from transformers import pipeline, AutoTokenizer
import os
import re
import joblib
import warnings

from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)


_nlp_pipeline = None
_label_encoder = None


def get_resources():
    global _nlp_pipeline, _label_encoder

    if _nlp_pipeline is None:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        base_dir = os.path.dirname(current_dir)
        assets_dir = os.path.join(base_dir, "assets")

        model_path = os.path.abspath(
            os.path.join(assets_dir, "models", "best_phobert")
        )

        le_path = os.path.abspath(
            os.path.join(model_path, "label_encoder.pkl")
        )

        if _label_encoder is None:
            if os.path.exists(le_path):
                try:
                    _label_encoder = joblib.load(le_path)
                except Exception as e:
                    print(f"Lỗi khi load Label Encoder: {e}")
            else:
                print(f"Không tìm thấy file Label Encoder tại: {le_path}")

        if not os.path.exists(os.path.join(model_path, "config.json")):
            print(f"LỖI: Không tìm thấy config.json tại {model_path}")
            return None

        try:
            tokenizer = AutoTokenizer.from_pretrained(
                model_path,
                local_files_only=True
            )

            _nlp_pipeline = pipeline(
                "text-classification",
                model=model_path,
                tokenizer=tokenizer,
                device=-1,
            )

        except Exception as e:
            print(f"Lỗi khi khởi tạo IC model: {e}")
            print("Kiểm tra đủ các file tokenizer như vocab.txt, bpe.codes, tokenizer_config.json...")
            return None

    return _nlp_pipeline, _label_encoder


def decode_label(raw_label, le=None):
    intent_name = str(raw_label)

    if le is None:
        return intent_name

    try:
        raw_label = str(raw_label)

        if raw_label.startswith("LABEL_"):
            label_idx = int(raw_label.replace("LABEL_", ""))
        else:
            label_idx = int(raw_label)

        intent_name = le.inverse_transform([label_idx])[0]

    except Exception:
        pass

    return intent_name


def normalize_question(text):
    text = str(text).strip()
    text = re.sub(r"\s+", " ", text)
    return text


# dsach từ nối
CONNECTORS = [
    "bên cạnh đó",
    "ngoài ra",
    "đồng thời",
    "thêm nữa",
    "với lại",
    "và",
    "với",
    "hay",
    "hoặc",
    "còn",
]

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
                sorted(CONNECTORS, key=len, reverse=True)
            )
        )
    ),
    flags=re.IGNORECASE
)


STOP_WORDS = "|".join(CONNECTORS)


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

    text = normalize_question(question)
    parts = CONNECTOR_PATTERN.split(text)

    parts = [
        p.strip()
        for p in parts
        if len(p.strip()) >= min_len
    ]

    return parts if parts else [text]


# lấy ra context trong câu
def extract_context(text):
    """
    Lấy ra context từ toàn bộ câu
    ví dụ: học phí và tổ hợp ngành công nghệ thông tin
    -> có context ngành công nghệ thông tin

    ở đây lấy ra regex trước rồi từ đó tìm trong CONTEXT_EXTRACTORS lấy ra dict có key tương ứng với regex (value)
    """
    text = normalize_question(text)
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


# xly phân loại các câu hỏi cùng 1 lúc thay vì phân loại 1 lần 1 câu
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


if __name__ == "__main__":
    print(split_question("điểm chẩn và tổ hợp xét tuyển ngành công nghệ thông tin và trường có mấy giảng đường"))