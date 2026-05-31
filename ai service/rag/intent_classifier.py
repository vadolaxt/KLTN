from transformers import pipeline, AutoTokenizer
import os
import joblib
import warnings

from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
import transformers

transformers.utils.logging.set_verbosity_error()

_nlp_pipeline = None
_label_encoder = None


def get_resources():
    global _nlp_pipeline, _label_encoder

    if _nlp_pipeline is None:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        base_dir = os.path.dirname(current_dir)
        assets_dir = os.path.join(base_dir, "assets")

        model_path = os.path.abspath(os.path.join(assets_dir, "models", "phobert", "completed_phobert"))
        le_path = os.path.abspath(os.path.join(assets_dir, "label_encoder_v2.pkl"))

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
                device=-1,  # chạy = CPU: -1,GPU: 0
            )

        except Exception as e:
            print(f"Lỗi khi khởi tạo: {e}")
            # nếu gặp lỗi này thì chạy hàm install_tokenizer
            print("Mẹo: Hãy đảm bảo các file vocab.txt, bpe.codes... có trong folder checkpoint.")
            return None

    return _nlp_pipeline, _label_encoder


def ic_call(question, top_k=3):
    """
    Hàm này trả về danh sách Top K intent để hỗ trợ việc chọn Context.
    Mặc định lấy Top 3 để ông dễ dàng xử lý trường hợp model phân vân.
    """

    resources = get_resources()
    if resources is None:
        return "Lỗi: IC chưa được khởi tạo."

    nlp, le = resources

    # 1. Lấy toàn bộ kết quả (đã sắp xếp từ cao đến thấp)
    results = nlp(question, top_k=None)

    final_results = []

    # 2. Duyệt qua danh sách để giải mã nhãn
    # Tôi giới hạn lại lấy Top K để tránh làm loãng dữ liệu
    for i in range(min(top_k, len(results))):
        res = results[i]
        raw_label = str(res['label'])
        score = res['score']

        intent_name = raw_label
        if le is not None:
            try:
                if "_" in raw_label:
                    label_idx = int(raw_label.split('_')[1])
                else:
                    label_idx = int(raw_label)
                intent_name = le.inverse_transform([label_idx])[0]
            except Exception as e:
                # Nếu không giải mã được thì giữ nguyên nhãn gốc
                pass

        final_results.append({
            "intent": intent_name,
            "score": score
        })

    # Trả về danh sách các intent tiềm năng nhất
    return final_results
