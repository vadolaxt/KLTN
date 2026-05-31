import os
import joblib
import pandas as pd
import sys
import warnings

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "4")
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
warnings.filterwarnings("ignore", category=UserWarning)

from score import (
    load_candidate_2025,
    load_historical_admissions,
    load_national_subject_stats,
    predict_admission,
    run_nlu_experiment,
    save_model_bundle,
    suggest_majors,
)


def print_table(title: str, df: pd.DataFrame, max_rows: int = 10) -> None:
    print(f"\n===== {title} =====")
    if df.empty:
        print("No data.")
        return
    print(df.head(max_rows).to_string(index=False))


def main() -> None:
    historical_df = load_historical_admissions()
    national_stats = load_national_subject_stats()
    candidate_2025_df = load_candidate_2025()

    report = run_nlu_experiment(
        historical_df=historical_df,
        national_subject_stats=national_stats,
        candidate_2025_df=candidate_2025_df,
        train_end_year=2024,
        test_year=2025,
        retrain_final=True,
    )

    leaderboard = report.leaderboard.copy()
    metric_cols = [
        "Pipeline",
        "Model",
        "MAE",
        "RMSE",
        "R2",
        "Accuracy_2025",
        "F1_2025",
        "Candidate_Rows",
    ]
    for col in ["MAE", "RMSE", "R2", "Accuracy_2025", "F1_2025"]:
        leaderboard[col] = leaderboard[col].round(4)

    print_table("COLAB-COMPATIBLE MODEL LEADERBOARD", leaderboard[metric_cols], max_rows=12)

    best = report.best_bundle
    print("\n===== BEST MODEL ON 2025 TEST =====")
    print(f"Pipeline: {best.pipeline_name}")
    print(f"Model: {best.model_name}")
    print(f"MAE: {best.metrics['MAE']:.4f}")
    print(f"RMSE: {best.metrics['RMSE']:.4f}")
    print(f"R2: {best.metrics['R2']:.4f}")
    print(f"Accuracy 2025: {best.metrics['Accuracy_2025']:.4f}")
    print(f"F1 2025: {best.metrics['F1_2025']:.4f}")

    # Lấy mô hình tốt nhất
    final_bundle = report.final_bundle or report.best_bundle

    # Tạo thư mục lưu model
    model_dir = "assets/models"
    os.makedirs(model_dir, exist_ok=True)

    # Tên file model
    model_path = os.path.join(model_dir, "best_predict_score_model.joblib")

    # Lưu model tốt nhất
    joblib.dump(final_bundle, model_path)

    print(f"\nSaved best model: {model_path}")

    sample_prediction = predict_admission(
        final_bundle,
        major_code="7480201",
        student_score=24.0,
        subject_combination="A00",
        target_year=2026,
    )
    print("\n===== SAMPLE 2026 ADMISSION PREDICTION =====")
    for key, value in sample_prediction.items():
        print(f"{key}: {value}")

    suggestions = suggest_majors(
        final_bundle,
        student_score=24.0,
        subject_combination="A00",
        top_k=5,
        target_year=2026,
    )
    for col in ["Predicted_Cutoff", "Margin", "Admission_Probability"]:
        suggestions[col] = suggestions[col].round(2)
    print_table("TOP-5 NLU MAJOR SUGGESTIONS", suggestions, max_rows=5)


if __name__ == "__main__":
    main()
