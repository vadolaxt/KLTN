from pathlib import Path
from typing import Optional

import pandas as pd

from .config import (
    CANDIDATE_2025_PATH,
    HISTORICAL_DATA_PATH,
    NATIONAL_SUBJECT_STATS_PATH,
)


def _resolve_path(path: Optional[str | Path], default_path: Path) -> Path:
    return Path(path).resolve() if path else default_path


def _read_table(path: Path, **kwargs) -> pd.DataFrame:
    suffix = path.suffix.lower()
    if suffix in {".xlsx", ".xls"}:
        return pd.read_excel(path, **kwargs)
    if suffix == ".csv":
        return pd.read_csv(path, encoding="utf-8-sig", **kwargs)
    raise ValueError(f"Unsupported data file: {path}")


def load_historical_admissions(path: Optional[str | Path] = None) -> pd.DataFrame:
    """Load NLU historical cutoff/quota data from CSV or Excel."""
    source = _resolve_path(path, HISTORICAL_DATA_PATH)
    return _read_table(
        source,
        dtype={
            "School_Code": "string",
            "Department_Code": "string",
            "Major_Code": "string",
            "Subject_Combinations": "string",
            "Program_Type": "string",
        },
    )


def load_candidate_2025(
    path: Optional[str | Path] = None,
    nrows: Optional[int] = None,
) -> pd.DataFrame:
    """Load 2025 applicant wishes used for admission classification testing."""
    source = _resolve_path(path, CANDIDATE_2025_PATH)
    return _read_table(
        source,
        nrows=nrows,
        dtype={
            "SBD": "string",
            "Ma_Nganh_Dang_Ky": "string",
            "To_Hop_Xet_Tuyen": "string",
            "Ket_Qua": "string",
        },
    )


def load_national_subject_stats(path: Optional[str | Path] = None) -> pd.DataFrame:
    """Load national subject distribution summary used by Pipeline B."""
    source = _resolve_path(path, NATIONAL_SUBJECT_STATS_PATH)
    return _read_table(source)
