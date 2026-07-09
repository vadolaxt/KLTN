from typing import Any, Callable, Dict, List, Optional, Union
import math
from retriever import *

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

llm = ChatOpenAI(
    model="meta/llama-3.1-8b-instruct",
    openai_api_key="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",
    openai_api_base="https://integrate.api.nvidia.com/v1",
    temperature=0
)


def get_context(
        query: str,
        intent: Union[str, List[str]],
        metadata_filter: Optional[Dict[str, Any]] = None,
        top_k: int = 5,
        num_candidates: int = 50,
) -> Dict[str, Any]:
    if not intent:
        return {
            "item_intent": [],
            "chunk_index": [],
            "source_file": [],
            "score": [],
            "text": [],
            "metadata": [],
        }

    collection = get_collection()
    embeddings = embedding_client()
    query_vector = embeddings.embed_query(query)

    context_parts = {
        "item_intent": [],
        "chunk_index": [],
        "source_file": [],
        "score": [],
        "text": [],
        "metadata": [],
    }

    intents = intent if isinstance(intent, list) else [intent]

    for current_intent in intents:
        vector_filter = build_vector_filter(
            current_intent=current_intent,
            metadata_filter=metadata_filter,
        )

        pipeline = [
            {
                "$vectorSearch": {
                    "index": MONGO_VECTOR_INDEX_NAME,
                    "path": "embedding",
                    "queryVector": query_vector,
                    "numCandidates": num_candidates,
                    "limit": top_k,
                    "filter": vector_filter,
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "intent": 1,
                    "chunk_index": 1,
                    "source_file": 1,
                    "text": 1,
                    "metadata": 1,
                    "score": {"$meta": "vectorSearchScore"},
                }
            },
        ]

        try:
            results = list(collection.aggregate(pipeline))

            for item in results:
                item_intent = item.get("intent", "unknown")
                chunk_index = item.get("chunk_index", "unknown")
                source_file = item.get("source_file", "unknown")
                text = item.get("text", "").strip()
                metadata = item.get("metadata", {})

                if text:
                    context_parts["item_intent"].append(item_intent)
                    context_parts["chunk_index"].append(chunk_index)
                    context_parts["source_file"].append(source_file)
                    context_parts["text"].append(text)
                    context_parts["metadata"].append(metadata)

        except Exception as e:
            print(f"[WARN] Lỗi khi retrieve intent {current_intent}: {type(e).__name__}: {e}")

    return context_parts


def evaluate_at_k(
        context_result: Dict[str, Any],
        expected_chunk_indexes: Union[int, List[int]],
        k: int = 5,
) -> Dict[str, float]:
    retrieved_chunk_indexes = context_result.get("chunk_index", [])[:k]

    if isinstance(expected_chunk_indexes, int):
        expected_chunk_indexes = [expected_chunk_indexes]

    expected_set = set(expected_chunk_indexes)
    retrieved_set = set(retrieved_chunk_indexes)

    matched_set = expected_set & retrieved_set
    matched_count = len(matched_set)

    recall = matched_count / len(expected_set) if expected_set else 0.0
    hitrate = 1.0 if matched_count > 0 else 0.0
    precision = matched_count / k if k > 0 else 0.0

    mrr = 0.0
    for rank, chunk_index in enumerate(retrieved_chunk_indexes, start=1):
        if chunk_index in expected_set:
            mrr = 1.0 / rank
            break

    return {
        f"recall@{k}": recall,
        f"hitrate@{k}": hitrate,
        f"precision@{k}": precision,
        f"mrr@{k}": mrr,
    }

def _extract_json(text: str) -> Dict[str, Any]:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {}

    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return {}

def judge_fn(prompt: str) -> str:
    response = llm.invoke(prompt)
    return response.content

def evaluate_llm_answer(
        question: str,
        answer: str,
        retrieved_context: Union[str, List[str]],
        judge_fn: Callable[[str], str],
        expected_answer: Optional[str] = None,
) -> Dict[str, float]:
    if isinstance(retrieved_context, list):
        retrieved_context = "\n\n".join(retrieved_context)

    prompt = f"""
Bạn là evaluator cho hệ thống RAG tư vấn tuyển sinh.

Hãy đánh giá câu trả lời của LLM dựa trên:
- Question: câu hỏi của người dùng
- Retrieved context: ngữ cảnh được retrieve từ database
- Expected answer: đáp án chuẩn nếu có
- Answer: câu trả lời của LLM cần chấm

Chấm các metric từ 0.0 đến 1.0:

1. answer_correctness:
- 1.0 nếu answer đúng hoàn toàn so với expected answer.
- 0.5 nếu đúng một phần.
- 0.0 nếu sai.
- Nếu không có expected answer, hãy đánh giá dựa trên retrieved context.

2. faithfulness:
- 1.0 nếu mọi thông tin trong answer đều được hỗ trợ bởi retrieved context.
- 0.0 nếu answer bịa nhiều thông tin ngoài context.

3. answer_relevance:
- 1.0 nếu answer trả lời đúng trọng tâm question.
- 0.0 nếu answer lạc đề hoặc không trả lời câu hỏi.

4. completeness:
- 1.0 nếu answer trả lời đầy đủ các ý cần thiết trong question.
- 0.5 nếu thiếu một phần.
- 0.0 nếu thiếu phần chính.

5. hallucination_rate:
- 0.0 nếu không có thông tin bịa ngoài context.
- 1.0 nếu phần lớn thông tin là bịa hoặc không được context hỗ trợ.

Chỉ trả về JSON, không giải thích thêm.

Format JSON bắt buộc:
{{
  "answer_correctness": 0.0,
  "faithfulness": 0.0,
  "answer_relevance": 0.0,
  "completeness": 0.0,
  "hallucination_rate": 0.0
}}

Question:
{question}

Retrieved context:
{retrieved_context}

Expected answer:
{expected_answer if expected_answer else "Không có"}

Answer:
{answer}
"""

    judge_response = judge_fn(prompt)
    scores = _extract_json(judge_response)

    return {
        # llm trả lời đúng thông tin, dlieu, số liệu so với câu trl
        "answer_correctness": float(scores.get("answer_correctness", 0.0)),
        # ktra llm có bịa thêm thông tin ko, ans có đúng với context dc hỗ trợ ko
        "faithfulness": float(scores.get("faithfulness", 0.0)),
        # ktra xem ans có trả lời lquan tới câu hỏi ko
        "answer_relevance": float(scores.get("answer_relevance", 0.0)),
        # ktra ans có trả lòi đủ ý ko
        "completeness": float(scores.get("completeness", 0.0)),
        # ktra ans có bị hoang tưởng ko, tự lấy thêm thông tin ở ngoài
        "hallucination_rate": float(scores.get("hallucination_rate", 0.0)),
    }




def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))

    if norm1 == 0 or norm2 == 0:
        return 0.0

    return dot / (norm1 * norm2)


def evaluate_answer_context_similarity(
        answer: str,
        context_result: Dict[str, Any],
        top_k: int = 5,
) -> Dict[str, Any]:
    context_texts = context_result.get("text", [])[:top_k]
    chunk_indexes = context_result.get("chunk_index", [])[:top_k]

    if not answer.strip() or not context_texts:
        return {
            "max_context_similarity": 0.0,
            "avg_context_similarity": 0.0,
            "best_matched_chunk_index": None,
        }

    embeddings = embedding_client()

    answer_vector = embeddings.embed_query(answer)
    context_vectors = embeddings.embed_documents(context_texts)

    similarities = []

    for i, context_vector in enumerate(context_vectors):
        sim = cosine_similarity(answer_vector, context_vector)

        similarities.append({
            "chunk_index": chunk_indexes[i] if i < len(chunk_indexes) else None,
            "similarity": sim,
        })

    best_match = max(similarities, key=lambda x: x["similarity"])
    avg_similarity = sum(item["similarity"] for item in similarities) / len(similarities)

    return {
        "max_context_similarity": best_match["similarity"],
        "avg_context_similarity": avg_similarity,
        "best_matched_chunk_index": best_match["chunk_index"],
    }

def evaluate_question_answer_similarity(
        question: str,
        answer: str,
) -> Dict[str, float]:
    if not question.strip() or not answer.strip():
        return {
            "question_answer_similarity": 0.0
        }

    embeddings = embedding_client()

    question_vector = embeddings.embed_query(question)
    answer_vector = embeddings.embed_query(answer)

    similarity = cosine_similarity(question_vector, answer_vector)

    return {
        "question_answer_similarity": similarity
    }


if __name__ == "__main__":
    question = "điểm chuẩn ngành công nghệ thông tin năm 2024"

    context = get_context(
        query=question,
        intent=["diem_chuan"],
        metadata_filter={
            "year": "2024",
            # "major": "công nghệ thông tin"
        },
        top_k=5,
        num_candidates=50,
    )

    print("Retrieved chunk_index:")
    print(context.get("chunk_index"))

    print("Source files:")
    print(context.get("source_file"))

    retrieve_metrics = evaluate_at_k(
        context_result=context,
        expected_chunk_indexes=[21, 22, 23],
        k=5,
    )

    print("Retrieve metrics:")
    print(retrieve_metrics)


    answer = """
    Điểm trúng tuyển ngành Công nghệ thông tin năm 2024 của Trường Đại học Nông Lâm như sau:
    - Phương thức xét tuyển 100: 22.25
    - Phương thức xét tuyển 200: 21
    - Phương thức xét tuyển 402: 700
    """

    expected_answer = """
    Điểm chuẩn nghành công nghệ thông tin 2024:
    - Phương thức 100: 22.25
    - Phương thức 200: 21
    - Phương thức 402: 700
    """

    llm_metrics = evaluate_llm_answer(
        question=question,
        answer=answer,
        retrieved_context=context.get("text", []),
        expected_answer=expected_answer,
        judge_fn=judge_fn,
    )

    print("LLM answer metrics:")
    print(llm_metrics)


    similarity_metrics = evaluate_answer_context_similarity(
        answer=answer,
        context_result=context,
        top_k=5,
    )

    print("Answer-context similarity metrics:")
    print(similarity_metrics)


    question_answer_metrics = evaluate_question_answer_similarity(
        question=question,
        answer=answer,
    )

    print("Question-answer similarity metrics:")
    print(question_answer_metrics)


