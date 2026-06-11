from transformers import pipeline, AutoTokenizer
import os
import joblib
import warnings
import json
import re
from typing import List
from pattern import *
from utils.helper import *
from prompt import *

from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)


# xác định intent của câu thông qua model
def intent_classifier(questions):
    if not questions:
        return []

    resources = get_resources()

    if resources is None:
        return {
            "intent": "error",
            "conf": 0.0,
            "message": "IC chưa được khởi tạo."
        }

    nlp, le = resources

    try:
        results = nlp(questions, top_k=1)

        output = []
        for result in results:
            if isinstance(result, list):
                res_dict = result[0]
            else:
                res_dict = result

            raw_label = res_dict["label"]
            confidence = float(res_dict["score"])
            intent_name = decode_label(raw_label, le)

            output.append({
                "intent": intent_name,
                "conf": confidence
            })

        return output

    except Exception as e:
        if resources is None:
            return [{
                "intent": "error",
                "conf": 0.0,
                "message": f"Lỗi batch inference: {e}"}] * len(questions)

# tiền xử lý query trước khi retrieve
# 1/ viết thường, xóa tab dư
# 2/ chuyển đổi các từ viết tắt thành viết đủ (bổ sung rule vào trong prompt)
# 3/ tách câu nhiều ý thành các câu riêng biệt
# 4/ trích xuất context từ query để dùng cho filter (nếu có)
# 5/ gọi ic và phân loại, nếu conf thấp hơn threshold thì ko add vào result trả về

def preprocess_query(text: str) -> str:
    text = text.lower().strip()
    return text


# ktra cặp key value có liền kề ko
def keyword_value_exists(question: str, keyword: str, value: str, max_gap_words: int = 6) -> bool:

    if not keyword or not value:
        return False

    # Cho phép giữa keyword và value có tối đa max_gap_words từ chen vào
    gap = rf"(?:\s+\w+){{0,{max_gap_words}}}\s+"

    pattern = rf"(?<!\w){re.escape(keyword)}{gap}{re.escape(value)}(?!\w)"

    return re.search(pattern, question) is not None


# lấy ra metadata (cho filter) từ câu dựa theo 1 sô rule
def extract_metadata_filter(question: str) -> Dict[str, Any]:
    metadata_patterns = metadata_extractor_dict()
    metadata_filter = {}

    for metadata_key, rule in metadata_patterns.items():
        if not rule or len(rule) < 2:
            continue

        keywords = rule[0]
        values = rule[1]

        if not keywords or not values:
            continue

        # Ưu tiên value dài hơn để tránh match nhầm value ngắn trước
        values = sorted(values, key=len, reverse=True)

        for value in values:
            matched = False

            for keyword in keywords:
                if keyword_value_exists(question, keyword, value):
                    metadata_filter[metadata_key] = value
                    matched = True
                    break

            # Mỗi metadata_key chỉ lấy 1 value đầu tiên match được
            if matched:
                break

    return metadata_filter


# gắn metadata vào từng câu hỏi sau khi đã tách
def build_output(
    question: str,
    intent: str,
    conf: float
) -> Dict[str, Any]:
    metadata_filter = extract_metadata_filter(question)

    return {
        "question": question,
        "intent": intent,
        "conf": conf,
        "metadata_filter": metadata_filter
    }

def split_question(question: str) -> List[Dict[str, Any]]:
    if question is None or not str(question).strip():
        return []

    # ngưỡng cho IC
    threshold = 0.8

    question = preprocess_query(question)
    llm = llm_call()
    system_prompt = split_question_prompt()
    user_prompt = f'Câu hỏi cần tách: "{question}"'

    try:
        response = llm.invoke([
            ("system", system_prompt),
            ("human", user_prompt),
        ])

        content = response.content if hasattr(response, "content") else str(response)
        questions = parse_llm_json(content)

        # nếu ko tách được thì giữ nguyên câu ban đầu
        if not questions:
            questions = [question]

    except Exception as e:
        print("[SPLIT QUESTION ERROR]", e)
        questions = [question]

    if not questions:
        return []

    # phân loại intent
    ic_results = intent_classifier(questions)

    if isinstance(ic_results, dict):
        ic_results = [ic_results] * len(questions)

    output = []

    for q, ic_result in zip(questions, ic_results):
        intent = ic_result.get("intent", "error")
        conf = float(ic_result.get("conf", 0.0))

        if conf < threshold:
            continue

        item = build_output(
            question=q,
            intent=intent,
            conf=conf
        )

        output.append(item)

    return output

if __name__ == "__main__":
    print(split_question("Điểm chuẩn và tổ hợp xét tuyển ngành công nghệ thông tin và trường có mấy giảng đường"))