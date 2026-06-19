from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

from .config import (
    CATEGORICAL_FEATURES,
    MODEL_DIR,
    RANDOM_STATE,
    TEST_YEAR,
    TRAIN_END_YEAR,
    SCHOOL_CODE,
)
from .evaluation import (
    ExperimentReport,
    evaluate_candidate_admissions,
    regression_metrics,
)
from .features import (
    FeatureSpec,
    build_pipeline_specs,
    prepare_historical_frame,
    required_feature_columns,
)

try:
    from lightgbm import LGBMRegressor
except Exception:  # pragma: no cover
    LGBMRegressor = None

try:
    from xgboost import XGBRegressor
except Exception:  # pragma: no cover
    XGBRegressor = None


@dataclass
class ModelBundle:
    estimator: Pipeline
    model_name: str
    pipeline_name: str
    feature_spec: FeatureSpec
    metrics: dict[str, float]
    train_end_year: int
    source_data: pd.DataFrame
    national_subject_stats: pd.DataFrame | None
    school_code: str = SCHOOL_CODE
    leaderboard: pd.DataFrame = field(default_factory=pd.DataFrame)


def _one_hot_encoder() -> OneHotEncoder:
    try:
        return OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    except TypeError:
        return OneHotEncoder(handle_unknown="ignore", sparse=False)


def _build_preprocessor(spec: FeatureSpec, scale_numeric: bool) -> ColumnTransformer:
    numeric_steps: list[tuple[str, Any]] = [("imputer", SimpleImputer(strategy="median"))]
    if scale_numeric:
        numeric_steps.append(("scaler", StandardScaler()))

    numeric_transformer = Pipeline(numeric_steps)
    categorical_transformer = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", _one_hot_encoder()),
        ]
    )

    transformers: list[tuple[str, Any, list[str]]] = [
        ("num", numeric_transformer, spec.numeric_features),
    ]
    if spec.categorical_features:
        transformers.append(("cat", categorical_transformer, spec.categorical_features))

    return ColumnTransformer(transformers, remainder="drop")


def _available_regressors() -> dict[str, Any]:
    models: dict[str, Any] = {
        "Linear": LinearRegression(),
        "Tree": DecisionTreeRegressor(max_depth=5, random_state=RANDOM_STATE),
        "RF": RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE, n_jobs=1),
    }
    if LGBMRegressor is not None:
        models["LGBM"] = LGBMRegressor(
            n_estimators=100, learning_rate=0.05, random_state=RANDOM_STATE, verbose=-1
        )
    if XGBRegressor is not None:
        models["XGB"] = XGBRegressor(
            objective="reg:squarederror",
            n_estimators=100,
            learning_rate=0.05,
            random_state=RANDOM_STATE,
            n_jobs=1,
        )
    return models


def _make_pipeline(model_name: str, regressor: Any, spec: FeatureSpec) -> Pipeline:
    scale_numeric = model_name == "Linear"
    return Pipeline(
        [
            ("preprocess", _build_preprocessor(spec, scale_numeric=scale_numeric)),
            ("model", regressor),
        ]
    )


def _make_tuned_xgb_pipeline(spec: FeatureSpec, cv: int = 3) -> GridSearchCV:
    if XGBRegressor is None:
        raise RuntimeError("XGBoost is not available.")
    estimator = _make_pipeline(
        "XGB_Tuned",
        XGBRegressor(objective="reg:squarederror", random_state=RANDOM_STATE, n_jobs=1),
        spec,
    )
    param_grid = {
        "model__n_estimators": [50, 100, 150],
        "model__max_depth": [3, 4, 5],
        "model__learning_rate": [0.01, 0.05, 0.1],
        "model__reg_lambda": [1, 5, 10],
    }
    return GridSearchCV(
        estimator, param_grid, cv=cv, scoring="neg_mean_absolute_error", n_jobs=1
    )


def _valid_model_rows(df: pd.DataFrame, year_mask: pd.Series) -> pd.DataFrame:
    return df[year_mask & df["Score_Change"].notna() & df["Cutoff_Score"].notna()].copy()


def _predict_cutoff(estimator: Pipeline, frame: pd.DataFrame, spec: FeatureSpec) -> np.ndarray:
    pred_delta = estimator.predict(frame[required_feature_columns(spec)])
    pred_cutoff = frame["Prev_Year_Score"].to_numpy(dtype=float) + pred_delta
    return np.clip(pred_cutoff, 0, 30)


def _select_best(leaderboard: pd.DataFrame) -> pd.Series:
    if leaderboard["F1_2025"].notna().any():
        sort_cols = ["F1_2025", "Accuracy_2025", "MAE", "RMSE"]
        ascending = [False, False, True, True]
    else:
        sort_cols = ["MAE", "RMSE", "R2"]
        ascending = [True, True, False]
    return leaderboard.sort_values(sort_cols, ascending=ascending).iloc[0]


def _fit_single_model(
    raw_data: pd.DataFrame,
    national_subject_stats: pd.DataFrame | None,
    model_name: str,
    pipeline_name: str,
    train_end_year: int,
    school_code: str = SCHOOL_CODE,
) -> tuple[Pipeline, FeatureSpec, pd.DataFrame]:
    frame = prepare_historical_frame(
        raw_data, national_subject_stats,
        train_end_year=train_end_year, school_code=school_code,
    )
    spec = build_pipeline_specs(CATEGORICAL_FEATURES)[pipeline_name]
    if model_name == "XGB_Tuned":
        estimator = _make_tuned_xgb_pipeline(spec)
    else:
        regressor = _available_regressors()[model_name]
        estimator = _make_pipeline(model_name, regressor, spec)
    train_rows = _valid_model_rows(frame, frame["Year"].le(train_end_year))
    estimator.fit(train_rows[required_feature_columns(spec)], train_rows["Score_Change"])
    return estimator, spec, frame


def run_nlu_experiment(
    historical_df: pd.DataFrame,
    national_subject_stats: pd.DataFrame | None = None,
    candidate_df: pd.DataFrame | None = None,
    train_end_year: int = TRAIN_END_YEAR,
    test_year: int = TEST_YEAR,
    retrain_final: bool = True,
    school_code: str = SCHOOL_CODE,
) -> ExperimentReport:
    """Huấn luyện và đánh giá mô hình dự đoán điểm chuẩn.

    Quy trình:
    - Train: dữ liệu từ đầu đến train_end_year (mặc định 2025)
    - Test : năm test_year (mặc định 2026, nếu có điểm chuẩn thực tế)
    - Nếu test_year chưa có điểm chuẩn → chỉ dự đoán, không tính metrics test
    - Sau khi chọn model tốt nhất, retrain trên toàn bộ dữ liệu (bao gồm test_year)
      để chuẩn bị dự đoán năm tiếp theo.

    Hỗ trợ mở rộng:
    - Truyền school_code = "SGU" (hoặc trường khác) nếu có dữ liệu tương tự.
    """
    frame = prepare_historical_frame(
        historical_df, national_subject_stats,
        train_end_year=train_end_year, school_code=school_code,
    )
    pipeline_specs = build_pipeline_specs(CATEGORICAL_FEATURES)
    regressors = _available_regressors()

    train_rows = _valid_model_rows(frame, frame["Year"].le(train_end_year))
    test_rows = _valid_model_rows(frame, frame["Year"].eq(test_year))

    if train_rows.empty:
        raise ValueError("Không có dữ liệu huấn luyện hợp lệ sau khi xử lý.")

    # Nếu test_year chưa có điểm chuẩn, vẫn chạy nhưng bỏ qua metrics test
    has_test_data = not test_rows.empty

    rows: list[dict[str, object]] = []
    bundles: dict[tuple[str, str], ModelBundle] = {}
    cutoff_prediction_parts: list[pd.DataFrame] = []
    candidate_prediction_parts: list[pd.DataFrame] = []

    for pipeline_name, spec in pipeline_specs.items():
        feature_cols = required_feature_columns(spec)
        for model_name, regressor in regressors.items():
            estimator = _make_pipeline(model_name, regressor, spec)
            estimator.fit(train_rows[feature_cols], train_rows["Score_Change"])

            result_row: dict[str, object] = {"Pipeline": pipeline_name, "Model": model_name}

            if has_test_data:
                y_pred = _predict_cutoff(estimator, test_rows, spec)
                y_true = test_rows["Cutoff_Score"].to_numpy(dtype=float)
                metrics = regression_metrics(y_true, y_pred)

                pred_df = test_rows[[
                    "Year", "Major_Code", "Major_Name", "Admission_Quota",
                    "Cutoff_Score", "Prev_Year_Score", "Combination_Key",
                ]].copy()
                pred_df["Pipeline"] = pipeline_name
                pred_df["Model"] = model_name
                pred_df["Predicted_Cutoff"] = y_pred
                pred_df["Prediction_Error"] = pred_df["Predicted_Cutoff"] - pred_df["Cutoff_Score"]
                cutoff_prediction_parts.append(pred_df)

                candidate_metrics, candidate_pred_df = evaluate_candidate_admissions(
                    candidate_df, pred_df
                )
                if not candidate_pred_df.empty:
                    candidate_pred_df["Pipeline"] = pipeline_name
                    candidate_pred_df["Model"] = model_name
                    candidate_prediction_parts.append(candidate_pred_df)

                result_row.update({**metrics, **candidate_metrics})
            else:
                # Không có điểm chuẩn test_year → dùng metrics trên tập train (CV-like)
                result_row.update({
                    "MAE": np.nan, "RMSE": np.nan, "R2": np.nan,
                    "Accuracy_2025": np.nan, "F1_2025": np.nan, "Candidate_Rows": 0,
                })

            rows.append(result_row)
            bundles[(pipeline_name, model_name)] = ModelBundle(
                estimator=estimator,
                model_name=model_name,
                pipeline_name=pipeline_name,
                feature_spec=spec,
                metrics=result_row,
                train_end_year=train_end_year,
                source_data=historical_df.copy(),
                national_subject_stats=None if national_subject_stats is None else national_subject_stats.copy(),
                school_code=school_code,
            )

    # XGB Tuned (Pipeline B)
    if XGBRegressor is not None and "Pipeline_B_National" in pipeline_specs:
        pipeline_name = "Pipeline_B_National"
        model_name = "XGB_Tuned"
        spec = pipeline_specs[pipeline_name]
        feature_cols = required_feature_columns(spec)
        estimator = _make_tuned_xgb_pipeline(spec)
        estimator.fit(train_rows[feature_cols], train_rows["Score_Change"])

        result_row = {"Pipeline": pipeline_name, "Model": model_name}

        if has_test_data:
            y_pred = _predict_cutoff(estimator, test_rows, spec)
            y_true = test_rows["Cutoff_Score"].to_numpy(dtype=float)
            metrics = regression_metrics(y_true, y_pred)

            pred_df = test_rows[[
                "Year", "Major_Code", "Major_Name", "Admission_Quota",
                "Cutoff_Score", "Prev_Year_Score", "Combination_Key",
            ]].copy()
            pred_df["Pipeline"] = pipeline_name
            pred_df["Model"] = model_name
            pred_df["Predicted_Cutoff"] = y_pred
            pred_df["Prediction_Error"] = pred_df["Predicted_Cutoff"] - pred_df["Cutoff_Score"]
            cutoff_prediction_parts.append(pred_df)

            candidate_metrics, candidate_pred_df = evaluate_candidate_admissions(candidate_df, pred_df)
            if not candidate_pred_df.empty:
                candidate_pred_df["Pipeline"] = pipeline_name
                candidate_pred_df["Model"] = model_name
                candidate_prediction_parts.append(candidate_pred_df)

            result_row.update({**metrics, **candidate_metrics})
        else:
            result_row.update({
                "MAE": np.nan, "RMSE": np.nan, "R2": np.nan,
                "Accuracy_2025": np.nan, "F1_2025": np.nan, "Candidate_Rows": 0,
            })

        rows.append(result_row)
        bundles[(pipeline_name, model_name)] = ModelBundle(
            estimator=estimator,
            model_name=model_name,
            pipeline_name=pipeline_name,
            feature_spec=spec,
            metrics=result_row,
            train_end_year=train_end_year,
            source_data=historical_df.copy(),
            national_subject_stats=None if national_subject_stats is None else national_subject_stats.copy(),
            school_code=school_code,
        )

    leaderboard = pd.DataFrame(rows)

    # Sắp xếp leaderboard: ưu tiên MAE nếu chưa có metrics test
    if leaderboard["MAE"].notna().any():
        leaderboard = leaderboard.sort_values(["MAE", "RMSE"], ascending=[True, True]).reset_index(drop=True)
    best_row = _select_best(leaderboard)
    best_key = (str(best_row["Pipeline"]), str(best_row["Model"]))
    best_bundle = bundles[best_key]
    best_bundle.leaderboard = leaderboard.copy()

    # Retrain trên toàn bộ dữ liệu (train_end_year = test_year)
    final_bundle = None
    if retrain_final:
        final_train_end_year = test_year
        estimator, spec, _ = _fit_single_model(
            historical_df,
            national_subject_stats,
            model_name=best_bundle.model_name,
            pipeline_name=best_bundle.pipeline_name,
            train_end_year=final_train_end_year,
            school_code=school_code,
        )
        final_bundle = ModelBundle(
            estimator=estimator,
            model_name=best_bundle.model_name,
            pipeline_name=best_bundle.pipeline_name,
            feature_spec=spec,
            metrics=best_bundle.metrics,
            train_end_year=final_train_end_year,
            source_data=historical_df.copy(),
            national_subject_stats=None if national_subject_stats is None else national_subject_stats.copy(),
            school_code=school_code,
            leaderboard=leaderboard.copy(),
        )

    return ExperimentReport(
        leaderboard=leaderboard,
        cutoff_predictions=pd.concat(cutoff_prediction_parts, ignore_index=True)
            if cutoff_prediction_parts else pd.DataFrame(),
        candidate_predictions=pd.concat(candidate_prediction_parts, ignore_index=True)
            if candidate_prediction_parts else pd.DataFrame(),
        best_bundle=best_bundle,
        final_bundle=final_bundle,
    )


def save_model_bundle(bundle: ModelBundle, output_dir: str | Path = MODEL_DIR) -> Path:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    file_name = f"{bundle.pipeline_name}_{bundle.model_name}_{bundle.school_code}.joblib"
    model_path = output_path / file_name
    joblib.dump(bundle, model_path)
    return model_path