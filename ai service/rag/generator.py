from typing import Any
from prompt import generate_response_prompt

# xly response.content trả về từ llm, ChatGoogleGenerativeAI đôi khi ko trả về str mà lại là list, cần chuẩn hóa
def normalize_llm_content(content: Any) -> str:
    if content is None:
        return ""

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        parts = []

        for item in content:
            if isinstance(item, str):
                parts.append(item)

            elif isinstance(item, dict):
                text = item.get("text") or item.get("content") or ""
                if text:
                    parts.append(str(text))

            else:
                parts.append(str(item))

        return "\n".join(parts).strip()

    return str(content).strip()


def generate_response(llm, query, context):
    prompt = generate_response_prompt(context, query)

    response = llm.invoke(prompt)

    if hasattr(response, "content"):
        return normalize_llm_content(response.content)

    return normalize_llm_content(response)