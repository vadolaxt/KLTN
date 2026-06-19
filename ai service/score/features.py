from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from typing import Iterable

import numpy as np
import pandas as pd

from .config import (
    BLOCK_SUBJECTS,
    PIPELINE_A_NUMERIC_FEATURES,
    PIPELINE_B_EXTRA_NUMERIC_FEATURES,
    SCHOOL_CODE,
    SUBJECT_VI_TO_KEY,
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


def _ascii_subject_text(value: object) -> str:
    text = "" if pd.isna(value) else str(value)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = text.replace("đ", "d").replace("Đ", "D")
    text = re.sub(r"\s+", " ", text.lower()).strip()
    return text


SUBJECT_ASCII_TO_KEY = {
    "toan": "Toan",
    "vat ly": "Vat_li",
    "vat li": "Vat_li",
    "ly": "Vat_li",
    "li": "Vat_li",
    "hoa hoc": "Hoa_hoc",
    "hoa": "Hoa_hoc",
    "tieng anh": "Tieng_Anh",
    "anh": "Tieng_Anh",
    "sinh hoc": "Sinh_hoc",
    "sinh": "Sinh_hoc",
    "ngu van": "Ngu_van",
    "van": "Ngu_van",
    "lich su": "Lich_su",
    "su": "Lich_su",
    "dia ly": "Dia_li",
    "dia li": "Dia_li",
    "dia": "Dia_li",
}


def subject_name_to_key(value: object) -> str | None:
    if pd.isna(value):
        return None
    raw = str(value).strip()
    if not raw:
        return None
    if raw in SUBJECT_ASCII_TO_KEY.values():
        return raw

    key = SUBJECT_VI_TO_KEY.get(raw.lower())
    if key:
        return key

    return SUBJECT_ASCII_TO_KEY.get(_ascii_subject_text(raw))


def normalize_subject_scores(subject_scores: dict[str, float] | None) -> dict[str, float]:
    normalized: dict[str, float] = {}
    for subject, score in (subject_scores or {}).items():
        key = subject_name_to_key(subject)
        if key is None:
            continue
        normalized[key] = float(score)
    return normalized


def _subjects_from_note_tail(note: object) -> list[str]:
    if pd.isna(note):
        return []
    note_str = str(note).strip()
    if not note_str:
        return []

    match = re.search(
        r"(?:m[oô]n\s+(?:chung|ch[ií]nh)|mon\s+(?:chung|chinh))\s*:\s*(.+)",
        note_str,
        re.IGNORECASE,
    )
    subjects_raw = match.group(1) if match else note_str

    result: list[str] = []
    for part in re.split(r"[,;/|\n]+", subjects_raw):
        candidate = re.sub(
            r"^\s*(?:m[oô]n\s+)?(?:chung|ch[ií]nh)\s*:?\s*",
            "",
            part,
            flags=re.IGNORECASE,
        )
        key = subject_name_to_key(candidate)
        if key and key not in result:
            result.append(key)
    return result


# ---------------------------------------------------------------------------
# Xử lý môn chung (môn nhân hệ số 2) từ cột Note
# ---------------------------------------------------------------------------

def parse_common_subjects_nlu(note: object) -> list[str]:
    """Trích xuất danh sách môn chung từ Note của NLU.

    Định dạng: "Tổ hợp gốc: A00\\nMôn chung: Toán, Vật lý"
    Trả về list các subject key, ví dụ: ["Toan", "Vat_li"]
    """
    if pd.isna(note):
        return []
    note_str = str(note).strip()
    match = re.search(
        r"(?:m[oô]n\s+chung|mon\s+chung)\s*:\s*(.+)",
        note_str,
        re.IGNORECASE,
    )
    if not match:
        return []
    return _subjects_from_note_tail(match.group(1).strip())


def parse_common_subject_sgu(note: object) -> list[str]:
    """Trích xuất môn chính từ Note của SGU.

    Định dạng: "Môn chính: Toán" hoặc "Môn chính: Lý"
    Trả về list một phần tử, ví dụ: ["Toan"]
    """
    if pd.isna(note):
        return []
    return _subjects_from_note_tail(note)


def apply_common_subject_score(
    raw_score: float,
    combo: str,
    common_subjects: list[str],
) -> float:
    """Quy đổi điểm tổ hợp khi có môn chung nhân hệ số 2.

    Điểm gốc trên thang 30 (tổng 3 môn, mỗi môn tối đa 10).
    Khi môn chính nhân đôi:
        Điểm mới = (s1 + s2 + s_main * 2) * 3/4
    Vì không có điểm từng môn riêng lẻ, ta quy đổi ngược từ điểm tổ hợp.

    Giả sử điểm trung bình đều nhau (s1 = s2 = s_main = raw_score / 3),
    điều chỉnh theo tỉ lệ:
        Điểm mới = raw_score * (4/3) / (4/3) ... 

    Thực tế: điểm chuẩn đã được công bố theo thang 30 (đã áp dụng công thức).
    Nếu dữ liệu lịch sử đã là điểm quy đổi → giữ nguyên.
    Nếu dữ liệu là điểm thô (tổng 3 môn) → cần quy đổi.

    Hàm này dùng để TÍNH ĐIỂM THÍ SINH khi nộp nguyện vọng,
    không dùng cho dữ liệu lịch sử (đã là điểm chuẩn công bố).
    """
    if not common_subjects or pd.isna(raw_score):
        return float(raw_score) if not pd.isna(raw_score) else np.nan

    subjects_in_combo = BLOCK_SUBJECTS.get(combo.upper(), ())
    if not subjects_in_combo:
        return float(raw_score)

    # Kiểm tra môn chung có trong tổ hợp không
    valid_common = [s for s in common_subjects if s in subjects_in_combo]
    if not valid_common:
        return float(raw_score)

    # Giả sử điểm trung bình mỗi môn = raw_score / 3 (thang 10)
    avg = raw_score / 3.0
    # Công thức: (s1 + s2 + s_main * 2) * 3/4
    # Với n_common môn được nhân đôi: cộng thêm avg * n_common rồi nhân 3/4
    n_common = len(valid_common)
    adjusted = (raw_score + avg * n_common) * (3.0 / (3.0 + n_common))
    return round(min(adjusted, 30.0), 2)


def compute_student_score_with_common_subject(
    subject_scores: dict[str, float],
    combo: str,
    common_subjects: list[str],
) -> float:
    """Tính điểm xét tuyển của thí sinh có môn chung nhân đôi.

    Args:
        subject_scores: Dict {subject_key: score}, ví dụ {"Toan": 8.0, "Vat_li": 7.5, "Tieng_Anh": 9.0}
        combo: Mã tổ hợp, ví dụ "A01"
        common_subjects: Danh sách môn chung nhân đôi, ví dụ ["Tieng_Anh"]

    Returns:
        Điểm xét tuyển quy về thang 30.
    """
    subjects_in_combo = BLOCK_SUBJECTS.get(combo.upper(), ())
    if not subjects_in_combo:
        return 0.0

    normalized_scores = normalize_subject_scores(subject_scores)

    scores = []
    for subj in subjects_in_combo:
        score = normalized_scores.get(subj, 0.0)
        multiplier = 2 if subj in common_subjects else 1
        scores.append(score * multiplier)

    total = sum(scores)
    # Quy về thang 30: chia cho (3 + n_common) * 10 rồi nhân 30
    n_common = len([s for s in common_subjects if s in subjects_in_combo])
    max_total = (3 + n_common) * 10.0
    result = total / max_total * 30.0
    return round(min(result, 30.0), 2)


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
    """Chuyển thống kê phổ điểm từng môn → thống kê theo tổ hợp."""
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


def _extract_common_subjects(row: pd.Series, school_code: str) -> list[str]:
    """Trích xuất danh sách môn chung từ Note theo từng trường."""
    note = row.get("Note", None)
    sc = str(school_code).strip().upper()
    if sc == "NLU":
        return parse_common_subjects_nlu(note)
    elif sc == "SGU":
        return parse_common_subject_sgu(note)
    return []


def prepare_historical_frame(
    raw_df: pd.DataFrame,
    national_subject_stats: pd.DataFrame | None = None,
    train_end_year: int = 2025,
    school_code: str = SCHOOL_CODE,
) -> pd.DataFrame:
    """Chuẩn bị features cho mô hình, hỗ trợ nhiều trường.

    Xử lý đặc biệt:
    - Điểm chuẩn đã công bố dùng thang 30 (kể cả ngành có môn chung).
    - Thêm feature Has_Common_Subject để mô hình nhận biết ngành đặc thù.
    - Hỗ trợ mở rộng sang trường khác (SGU, ...) nếu có dữ liệu tương tự.
    """
    df = raw_df.copy()
    df.columns = [str(col).strip() for col in df.columns]

    # Lọc theo trường nếu có cột School_Code
    if "School_Code" in df.columns:
        df = df[df["School_Code"].astype("string").str.strip().eq(school_code)].copy()

    df["Year"] = pd.to_numeric(df["Year"], errors="coerce").astype("Int64")

    if "Department_Code" in df.columns:
        df["Department_Code"] = df["Department_Code"].map(normalize_text)
    else:
        df["Department_Code"] = "Unknown"

    df["Major_Name"] = df["Major_Name"].map(normalize_text)
    df["Major_Code"] = df["Major_Code"].map(normalize_major_code)
    df["Program_Type_Normalized"] = df.get("Program_Type", pd.Series("Unknown", index=df.index)).map(normalize_text)
    df["Admission_Quota"] = coerce_number(df["Admission_Quota"])
    df["Cutoff_Score"] = coerce_number(df["Cutoff_Score"])

    # --- Trích xuất môn chung từ Note ---
    if "Note" in df.columns:
        df["Common_Subjects"] = df.apply(
            lambda row: _extract_common_subjects(row, school_code), axis=1
        )
    else:
        df["Common_Subjects"] = [[] for _ in range(len(df))]

    # Feature nhị phân: có môn chung không
    df["Has_Common_Subject"] = df["Common_Subjects"].map(lambda x: 1 if x else 0).astype(float)

    # --- Explode tổ hợp xét tuyển ---
    df["_Subject_Combination_One"] = df["Subject_Combinations"].map(split_combinations)
    df = df.explode("_Subject_Combination_One")
    df = df.drop(columns=["Subject_Combinations"]).rename(
        columns={"_Subject_Combination_One": "Subject_Combinations"}
    )
    df["Subject_Combinations"] = (
        df["Subject_Combinations"].fillna("Unknown").astype(str).str.strip().str.upper()
    )
    df["Combination_Key"] = df["Subject_Combinations"]

    if "Admission_Method" in df.columns:
        df = df[df["Admission_Method"].astype("string").str.strip().eq("THPT")].copy()

    df = df.dropna(subset=["Admission_Quota", "Year"]).copy()

    # --- Encoding ---
    train_mask = df["Year"].le(train_end_year)
    df["Major_Code_Enc"], _, _ = _target_mean(df, train_mask, "Major_Code")

    block_values = sorted(df["Subject_Combinations"].astype(str).unique())
    block_map = {value: idx for idx, value in enumerate(block_values)}
    df["Block_Enc"] = df["Subject_Combinations"].map(block_map).astype(float)

    program_values = sorted(df["Program_Type_Normalized"].astype(str).unique())
    program_map = {value: idx for idx, value in enumerate(program_values)}
    df["Program_Type_Enc"] = df["Program_Type_Normalized"].map(program_map).astype(float)

    # --- Time-series features ---
    df = df.sort_values(["Major_Code", "Year"]).reset_index(drop=True)
    grouped = df.groupby("Major_Code", group_keys=False)
    df["Prev_Year_Score"] = grouped["Cutoff_Score"].shift(1)
    df["Prev_Year_Quota"] = grouped["Admission_Quota"].shift(1)
    df["Has_Previous_Score"] = df["Prev_Year_Score"].notna().astype(int)

    df["Prev_Year_Score"] = df["Prev_Year_Score"].fillna(df["Major_Code_Enc"])
    df["Prev_Year_Quota"] = df["Prev_Year_Quota"].fillna(df["Admission_Quota"])
    df["Delta_Quota"] = df["Admission_Quota"] - df["Prev_Year_Quota"]
    df["Score_Change"] = df["Cutoff_Score"] - df["Prev_Year_Score"]

    # --- National stats (Pipeline B) ---
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
