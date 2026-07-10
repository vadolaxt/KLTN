import joblib
from score import predict_admission

# Load model đã lưu
bundle = joblib.load(
    "assets/models/best_predict_score_model.joblib"
)

print("Load model thành công!")

# Test predict
result = predict_admission(
    bundle=bundle,
    major_code="7480201",
    student_score=24.0,
    subject_combination="A00",
    target_year=2026,
)

print("\n===== RESULT =====")

for key, value in result.items():
    print(f"{key}: {value}")