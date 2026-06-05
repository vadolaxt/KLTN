from pydantic import BaseModel
from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Any, Union

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    # intent: str
    intent: Union[str, List[str]]
    answer: str

class AdmissionPredictRequest(BaseModel):
    major_code: str
    student_score: float
    subject_combination: str
    target_year: int

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
    chunk_size: int
    chunk_overlap: int
    content_hash: str
    created_at: datetime
    updated_at: datetime

    def to_mongo_doc(self) -> Dict[str, Any]:
        """
        Chuyển object KnowledgeChunk thành dictionary
        để insert vào MongoDB.
        """

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
            "chunk_size": self.chunk_size,
            "chunk_overlap": self.chunk_overlap,
            "content_hash": self.content_hash,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }