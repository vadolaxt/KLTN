import os
import time
from dotenv import load_dotenv
from pathlib import Path
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env", override=True)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
DATA_PATH = os.path.abspath(os.path.join(BASE_DIR, os.getenv("DATA_PATH")))
VECTOR_STORE_PATH = os.path.abspath(os.path.join(BASE_DIR, os.getenv("VECTOR_STORE_PATH")))


def create_vector_stores():
    if not os.path.exists(VECTOR_STORE_PATH):
        os.makedirs(VECTOR_STORE_PATH)

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=GOOGLE_API_KEY,
        task_type="retrieval_document",
    )

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    files = [f for f in os.listdir(DATA_PATH) if f.endswith(".txt")]
    for filename in files:
        intent_name = filename.replace(".txt", "")
        # print(f"Đang xử lý: {intent_name}...", end=" ", flush=True)

        try:
            loader = TextLoader(os.path.join(DATA_PATH, filename), encoding="utf-8")
            documents = loader.load()
            chunks = text_splitter.split_documents(documents)

            if not chunks:
                print("File trống!")
                continue

            texts = [doc.page_content for doc in chunks]

            # Ép model xử lý từng đoạn một để đảm bảo không bị gộp (len mismatch)
            vectors = []
            for t in texts:
                # Dùng embed_query để lấy từng vector riêng lẻ
                v = embeddings.embed_query(t)
                vectors.append(v)
                time.sleep(0.1)  # Nghỉ cực ngắn để tránh spam API

            # Sau khi đã có đủ list vector, ta nạp vào FAISS
            text_embeddings = list(zip(texts, vectors))
            vector_db = FAISS.from_embeddings(text_embeddings, embeddings)

            save_dir = os.path.join(VECTOR_STORE_PATH, intent_name)
            vector_db.save_local(save_dir)

        except Exception as e:
            print(f"Lỗi: {str(e)}")


if __name__ == "__main__":
    create_vector_stores()
    print("\n- Hoàn thành embedding và lưu vào vector DB")