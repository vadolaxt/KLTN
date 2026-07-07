import hashlib
import json
import os
import re
from pathlib import Path
from typing import List

import joblib
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from pymongo import MongoClient
from pymongo.operations import SearchIndexModel
from transformers import AutoTokenizer, pipeline

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)


def reset_collection():
    rs = os.getenv("RESET_COLLECTION")
    return rs

def get_collection():
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client[str(os.getenv("MONGO_DB_NAME"))]
    collection = db[str(os.getenv("MONGO_COLLECTION_NAME"))]
    return collection

def get_api_key():
    key = os.getenv("API_KEY")
    return key

def get_embedding_model():
    embed_model = os.getenv("EMBEDDING_MODEL")
    return embed_model

def get_embedding_dimensions() -> int:
    dim = os.getenv("EMBEDDING_DIMENSIONS")
    return int(dim)

def get_embedding_sleep_second() -> float:
    sec = os.getenv("EMBEDDING_SLEEP_SECONDS")
    return float(sec)

def get_chunk_size():
    size = os.getenv("CHUNK_SIZE")
    return size

def get_chunk_overlap():
    size = os.getenv("CHUNK_OVERLAP")
    return size

def get_mongo_uri():
    uri = os.getenv("MONGO_URI")
    return uri

def get_mongo_db_name():
    name = os.getenv("MONGO_DB_NAME")
    return name

def get_mongo_collection_name():
    collection = os.getenv("MONGO_COLLECTION_NAME")
    return collection

def get_mongo_vector_index_name():
    name = os.getenv("MONGO_VECTOR_INDEX_NAME")
    return name

def sha256_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def build_chunk_id(
    intent_name: str,
    chunk_index: int,
    content_hash: str
) -> str:
    return f"{intent_name}_{chunk_index:04d}_{content_hash[:12]}"

def create_vector_search_index(collection=get_collection()) -> None:
    try:
        existing_indexes = list(collection.list_search_indexes())
        existing_names = {idx.get("name") for idx in existing_indexes}

        mongo_vector_index_name = get_mongo_vector_index_name()

        if mongo_vector_index_name in existing_names:
            print(f"[INDEX] Vector index đã tồn tại: {mongo_vector_index_name}")
            return

        index_model = SearchIndexModel(
            definition={
                "fields": [
                    {
                        "type": "vector",
                        "path": "embedding", # nơi chứa các embedding vector, xem attr embedding trong collection chứa chunk
                        "numDimensions": get_embedding_dimensions(),
                        "similarity": "cosine", # đo độ tương đồng giữa các vector (xem thêm euclidean, dotProduct)
                    },
                    {
                        "type": "filter",
                        "path": "intent",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.major",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.major_code",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.specialization",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.specialization_code",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.combination",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.overview",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.achievement",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.development",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.formula",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.priority_type",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.club_name",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.year",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.school_year",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.right",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.condition",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.profile",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.price",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.method",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.method_num",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.program_type",
                    },
                    {
                        "type": "filter",
                        "path": "metadata.dorm_type",
                    },
                ]
            },
            name=mongo_vector_index_name,
            type="vectorSearch",
        )

        collection.create_search_index(index_model)

        print(f"[INDEX] Đã gửi yêu cầu tạo vector index: {mongo_vector_index_name}")
        print("[INDEX] MongoDB Atlas có thể cần một lúc để index sẵn sàng.")

    except Exception as e:
        print("[INDEX-WARN] Không tạo được vector index bằng code.")
        print(f"[INDEX-WARN] Lỗi: {type(e).__name__}: {e}")
        print("[INDEX-WARN] Có thể tạo thủ công trong MongoDB Atlas UI.")


# lấy ra model và label encoder của IC
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

# gọi llm
def llm_call():
    # return ChatGoogleGenerativeAI(
    #     model="gemini-2.5-flash",
    #     temperature=0.1,
    #     google_api_key=os.getenv("GOOGLE_API_KEY")
    # )

    return ChatOpenAI(
        # model="meta/llama-3.1-8b-instruct",
        model="qwen/qwen3-next-80b-a3b-instruct",
        # openai_api_key=os.environ.get("API_KEY"),
        openai_api_key="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",
        openai_api_base="https://integrate.api.nvidia.com/v1",
        temperature=0
    )


# dùng cho
def parse_llm_json(text: str) -> List[str]:
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            return []

        try:
            data = json.loads(match.group(0))
        except json.JSONDecodeError:
            return []

    if isinstance(data, dict):
        questions = data.get("questions", [])
    elif isinstance(data, list):
        questions = data
    else:
        return []

    return [
        q.strip()
        for q in questions
        if isinstance(q, str) and q.strip()
    ]


if __name__ == "__main__":
    create_vector_search_index(get_collection())