from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable

import numpy as np
import pandas as pd

from .config import (
    BLOCK_SUBJECTS,
    PIPELINE_A_NUMERIC_FEATURES,
    PIPELINE_B_EXTRA_NUMERIC_FEATURES,
    SCHOOL_CODE,
)


@dataclass(frozen=True)
class FeatureSpec:
    name: str
    numeric_features: list[str]
    categorical_features: list[str]


def coerce_number(series: pd.Series) -> pd.Series:
    cleaned = series.astype("string").str.replace(",", ".", regex=False)
    return pd.to_numeric(cleaned, errors="coerce")


def normalize_text(value: object) -> str:
    if pd.isna(value):
        return "Unknown"
    text = str(value).strip()
    text = re.sub(r"\s+", " ", text)
    return text or "Unknown"


def normalize_major_code(value: object) -> str:
    if pd.isna(value):
        return "Unknown"
    text = str(value).strip()
    if text.endswith(".0"):
        text = text[:-2]
    return text


def split_combinations(value: object) -> list[str]:
    if pd.isna(value):
        return []
    parts = re.split(r"[,;/|]+", str(value))
    return [part.strip().upper() for part in parts if part.strip()]


def build_pipeline_specs(categorical_features: list[str]) -> dict[str, FeatureSpec]:
    return {
        "Pipeline_A_Internal": FeatureSpec(
            name="Pipeline_A_Internal",
            numeric_features=list(PIPELINE_A_NUMERIC_FEATURES),
            categorical_features=list(categorical_features),
        ),
        "Pipeline_B_National": FeatureSpec(
            name="Pipeline_B_National",
            numeric_features=list(PIPELINE_A_NUMERIC_FEATURES)
            + list(PIPELINE_B_EXTRA_NUMERIC_FEATURES),
            categorical_features=list(categorical_features),
        ),
    }


def build_block_national_stats(subject_stats: pd.DataFrame) -> pd.DataFrame:
    """Convert subject-level national stats into block-level stats."""
    if subject_stats is None or subject_stats.empty:
        return pd.DataFrame(
            columns=[
                "Year",
                "Subject_Combination",
                "National_Mean_Score",
                "National_Median_Score",
                "National_Mode_Score",
                "National_Candidate_Count",
            ]
        )

    df = subject_stats.copy()
    df.columns = [str(col).strip() for col in df.columns]
    df = df.rename(columns={"year": "Year", "subject": "Subject"})
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce").astype("Int64")
    for col in ["candidate_count", "mean_score", "median_score", "mode_score"]:
        if col in df.columns:
            df[col] = coerce_number(df[col])

    records: list[dict[str, object]] = []
    for year, year_df in df.dropna(subset=["Year"]).groupby("Year"):
        by_subject = year_df.set_index("Subject")
        for combo, subjects in BLOCK_SUBJECTS.items():
            if not all(subject in by_subject.index for subject in subjects):
                continue
            rows = by_subject.loc[list(subjects)]
            records.append(
                {
                    "Year": int(year),
                    "Subject_Combination": combo,
                    "National_Mean_Score": rows["mean_score"].sum(),
                    "National_Median_Score": rows["median_score"].sum(),
                    "National_Mode_Score": rows["mode_score"].sum(),
                    "National_Candidate_Count": rows["candidate_count"].min(),
                }
            )

    return pd.DataFrame(records)


def _mean_before_current(series: pd.Series) -> pd.Series:
    return series.expanding(min_periods=1).mean().shift(1)


def _std_before_current(series: pd.Series) -> pd.Series:
    return series.expanding(min_periods=2).std().shift(1)


def _count_before_current(series: pd.Series) -> pd.Series:
    return pd.Series(np.arange(len(series)), index=series.index, dtype=float)


def _target_mean(
    df: pd.DataFrame,
    train_mask: pd.Series,
    group_col: str,
    target_col: str = "Cutoff_Score",
) -> tuple[pd.Series, dict[str, float], float]:
    train_df = df.loc[train_mask & df[target_col].notna()]
    global_mean = float(train_df[target_col].mean())
    mapping = train_df.groupby(group_col)[target_col].mean().to_dict()
    encoded = df[group_col].map(mapping).fillna(global_mean)
    return encoded.astype(float), mapping, global_mean


def _aggregate_national_features(
    combinations: Iterable[str],
    year: int,
    block_stats: pd.DataFrame,
) -> dict[str, float]:
    empty = {
        "National_Mean_Score": np.nan,
        "National_Median_Score": np.nan,
        "National_Mode_Score": np.nan,
        "National_Candidate_Count": np.nan,
    }
    combos = [combo for combo in combinations if combo]
    if block_stats.empty or not combos:
        return empty

    rows = block_stats[
        (block_stats["Year"].eq(year))
        & (block_stats["Subject_Combination"].isin(combos))
    ]
    if rows.empty:
        rows = block_stats[
            (block_stats["Year"].le(year))
            & (block_stats["Subject_Combination"].isin(combos))
        ]
        if not rows.empty:
            latest_year = rows["Year"].max()
            rows = rows[rows["Year"].eq(latest_year)]
    if rows.empty:
        rows = block_stats[block_stats["Year"].eq(year)]
    if rows.empty:
        rows = block_stats

    return {
        "National_Mean_Score": float(rows["National_Mean_Score"].mean()),
        "National_Median_Score": float(rows["National_Median_Score"].mean()),
        "National_Mode_Score": float(rows["National_Mode_Score"].mean()),
        "National_Candidate_Count": float(rows["National_Candidate_Count"].mean()),
    }


def prepare_historical_frame(
    raw_df: pd.DataFrame,
    national_subject_stats: pd.DataFrame | None = None,
    train_end_year: int = 2024,
) -> pd.DataFrame:
    """Prepare features with the same modeling unit used in the Colab demo.

    The notebook explodes each major/year into one row per subject combination
    and predicts ``Score_Change``; this function intentionally keeps that shape
    so project metrics are comparable with the Colab report.
    """
    df = raw_df.copy()
    df.columns = [str(col).strip() for col in df.columns]

    if "School_Code" in df.columns:
        df = df[df["School_Code"].astype("string").str.strip().eq(SCHOOL_CODE)].copy()

    df["Year"] = pd.to_numeric(df["Year"], errors="coerce").astype("Int64")
    df["Department_Code"] = df["Department_Code"].map(normalize_text)
    df["Major_Name"] = df["Major_Name"].map(normalize_text)
    df["Major_Code"] = df["Major_Code"].map(normalize_major_code)
    df["Program_Type_Normalized"] = df.get("Program_Type", "Unknown").map(normalize_text)
    df["Admission_Quota"] = coerce_number(df["Admission_Quota"])
    df["Cutoff_Score"] = coerce_number(df["Cutoff_Score"])
    df["_Subject_Combination_One"] = df["Subject_Combinations"].map(split_combinations)
    df = df.explode("_Subject_Combination_One")
    df = df.drop(columns=["Subject_Combinations"]).rename(
        columns={"_Subject_Combination_One": "Subject_Combinations"}
    )
    df["Subject_Combinations"] = df["Subject_Combinations"].fillna("Unknown").astype(str).str.strip().str.upper()
    df["Combination_Key"] = df["Subject_Combinations"]

    if "Admission_Method" in df.columns:
        df = df[df["Admission_Method"].astype("string").str.strip().eq("THPT")].copy()

    df = df.dropna(subset=["Admission_Quota", "Year"]).copy()

    train_mask = df["Year"].le(train_end_year)
    df["Major_Code_Enc"], _, _ = _target_mean(df, train_mask, "Major_Code")

    block_values = sorted(df["Subject_Combinations"].astype(str).unique())
    block_map = {value: idx for idx, value in enumerate(block_values)}
    df["Block_Enc"] = df["Subject_Combinations"].map(block_map).astype(float)

    program_values = sorted(df["Program_Type_Normalized"].astype(str).unique())
    program_map = {value: idx for idx, value in enumerate(program_values)}
    df["Program_Type_Enc"] = df["Program_Type_Normalized"].map(program_map).astype(float)

    df = df.sort_values(["Major_Code", "Year"]).reset_index(drop=True)
    grouped = df.groupby("Major_Code", group_keys=False)
    df["Prev_Year_Score"] = grouped["Cutoff_Score"].shift(1)
    df["Prev_Year_Quota"] = grouped["Admission_Quota"].shift(1)
    df["Has_Previous_Score"] = df["Prev_Year_Score"].notna().astype(int)

    df["Prev_Year_Score"] = df["Prev_Year_Score"].fillna(df["Major_Code_Enc"])
    df["Prev_Year_Quota"] = df["Prev_Year_Quota"].fillna(df["Admission_Quota"])
    df["Delta_Quota"] = df["Admission_Quota"] - df["Prev_Year_Quota"]
    df["Score_Change"] = df["Cutoff_Score"] - df["Prev_Year_Score"]

    block_stats = build_block_national_stats(national_subject_stats)
    if not block_stats.empty:
        block_stats = block_stats.rename(columns={"Subject_Combination": "Subject_Combinations"})
        df = df.merge(block_stats, on=["Year", "Subject_Combinations"], how="left")
    else:
        for col in PIPELINE_B_EXTRA_NUMERIC_FEATURES:
            if col not in df.columns:
                df[col] = np.nan

    for col in PIPELINE_B_EXTRA_NUMERIC_FEATURES:
        if col not in df.columns:
            df[col] = np.nan
        df[col] = coerce_number(df[col]).fillna(coerce_number(df[col]).mean())
        if df[col].isna().any():
            df[col] = df[col].fillna(0)

    return df


def required_feature_columns(spec: FeatureSpec) -> list[str]:
    return spec.numeric_features + spec.categorical_features
