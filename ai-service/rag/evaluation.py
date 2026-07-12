from typing import Any, Callable, Dict, List, Optional, Union
import math
from retriever import *

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

# llm = ChatOpenAI(
#     model="meta/llama-3.1-8b-instruct",
#     openai_api_key="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",
#     openai_api_base="https://integrate.api.nvidia.com/v1",
#     temperature=0
# )

llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    google_api_key=os.getenv("API_KEY"),
    temperature=0,
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

# def _extract_json(text: str) -> Dict[str, Any]:
#     try:
#         return json.loads(text)
#     except json.JSONDecodeError:
#         pass
#
#     match = re.search(r"\{.*\}", text, re.DOTALL)
#     if not match:
#         return {}
#
#     try:
#         return json.loads(match.group(0))
#     except json.JSONDecodeError:
#         return {}

# def judge_fn(prompt: str) -> str:
#     response = llm.invoke(prompt)
#     return response.content

def _extract_json(text) -> Dict[str, Any]:
    if isinstance(text, dict):
        return text

    if isinstance(text, list):
        text = "\n".join(
            item.get("text", "") if isinstance(item, dict) else str(item)
            for item in text
        )

    if not isinstance(text, str):
        text = str(text)

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
    content = response.content

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict):
                parts.append(item.get("text", ""))
            else:
                parts.append(str(item))
        return "\n".join(parts)

    return str(content)

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
    # 1. Chuẩn bị danh sách các test case
    test_cases = [
        {
            "question": "điểm chuẩn ngành công nghệ thông tin năm 2024",
            "intent": ["diem_chuan"],
            "metadata_filter": {"year": "2024"},
            "expected_chunk_indexes": [21, 22, 23],
            "answer": """
            Điểm trúng tuyển ngành Công nghệ thông tin năm 2024 của Trường Đại học Nông Lâm như sau:
            - Phương thức xét tuyển 100: 22.25
            - Phương thức xét tuyển 200: 21
            - Phương thức xét tuyển 402: 700
            """,
            "expected_answer": """
            Điểm chuẩn nghành công nghệ thông tin 2024:
            - Phương thức 100: 22.25
            - Phương thức 200: 21
            - Phương thức 402: 700
            """
        },
        {
            "question": "cho em hỏi giá tiền ở ký túc xá của trường là bao nhiêu",
            "intent": ["ky_tuc_xa"],
            "expected_chunk_indexes": [2, 1],
            "answer": """
                Chào bạn, chi phí ở ký túc xá của Trường Đại học Nông Lâm được quy định như sau:
                    Khu A, B, C, D, F: 250.000đ/tháng.
                    Khu E: 400.000đ/tháng (khu này có thêm ban công và nhà vệ sinh riêng).
                Lưu ý:
                    Chi phí trên đã bao gồm hỗ trợ sử dụng nước.
                    Nhà trường thu theo năm học (10 tháng).
                Ngoài ra, đối với ký túc xá Cỏ May, tài liệu hiện chưa nêu cụ thể mức giá tiền vì đây là ký túc xá có chính sách miễn phí chỗ ở cho sinh viên.
                """,
            "expected_answer": """
                Giá tiền ở ký túc xá của Trường Đại học Nông Lâm được tính như sau:
                    Khu A, B, C, D, F: 250.000đ/tháng.
                    Khu E: 400.000đ/tháng (ban công và nhà vệ sinh riêng).
                """
        },
        {
            "question": "tổ hợp xét tuyển ngành công nghệ thông tin",
            "intent": ["to_hop"],
            # "metadata_filter": {"major": "công nghệ thông tin"},
            "expected_chunk_indexes": [12, 13, 14],
            "answer": """
                Ngành Công nghệ thông tin (bao gồm Công nghệ thông tin, Công nghệ thông tin chương trình nâng cao và Công nghệ thông tin phân hiệu Ninh Thuận) có các tổ hợp xét tuyển sau: A00, A01, D07, X06, X07, X10.
                """,
            "expected_answer": """
                Ngành Công nghệ thông tin có các tổ hợp xét tuyển sau: A00, A01, D07, X06, X07, X10.
                """
        },
        {
            "question": "trường có mấy giảng đường và có ký túc xá ko",
            "intent": ["co_so_vat_chat"],
            # "metadata_filter": {"major": "công nghệ thông tin"},
            "expected_chunk_indexes": [1],
            "answer": """
            Chào bạn, về câu hỏi của bạn, tôi xin được giải đáp dựa trên thông tin của nhà trường như sau:
                Trường Đại học Nông Lâm hiện có 06 giảng đường.
                Về hệ thống ký túc xá, trường có 06 khu ký túc xá với 391 phòng, có sức chứa khoảng 3.000 sinh viên và nhiều năm đạt danh hiệu Ký túc xá sinh viên văn hóa cấp thành phố.
            """,
            "expected_answer": """
                    Trường Đại học Nông Lâm hiện có 06 giảng đường và trường có 06 khu ký túc xá với 391 phòng, có sức chứa khoảng 3.000 sinh viên và nhiều năm đạt danh hiệu Ký túc xá sinh viên văn hóa cấp thành phố.
                    """
        },
        {
            "question": "slogan câu lạc bộ bóng rổ của trường là gì",
            "intent": ["cau_lac_bo"],
            # "metadata_filter": {"major": "công nghệ thông tin"},
            "expected_chunk_indexes": [2],
            "answer": """
                Slogan của câu lạc bộ Bóng rổ Đại học Nông Lâm là: 1 2 3 Nông Lâm (x3).
                """,
            "expected_answer": """
                        Slogan của câu lạc bộ Bóng rổ Đại học Nông Lâm là: 1 2 3 Nông Lâm (x3).
                        """
        },
        {
            "question": "ý nghĩa viết tắt tên câu lạc bộ EFB là gì",
            "intent": ["cau_lac_bo"],
            # "metadata_filter": {"major": "công nghệ thông tin"},
            "expected_chunk_indexes": [15],
            "answer": """
            Chào bạn, tên đầy đủ câu lạc bộ EFB là English For Business Club.
                    """,
            "expected_answer": """
            Ý nghĩa tên viết tắt câu lạc bộ là English For Business Club.
                            """
        },
        {
            "question": "Mức điểm ưu tiên khu vực 1 là bao nhiêu",
            "intent": ["diem_uu_tien"],
            "metadata_filter": {"priority_type": "khu vực"},
            "expected_chunk_indexes": [1],
            "answer": """
                        Mức điểm ưu tiên khu vực 1 là 0,75 điểm. Bao gồm các xã vùng đồng bào dân tộc thiểu số và miền núi, xã đặc biệt khó khăn, xã đảo, xã biên giới.
                        """,
            "expected_answer": """
                                    Mức điểm ưu tiên khu vực 1 (KV1) là 0,75 điểm. Bao gồm các xã vùng đồng bào dân tộc thiểu số và miền núi, xã đặc biệt khó khăn, xã đảo, xã biên giới.
                                """
        },
        {
            "question": "Phương thức xét tuyển kết hợp điểm thi THPT và học bạ là như nào",
            "intent": ["phuong_thuc_tuyen_sinh"],
            "metadata_filter": {"method": "4"},
            "expected_chunk_indexes": [5],
            "answer": """
Chào bạn, phương thức xét tuyển kết hợp điểm thi THPT và học bạ là sử dụng:
    * 02 môn thuộc tổ hợp xét tuyển lấy từ điểm thi tốt nghiệp THPT năm 2026
    * 01 môn còn lại sử dụng điểm học bạ THPT
Trong đó: 
* Quy định môn học bạ
  * Điểm học bạ được tính bằng:
    * Trung bình 06 học kỳ
    * Từ HK I lớp 10 → HK II lớp 12
    * Làm tròn đến 02 chữ số thập phân
* Điều kiện
  * Môn bổ sung hoặc thay thế không được là Toán hoặc Ngữ văn.
                                """,
            "expected_answer": """
Chào bạn, phương thức xét tuyển kết hợp điểm thi THPT và học bạ là sử dụng:
    * 02 môn thuộc tổ hợp xét tuyển lấy từ điểm thi tốt nghiệp THPT năm 2026
    * 01 môn còn lại sử dụng điểm học bạ THPT
Trong đó: 
* Quy định môn học bạ
  * Điểm học bạ được tính bằng:
    * Trung bình 06 học kỳ
    * Từ HK I lớp 10 → HK II lớp 12
    * Làm tròn đến 02 chữ số thập phân
* Điều kiện
  * Môn bổ sung hoặc thay thế không được là Toán hoặc Ngữ văn.
                            """
        },
        {
            "question": "các thành tựu mà trường đã đạt được",
            "intent": ["so_luoc_ve_truong"],
            "metadata_filter": {"achievement": ""},
            "expected_chunk_indexes": [3],
            "answer": """
                Nhà trường đã vinh dự được trao tặng nhiều danh hiệu và phần thưởng cao quý, tiêu biểu như:
                    * Huân chương Lao động hạng Ba
                    * Huân chương Lao động hạng Nhất
                    * Huân chương Độc lập hạng Ba
                """,
            "expected_answer": """
                Chào bạn, nhà trường đã vinh dự được trao tặng nhiều danh hiệu và phần thưởng cao quý, tiêu biểu như:
                    * Huân chương Lao động hạng Ba
                    * Huân chương Lao động hạng Nhất
                    * Huân chương Độc lập hạng Ba
                """
        },
        {
            "question": "ngành công nghệ kỹ thuật cơ điện tử sẽ được học gì",
            "intent": ["thong_tin_ve_nganh_hoc"],
            "metadata_filter": {"major": "công nghệ kỹ thuật cơ điện tử"},
            "expected_chunk_indexes": [1],
            "answer": """
            Chào bạn, ngành công nghệ kỹ thuật cơ điện tử sẽ được đào tạo như sau:
            - Nền tảng về cơ khí, điện, điện tử và công nghệ thông tin.
            - Tính toán, thiết kế, chế tạo các chi tiết máy và mạch điện tử.
            - Thiết kế, chế tạo và điều khiển robot.
            - Lập trình điều khiển các thiết bị, hệ thống cơ điện tử, dây chuyền điều khiển tự động.
            - Sử dụng các phần mềm hỗ trợ trong thiết kế chi tiết máy, gia công khuôn mẫu, thiết kế mạch điện tử.
                """,
            "expected_answer": """
                Kiến thức chuyên môn
                - Nền tảng về cơ khí, điện, điện tử và công nghệ thông tin.
                - Tính toán, thiết kế, chế tạo các chi tiết máy và mạch điện tử.
                - Thiết kế, chế tạo và điều khiển robot.
                - Lập trình điều khiển các thiết bị, hệ thống cơ điện tử, dây chuyền điều khiển tự động.
                - Sử dụng các phần mềm hỗ trợ trong thiết kế chi tiết máy, gia công khuôn mẫu, thiết kế mạch điện tử.
                """
        },
    ]

    all_results = []

    # 2. Vòng lặp đánh giá từng câu hỏi
    for idx, tc in enumerate(test_cases, start=1):
        print(f"\n{'=' * 50}")
        print(f"Đang đánh giá câu hỏi {idx}/{len(test_cases)}: {tc['question']}")
        print(f"{'=' * 50}")

        # Lấy context
        context = get_context(
            query=tc["question"],
            intent=tc["intent"],
            metadata_filter=tc.get("metadata_filter"),
            top_k=5,
            num_candidates=50,
        )

        # Retrieve metrics
        retrieve_metrics = evaluate_at_k(
            context_result=context,
            expected_chunk_indexes=tc["expected_chunk_indexes"],
            k=5,
        )

        # LLM metrics
        llm_metrics = evaluate_llm_answer(
            question=tc["question"],
            answer=tc["answer"],
            retrieved_context=context.get("text", []),
            expected_answer=tc["expected_answer"],
            judge_fn=judge_fn,
        )

        # Context similarity metrics
        similarity_metrics = evaluate_answer_context_similarity(
            answer=tc["answer"],
            context_result=context,
            top_k=5,
        )

        # QA similarity metrics
        question_answer_metrics = evaluate_question_answer_similarity(
            question=tc["question"],
            answer=tc["answer"],
        )

        # Lưu kết quả của câu hỏi hiện tại
        case_result = {
            "question": tc["question"],
            "retrieve_metrics": retrieve_metrics,
            "llm_metrics": llm_metrics,
            "similarity_metrics": similarity_metrics,
            "question_answer_metrics": question_answer_metrics
        }
        all_results.append(case_result)

        # In kết quả chi tiết của từng câu
        print(f"Retrieve metrics: {retrieve_metrics}")
        print(f"LLM answer metrics: {llm_metrics}")
        print(f"Similarity metrics: {similarity_metrics}")
        print(f"QA similarity metrics: {question_answer_metrics}")

    # 3. Tính toán và in ra điểm trung bình cho toàn bộ tập dữ liệu (Tùy chọn)
    print("\n" + "*" * 50)
    print("TỔNG KẾT ĐÁNH GIÁ (AVERAGE SCORES)")
    print("*" * 50)

    if all_results:
        num_cases = len(all_results)

        # Khởi tạo dict để cộng tổng các chỉ số
        avg_retrieve = {k: 0.0 for k in all_results[0]["retrieve_metrics"]}
        avg_llm = {k: 0.0 for k in all_results[0]["llm_metrics"]}
        avg_qa_sim = 0.0

        # Cộng dồn
        for res in all_results:
            for k, v in res["retrieve_metrics"].items():
                avg_retrieve[k] += v
            for k, v in res["llm_metrics"].items():
                avg_llm[k] += v
            avg_qa_sim += res["question_answer_metrics"]["question_answer_similarity"]

        # Chia trung bình và in ra
        print("1. Trung bình Retrieve Metrics:")
        for k, v in avg_retrieve.items():
            print(f"   - {k}: {v / num_cases:.4f}")

        print("\n2. Trung bình LLM Metrics:")
        for k, v in avg_llm.items():
            print(f"   - {k}: {v / num_cases:.4f}")

        print(f"\n3. Trung bình QA Similarity: {avg_qa_sim / num_cases:.4f}")


