import os
from pathlib import Path
from dotenv import load_dotenv
import joblib
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

MODEL_PATH = BASE_DIR / "assets" / "models" / "best_predict_score_model.joblib"

try:
    admission_bundle = joblib.load(MODEL_PATH)
    print("Load admission model thành công!")
except Exception as e:
    admission_bundle = None
    print(f"Lỗi load admission model: {e}")

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    task_type="retrieval_query"
)

# llm = ChatGoogleGenerativeAI(
#     model="gemini-2.5-flash",
#     temperature=0.1,
#     google_api_key=os.getenv("GOOGLE_API_KEY")
# )
llm = ChatOpenAI(
    # model="meta/llama-3.1-8b-instruct",
    model="qwen/qwen3-next-80b-a3b-instruct",
    openai_api_key=os.environ.get("NVDIA_API_KEY"),
    openai_api_base="https://integrate.api.nvidia.com/v1",
    temperature=0
)