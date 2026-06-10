import re
import yaml
from typing import Dict, Any, Optional, Tuple, List, Union
from pattern import unique_metadata_pattern, front_matter_pattern, unique_metadata_keyword


# bỏ khoảng trắng dư
# bỏ dấu (* ' ") sau khi lấy ra regex
# xóa {} () []
# xóa các dấu format của .md (*_~`)
def clean_metadata_value(value: Any) -> str:
    if value is None:
        return ""

    value = str(value).lower().strip()
    value = re.sub(r"[()\[\]{}]", "", value)
    # value = re.sub(r"[*_~`]", "", value)
    value = re.sub(r"[*~`]", "", value)
    value = re.sub(r"\s+", " ", value)

    return value


# ép value của unique global_metadata về dạng list nếu có nhiều giá trị
# nếu value ko có nhiều giá trị thì giữ nguyên
# ví dụ: "A00, A01, D07" -> ["A00", "A01", "D07"]
#         A01 thì giữ nguyên
def normalize_value(value: Any) -> Union[str, List[str]]:
    value = clean_metadata_value(value)
    extractor = r"[,;]"

    # nếu có dấu , ; trong value thì output là list
    if re.search(extractor, value):
        return [
            item.strip()
            for item in re.split(extractor, value)
            if item.strip()
        ]

    # trả vê nguyên dạng nếu ko có , ;
    return value


# trúng regex nào trước thì ghép vào
def search_first(text: str, patterns: List[str]) -> Optional[str]:
    for p in patterns:
        match = re.search(
            p,
            text or "",
            flags=re.IGNORECASE | re.MULTILINE | re.UNICODE
        )

        if not match:
            continue

        if "value" in match.groupdict():
            return clean_metadata_value(match.group("value"))

        return clean_metadata_value(match.group(1))

    return None


# lấy ra global_metadata trong front matter và lưu dưới dạng dict
def extract_global_metadata(text: str) -> Dict[str, Any]:
    # Loại bỏ ký tự ẩn BOM nếu có
    text = text.lstrip("\ufeff")

    match = front_matter_pattern().match(text)

    # nếu file ko có front matter thì trả về dict rỗng
    if not match:
        return {}

    metadata_text = match.group(1).strip()

    global_metadata = yaml.safe_load(metadata_text) or {}

    if not isinstance(global_metadata, dict):
        raise ValueError("Front matter phải là dạng dict key-value.")

    return global_metadata


# lấy ra unique global_metadata lưu các giá trị dưới dạng dict
def extract_unique_metadata(text: str) -> Dict[str, Any]:
    unique_metadata: Dict[str, Any] = {}
    text = text.lstrip("\ufeff")

    keyword_config = unique_metadata_keyword()
    keyword_rules = []

    for metadata_key, keywords in keyword_config.items():
        for keyword in keywords:
            keyword = clean_metadata_value(keyword).lower().strip()

            # bỏ keyword rỗng để tránh match mọi heading
            if not keyword:
                continue

            keyword_rules.append((metadata_key, keyword))

    # ưu tiên keyword dài hơn trước
    # để "mã ngành" match major_code trước "ngành"
    # keyword_rules.sort(
    #     key=lambda item: len(item[1]),
    #     reverse=True
    # )

    # dùng finditer thay vì match
    # vì trong một chunk có thể có nhiều heading
    for match in unique_metadata_pattern().finditer(text):
        heading_key = clean_metadata_value(match.group("key"))
        heading_value = match.group("value")

        heading_key_normalized = heading_key.lower()

        if heading_value is not None:
            heading_value = clean_metadata_value(heading_value)
        else:
            heading_value = ""

        for metadata_key, keyword in keyword_rules:
            if keyword not in heading_key_normalized:
                continue

            # nếu heading có value sau dấu ":" thì lấy value
            # nếu heading không có value thì lấy chính heading key
            # vd: Công thức tính điểm ưu tiên
            #   => formula : "Công thức tính điểm ưu tiên"
            if heading_value:
                unique_metadata[metadata_key] = heading_value
            else:
                unique_metadata[metadata_key] = heading_key
            break

    return unique_metadata


if __name__ == "__main__":
    metadata = """
---
intent: "diem_chuan"
year: "2024"
---
"""
unique = """
# Giới thiệu chung
# ngành: công nghệ thông tin

Trường Đại học Nông Lâm Thành phố Hồ Chí Minh
(Nong Lam University – NLU) là trường đại học đa ngành, trực thuộc *Bộ Giáo dục và Đào tạo.

Trường tọa lạc trên khuôn viên rộng khoảng 118 ha, thuộc:

* Thành phố Thủ Đức, Thành phố Hồ Chí Minh
* Thành phố Dĩ An, tỉnh Bình Dương
    """

# split = "a,b,c,d"
split = "a"

# print(extract_global_metadata(global_metadata))
# print(extract_unique_metadata(unique))
# print(normalize_value(split))
