from __future__ import annotations

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.db.database import PredictionRecord
from app.models.schemas import HistoryItem, LoanInput, ModelPrediction


def create_prediction(
    db: Session,
    loan_input: LoanInput,
    predictions: list[ModelPrediction],
    consensus: str,
    consensus_confidence: float,
) -> PredictionRecord:
    record = PredictionRecord(
        input_data=loan_input.model_dump(),
        predictions=[prediction.model_dump() for prediction in predictions],
        consensus=consensus,
        consensus_confidence=consensus_confidence,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_predictions(db: Session, decision: str | None = None) -> list[HistoryItem]:
    statement = select(PredictionRecord)
    if decision in {"Approved", "Rejected"}:
        statement = statement.where(PredictionRecord.consensus == decision)
    statement = statement.order_by(desc(PredictionRecord.timestamp))
    records = db.scalars(statement).all()
    return [_to_history_item(record) for record in records]


def get_prediction(db: Session, prediction_id: int) -> HistoryItem | None:
    record = db.get(PredictionRecord, prediction_id)
    if record is None:
        return None
    return _to_history_item(record)


def _to_history_item(record: PredictionRecord) -> HistoryItem:
    return HistoryItem(
        id=record.id,
        timestamp=record.timestamp,
        input=LoanInput(**record.input_data),
        predictions=[ModelPrediction(**prediction) for prediction in record.predictions],
        consensus=record.consensus,
        consensus_confidence=record.consensus_confidence,
    )
