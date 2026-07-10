from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from .features import coerce_number, normalize_major_code


@dataclass
class ExperimentReport:
    """Kết quả trả về sau một lần huấn luyện và đánh giá mô hình."""

    leaderboard: pd.DataFrame
    cutoff_predictions: pd.DataFrame
    candidate_predictions: pd.DataFrame
    best_bundle: object
    final_bundle: object | None = None
    saved_model_path: str | None = None


def regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict[str, float]:
    """Tính các chỉ số sai số giữa điểm chuẩn thật và điểm chuẩn dự đoán."""
    return {
        "MAE": float(mean_absolute_error(y_true, y_pred)),
        "RMSE": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "R2": float(r2_score(y_true, y_pred)),
    }


def evaluate_candidate_admissions(
    candidate_df: pd.DataFrame | None,
    predicted_cutoffs: pd.DataFrame,
) -> tuple[dict[str, float], pd.DataFrame]:
    """Đánh giá dự đoán đậu/rớt nếu có dữ liệu thí sinh thực tế.

    Hàm này dùng trong giai đoạn thử nghiệm mô hình, không dùng trực tiếp cho API.
    Nó ghép điểm thí sinh với điểm chuẩn dự đoán theo ngành và tổ hợp, sau đó
    tính Accuracy/F1 cho quyết định đậu hoặc rớt.
    """
    if candidate_df is None or candidate_df.empty:
        return {"Accuracy_2025": np.nan, "F1_2025": np.nan, "Candidate_Rows": 0}, pd.DataFrame()

    cutoff_cols = ["Major_Code", "Predicted_Cutoff"]
    if "Combination_Key" in predicted_cutoffs.columns:
        cutoff_cols.append("Combination_Key")
    cutoffs = predicted_cutoffs[cutoff_cols].copy()
    cutoffs["Major_Code"] = cutoffs["Major_Code"].map(normalize_major_code)
    if "Combination_Key" in cutoffs.columns:
        cutoffs["Combination_Key"] = cutoffs["Combination_Key"].astype("string").str.strip().str.upper()

    df = candidate_df.copy()
    df["Major_Code"] = df["Ma_Nganh_Dang_Ky"].map(normalize_major_code)
    if "To_Hop_Xet_Tuyen" in df.columns:
        df["Combination_Key"] = df["To_Hop_Xet_Tuyen"].astype("string").str.strip().str.upper()
    df["Student_Score"] = coerce_number(df["Diem_To_Hop_Cao_Nhat"])
    if "Dau_Rot" in df.columns:
        df["Actual_Admitted"] = pd.to_numeric(df["Dau_Rot"], errors="coerce")
    else:
        df["Actual_Admitted"] = df["Ket_Qua"].astype("string").str.contains("Đậu", na=False).astype(int)

    merge_keys = ["Major_Code"]
    if "Combination_Key" in df.columns and "Combination_Key" in cutoffs.columns:
        merge_keys.append("Combination_Key")
    cutoffs = cutoffs.drop_duplicates(merge_keys, keep="last")
    merged = df.merge(cutoffs, on=merge_keys, how="left")
    merged = merged.dropna(subset=["Student_Score", "Predicted_Cutoff", "Actual_Admitted"]).copy()
    if merged.empty:
        return {"Accuracy_2025": np.nan, "F1_2025": np.nan, "Candidate_Rows": 0}, merged

    merged["Predicted_Admitted"] = (merged["Student_Score"] >= merged["Predicted_Cutoff"]).astype(int)
    y_true = merged["Actual_Admitted"].astype(int)
    y_pred = merged["Predicted_Admitted"].astype(int)
    metrics = {
        "Accuracy_2025": float(accuracy_score(y_true, y_pred)),
        "F1_2025": float(f1_score(y_true, y_pred, zero_division=0)),
        "Candidate_Rows": int(len(merged)),
    }
    return metrics, merged
