from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "assets" / "score-data"
MODEL_DIR = PROJECT_ROOT / "assets" / "models"

HISTORICAL_DATA_PATH = DATA_DIR / "dataset.csv"
CANDIDATE_2025_PATH = DATA_DIR / "thi_sinh_2025_nguyen_vong.csv"
NATIONAL_SUBJECT_STATS_PATH = DATA_DIR / "pho_diem_2020_2025.csv"

SCHOOL_CODE = "NLU"
TRAIN_END_YEAR = 2024
TEST_YEAR = 2025
RANDOM_STATE = 42

# Subject names follow pho_diem_2020_2025.csv.
BLOCK_SUBJECTS = {
    "A00": ("Toan", "Vat_li", "Hoa_hoc"),
    "A01": ("Toan", "Vat_li", "Tieng_Anh"),
    "A02": ("Toan", "Vat_li", "Sinh_hoc"),
    "B00": ("Toan", "Hoa_hoc", "Sinh_hoc"),
    "B02": ("Toan", "Sinh_hoc", "Dia_li"),
    "B03": ("Toan", "Sinh_hoc", "Ngu_van"),
    "C00": ("Ngu_van", "Lich_su", "Dia_li"),
    "C01": ("Ngu_van", "Toan", "Vat_li"),
    "C02": ("Ngu_van", "Toan", "Hoa_hoc"),
    "C03": ("Ngu_van", "Toan", "Lich_su"),
    "C04": ("Ngu_van", "Toan", "Dia_li"),
    "D01": ("Toan", "Ngu_van", "Tieng_Anh"),
    "D07": ("Toan", "Hoa_hoc", "Tieng_Anh"),
    "D08": ("Toan", "Sinh_hoc", "Tieng_Anh"),
    "D09": ("Toan", "Lich_su", "Tieng_Anh"),
    "D10": ("Toan", "Dia_li", "Tieng_Anh"),
    "D14": ("Ngu_van", "Lich_su", "Tieng_Anh"),
}

PIPELINE_A_NUMERIC_FEATURES = [
    "Major_Code_Enc",
    "Block_Enc",
    "Admission_Quota",
    "Prev_Year_Score",
    "Program_Type_Enc",
]

PIPELINE_B_EXTRA_NUMERIC_FEATURES = [
    "National_Mean_Score",
    "National_Median_Score",
    "Delta_Quota",
]

CATEGORICAL_FEATURES = []
