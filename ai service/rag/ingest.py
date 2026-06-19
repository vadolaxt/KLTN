import time
from datetime import datetime, timezone
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings

from entity.entity import KnowledgeChunk
from utils.helper import *
from metadata_process import *
from pattern import *


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

DATA_PATH = Path(BASE_DIR / os.getenv("DATA_PATH", "data/knowledge")).resolve()

API_KEY = get_api_key()

EMBEDDING_MODEL = get_embedding_model()
EMBEDDING_DIMENSIONS = get_embedding_dimensions()
EMBED_SLEEP_SECONDS = get_embedding_sleep_second()

MONGO_URI = get_mongo_uri()
MONGO_DB_NAME = get_mongo_db_name()
MONGO_COLLECTION_NAME = get_mongo_collection_name()
MONGO_VECTOR_INDEX_NAME = get_mongo_vector_index_name()

RESET_COLLECTION = reset_collection()


# gọi embedding model từ api
def embedding_client() -> NVIDIAEmbeddings:
    return NVIDIAEmbeddings(
        model=EMBEDDING_MODEL,
        api_key=API_KEY,
        base_url="https://integrate.api.nvidia.com/v1",
    )


# đọc file .md từ assets
# hàm trả về global metadata và raw text
def read_knowledge_file(file_path: Path) -> Tuple[Dict[str, Any], str]:
    if not file_path.exists():
        raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

    if not file_path.is_file():
        raise ValueError(f"Path không phải là file: {file_path}")

    raw_text = file_path.read_text(encoding="utf-8").lstrip("\ufeff")
    global_metadata = extract_global_metadata(raw_text)

    return global_metadata, raw_text


# tạo KnowledgeChunk với các giá trị truyền vào
# class KnowledgeChunk đại diện cho record trong collection
def map_to_knowledge_chunk(
    intent_name: str,
    filename: str,
    file_path: Path,
    chunk_index: int,
    text: str,
    embedding: List[float],
    metadata: Dict[str, Any],
) -> KnowledgeChunk:

    content_hash = sha256_hash(text)

    chunk_id = build_chunk_id(
        intent_name=intent_name,
        chunk_index=chunk_index,
        content_hash=content_hash,
    )

    current_time = datetime.now(timezone.utc)

    return KnowledgeChunk(
        id=chunk_id,
        intent=intent_name,
        source_file=filename,
        source_path=str(file_path),

        chunk_index=chunk_index,

        text=text,
        embedding=embedding,

        embedding_model=EMBEDDING_MODEL,
        embedding_dimensions=EMBEDDING_DIMENSIONS,

        content_hash=content_hash,

        created_at=current_time,
        updated_at=current_time,

        metadata=metadata,
    )


# xác định có đang ở header ko
def is_heading_line(line: str):
    return heading_pattern().match(line or "")


# tách text thành các chunk theo heading
# các dòng trong chunk được nối bằng \n (nếu tách ra thì tách theo dấu đó)
# output trả về dict, key là chunk_index (bdau từ 1), value là toàn bộ giá trị của chunk
def split_text_to_chunks(text: str) -> Dict[int, str]:
    chunks: Dict[int, str] = {}

    if not text:
        return chunks

    lines = text.strip().splitlines()

    current_lines: List[str] = []
    has_content_after_heading = False

    chunk_index_counter = 1

    def flush_chunk():
        nonlocal current_lines, has_content_after_heading, chunk_index_counter

        chunk_text = "\n".join(current_lines).strip()

        if chunk_text:
            chunks[chunk_index_counter] = chunk_text
            chunk_index_counter += 1

        current_lines = []
        has_content_after_heading = False

    for line in lines:
        stripped_line = line.strip()
        heading_match = is_heading_line(line)

        if heading_match:
            # nếu chưa có chunk hiện tại thì bắt đầu chunk mới
            if not current_lines:
                current_lines.append(line)
                continue

            # nếu chunk hiện tại chưa có content thật,
            # nghĩa là đang gặp nhiều heading liên tiếp
            # => vẫn gom vào cùng chunk
            if not has_content_after_heading:
                current_lines.append(line)
                continue

            # nếu chunk hiện tại đã có nội dung,
            # heading mới sẽ bắt đầu chunk mới
            flush_chunk()
            current_lines.append(line)
            continue

        # dòng thường
        current_lines.append(line)

        # dòng trống không tính là content thật
        if stripped_line:
            has_content_after_heading = True

    flush_chunk()

    return chunks


# gộp global và unique metadata lại làm 1 để lưu trong class KnowledgeChunk
def merge_metadata(
    global_metadata: Dict[str, Any],
    unique_metadata: Dict[str, Any],
) -> Dict[str, Any]:
    metadata: Dict[str, Any] = {}

    for key, value in (global_metadata or {}).items():
        if value is None:
            continue
        metadata[key] = value

    for key, value in (unique_metadata or {}).items():
        if value is None:
            continue
        metadata[key] = value

    return metadata

def create_vector_stores() -> None:
    collection = get_collection()

    print("[DB]", collection.database.name)
    print("[COLLECTION]", collection.name)
    print("[COUNT BEFORE]", collection.count_documents({}))

    if RESET_COLLECTION:
        print(f"[RESET] Xóa toàn bộ collection: {MONGO_COLLECTION_NAME}")
        collection.delete_many({})
        print("[COUNT AFTER RESET]", collection.count_documents({}))

    embeddings = embedding_client()

    total_files = 0
    total_chunks = 0

    files = sorted(DATA_PATH.rglob("*.md"))

    if not files:
        print(f"[WARN] Không tìm thấy file .md trong thư mục: {DATA_PATH}")
        return

    for file_path in files:
        filename = file_path.name

        print("\n====================================")
        print(f"[FILE] {filename}")
        print(f"[PATH] {file_path}")

        try:
            # đọc file data
            global_metadata, raw_text = read_knowledge_file(file_path)

            # intent từ front matter.
            intent_name = str(global_metadata.get("intent")).strip()

            if not intent_name:
                print("[SKIP] Không xác định được intent của file.")
                continue

            # Không đưa YAML front matter vào chunk để tránh tạo chunk chỉ chứa metadata.
            # Metadata global đã được lưu riêng trong global_metadata.
            content_text = front_matter_pattern().sub("", raw_text, count=1).strip()

            if not content_text:
                print("[SKIP] File không có nội dung sau front matter.")
                continue

            # tách raw text thành các chunk theo heading
            chunk_map = split_text_to_chunks(content_text)

            if not chunk_map:
                print("[SKIP] Không tách được chunk hợp lệ từ file.")
                continue

            knowledge_chunks: List[KnowledgeChunk] = []

            for chunk_index, chunk_text in chunk_map.items():
                chunk_text = (chunk_text or "").strip()

                if not chunk_text:
                    continue

                # lấy unique metadata từ text của từng chunk.
                unique_metadata = extract_unique_metadata(chunk_text)

                # gộp unique và global metadata thành 1
                metadata = merge_metadata(
                    global_metadata=global_metadata,
                    unique_metadata=unique_metadata,
                )

                # embed raw chunk text
                embedding = embeddings.embed_query(chunk_text)

                knowledge_chunk = map_to_knowledge_chunk(
                    intent_name=intent_name,
                    filename=filename,
                    file_path=file_path,
                    chunk_index=chunk_index,
                    text=chunk_text,
                    embedding=embedding,
                    metadata=metadata,
                )

                knowledge_chunks.append(knowledge_chunk)

                if EMBED_SLEEP_SECONDS and EMBED_SLEEP_SECONDS > 0:
                    time.sleep(EMBED_SLEEP_SECONDS)

            if not knowledge_chunks:
                print("[SKIP] Không có chunk hợp lệ để lưu.")
                continue

            delete_result = collection.delete_many(
                {
                    "source_path": str(file_path)
                }
            )

            print(f"[CLEAN] Đã xóa {delete_result.deleted_count} chunk cũ của file này.")

            mongo_docs = [
                chunk.to_mongo_doc()
                for chunk in knowledge_chunks
            ]

            result = collection.insert_many(
                mongo_docs,
                ordered=False,
            )

            inserted_count = len(result.inserted_ids)

            print(f"[OK] Đã lưu {inserted_count} chunks vào MongoDB.")
            print("[COUNT CURRENT]", collection.count_documents({}))

            total_files += 1
            total_chunks += inserted_count

        except Exception as e:
            print(f"[ERROR] Lỗi khi xử lý {filename}: {type(e).__name__}: {e}")

    print("\n====================================")
    print("[DONE] Hoàn thành embedding và lưu vào MongoDB Atlas")
    print(f"[DONE] Số file xử lý thành công: {total_files}")
    print(f"[DONE] Tổng số chunks đã lưu: {total_chunks}")
    print("[COUNT FINAL]", collection.count_documents({}))
    print("====================================")


if __name__ == "__main__":
    # helper.create_vector_search_index()
    create_vector_stores()

    chunk = """
## Mã ngành: 734
* Học phí/tín chỉ: 1.161.000

## Mã ngành: 748, 751, 754, 762
## Mã chuyên ngành: CNC, HHC, BQC, CKC, ITC
## Khóa học: 2025
* Học phí/tín chỉ: 1.164.000
    """
    # print(split_text_to_chunks(chunk))

#     global_meta= {"abc": 123, "cde": 324}
#     unique_meta= {"A": 1212, "B": 3434}
#     text = """## fefefe
# tutututututu"""
#
#     print(build_embedding_input(text, global_meta, unique_meta))

