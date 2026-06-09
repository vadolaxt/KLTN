import os
import time
import hashlib
from pathlib import Path
from datetime import datetime, timezone
from typing import List

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.operations import SearchIndexModel

from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from entity.entity import KnowledgeChunk


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

DATA_PATH = Path(BASE_DIR / os.getenv("DATA_PATH", "data/knowledge")).resolve()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME")
MONGO_VECTOR_INDEX_NAME = os.getenv("MONGO_VECTOR_INDEX_NAME")

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", 1024))

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 1000))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 200))
EMBED_SLEEP_SECONDS = float(os.getenv("EMBED_SLEEP_SECONDS", 1.0))

RESET_COLLECTION = os.getenv("RESET_COLLECTION")

def now() -> datetime:
    return datetime.now(timezone.utc)


def sha256_hash(text: str) -> str:
    """
    Tạo mã hash SHA256 cho nội dung chunk.

    Dùng để:
    - định danh nội dung chunk
    - tạo _id ổn định
    - kiểm tra chunk có thay đổi không
    """

    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def check_env() -> None:
    if not GOOGLE_API_KEY:
        raise ValueError("Thiếu GOOGLE_API_KEY trong file .env")

    if not MONGODB_URI:
        raise ValueError("Thiếu MONGODB_URI trong file .env")

    if not DATA_PATH.exists():
        raise FileNotFoundError(f"DATA_PATH không tồn tại: {DATA_PATH}")


def get_collection():
    client = MongoClient(MONGODB_URI)
    db = client[MONGO_DB_NAME]
    collection = db[MONGO_COLLECTION_NAME]

    return collection


def build_chunk_id(intent_name: str, chunk_index: int, content_hash: str) -> str:
    """
    id:
        intent_name = hoc_phi
        chunk_index = 2
        hash = abcdef123456...
    """

    return f"{intent_name}_{chunk_index:04d}_{content_hash[:12]}"


def create_vector_search_index(collection) -> None:
    """
    Tạo MongoDB Atlas Vector Search Index nếu chưa tồn tại.

    Index này cho phép:
    - semantic search trên field embedding
    - filter theo intent
    - filter theo source_file
    """

    try:
        existing_indexes = list(collection.list_search_indexes())
        existing_names = {idx.get("name") for idx in existing_indexes}

        if MONGO_VECTOR_INDEX_NAME in existing_names:
            print(f"[INDEX] Vector index đã tồn tại: {MONGO_VECTOR_INDEX_NAME}")
            return

        index_model = SearchIndexModel(
            definition={
                "fields": [
                    {
                        "type": "vector",
                        "path": "embedding", # nơi chứa các embedding vector, xem attr embedding trong collection chứa chunk
                        "numDimensions": EMBEDDING_DIMENSIONS,
                        "similarity": "cosine", # đo độ tương đồng giữa các vector (xem thêm euclidean, dotProduct)
                    },
                    {
                        "type": "filter",
                        "path": "intent",
                    },
                ]
            },
            name=MONGO_VECTOR_INDEX_NAME,
            type="vectorSearch",
        )

        collection.create_search_index(index_model)

        print(f"[INDEX] Đã gửi yêu cầu tạo vector index: {MONGO_VECTOR_INDEX_NAME}")
        print("[INDEX] MongoDB Atlas có thể cần một lúc để index sẵn sàng.")

    except Exception as e:
        print("[INDEX-WARN] Không tạo được vector index bằng code.")
        print(f"[INDEX-WARN] Lỗi: {type(e).__name__}: {e}")
        print("[INDEX-WARN] Có thể tạo thủ công trong MongoDB Atlas UI.")


def create_knowledge_chunk(
    intent_name: str,
    filename: str,
    file_path: Path,
    chunk_index: int,
    text: str,
    vector: List[float]
) -> KnowledgeChunk:

    content_hash = sha256_hash(text)
    chunk_id = build_chunk_id(intent_name, chunk_index, content_hash)
    current_time = now()

    return KnowledgeChunk(
        id=chunk_id,
        intent=intent_name,
        source_file=filename,
        source_path=str(file_path),
        chunk_index=chunk_index,
        text=text,
        embedding=vector,
        embedding_model=EMBEDDING_MODEL,
        embedding_dimensions=EMBEDDING_DIMENSIONS,
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        content_hash=content_hash,
        created_at=current_time,
        updated_at=current_time,
    )


def create_vector_stores() -> None:
    """
    1. Đọc các file .md trong DATA_PATH
    2. Lấy tên file làm intent
    3. Cắt file thành nhiều chunk
    4. Tạo embedding cho từng chunk
    5. Lưu từng chunk vào MongoDB Atlas
    """

    check_env()

    collection = get_collection()

    collection.create_index("intent")
    collection.create_index("source_file")
    collection.create_index("content_hash")

    if RESET_COLLECTION:
        print(f"[RESET] Xóa toàn bộ collection: {MONGO_COLLECTION_NAME}")
        collection.delete_many({})

    # create_vector_search_index(collection)

    # embeddings = GoogleGenerativeAIEmbeddings(
    #     model=EMBEDDING_MODEL,
    #     google_api_key=GOOGLE_API_KEY,
    #     task_type="retrieval_document",
    # )
    embeddings = NVIDIAEmbeddings(
        model=EMBEDDING_MODEL,
        api_key=os.getenv("NVDIA_API_KEY"),
        base_url = "https://integrate.api.nvidia.com/v1",
    )


    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=[
            "\n# ",
            "\n## ",
            "\n### ",
            "\n\n",
            "\n",
            ". ",
            " ",
            "",
        ],
    )

    files = sorted([
        f for f in os.listdir(DATA_PATH)
        if f.endswith(".md") and os.path.isfile(DATA_PATH / f)
    ])

    if not files:
        print(f"[WARN] Không tìm thấy file .md trong thư mục: {DATA_PATH}")
        return

    total_files = 0
    total_chunks = 0

    for filename in files:
        file_path = DATA_PATH / filename
        intent_name = Path(filename).stem.strip()

        print("\n====================================")
        print(f"[FILE] {filename}")
        print(f"[INTENT] {intent_name}")

        try:
            loader = TextLoader(str(file_path), encoding="utf-8")
            documents = loader.load()

            chunks = text_splitter.split_documents(documents)

            if not chunks:
                print("[SKIP] File trống hoặc không tạo được chunk.")
                continue

            delete_result = collection.delete_many({"source_file": filename})
            print(f"[CLEAN] Đã xóa {delete_result.deleted_count} chunk cũ của file này.")

            mongo_docs = []

            for chunk_index, doc in enumerate(chunks):
                text = doc.page_content.strip()

                if not text:
                    continue

                vector = embeddings.embed_query(text)

                if len(vector) != EMBEDDING_DIMENSIONS:
                    raise ValueError(
                        f"Số chiều embedding không khớp. "
                        f"Expected={EMBEDDING_DIMENSIONS}, got={len(vector)}."
                    )

                chunk_object = create_knowledge_chunk(
                    intent_name=intent_name,
                    filename=filename,
                    file_path=file_path,
                    chunk_index=chunk_index,
                    text=text,
                    vector=vector,
                )

                mongo_docs.append(chunk_object.to_mongo_doc())

                time.sleep(EMBED_SLEEP_SECONDS)

            if not mongo_docs:
                print("[SKIP] Không có chunk hợp lệ để lưu.")
                continue

            collection.insert_many(mongo_docs, ordered=False)

            print(f"[OK] Đã lưu {len(mongo_docs)} chunks vào MongoDB.")
            total_files += 1
            total_chunks += len(mongo_docs)

        except Exception as e:
            print(f"[ERROR] Lỗi khi xử lý {filename}: {type(e).__name__}: {e}")

    print("\n====================================")
    print("[DONE] Hoàn thành embedding và lưu vào MongoDB Atlas")
    print(f"[DONE] Số file xử lý thành công: {total_files}")
    print(f"[DONE] Tổng số chunks đã lưu: {total_chunks}")
    print("====================================")


if __name__ == "__main__":
    create_vector_stores()