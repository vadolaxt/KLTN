from pathlib import Path
from typing import Optional

import pandas as pd

from .config import (
    HISTORICAL_DATA_PATH,
    HISTORICAL_DATA_SGU_PATH,
    NATIONAL_SUBJECT_STATS_PATH,
)


def _resolve_path(path: Optional[str | Path], default_path: Path) -> Path:
    return Path(path).resolve() if path else default_path


def _read_table(path: Path, **kwargs) -> pd.DataFrame:
    """Đọc file dữ liệu đầu vào, hiện hỗ trợ CSV và Excel."""
    suffix = path.suffix.lower()
    if suffix in {".xlsx", ".xls"}:
        return pd.read_excel(path, **kwargs)
    if suffix == ".csv":
        return pd.read_csv(path, encoding="utf-8-sig", **kwargs)
    raise ValueError(f"Không hỗ trợ định dạng dữ liệu: {path}")


def load_historical_admissions(
    path: Optional[str | Path] = None,
    school_code: Optional[str] = None,
) -> pd.DataFrame:
    """Tải lịch sử điểm chuẩn/chỉ tiêu từ CSV hoặc Excel.

    Tham số:
        path: Đường dẫn tới file dữ liệu. Mặc định dùng dataset NLU.
        school_code: Nếu truyền vào thì lọc theo mã trường, ví dụ NLU hoặc SGU.
            Nếu bỏ trống thì trả về toàn bộ dữ liệu trong file.
    """
    source = _resolve_path(path, HISTORICAL_DATA_PATH)
    df = _read_table(
        source,
        dtype={
            "School_Code": "string",
            "Department_Code": "string",
            "Major_Code": "string",
            "Subject_Combinations": "string",
            "Program_Type": "string",
            "Note": "string",
        },
    )
    if school_code:
        df = df[df["School_Code"].astype("string").str.strip().eq(school_code)].copy()
    return df


def load_historical_admissions_sgu(path: Optional[str | Path] = None) -> pd.DataFrame:
    """Tải lịch sử điểm chuẩn trường Đại học Sài Gòn (SGU)."""
    source = _resolve_path(path, HISTORICAL_DATA_SGU_PATH)
    return _read_table(
        source,
        dtype={
            "School_Code": "string",
            "Major_Code": "string",
            "Subject_Combinations": "string",
            "Program_Type": "string",
            "Note": "string",
        },
    )


def load_national_subject_stats(path: Optional[str | Path] = None) -> pd.DataFrame:
    """Tải thống kê phổ điểm quốc gia theo môn, dùng cho pipeline B."""
    source = _resolve_path(path, NATIONAL_SUBJECT_STATS_PATH)
    return _read_table(source)
