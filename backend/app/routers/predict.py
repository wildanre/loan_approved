from __future__ import annotations

from fastapi import APIRouter, Request

from app.db import crud
from app.db.database import DbSession
from app.models.schemas import LoanInput, PredictResponse


router = APIRouter(prefix="/api/predict", tags=["predict"])


@router.post("", response_model=PredictResponse)
def predict_loan(
    loan_input: LoanInput,
    db: DbSession,
    request: Request,
) -> PredictResponse:
    predictions, consensus, consensus_confidence = request.app.state.predictor.predict(loan_input)
    record = crud.create_prediction(
        db=db,
        loan_input=loan_input,
        predictions=predictions,
        consensus=consensus,
        consensus_confidence=consensus_confidence,
    )
    return PredictResponse(
        predictions=predictions,
        consensus=consensus,
        consensus_confidence=consensus_confidence,
        prediction_id=record.id,
    )
