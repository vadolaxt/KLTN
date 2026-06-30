from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "assets" / "score-data"
MODEL_DIR = PROJECT_ROOT / "assets" / "models"

HISTORICAL_DATA_PATH = DATA_DIR / "dataset.csv"
HISTORICAL_DATA_SGU_PATH = DATA_DIR / "dataset_sgu.csv"
NATIONAL_SUBJECT_STATS_PATH = DATA_DIR / "pho_diem_2020_2025.csv"

SCHOOL_CODE = "NLU"
# Quy trình mặc định: huấn luyện đến 2024, kiểm thử bằng điểm chuẩn thật 2025,
# rồi retrain đến 2025 để đóng gói model dự đoán cho năm 2026 trên giao diện.
TRAIN_END_YEAR = 2024
TEST_YEAR = 2025
RANDOM_STATE = 42

# Mã môn dùng thống nhất cho dữ liệu điểm chuẩn, phổ điểm quốc gia và điểm thí sinh.
BLOCK_SUBJECTS = {
    "A00": ("Toan", "Vat_li", "Hoa_hoc"),
    "A01": ("Toan", "Vat_li", "Tieng_Anh"),
    "A02": ("Toan", "Vat_li", "Sinh_hoc"),
    "A03": ("Toan", "Vat_li", "Lich_su"),
    "A04": ("Toan", "Vat_li", "Dia_li"),
    "A05": ("Toan", "Hoa_hoc", "Lich_su"),
    "A06": ("Toan", "Hoa_hoc", "Dia_li"),
    "A07": ("Toan", "Lich_su", "Dia_li"),
    "B00": ("Toan", "Hoa_hoc", "Sinh_hoc"),
    "B01": ("Toan", "Sinh_hoc", "Lich_su"),
    "B02": ("Toan", "Sinh_hoc", "Dia_li"),
    "B03": ("Toan", "Sinh_hoc", "Ngu_van"),
    "B08": ("Toan", "Sinh_hoc", "Tieng_Anh"),
    "C00": ("Ngu_van", "Lich_su", "Dia_li"),
    "C01": ("Ngu_van", "Toan", "Vat_li"),
    "C02": ("Ngu_van", "Toan", "Hoa_hoc"),
    "C03": ("Ngu_van", "Toan", "Lich_su"),
    "C04": ("Ngu_van", "Toan", "Dia_li"),
    "C05": ("Ngu_van", "Vat_li", "Hoa_hoc"),
    "C06": ("Ngu_van", "Vat_li", "Sinh_hoc"),
    "C07": ("Ngu_van", "Vat_li", "Lich_su"),
    "C08": ("Ngu_van", "Hoa_hoc", "Sinh_hoc"),
    "C09": ("Ngu_van", "Vat_li", "Dia_li"),
    "C10": ("Ngu_van", "Hoa_hoc", "Lich_su"),
    "C11": ("Ngu_van", "Hoa_hoc", "Dia_li"),
    "C12": ("Ngu_van", "Sinh_hoc", "Lich_su"),
    "C13": ("Ngu_van", "Sinh_hoc", "Dia_li"),
    "D01": ("Toan", "Ngu_van", "Tieng_Anh"),
    "D07": ("Toan", "Hoa_hoc", "Tieng_Anh"),
    "D08": ("Toan", "Sinh_hoc", "Tieng_Anh"),
    "D09": ("Toan", "Lich_su", "Tieng_Anh"),
    "D10": ("Toan", "Dia_li", "Tieng_Anh"),
    "D11": ("Ngu_van", "Vat_li", "Tieng_Anh"),
    "D12": ("Ngu_van", "Hoa_hoc", "Tieng_Anh"),
    "D13": ("Ngu_van", "Sinh_hoc", "Tieng_Anh"),
    "D14": ("Ngu_van", "Lich_su", "Tieng_Anh"),
    "D15": ("Ngu_van", "Dia_li", "Tieng_Anh"),
    "X01": ("Toan", "Ngu_van", "GDKT_PL"),
    "X02": ("Toan", "Ngu_van", "TIN_HOC"),
    "X03": ("Toan", "Ngu_van", "CN_CONG_NGHIEP"),
    "X04": ("Toan", "Ngu_van", "CN_NONG_NGHIEP"),
    "X05": ("Toan", "Vat_li", "GDKT_PL"),
    "X06": ("Toan", "Vat_li", "TIN_HOC"),
    "X07": ("Toan", "Vat_li", "CN_CONG_NGHIEP"),
    "X08": ("Toan", "Vat_li", "CN_NONG_NGHIEP"),
    "X09": ("Toan", "Hoa_hoc", "GDKT_PL"),
    "X10": ("Toan", "Hoa_hoc", "TIN_HOC"),
    "X11": ("Toan", "Hoa_hoc", "CN_CONG_NGHIEP"),
    "X12": ("Toan", "Hoa_hoc", "CN_NONG_NGHIEP"),
    "X13": ("Toan", "Sinh_hoc", "GDKT_PL"),
    "X14": ("Toan", "Sinh_hoc", "TIN_HOC"),
    "X15": ("Toan", "Sinh_hoc", "CN_CONG_NGHIEP"),
    "X16": ("Toan", "Sinh_hoc", "CN_NONG_NGHIEP"),
    "X17": ("Toan", "Dia_li", "GDKT_PL"),
    "X18": ("Toan", "Dia_li", "TIN_HOC"),
    "X19": ("Toan", "Dia_li", "CN_CONG_NGHIEP"),
    "X20": ("Toan", "Dia_li", "CN_NONG_NGHIEP"),
    "X21": ("Toan", "Lich_su", "GDKT_PL"),
    "X22": ("Toan", "Lich_su", "TIN_HOC"),
    "X23": ("Toan", "Lich_su", "CN_CONG_NGHIEP"),
    "X24": ("Toan", "Lich_su", "CN_NONG_NGHIEP"),
    "X25": ("Toan", "GDKT_PL", "Tieng_Anh"),
    "X26": ("Toan", "TIN_HOC", "Tieng_Anh"),
    "X27": ("Toan", "CN_CONG_NGHIEP", "Tieng_Anh"),
    "X28": ("Toan", "CN_NONG_NGHIEP", "Tieng_Anh"),
    "X53": ("Toan", "GDKT_PL", "TIN_HOC"),
    "X54": ("Toan", "GDKT_PL", "CN_CONG_NGHIEP"),
    "X55": ("Toan", "GDKT_PL", "CN_NONG_NGHIEP"),
    "X56": ("Toan", "TIN_HOC", "CN_CONG_NGHIEP"),
    "X57": ("Toan", "TIN_HOC", "CN_NONG_NGHIEP"),
    "X78": ("Ngu_van", "GDKT_PL", "Tieng_Anh"),
    "X79": ("Ngu_van", "Tieng_Anh", "TIN_HOC"),
    "X80": ("Ngu_van", "Tieng_Anh", "CN_CONG_NGHIEP"),
    "X81": ("Ngu_van", "Tieng_Anh", "CN_NONG_NGHIEP"),
}

# Ánh xạ tên môn tiếng Việt trong cột Note và dữ liệu request API về mã môn nội bộ.
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
    # Giáo dục kinh tế và pháp luật
    "giáo dục kinh tế và pháp luật": "GDKT_PL",
    "giáo dục kt&pl": "GDKT_PL",
    "giao duc kinh te va phap luat": "GDKT_PL",
    "giao duc kt&pl": "GDKT_PL",
    # Tin học và công nghệ
    "tin học": "TIN_HOC",
    "tin hoc": "TIN_HOC",
    "công nghệ công nghiệp": "CN_CONG_NGHIEP",
    "cong nghe cong nghiep": "CN_CONG_NGHIEP",
    "công nghệ nông nghiệp": "CN_NONG_NGHIEP",
    "cong nghe nong nghiep": "CN_NONG_NGHIEP",
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

# Vị trí môn trong từng tổ hợp, dùng khi cần kiểm tra môn chung có thuộc tổ hợp hay không.
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
    "Has_Common_Subject",   # Có môn chung/môn chính nhân hệ số hay không.
]

PIPELINE_B_EXTRA_NUMERIC_FEATURES = [
    "National_Mean_Score",
    "National_Median_Score",
    "Delta_Quota",
]

CATEGORICAL_FEATURES = []
