from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "assets" / "score-data"
MODEL_DIR = PROJECT_ROOT / "assets" / "models"

HISTORICAL_DATA_PATH = DATA_DIR / "dataset.csv"
HISTORICAL_DATA_SGU_PATH = DATA_DIR / "dataset_sgu.csv"
NATIONAL_SUBJECT_STATS_PATH = DATA_DIR / "pho_diem_2020_2025.csv"

SCHOOL_CODE = "NLU"
TRAIN_END_YEAR = 2025
TEST_YEAR = 2026
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

# Ánh xạ tên tiếng Việt (trong cột Note) → tên môn theo config (dùng cho cả NLU và SGU)
# NLU dùng: "Toán", "Vật lý", "Hóa học", "Tiếng Anh", "Sinh học", "Ngữ văn", "Lịch sử", "Địa lý/Địa lí"
# SGU dùng: "Toán", "Lý", "Hóa", "Anh", "Sinh", "Văn", "Sử", "Địa", "Ngữ văn"
SUBJECT_VI_TO_KEY = {
    # Toán
    "toán": "Toan",
    # Vật lý
    "vật lý": "Vat_li",
    "vật lí": "Vat_li",
    "lý": "Vat_li",
    # Hóa học
    "hóa học": "Hoa_hoc",
    "hóa": "Hoa_hoc",
    # Tiếng Anh
    "tiếng anh": "Tieng_Anh",
    "anh": "Tieng_Anh",
    # Sinh học
    "sinh học": "Sinh_hoc",
    "sinh": "Sinh_hoc",
    # Ngữ văn
    "ngữ văn": "Ngu_van",
    "văn": "Ngu_van",
    # Lịch sử
    "lịch sử": "Lich_su",
    "sử": "Lich_su",
    # Địa lý
    "địa lý": "Dia_li",
    "địa lí": "Dia_li",
    "địa": "Dia_li",
}

# Ánh xạ subject key → vị trí trong tổ hợp (để biết môn nào là môn nào)
# Mỗi tổ hợp gồm 3 môn; khi nhân đôi môn chung, công thức:
# Điểm xét tuyển = (s1 + s2 + s_main * 2) * 3/4  →  thang 30
BLOCK_SUBJECT_POSITIONS = {
    combo: {subj: i for i, subj in enumerate(subjects)}
    for combo, subjects in BLOCK_SUBJECTS.items()
}

PIPELINE_A_NUMERIC_FEATURES = [
    "Major_Code_Enc",
    "Block_Enc",
    "Admission_Quota",
    "Prev_Year_Score",
    "Program_Type_Enc",
    "Has_Common_Subject",   # feature mới: có môn chung nhân đôi không
]

PIPELINE_B_EXTRA_NUMERIC_FEATURES = [
    "National_Mean_Score",
    "National_Median_Score",
    "Delta_Quota",
]

CATEGORICAL_FEATURES = []