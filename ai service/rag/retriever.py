# from pathlib import Path
# from dotenv import load_dotenv
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
# from utils.helper import *
# from pattern import *
#
# BASE_DIR = Path(__file__).resolve().parent.parent
# load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)
#
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
#
# MONGODB_URI = get_mongo_uri()
# MONGO_DB_NAME = get_mongo_db_name()
# MONGO_COLLECTION_NAME = get_mongo_collection_name()
# MONGO_VECTOR_INDEX_NAME= get_mongo_vector_index_name()
#
# def embedding_client() -> NVIDIAEmbeddings:
#     return NVIDIAEmbeddings(
#         model="nvidia/nv-embedqa-e5-v5",
#         api_key=os.getenv("NVDIA_API_KEY")
#     )
#
#
# # tiền xử lý query trước khi retrieve
# # đưa về chữ thường, trích xuất các từ có trong câu và ktra xem có trong metadata ko
# def preprocess_query(text: str) -> str:
#     text = text.lower()
#
#
#     return text
#
#
# def normalize_intents(intent):
#     """
#     Chuẩn hóa intent đầu vào.
#     Hỗ trợ:
#     - intent = "hoc_phi"
#     - intent = ["hoc_phi", "diem_chuan"]
#     """
#
#     if intent is None:
#         return []
#
#     if isinstance(intent, str):
#         intent = intent.strip()
#         return [intent] if intent else []
#
#     if isinstance(intent, list):
#         intents = []
#
#         for item in intent:
#             if not item:
#                 continue
#
#             item = str(item).strip()
#
#             if item and item not in intents:
#                 intents.append(item)
#
#         return intents
#
#     return []
#
#
# # param num_candidates lấy ra các chunk liên quan tới query, tiêu chi lấy dựa vượt qua search vector index và hàm cosine
# def get_relevant_context(
#         query,
#         intent,
#         top_k=5,
#         num_candidates=50,
# ):
#     intents = normalize_intents(intent)
#     if not intents:
#         return "Không xác định được intent để truy xuất dữ liệu bổ trợ."
#
#     collection = get_collection()
#     query_embeddings = embedding_client()
#     query_vector = query_embeddings.embed_query(query)
#
#     context_parts = []
#
#     # VÒNG LẶP: Truy vấn riêng biệt cho từng Intent một
#     for current_intent in intents:
#
#         # Bộ lọc cô lập duy nhất 1 intent tại mỗi lượt chạy
#         intent_filter = {"intent": current_intent}
#
#         pipeline = [
#             {
#                 "$vectorSearch": {
#                     "index": MONGO_VECTOR_INDEX_NAME,
#                     "path": "embedding",
#                     "queryVector": query_vector,
#                     "numCandidates": num_candidates,
#                     "limit": top_k,
#                     "filter": intent_filter
#                 }
#             },
#             {
#                 "$project": {
#                     "_id": 0,
#                     "intent": 1,
#                     "chunk_index": 1,
#                     "text": 1,
#                     "score": {"$meta": "vectorSearchScore"}
#                 }
#             }
#         ]
#
#         try:
#             results = list(collection.aggregate(pipeline))
#
#             # Gom kết quả của intent này vào danh sách chung
#             for item in results:
#                 item_intent = item.get("intent", "unknown")
#                 chunk_index = item.get("chunk_index", "unknown")
#                 score = item.get("score", 0)
#                 text = item.get("text", "").strip()
#
#                 if text:
#                     context_parts.append(
#                         f"[Intent: {item_intent} | chunk: {chunk_index} | score: {score:.4f}]\n{text}"
#                     )
#         except Exception as e:
#             print(f"[WARN] Lỗi khi quét intent {current_intent}: {e}")
#
#     if not context_parts:
#         return "Không tìm thấy nội dung context hợp lệ."
#
#     return "\n\n---\n\n".join(context_parts)
#
#
# if __name__ == "__main__":
#     context = get_relevant_context(
#         query="Học phí và điểm chuẩn ngành công nghệ thông tin",
#         intent=["hoc_phi", "diem_chuan"])
#     print(context)



import os
from pathlib import Path
from typing import Dict, Any, Optional, List, Union

from dotenv import load_dotenv
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

from utils.helper import *
from metadata_process import clean_metadata_value
from classifier import *


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

MONGO_VECTOR_INDEX_NAME = get_mongo_vector_index_name()


def embedding_client() -> NVIDIAEmbeddings:
    return NVIDIAEmbeddings(
        model=get_embedding_model(),
        api_key=os.getenv("API_KEY"),
        base_url="https://integrate.api.nvidia.com/v1",
    )


def normalize_intents(intent) -> List[str]:
    if intent is None:
        return []

    if isinstance(intent, str):
        intent = intent.strip()
        return [intent] if intent else []

    if isinstance(intent, list):
        intents = []
        for item in intent:
            item = str(item).strip()
            if item and item not in intents:
                intents.append(item)
        return intents

    return []


# thêm phần metadata vào trc key để dùng trong filter
# vdu: major_code: cntt -> metadata.major_code: cntt
def normalize_metadata_filter(
    metadata_filter: Optional[Dict[str, Any]]
) -> Dict[str, Any]:
    if not metadata_filter:
        return {}

    normalized: Dict[str, Any] = {}

    for key, value in metadata_filter.items():
        if value is None:
            continue

        mongo_key = key if key.startswith("metadata.") else f"metadata.{key}"

        if isinstance(value, list):
            normalized[mongo_key] = {
                "$in": [
                    clean_metadata_value(v)
                    for v in value
                    if v is not None and str(v).strip()
                ]
            }
            continue

        if isinstance(value, dict):
            normalized[mongo_key] = value
            continue

        normalized[mongo_key] = clean_metadata_value(value)

    return normalized


# tạo filter
def build_vector_filter(
    current_intent: str,
    metadata_filter: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:

    vector_filter = {
        "intent": current_intent
    }

    extra_filter = normalize_metadata_filter(metadata_filter)

    vector_filter.update(extra_filter)

    return vector_filter

def get_relevant_context(
    query: str,
    intent: Union[str, List[str]],
    metadata_filter: Optional[Dict[str, Any]] = None,
    top_k: int = 5,
    num_candidates: int = 50,
) -> str:
    intents = normalize_intents(intent)

    if not intents:
        return "Ko xác định được intent"

    query = preprocess_query(query)

    collection = get_collection()
    embeddings = embedding_client()
    query_vector = embeddings.embed_query(query)

    context_parts = []

    for current_intent in intents:
        vector_filter = build_vector_filter(
            current_intent=current_intent,
            metadata_filter=metadata_filter,
        )

        pipeline = [
            {
                "$vectorSearch": {
                    "index": MONGO_VECTOR_INDEX_NAME,
                    "path": "embedding",
                    "queryVector": query_vector,
                    "numCandidates": num_candidates,
                    "limit": top_k,
                    "filter": vector_filter,
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "intent": 1,
                    "chunk_index": 1,
                    "source_file": 1,
                    "text": 1,
                    "metadata": 1,
                    "score": {"$meta": "vectorSearchScore"},
                }
            },
        ]

        try:
            results = list(collection.aggregate(pipeline))

            print("\n====================================")
            print("[QUERY]", query)
            print("[INTENT]", current_intent)
            print("[FILTER]", vector_filter)
            print("[RESULT COUNT]", len(results))

            for item in results:
                item_intent = item.get("intent", "unknown")
                chunk_index = item.get("chunk_index", "unknown")
                source_file = item.get("source_file", "unknown")
                score = item.get("score", 0)
                text = item.get("text", "").strip()
                metadata = item.get("metadata", {})

                if text:
                    context_parts.append(
                        f"[Intent: {item_intent} | source: {source_file} | "
                        f"chunk: {chunk_index} | score: {score:.4f}]\n"
                        f"[Metadata: {metadata}]\n"
                        f"{text}"
                    )

        except Exception as e:
            print(f"[WARN] Lỗi khi retrieve intent {current_intent}: {type(e).__name__}: {e}")

    if not context_parts:
        return "Không tìm thấy nội dung context hợp lệ."

    return "\n\n---\n\n".join(context_parts)


if __name__ == "__main__":
    context = get_relevant_context(
        query="tổ hợp xét tuyển ngành sư phạm kỹ thuật nông nghiệp",
        intent="to_hop",
        metadata_filter={
            # "year": "2024",
            "major": "sư phạm kỹ thuật nông nghiệp"
        },
        top_k=5,
        num_candidates=50,
    )

    print("\n\n========== CONTEXT ==========\n")
    print(context)