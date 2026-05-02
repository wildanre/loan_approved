from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


LoanDecision = Literal["Approved", "Rejected"]
Education = Literal["Graduate", "Not Graduate"]
SelfEmployed = Literal["Yes", "No"]


class LoanInput(BaseModel):
    no_of_dependents: int = Field(ge=0, le=5)
    education: Education
    self_employed: SelfEmployed
    income_annum: int = Field(gt=0)
    loan_amount: int = Field(gt=0)
    loan_term: int = Field(ge=2, le=20)
    cibil_score: int = Field(ge=300, le=900)
    residential_assets_value: int = Field(ge=0)
    commercial_assets_value: int = Field(ge=0)
    luxury_assets_value: int = Field(ge=0)
    bank_asset_value: int = Field(ge=0)


class ModelPrediction(BaseModel):
    model: str
    label: LoanDecision
    probability: float = Field(ge=0, le=1)


class PredictResponse(BaseModel):
    predictions: list[ModelPrediction]
    consensus: LoanDecision
    consensus_confidence: float = Field(ge=0, le=1)
    prediction_id: int


class HistoryItem(BaseModel):
    id: int
    timestamp: datetime
    input: LoanInput
    predictions: list[ModelPrediction]
    consensus: LoanDecision
    consensus_confidence: float

    model_config = ConfigDict(from_attributes=True)


class MetricsValue(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: dict[str, int]


class MetricsResponse(BaseModel):
    baseline: dict[str, MetricsValue]
    tuning: dict[str, MetricsValue]


class HealthResponse(BaseModel):
    status: str
