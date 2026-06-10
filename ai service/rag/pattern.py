import re
from typing import Dict, List, Any


# pattern của global meta
def front_matter_pattern():
    return re.compile(
        r"^\s*---\s*\n(.*?)\n---\s*\n?",
        flags=re.MULTILINE | re.DOTALL
    )


# pattern của header (unique global_metadata)
def unique_metadata_pattern():
    return re.compile(
        r"^\s{0,3}(?P<header>#{1,3})\s*"
        r"(?P<key>[^:\n]+?)"
        r"\s*"
        r"(?::\s*(?P<value>.*?))?"
        r"\s*$",
        flags=re.IGNORECASE | re.MULTILINE | re.UNICODE
    )


def heading_pattern():
    pattern = re.compile(
        r"^[ \t]*(?P<level>#{1,3})[ \t]*(?P<title>.+?)[ \t]*$",
        flags=re.MULTILINE | re.UNICODE
    )
    return pattern

def unique_metadata_keyword() -> Dict[str, Any]:
    pattern: Dict[str, Any] = {
        "major_code": ["mã ngành"],
        "specialization_code": ["mã chuyên ngành"],
        "major": ["ngành", "tên ngành"],
        "specialization" : ["chuyên ngành", "tên chuyên ngành"],

        "combination": ["tổ hợp", "tổ hợp xét tuyển"],

        "overview": ["sơ lược", "giới thiệu chung"],
        "achievement": ["thành tựu tiêu biểu"],
        "development": ["quá trình phát triển"],

        "formula": ["công tức quy đổi", "công thức tính điểm ưu tiên"],

        "priority_type": ["mức điểm ưu tiên theo"],

        "club_name:": ["tên", "câu lạc bộ", "tên câu lạc bộ", "clb"],

        "school_year": ["khóa học"],

        "right": ["quyền lợi"],

        "condition": ["điều kiện"],
        "profile": ["hồ sơ đăng ký", 'hồ sơ'],
        "price": ["chi phí", "giá"],

        "method": ["phương thức"],
        "method_num": ["mã phương thức"],

    }

    return pattern

# dsach từ nối (dùng khi tách câu nhiều ý)
def word_connector():
    ls = [
        "bên cạnh đó",
        "ngoài ra",
        "đồng thời",
        "thêm nữa",
        "với lại",
        "và",
        "với",
        "hay",
        "hoặc",
        "còn",
    ]

    return ls

if __name__ == "__main__":
    texts = [
        "# Mức điểm ưu tiên theo đối tượng:",
        "# Công thức tính điểm ưu tiên",
        "## Tên ngành: Sư phạm Kỹ thuật nông nghiệp",
    ]

    pattern = unique_metadata_pattern()

    for text in texts:
        match = pattern.search(text)

        if match:
            print({
                "text": text,
                "header": match.group("header"),
                "key": match.group("key").strip(),
                "value": match.group("value").strip() if match.group("value") else None,
            })



