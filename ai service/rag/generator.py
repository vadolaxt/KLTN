def generate_response(llm, query, context):

    if not context or not context.strip():
        return "Thông tin ko có trong tài liệu."

    invalid_context_prefixes = [
        "Lỗi khi truy xuất",
        "Không tìm thấy",
        "Câu hỏi rỗng",
        "Không xác định được intent",
        "Không tìm thấy nội dung context hợp lệ",
    ]

    if any(context.strip().startswith(prefix) for prefix in invalid_context_prefixes):
        return "Thông tin ko có trong tài liệu."

    prompt = f"""
Bạn là chatbot tư vấn tuyển sinh của Trường Đại học Nông Lâm.

[BẮT BUỘC]

- Chỉ sử dụng thông tin trong "THÔNG TIN HỖ TRỢ".
- Không dùng kiến thức ngoài tài liệu.

[QUY TẮC TRẢ LỜI]

B1.
Nếu tài liệu chứa câu trả lời trực tiếp
→ trả lời trực tiếp.

B2.
Nếu tài liệu KHÔNG chứa câu trả lời trực tiếp
NHƯNG có thông tin liên quan
→ PHẢI trích lại thông tin liên quan đó.
→ nói rõ tài liệu hiện chưa nêu trực tiếp.

Ví dụ:

Người hỏi:
"điểm ưu tiên khu vực 1 là bao nhiêu"

Tài liệu:
"điểm ưu tiên thực hiện theo quy chế tuyển sinh hiện hành"

Trả lời đúng:
"Theo tài liệu, điểm ưu tiên theo khu vực và đối tượng được thực hiện theo quy chế tuyển sinh hiện hành. Tài liệu hiện chưa nêu cụ thể khu vực 1 được cộng bao nhiêu điểm."

KHÔNG được trả:
"Thông tin ko có trong tài liệu."

B3.
Chỉ trả:
"Thông tin ko có trong tài liệu."

khi tài liệu hoàn toàn không có đoạn nào liên quan.

[LƯU Ý]
Có nhiều từ được viết tắt (ví dụ như mã ngành DT, KT, ...)
Trong tài liệu liên quan đến chủ đề câu hỏi đề có 1 link dẫn đến các từ khóa được viết tắt hoặc 1 bảng quy định tên viết tắt
Nếu gặp phải các từ viết tắt thì đưa ra link hoặc trích dẫn t nguồn
(Hiện tại ghi nhớ DT là viết tắt của ngành công nghệ thông tin, KT là viết tắt của ngành kinh tế)

Yêu cầu:
- Ngắn gọn.
- Không lặp ý.

THÔNG TIN HỖ TRỢ:
{context}

CÂU HỎI:
{query}

TRẢ LỜI:
"""

    response = llm.invoke(prompt)

    if hasattr(response, "content"):
        return response.content.strip()

    return str(response).strip()