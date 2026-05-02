from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import MetricsResponse


router = APIRouter(prefix="/api/metrics", tags=["metrics"])


METRICS = {
    "baseline": {
        "Logistic Regression": {
            "accuracy": 0.9052,
            "precision": 0.9148,
            "recall": 0.9301,
            "f1_score": 0.9224,
            "confusion_matrix": {"tn": 294, "fp": 48, "fn": 33, "tp": 479},
        },
        "Random Forest": {
            "accuracy": 0.9754,
            "precision": 0.9824,
            "recall": 0.9766,
            "f1_score": 0.9795,
            "confusion_matrix": {"tn": 333, "fp": 9, "fn": 12, "tp": 500},
        },
        "LightGBM": {
            "accuracy": 0.9859,
            "precision": 0.9883,
            "recall": 0.9883,
            "f1_score": 0.9883,
            "confusion_matrix": {"tn": 336, "fp": 6, "fn": 6, "tp": 506},
        },
        "CatBoost": {
            "accuracy": 0.9813,
            "precision": 0.9863,
            "recall": 0.9824,
            "f1_score": 0.9843,
            "confusion_matrix": {"tn": 335, "fp": 7, "fn": 9, "tp": 503},
        },
    },
    "tuning": {
        "Logistic Regression": {
            "accuracy": 0.9122,
            "precision": 0.9213,
            "recall": 0.9336,
            "f1_score": 0.9274,
            "confusion_matrix": {"tn": 301, "fp": 41, "fn": 34, "tp": 478},
        },
        "Random Forest": {
            "accuracy": 0.9824,
            "precision": 0.9882,
            "recall": 0.9824,
            "f1_score": 0.9853,
            "confusion_matrix": {"tn": 336, "fp": 6, "fn": 9, "tp": 503},
        },
        "LightGBM": {
            "accuracy": 0.9918,
            "precision": 0.9922,
            "recall": 0.9941,
            "f1_score": 0.9932,
            "confusion_matrix": {"tn": 338, "fp": 4, "fn": 3, "tp": 509},
        },
        "CatBoost": {
            "accuracy": 0.9871,
            "precision": 0.9902,
            "recall": 0.9883,
            "f1_score": 0.9892,
            "confusion_matrix": {"tn": 337, "fp": 5, "fn": 6, "tp": 506},
        },
    },
}


@router.get("", response_model=MetricsResponse)
def get_metrics() -> dict:
    return METRICS
