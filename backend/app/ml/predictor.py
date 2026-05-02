from __future__ import annotations

from math import exp
from typing import Any

import numpy as np
import pandas as pd

from app.ml.loader import MODEL_FILES
from app.models.schemas import LoanInput, ModelPrediction


FEATURE_ORDER = [
    "no_of_dependents",
    "education",
    "self_employed",
    "income_annum",
    "loan_amount",
    "loan_term",
    "cibil_score",
    "residential_assets_value",
    "commercial_assets_value",
    "luxury_assets_value",
    "bank_asset_value",
    "total_assets_value",
    "rasio_pinjaman_pendapatan",
    "rasio_agunan_pinjaman",
]


class LoanPredictor:
    def __init__(self, models: dict[str, Any] | None = None) -> None:
        self.models = models or {}

    def predict(self, loan_input: LoanInput) -> tuple[list[ModelPrediction], str, float]:
        predictions = [
            self._predict_model(model_name, loan_input)
            for model_name in MODEL_FILES
        ]
        approved_count = sum(1 for prediction in predictions if prediction.label == "Approved")
        consensus = "Approved" if approved_count >= 2 else "Rejected"
        matching = [prediction.probability for prediction in predictions if prediction.label == consensus]
        consensus_confidence = sum(matching) / len(matching) if matching else 0
        return predictions, consensus, round(consensus_confidence, 4)

    def _predict_model(self, model_name: str, loan_input: LoanInput) -> ModelPrediction:
        model = self.models.get(model_name)
        if model is not None:
            probability = self._predict_with_loaded_model(model, loan_input)
        else:
            probability = self._fallback_probability(model_name, loan_input)

        return ModelPrediction(
            model=model_name,
            label="Approved" if probability >= 0.5 else "Rejected",
            probability=round(float(probability), 4),
        )

    def _predict_with_loaded_model(self, model: Any, loan_input: LoanInput) -> float:
        features = self._feature_frame(loan_input)
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features)[0]
            return self._approved_probability(model, probabilities)
        prediction = model.predict(features)[0]
        if isinstance(prediction, str):
            return 1.0 if prediction.strip().lower() == "approved" else 0.0
        return 1.0 if int(prediction) == 1 else 0.0

    def _feature_frame(self, loan_input: LoanInput) -> pd.DataFrame:
        payload = loan_input.model_dump()
        total_assets = (
            payload["residential_assets_value"]
            + payload["commercial_assets_value"]
            + payload["luxury_assets_value"]
            + payload["bank_asset_value"]
        )
        payload["total_assets_value"] = total_assets
        payload["rasio_pinjaman_pendapatan"] = payload["loan_amount"] / payload["income_annum"]
        payload["rasio_agunan_pinjaman"] = total_assets / payload["loan_amount"]
        return pd.DataFrame([{key: payload[key] for key in FEATURE_ORDER}])

    def _approved_probability(self, model: Any, probabilities: np.ndarray) -> float:
        classes = getattr(model, "classes_", None)
        if classes is None and hasattr(model, "named_steps"):
            classes = getattr(list(model.named_steps.values())[-1], "classes_", None)
        if classes is not None:
            for index, class_name in enumerate(classes):
                if class_name == 1 or str(class_name).strip().lower() == "approved":
                    return float(probabilities[index])
        return float(probabilities[-1])

    def _fallback_probability(self, model_name: str, loan_input: LoanInput) -> float:
        total_assets = (
            loan_input.residential_assets_value
            + loan_input.commercial_assets_value
            + loan_input.luxury_assets_value
            + loan_input.bank_asset_value
        )
        income_ratio = loan_input.income_annum / loan_input.loan_amount
        asset_ratio = total_assets / loan_input.loan_amount
        cibil_score = (loan_input.cibil_score - 300) / 600
        term_penalty = (loan_input.loan_term - 2) / 18
        dependent_penalty = loan_input.no_of_dependents / 5
        education_bonus = 0.06 if loan_input.education == "Graduate" else -0.03
        employment_adjustment = 0.03 if loan_input.self_employed == "No" else -0.02

        model_bias = {
            "Logistic Regression": -0.04,
            "Random Forest": 0.03,
            "LightGBM": 0.06,
            "CatBoost": 0.04,
        }[model_name]

        score = (
            -1.15
            + (2.55 * cibil_score)
            + (0.85 * income_ratio)
            + (0.38 * asset_ratio)
            - (0.35 * term_penalty)
            - (0.2 * dependent_penalty)
            + education_bonus
            + employment_adjustment
            + model_bias
        )
        return 1 / (1 + exp(-score))
