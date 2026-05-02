from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib


MODEL_FILES = {
    "Logistic Regression": "logistic_regression_tuned.joblib",
    "Random Forest": "random_forest_tuned.joblib",
    "LightGBM": "lightgbm_tuned.joblib",
    "CatBoost": "catboost_tuned.joblib",
}


def load_models(models_dir: Path | None = None) -> dict[str, Any]:
    base_dir = models_dir or Path(__file__).resolve().parents[2] / "models"
    loaded: dict[str, Any] = {}
    for model_name, filename in MODEL_FILES.items():
        model_path = base_dir / filename
        if model_path.exists():
            loaded[model_name] = joblib.load(model_path)
    return loaded
