from __future__ import annotations

import math
from typing import Mapping

import numpy as np
import pandas as pd

from .features import (
    compute_student_score_with_common_subject,
    prepare_historical_frame,
    required_feature_columns,
    split_combinations,
    normalize_major_code,
)
from .models import ModelBundle


def _sigmoid(value: float) -> float:
    value = max(min(value, 60), -60)
    return 1.0 / (1.0 + math.exp(-value))


def _probability_scale(metrics: Mapping[str, float]) -> float:
    mae = float(metrics.get("MAE", 1.0) or 1.0)
    if not np.isfinite(mae):
        mae = 1.0
    return max(mae, 0.5)


def _latest_major_rows(raw_data: pd.DataFrame, target_year: int) -> pd.DataFrame:
    df = raw_data.copy()
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce")
    df["Major_Code"] = df["Major_Code"].map(normalize_major_code)
    df = df[df["Year"].lt(target_year)].copy()
    df = df.sort_values(["Major_Code", "Year"])
    return df.groupby("Major_Code", as_index=False).tail(1).reset_index(drop=True)


def _target_year_rows(raw_data: pd.DataFrame, target_year: int) -> pd.DataFrame:
    df = raw_data.copy()
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce")
    df["Major_Code"] = df["Major_Code"].map(normalize_major_code)
    return df[df["Year"].eq(target_year)].copy().reset_index(drop=True)


def _scenario_rows(
    bundle: ModelBundle,
    target_year: int,
    quota_overrides: Mapping[str, float] | None = None,
) -> pd.DataFrame:
    target_rows = _target_year_rows(bundle.source_data, target_year)
    use_declared_target_rows = not target_rows.empty
    scenario = target_rows if use_declared_target_rows else _latest_major_rows(bundle.source_data, target_year)
    if scenario.empty:
        raise ValueError(f"No historical rows available before {target_year}.")

    scenario = scenario.copy()
    scenario["Year"] = target_year
    scenario["Cutoff_Score"] = np.nan
    quota_overrides = quota_overrides or {}
    for major_code, quota in quota_overrides.items():
        mask = scenario["Major_Code"].map(normalize_major_code).eq(normalize_major_code(major_code))
        scenario.loc[mask, "Admission_Quota"] = quota

    base = bundle.source_data.copy()
    if use_declared_target_rows:
        base_year = pd.to_numeric(base["Year"], errors="coerce")
        base = base[~base_year.eq(target_year)].copy()

    combined = pd.concat([base, scenario], ignore_index=True)
    frame = prepare_historical_frame(
        combined,
        bundle.national_subject_stats,
        train_end_year=bundle.train_end_year,
        school_code=bundle.school_code,
    )
    return frame[frame["Year"].eq(target_year)].copy()


def predict_next_year_cutoffs(
    bundle: ModelBundle,
    target_year: int = 2026,
    quota_overrides: Mapping[str, float] | None = None,
) -> pd.DataFrame:
    frame = _scenario_rows(bundle, target_year=target_year, quota_overrides=quota_overrides)
    feature_cols = required_feature_columns(bundle.feature_spec)
    pred_delta = bundle.estimator.predict(frame[feature_cols])
    frame["Predicted_Cutoff"] = np.clip(frame["Prev_Year_Score"].to_numpy(dtype=float) + pred_delta, 0, 30)
    frame["Predicted_Delta"] = pred_delta
    return frame[
        [
            "Year",
            "Major_Code",
            "Major_Name",
            "Admission_Quota",
            "Prev_Year_Score",
            "Predicted_Delta",
            "Predicted_Cutoff",
            "Combination_Key",
            "Common_Subjects",
            "Has_Common_Subject",
            "Program_Type_Normalized",
        ]
    ].sort_values("Predicted_Cutoff", ascending=False).reset_index(drop=True)


def predict_admission(
    bundle: ModelBundle,
    major_code: str,
    student_score: float,
    subject_combination: str | None = None,
    subject_scores: dict[str, float] | None = None,
    target_year: int = 2026,
    quota_overrides: Mapping[str, float] | None = None,
) -> dict[str, object]:
    predictions = predict_next_year_cutoffs(
        bundle,
        target_year=target_year,
        quota_overrides=quota_overrides,
    )
    code = normalize_major_code(major_code)
    row = predictions[predictions["Major_Code"].map(normalize_major_code).eq(code)]
    if row.empty:
        raise ValueError(f"Major code not found in NLU history: {major_code}")
    if subject_combination:
        combo = subject_combination.strip().upper()
        combo_row = row[row["Combination_Key"].map(lambda value: combo in split_combinations(value))]
        if not combo_row.empty:
            row = combo_row

    item = row.iloc[0]
    final_student_score = float(student_score)
    common_subjects = item.get("Common_Subjects", [])
    if subject_scores and subject_combination:
        final_student_score = compute_student_score_with_common_subject(
            subject_scores=subject_scores,
            combo=subject_combination,
            common_subjects=common_subjects if isinstance(common_subjects, list) else [],
        )

    cutoff = float(item["Predicted_Cutoff"])
    margin = final_student_score - cutoff
    scale = _probability_scale(bundle.metrics)
    probability = _sigmoid(margin / scale)

    matched_combination = True
    if subject_combination:
        official = split_combinations(item["Combination_Key"])
        matched_combination = subject_combination.strip().upper() in official

    return {
        "major_code": code,
        "major_name": item["Major_Name"],
        "school_code": bundle.school_code,
        "target_year": int(target_year),
        "student_score": round(final_student_score, 2),
        "raw_student_score": float(student_score),
        "subject_combination": subject_combination,
        "combination_matched": bool(matched_combination),
        "common_subjects": common_subjects if isinstance(common_subjects, list) else [],
        "predicted_cutoff": round(cutoff, 2),
        "margin": round(margin, 2),
        "admission_probability": round(probability * 100, 2),
        "model": bundle.model_name,
        "pipeline": bundle.pipeline_name,
    }


def suggest_majors(
    bundle: ModelBundle,
    student_score: float,
    subject_combination: str | None = None,
    top_k: int = 5,
    target_year: int = 2026,
    quota_overrides: Mapping[str, float] | None = None,
) -> pd.DataFrame:
    predictions = predict_next_year_cutoffs(
        bundle,
        target_year=target_year,
        quota_overrides=quota_overrides,
    )
    if subject_combination:
        combo = subject_combination.strip().upper()
        predictions["Combination_Matched"] = predictions["Combination_Key"].map(
            lambda value: combo in split_combinations(value)
        )
        filtered = predictions[predictions["Combination_Matched"]].copy()
        if filtered.empty:
            filtered = predictions.copy()
            filtered["Combination_Matched"] = False
    else:
        filtered = predictions.copy()
        filtered["Combination_Matched"] = True

    scale = _probability_scale(bundle.metrics)
    filtered["Margin"] = float(student_score) - filtered["Predicted_Cutoff"]
    filtered["Admission_Probability"] = filtered["Margin"].map(lambda margin: _sigmoid(float(margin) / scale) * 100)
    filtered["Distance_To_Cutoff"] = filtered["Margin"].abs()

    sorted_suggestions = filtered.sort_values(
        ["Admission_Probability", "Predicted_Cutoff"],
        ascending=[False, False],
    )
    sorted_suggestions = sorted_suggestions.drop_duplicates("Major_Code", keep="first")

    return sorted_suggestions.head(top_k)[
        [
            "Major_Code",
            "Major_Name",
            "Predicted_Cutoff",
            "Margin",
            "Admission_Probability",
            "Combination_Key",
            "Combination_Matched",
        ]
    ].reset_index(drop=True)
