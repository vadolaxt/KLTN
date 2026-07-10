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
    """Danh sách cột đầu vào của một cấu hình quy trình huấn luyện."""

    name: str
    numeric_features: list[str]
    categorical_features: list[str]


def coerce_number(series: pd.Series) -> pd.Series:
    """Ép chuỗi số trong CSV/Excel về số thực, hỗ trợ dấu phẩy thập phân."""
    cleaned = series.astype("string").str.replace(",", ".", regex=False)
    return pd.to_numeric(cleaned, errors="coerce")


def normalize_text(value: object) -> str:
    """Chuẩn hóa text rỗng/NaN về Unknown để tránh lỗi khi mã hóa dữ liệu."""
    if pd.isna(value):
        return "Unknown"
    text = str(value).strip()
    text = re.sub(r"\s+", " ", text)
    return text or "Unknown"


def normalize_major_code(value: object) -> str:
    """Chuẩn hóa mã ngành, đặc biệt xử lý trường hợp pandas đọc thành dạng 123.0."""
    if pd.isna(value):
        return "Unknown"
    text = str(value).strip()
    if text.endswith(".0"):
        text = text[:-2]
    return text


def split_combinations(value: object) -> list[str]:
    """Tách chuỗi tổ hợp như 'A00, A01, X07' thành danh sách mã tổ hợp."""
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
    "gdkt_pl": "GDKT_PL",
    "giao duc kt&pl": "GDKT_PL",
    "giao duc kinh te va phap luat": "GDKT_PL",
    "kinh te va phap luat": "GDKT_PL",
    "tin_hoc": "TIN_HOC",
    "tin hoc": "TIN_HOC",
    "cn_cong_nghiep": "CN_CONG_NGHIEP",
    "cong nghe cong nghiep": "CN_CONG_NGHIEP",
    "cn_nong_nghiep": "CN_NONG_NGHIEP",
    "cong nghe nong nghiep": "CN_NONG_NGHIEP",
}


def subject_name_to_key(value: object) -> str | None:
    """Đổi tên môn tiếng Việt hoặc mã môn sang mã môn nội bộ."""
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
    """Chuẩn hóa điểm từng môn trong request API về dạng {mã_môn: điểm}."""
    normalized: dict[str, float] = {}
    for subject, score in (subject_scores or {}).items():
        key = subject_name_to_key(subject)
        if key is None:
            continue
        normalized[key] = float(score)
    return normalized


def _subjects_from_note_tail(note: object) -> list[str]:
    """Tách danh sách môn chung/môn chính từ phần sau dấu hai chấm trong cột Note."""
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
    """Quy đổi điểm tổng khi chỉ có tổng 3 môn và biết môn chung.

    Luồng API hiện ưu tiên compute_student_score_with_common_subject vì request
    có điểm từng môn. Hàm này giữ lại cho trường hợp dữ liệu chỉ có tổng điểm
    thô, không có điểm chi tiết từng môn; khi đó hàm ước lượng theo điểm trung
    bình mỗi môn để không làm rơi dữ liệu về 0.
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

    # Không có điểm từng môn nên lấy trung bình raw_score / 3 làm ước lượng.
    avg = raw_score / 3.0
    # Môn chung được nhân hệ số, sau đó quy về lại thang 30.
    n_common = len(valid_common)
    adjusted = (raw_score + avg * n_common) * (3.0 / (3.0 + n_common))
    return round(min(adjusted, 30.0), 2)


def compute_student_score_with_common_subject(
    subject_scores: dict[str, float],
    combo: str,
    common_subjects: list[str],
) -> float:
    """Tính điểm xét tuyển của thí sinh có môn chung nhân đôi.

    Tham số:
        subject_scores: Dict {mã_môn: điểm}, ví dụ {"Toan": 8.0, "Vat_li": 7.5, "Tieng_Anh": 9.0}
        combo: Mã tổ hợp, ví dụ "A01"
        common_subjects: Danh sách môn chung nhân đôi, ví dụ ["Tieng_Anh"]

    Trả về:
        Điểm xét tuyển đã quy về thang 30.
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
    # Quy về thang 30 sau khi đã nhân hệ số môn chung.
    n_common = len([s for s in common_subjects if s in subjects_in_combo])
    max_total = (3 + n_common) * 10.0
    result = total / max_total * 30.0
    return round(min(result, 30.0), 2)


def build_pipeline_specs(categorical_features: list[str]) -> dict[str, FeatureSpec]:
    """Khai báo hai bộ đặc trưng: chỉ dùng dữ liệu nội bộ hoặc thêm phổ điểm quốc gia."""
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
    """Mã hóa một cột phân loại bằng điểm chuẩn trung bình trong tập train."""
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
    """Tổng hợp phổ điểm quốc gia cho một hoặc nhiều tổ hợp trong cùng năm."""
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


def _history_group_keys(school_code: str) -> list[str]:
    """Xác định cấp lịch sử điểm chuẩn theo quy định dữ liệu từng trường.

    NLU công bố chung một điểm chuẩn cho các tổ hợp của cùng ngành, nên chuỗi
    thời gian chỉ đi theo mã ngành. SGU có điểm chuẩn riêng theo tổ hợp, nên
    chuỗi thời gian phải đi theo cặp ngành + tổ hợp.
    """
    if str(school_code).strip().upper() == "SGU":
        return ["Major_Code", "Combination_Key"]
    return ["Major_Code"]


def prepare_historical_frame(
    raw_df: pd.DataFrame,
    national_subject_stats: pd.DataFrame | None = None,
    train_end_year: int = 2025,
    school_code: str = SCHOOL_CODE,
) -> pd.DataFrame:
    """Chuẩn bị features cho mô hình, hỗ trợ nhiều trường.

    Xử lý đặc biệt:
    - Điểm chuẩn đã công bố dùng thang 30 (kể cả ngành có môn chung).
    - Thêm đặc trưng Has_Common_Subject để mô hình nhận biết ngành đặc thù.
    - Hỗ trợ mở rộng sang trường khác (SGU, ...) nếu có dữ liệu tương tự.
    """
    df = raw_df.copy()
    df.columns = [str(col).strip() for col in df.columns]

    # Lọc đúng trường trước khi tạo đặc trưng để NLU và SGU không lẫn dữ liệu.
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

    # Trích xuất môn chung/môn chính để model biết ngành nào có cách tính điểm đặc thù.
    if "Note" in df.columns:
        df["Common_Subjects"] = df.apply(
            lambda row: _extract_common_subjects(row, school_code), axis=1
        )
    else:
        df["Common_Subjects"] = [[] for _ in range(len(df))]

    # Đặc trưng nhị phân: 1 nếu ngành có môn chung/môn chính, ngược lại 0.
    df["Has_Common_Subject"] = df["Common_Subjects"].map(lambda x: 1 if x else 0).astype(float)

    # Tách mỗi tổ hợp thành một dòng để model học riêng theo A00, X07, D01...
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

    # Mã hóa các cột phân loại thành số để đưa vào mô hình hồi quy.
    train_mask = df["Year"].le(train_end_year)
    df["Major_Code_Enc"], _, _ = _target_mean(df, train_mask, "Major_Code")

    block_values = sorted(df["Subject_Combinations"].astype(str).unique())
    block_map = {value: idx for idx, value in enumerate(block_values)}
    df["Block_Enc"] = df["Subject_Combinations"].map(block_map).astype(float)

    program_values = sorted(df["Program_Type_Normalized"].astype(str).unique())
    program_map = {value: idx for idx, value in enumerate(program_values)}
    df["Program_Type_Enc"] = df["Program_Type_Normalized"].map(program_map).astype(float)

    # Đặc trưng chuỗi thời gian: NLU theo ngành, SGU theo ngành + tổ hợp.
    # Tính ở cấp năm trước rồi merge lại để các tổ hợp NLU cùng năm không bị
    # nhầm thành "năm trước" của nhau sau khi explode tổ hợp.
    history_keys = _history_group_keys(school_code)
    annual_cols = history_keys + ["Year"]
    annual_history = (
        df[annual_cols + ["Cutoff_Score", "Admission_Quota"]]
        .groupby(annual_cols, as_index=False)
        .agg(
            Current_Year_Score=("Cutoff_Score", "mean"),
            Current_Year_Quota=("Admission_Quota", "mean"),
        )
        .sort_values(annual_cols)
    )
    annual_grouped = annual_history.groupby(history_keys, group_keys=False)
    annual_history["Prev_Year_Score"] = annual_grouped["Current_Year_Score"].shift(1)
    annual_history["Prev_Year_Quota"] = annual_grouped["Current_Year_Quota"].shift(1)

    df = df.merge(
        annual_history[annual_cols + ["Prev_Year_Score", "Prev_Year_Quota"]],
        on=annual_cols,
        how="left",
    )
    df["Has_Previous_Score"] = df["Prev_Year_Score"].notna().astype(int)

    df["Prev_Year_Score"] = df["Prev_Year_Score"].fillna(df["Major_Code_Enc"])
    df["Prev_Year_Quota"] = df["Prev_Year_Quota"].fillna(df["Admission_Quota"])
    df["Delta_Quota"] = df["Admission_Quota"] - df["Prev_Year_Quota"]
    df["Score_Change"] = df["Cutoff_Score"] - df["Prev_Year_Score"]

    # Quy trình B bổ sung phổ điểm quốc gia theo tổ hợp nếu có dữ liệu.
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
