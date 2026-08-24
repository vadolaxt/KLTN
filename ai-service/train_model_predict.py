from __future__ import annotations

import os
import sys
import warnings
from pathlib import Path

import joblib
import pandas as pd

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "4")
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
warnings.filterwarnings("ignore", category=UserWarning)

from score import (  # noqa: E402
    load_historical_admissions,
    load_historical_admissions_sgu,
    load_national_subject_stats,
    run_nlu_experiment,
)


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "assets" / "models" / "score-data"
MODEL_DIR = BASE_DIR / "assets" / "models"
CANDIDATE_2025_PATH = DATA_DIR / "thi_sinh_2025_nguyen_vong.csv"

MODEL_OUTPUTS = {
    "NLU": MODEL_DIR / "best_predict_score_model.joblib",
    "SGU": MODEL_DIR / "best_predict_score_model_sgu.joblib",
}


def load_candidate_preferences_2025() -> pd.DataFrame:
    """Đọc dữ liệu nguyện vọng dùng để kiểm thử F1 cho mô hình NLU."""
    return pd.read_csv(
        CANDIDATE_2025_PATH,
        encoding="utf-8-sig",
        dtype={
            "Ma_Nganh_Dang_Ky": "string",
            "To_Hop_Xet_Tuyen": "string",
        },
    )


def train_best_models() -> dict[str, object]:
    """Huấn luyện hai model cuối cùng mà API cần nạp."""
    national_stats = load_national_subject_stats()
    candidate_2025 = load_candidate_preferences_2025()

    # NLU: chọn model có MAE/RMSE thấp nhất trên điểm chuẩn thật năm 2025,
    # sau đó huấn luyện lại model đã chọn với dữ liệu điểm chuẩn đến hết 2025.
    # F1 trên nguyện vọng giả lập chỉ là chỉ số đánh giá bổ sung.
    nlu_report = run_nlu_experiment(
        historical_df=load_historical_admissions(),
        national_subject_stats=national_stats,
        candidate_df=candidate_2025,
        train_end_year=2024,
        test_year=2025,
        retrain_final=True,
        school_code="NLU",
    )
    nlu_bundle = nlu_report.final_bundle or nlu_report.best_bundle

    # SGU tự chọn mô hình tốt nhất trên dữ liệu của SGU. Không ép dùng cấu hình
    # thắng ở NLU vì hai trường có mức dịch chuyển điểm và cấp tổ hợp khác nhau.
    sgu_report = run_nlu_experiment(
        historical_df=load_historical_admissions_sgu(),
        national_subject_stats=national_stats,
        candidate_df=None,
        train_end_year=2024,
        test_year=2025,
        retrain_final=True,
        school_code="SGU",
    )

    return {
        "NLU": nlu_bundle,
        "SGU": sgu_report.final_bundle or sgu_report.best_bundle,
    }


def main() -> None:
    bundles = train_best_models()

    # Chỉ ghi đúng hai artifact model mà API đang sử dụng, không sinh leaderboard,
    # dự đoán mẫu, biểu đồ hoặc bất kỳ file kết quả trung gian nào.
    for school_code, output_path in MODEL_OUTPUTS.items():
        output_path.unlink(missing_ok=True)
        joblib.dump(bundles[school_code], output_path)

        metrics = bundles[school_code].metrics
        print(
            f"{school_code}: {bundles[school_code].pipeline_name}/"
            f"{bundles[school_code].model_name} -> {output_path.name} "
            f"(F1_2025={metrics.get('F1_2025')}, MAE={metrics.get('MAE')})"
        )


if __name__ == "__main__":
    main()
