import os
from langchain_community.vectorstores import FAISS

def get_relevant_context(query, intent, embeddings, base_dir):
    vector_store_path = os.path.join(base_dir, "assets", "vector_stores", intent)

    if not os.path.exists(vector_store_path):
        return "Không tìm thấy dữ liệu bổ trợ cho chủ đề này."

    # allow_dangerous_deserialization=True là bắt buộc để load file local
    db = FAISS.load_local(
        vector_store_path,
        embeddings,
        allow_dangerous_deserialization=True
    )

    # Tìm Top 3 đoạn văn liên quan nhất
    docs = db.similarity_search(query, k=3)

    context = "\n---\n".join([doc.page_content for doc in docs])
    return context
