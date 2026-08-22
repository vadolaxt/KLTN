from pydantic import BaseModel, Field
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Any, Union, Optional

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    # intent: str
    # intent: Union[str, List[str]]
    intent: List[str]
    answer: str

class AdmissionPredictRequest(BaseModel):
    school_code: Optional[str] = "NLU"
    major_code: str
    student_score: float
    subject_combination: str
    target_year: int
    admission_method: Optional[str] = None
    priority_score: Optional[float] = 0.0
    subject_scores: Optional[Dict[str, float]] = None
    top_k: int = Field(default=5, ge=1, le=500)

class AdmissionPredictResponse(BaseModel):
    result: dict

@dataclass
class KnowledgeChunk:
    id: str
    intent: str
    source_file: str
    source_path: str

    chunk_index: int

    text: str
    embedding: List[float]

    embedding_model: str
    embedding_dimensions: int

    content_hash: str

    created_at: datetime
    updated_at: datetime

    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_mongo_doc(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "intent": self.intent,
            "source_file": self.source_file,
            "source_path": self.source_path,
            "chunk_index": self.chunk_index,
            "text": self.text,
            "embedding": self.embedding,
            "embedding_model": self.embedding_model,
            "embedding_dimensions": self.embedding_dimensions,
            "content_hash": self.content_hash,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "metadata": self.metadata,
        }
