import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rag.retriever import get_relevant_context
from rag.generator import generate_response
from entity.entity import ChatResponse, ChatRequest, AdmissionPredictResponse, AdmissionPredictRequest
from score import predict_admission
from config.rag_config import BASE_DIR, admission_bundle, embeddings, llm
from rag.intent_classifier import ic_call

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_intent(text: str) -> str:
    try:
        results = ic_call(text)
        if isinstance(results, list) and len(results) > 0:
            return results[0]['intent']
    except Exception as e:
        print(f"Lỗi Intent: {e}")
    return "unknown"


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    user_query = request.query
    print(f"\n[API Nhận Câu Hỏi]: {user_query}")

    try:
        intent = get_intent(user_query)
        print(f"Intent: {intent}")
        context = get_relevant_context(user_query, intent, embeddings, BASE_DIR)
        answer = generate_response(llm, user_query, context)

        return ChatResponse(intent=intent, answer=answer)

    except Exception as e:
        print(f"Lỗi Hệ Thống: {e}")
        raise HTTPException(status_code=500, detail="Lỗi xử lý hệ thống nội bộ.")


@app.post("/api/predict-admission", response_model=AdmissionPredictResponse)
async def predict_admission_endpoint(request: AdmissionPredictRequest):
    if admission_bundle is None:
        raise HTTPException(
            status_code=500,
            detail="Model dự đoán chưa được load."
        )

    try:
        result = predict_admission(
            bundle=admission_bundle,
            major_code=request.major_code,
            student_score=request.student_score,
            subject_combination=request.subject_combination,
            target_year=request.target_year,
        )

        return AdmissionPredictResponse(result=result)

    except Exception as e:
        print(f"Lỗi predict admission: {e}")
        raise HTTPException(
            status_code=500,
            detail="Lỗi xử lý dự đoán điểm chuẩn."
        )


if __name__ == "__main__":
    print("Bắt đầu chạy Server API tại: http://localhost:8000")
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
