from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    intent: str
    answer: str

class AdmissionPredictRequest(BaseModel):
    major_code: str
    student_score: float
    subject_combination: str
    target_year: int

class AdmissionPredictResponse(BaseModel):
    result: dict