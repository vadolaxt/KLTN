import os
from dotenv import load_dotenv
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

from rag.retriever import get_relevant_context
from rag.generator import generate_response

from utils import libs_setup

libs_setup.install_libs()

# --- KHỞI TẠO HỆ THỐNG ---
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

# Khởi tạo các Model dùng chung (tránh khởi tạo lại nhiều lần tốn tài nguyên)
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    task_type="retrieval_query"
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)


class MainClass:
    def __init__(self):
        print("Khởi tạo MainClass")

    def intent_classifier(self, text):
        try:
            # Gọi PhoBERT
            results = test_ic.ic_call(text)

            if isinstance(results, list) and len(results) > 0:
                # Lấy tên intent của thằng có điểm cao nhất (thằng đầu tiên)
                top_intent = results[0]['intent']
                score = results[0]['score']

                print(f"Intent nhận diện: {top_intent} ({score:.2f})")
                return top_intent
            else:
                print("Không nhận diện được Intent, dùng mặc định.")
                return "so_luoc_ve_truong"  # Hoặc intent mặc định nào đó
        except Exception as e:
            print(f"Lỗi phân loại: {e}")
            return "so_luoc_ve_truong.md"

    def run_pipeline(self, user_query):
        print(f"\n--- Chatbot Processing ---")


        # Bước 1: Phân loại Intent bằng PhoBERT (Ông thay hàm ic_call của ông vào đây)
        intent = self.intent_classifier(user_query)
        print(f"Intent: {intent}")

        # Bước 2: Truy xuất Context từ Vector DB tương ứng
        context = get_relevant_context(user_query, intent, embeddings, BASE_DIR)
        print(f"Đã lấy xong Context.")

        # Bước 3: Tạo câu trả lời bằng Gemini
        answer = generate_response(llm, user_query, context)

        return answer


if __name__ == "__main__":
    app = MainClass()


    while True:
        query = input("\nBạn hỏi: ")
        if query.lower() in ['exit', 'quit', 'tạm biệt']: break

        final_answer = app.run_pipeline(query)
        print(f"\nChatbot: {final_answer}")
