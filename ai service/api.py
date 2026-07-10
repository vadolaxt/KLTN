from pathlib import Path
import sys

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config.rag_config import admission_bundles
from entity.entity import AdmissionPredictRequest, AdmissionPredictResponse
from score import predict_admission

BASE_DIR = Path(__file__).resolve().parent

# Chatbot-related code is temporarily disabled so the API only serves prediction.
# RAG_DIR = BASE_DIR / "rag"
# if str(RAG_DIR) not in sys.path:
#     sys.path.append(str(RAG_DIR))
# from rag.retriever import get_relevant_context
# from rag.generator import generate_response
# from rag.classifier import *
# from entity.entity import ChatRequest, ChatResponse
# from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings
#
# llm = ChatGoogleGenerativeAI(
#     model="gemini-3.1-flash-lite",
#     google_api_key=os.getenv("API_KEY"),
#     temperature=0,
# )

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.post("/api/chat", response_model=ChatResponse)
# async def chat_endpoint(request: ChatRequest):
#     user_query = request.query.strip()
#     ...


@app.post("/api/predict-admission", response_model=AdmissionPredictResponse)
async def predict_admission_endpoint(request: AdmissionPredictRequest):
    school_code = (request.school_code or "NLU").strip().upper()
    if school_code not in admission_bundles:
        school_code = "NLU"

    selected_bundle = admission_bundles.get(school_code)
    if selected_bundle is None:
        raise HTTPException(
            status_code=500,
            detail="Model du doan chua duoc load.",
        )

    try:
        result = predict_admission(
            bundle=selected_bundle,
            major_code=request.major_code,
            student_score=request.student_score,
            subject_combination=request.subject_combination,
            subject_scores=request.subject_scores,
            priority_score=request.priority_score or 0.0,
            admission_method=request.admission_method,
            target_year=request.target_year,
        )

        return AdmissionPredictResponse(result=result)
    except Exception as e:
        print(f"Loi predict admission: {e}")
        raise HTTPException(
            status_code=500,
            detail="Loi xu ly du doan diem chuan.",
        )


if __name__ == "__main__":
    print("Bat dau chay Server API tai: http://localhost:8000")
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
