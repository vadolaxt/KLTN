from transformers import pipeline, AutoTokenizer
import os
import joblib
import warnings
from pattern import *
from utils.helper import *

from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

_nlp_pipeline = None
_label_encoder = None

# Sắp xếp từ dài trước để tránh lỗi:
# ví dụ "bên cạnh đó" phải được bắt trước "đó"
# "bên\ cạnh\ đó|tuy\ nhiên|vì\ vậy|đó"
# tìm kiếm hoặc cắt (split) chuỗi, nó sẽ tìm tất cả các từ nối
# (được bao bọc bởi khoảng trắng, không phân biệt hoa thường, ưu tiên cụm từ dài trước) HOẶC các dấu phẩy, dấu chấm phẩy.
CONNECTOR_PATTERN = re.compile(
    r"\s+(?:{})\s+|[,;]+".format(
        "|".join(
            map(
                re.escape,
                sorted(word_connector, key=len, reverse=True)
            )
        )
    ),
    flags=re.IGNORECASE
)


STOP_WORDS = "|".join(word_connector)


# Các loại context có thể xuất hiện trong câu
# major   : ngành / chuyên ngành / khoa
# location: cơ sở / phân hiệu / ký túc xá
# year    : năm / khóa
# method  : phương thức xét tuyển

CONTEXT_EXTRACTORS = {
    "major": [
        # Bắt "ngành abc" nhưng dừng lại ngay khi gặp các từ nối hoặc dấu phẩy
        rf"ngành\s+(?:(?!\s+(?:{STOP_WORDS})\s+|[,;]).)+",
        rf"chuyên ngành\s+(?:(?!\s+(?:{STOP_WORDS})\s+|[,;]).)+",
        rf"khoa\s+(?:(?!\s+(?:{STOP_WORDS})\s+|[,;]).)+",
    ],

    "location": [
        rf"phân hiệu\s+(?:(?!\s+(?:{STOP_WORDS})\s+|[,;]).)+",
        rf"ký túc xá\s*(?:(?!\s+(?:{STOP_WORDS})\s+|[,;]).)*",
    ],

    "year": [
        r"năm\s+\d{4}",
        r"khóa\s+\d{4}",
    ],

    "method": [
        rf"phương thức\s+(?:(?!\s+(?:{STOP_WORDS})\s+|[,;]).)+",
        r"xét học bạ",
        r"xét tuyển học bạ",
        r"điểm thi thpt",
        r"đánh giá năng lực",
    ],
}


INTENT_CONTEXT_RULES = {
    "hoc_phi": ["major", "year"],
    "diem_chuan": ["major", "year", "method"],
    "to_hop": ["major"],
    "thong_tin_ve_nganh_hoc": ["major"],
    "phuong_thuc_xet_tuyen": ["major", "method"],
    "thi_nang_khieu": [],
    "ky_tuc_xa": ["location"],
    "co_so_vat_chat": ["location"],
    "cac_moc_thoi_gian": [],
    "quy_doi_diem_tieng_anh": [],
}

# tách câu theo từ nối
def split_by_connector(question, min_len=4):
    """
    min_len là độ dài của từ sau khi tách (loại bỏ những từ ko có ý nghĩa)

    - Ví dụ: câu gốc A, học phí và tổ hợp
    sau khi tách: ["A", "học phí", "tổ hợp"]
    loại bỏ A vì ngắn hơn min_len

    """

    parts = CONNECTOR_PATTERN.split(question)

    parts = [
        p.strip()
        for p in parts
        if len(p.strip()) >= min_len
    ]

    return parts if parts else [question]


# lấy ra context trong câu
def extract_context(text):
    """
    Lấy ra context từ toàn bộ câu
    ví dụ: học phí và tổ hợp ngành công nghệ thông tin
    -> có context ngành công nghệ thông tin

    ở đây lấy ra regex trước rồi từ đó tìm trong CONTEXT_EXTRACTORS lấy ra dict có key tương ứng với regex (value)
    """
    contexts = {}

    # ctruc của CONTEXT_EXTRACTORS là dict
    # ctx type là major, location ...
    # patterns là giá trị tương với type  r"ngành\s+[\w\sÀ-ỹ0-9]+", r"chuyên ngành\s+[\w\sÀ-ỹ0-9]+", ...
    for ctx_type, patterns in CONTEXT_EXTRACTORS.items():
        values = []

        # ktra xem trong câu có pattern nào được sử dụng ko
        for pattern in patterns:
            matches = re.findall(pattern, text, flags=re.IGNORECASE)

            # loop để tránh thêm pattern trùng nhau vào values
            for m in matches:
                m = m.strip()

                if m and m not in values:
                    values.append(m)

        if values:
            contexts[ctx_type] = values

    return contexts


# ktra câu sau khi tách đã có context chưa
def part_has_context(part, context_values):
    """
    Kiểm tra câu con đã có context chưa.
    Ví dụ:
    part = 'tổ hợp ngành CNTT'
    context_values = ['ngành CNTT']
    -> True
    """

    for ctx in context_values:
        if ctx.lower() in part.lower():
            return True

    return False


# bổ sung context vào câu con đã tách
def enrich_by_intent(part, intent, global_context):
    """
    Gắn context vào câu con dựa theo intent.

    Ví dụ:
    Câu gốc:
    'học phí và tổ hợp ngành CNTT'

    Sau split:
    ['học phí', 'tổ hợp ngành CNTT']

    Với intent 'hoc_phi', cần major.
    -> 'học phí ngành CNTT'

    Với intent 'to_hop', câu đã có major.
    -> giữ nguyên.
    """
    needed_contexts = INTENT_CONTEXT_RULES.get(intent, [])

    enriched = part

    for ctx_type in needed_contexts:
        values = global_context.get(ctx_type, [])

        if not values:
            continue

        if not part_has_context(enriched, values):
            enriched = f"{enriched} {values[0]}"

    return enriched


# xác định intent của câu thông qua IC
def ic_call(questions):

    if not questions:
        return []

    resources = get_resources()

    if resources is None:
        return {
            "intent": "error",
            "conf": 0.0,
            "message": "IC chưa được khởi tạo."
        }

    nlp, le = resources

    try:
        results = nlp(questions, top_k=1)

        output = []
        for result in results:
            if isinstance(result, list):
                res_dict = result[0]
            else:
                res_dict = result

            raw_label = res_dict["label"]
            confidence = float(res_dict["score"])
            intent_name = decode_label(raw_label, le)

            output.append({
                "intent": intent_name,
                "conf": confidence
            })

        return output

    except Exception as e:
        return [{
            "intent": "error",
            "conf": 0.0,
            "message": f"Lỗi batch inference: {e}"}] * len(questions)


# xly tách câu
def split_question(question):
    """
    Flow:
    1. Lấy context toàn câu
    2. Tách câu theo từ nối
    3. Phân loại từng câu con
    4. Dựa vào intent để gắn context nếu cần
    5. Phân loại lại câu sau khi đã gắn context vào câu con
    """


    global_context = extract_context(question)
    raw_parts = split_by_connector(question)

    if not raw_parts:
        return []

    # BƯỚC 1: BATCH INFERENCE LẦN 1 (Gọi 1 lần duy nhất cho tất cả các vế)
    initial_pred = ic_call(raw_parts)

    results = []
    enriched_parts = []
    parts_to_reclassify = []
    reclassify_indices = []

    # BƯỚC 2: ĐẮP NGỮ CẢNH VÀ LỌC RA CÁC CÂU CẦN PHÂN LOẠI LẠI
    for i, part in enumerate(raw_parts):
        pred = initial_pred[i]

        enriched = enrich_by_intent(
            part=part,
            intent=pred.get("intent"),
            global_context=global_context
        )
        enriched_parts.append(enriched)

        # TỐI ƯU KÉP: Chỉ lưu lại những câu thực sự được đắp thêm chữ để gọi model lần 2
        if enriched != part:
            parts_to_reclassify.append(enriched)
            reclassify_indices.append(i)  # Lưu lại vị trí để lát cập nhật đúng chỗ

    # BƯỚC 3: BATCH INFERENCE LẦN 2 (Chỉ chạy cho những câu đã thay đổi)
    if parts_to_reclassify:
        reclassified_preds = ic_call(parts_to_reclassify)

        # Cập nhật kết quả mới đè lên kết quả cũ tại đúng vị trí (index)
        for idx, new_pred in zip(reclassify_indices, reclassified_preds):
            initial_pred[idx] = new_pred

    for i, enriched_part in enumerate(enriched_parts):
        final_pred = initial_pred[i]
        results.append({
            "question": enriched_part,
            "intent": final_pred.get("intent"),
            "conf": final_pred.get("conf", 0.0)
        })

    return results


# tiền xử lý query trước khi retrieve
# 1/ viết thường, xóa tab dư
# 2/ chuyển đổi các từ viết tắt thành viết đủ
# 3/ tách câu nhiều ý thành các câu riêng biệt (xem ở router)
# 4/ trích xuất context từ query để dùng cho filter (nếu có)
# 5/ gọi ic và phân loại, nếu conf thấp hơn threshold thì ko add vào result trả về



def preprocess_query(text: str) -> str:
    text = text.lower().strip()

    return text


if __name__ == "__main__":
    print(split_question("Điểm chẩn và tổ hợp xét tuyển ngành công nghệ thông tin và trường có mấy giảng đường"))