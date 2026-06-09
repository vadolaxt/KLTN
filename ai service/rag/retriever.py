import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

MONGODB_URI = os.getenv("MONGODB_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "chatbot")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "knowledge_chunks")
MONGO_VECTOR_INDEX_NAME = os.getenv("MONGO_VECTOR_INDEX_NAME", "knowledge_vector_index")

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "models/gemini-embedding-001")


def get_mongo_collection():
    client = MongoClient(MONGODB_URI)
    db = client[MONGO_DB_NAME]
    collection = db[MONGO_COLLECTION_NAME]

    return collection


def normalize_intents(intent):
    """
    Chuẩn hóa intent đầu vào.
    Hỗ trợ:
    - intent = "hoc_phi"
    - intent = ["hoc_phi", "diem_chuan"]
    """

    if intent is None:
        return []

    if isinstance(intent, str):
        intent = intent.strip()
        return [intent] if intent else []

    if isinstance(intent, list):
        intents = []

        for item in intent:
            if not item:
                continue

            item = str(item).strip()

            if item and item not in intents:
                intents.append(item)

        return intents

    return []


# param num_candidates lấy ra các chunk liên quan tới query, tiêu chi lấy dựa vượt qua search vector index và hàm cosine
def get_relevant_context(query, intent, top_k=5, num_candidates=30):
    intents = normalize_intents(intent)
    if not intents:
        return "Không xác định được intent để truy xuất dữ liệu bổ trợ."

    collection = get_mongo_collection()
    query_embeddings = NVIDIAEmbeddings(
        model="nvidia/nv-embedqa-e5-v5",
        api_key=os.getenv("NVDIA_API_KEY")
    )
    query_vector = query_embeddings.embed_query(query)

    context_parts = []

    # VÒNG LẶP: Truy vấn riêng biệt cho từng Intent một
    for current_intent in intents:

        # Bộ lọc cô lập duy nhất 1 intent tại mỗi lượt chạy
        intent_filter = {"intent": current_intent}

        pipeline = [
            {
                "$vectorSearch": {
                    "index": MONGO_VECTOR_INDEX_NAME,
                    "path": "embedding",
                    "queryVector": query_vector,
                    "numCandidates": num_candidates,
                    "limit": top_k,  # Mỗi intent lấy đúng số lượng top_k này
                    "filter": intent_filter
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "intent": 1,
                    "chunk_index": 1,
                    "text": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]

        try:
            results = list(collection.aggregate(pipeline))

            # Gom kết quả của intent này vào danh sách chung
            for item in results:
                item_intent = item.get("intent", "unknown")
                chunk_index = item.get("chunk_index", "unknown")
                score = item.get("score", 0)
                text = item.get("text", "").strip()

                if text:
                    context_parts.append(
                        f"[Intent: {item_intent} | chunk: {chunk_index} | score: {score:.4f}]\n{text}"
                    )
        except Exception as e:
            print(f"[WARN] Lỗi khi quét intent {current_intent}: {e}")

    if not context_parts:
        return "Không tìm thấy nội dung context hợp lệ."

    return "\n\n---\n\n".join(context_parts)


if __name__ == "__main__":
    context = get_relevant_context(
        query="Học phí và điểm chuẩn ngành công nghệ thông tin",
        intent=["hoc_phi", "diem_chuan"])
    print(context)
