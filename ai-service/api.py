import os
from pathlib import Path
import sys

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config.rag_config import admission_bundles
from entity.entity import AdmissionPredictRequest, AdmissionPredictResponse
from score import predict_admission

from utils import libs_setup

BASE_DIR = Path(__file__).resolve().parent

RAG_DIR = BASE_DIR / "rag"
if str(RAG_DIR) not in sys.path:
    sys.path.append(str(RAG_DIR))
from rag.retriever import get_relevant_context
from rag.generator import generate_response
from rag.classifier import *
from entity.entity import ChatRequest, ChatResponse
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings

llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    google_api_key=os.getenv("API_KEY"),
    temperature=0,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    user_query = request.query.strip()
    print(f"\n[API Nhận Câu Hỏi]: {user_query}")

    if not user_query:
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống.")

    try:
        if llm is None:
            raise HTTPException(
                status_code=503,
                detail="Chat LLM chua duoc cau hinh API_KEY."
            )

        # 1. Tách câu + phân loại intent + lấy metadata_filter
        split_results = split_question(user_query)

        print(f"[SPLIT RESULTS]: {split_results}")

        if not split_results:
            fallback_answer = "Tôi chưa xác định được ý định câu hỏi của bạn. Bạn có thể hỏi rõ hơn được không?"
            return ChatResponse(
                intent=[],
                answer=fallback_answer
            )

        context_parts = []
        intents = []

        # 2. Với mỗi câu đã tách, gọi retrieve context
        for item in split_results:
            sub_question = item.get("question", "")
            intent = item.get("intent", "")
            conf = item.get("conf", 0.0)
            metadata_filter = item.get("metadata_filter", {})

            if not sub_question or not intent:
                continue

            intents.append(intent)

            print("\n------------------------------------")
            print(f"[SUB QUESTION]: {sub_question}")
            print(f"[INTENT]: {intent}")
            print(f"[CONF]: {conf}")
            print(f"[METADATA FILTER]: {metadata_filter}")

            context = get_relevant_context(
                query=sub_question,
                intent=[intent],
                metadata_filter=metadata_filter,
                # top_k=5,
                # num_candidates=50
            )

            print(f"[CONTEXT]: {context}")

            context_parts.append(
                f"[Câu hỏi con]: {sub_question}\n"
                f"[Intent]: {intent}\n"
                f"[Confidence]: {conf}\n"
                f"[Metadata filter]: {metadata_filter}\n"
                f"{context}"
            )

        # 3. Nếu không lấy được context hợp lệ
        if not context_parts:
            fallback_answer = "Tôi cần kiểm tra lại thông tin này."
            return ChatResponse(
                intent=intents,
                answer=fallback_answer
            )

        # 4. Gom context của tất cả câu hỏi con
        final_context = "\n\n====================\n\n".join(context_parts)

        print(f"\n[FINAL CONTEXT]: {final_context}")

        # 5. Sinh câu trả lời cuối cùng dựa trên query gốc + toàn bộ context
        answer = generate_response(
            llm=llm,
            query=user_query,
            context=final_context
        )

        print(f"[ANSWER]: {answer}")

        return ChatResponse(
            intent=intents,
            answer=answer
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[LỖI HỆ THỐNG]: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Lỗi xử lý hệ thống nội bộ."
        )


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
