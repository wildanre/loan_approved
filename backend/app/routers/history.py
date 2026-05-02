from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Query

from app.db import crud
from app.db.database import DbSession
from app.models.schemas import HistoryItem


router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=list[HistoryItem])
def get_history(
    db: DbSession,
    decision: Annotated[Literal["Approved", "Rejected"] | None, Query()] = None,
) -> list[HistoryItem]:
    return crud.list_predictions(db, decision)


@router.get("/{prediction_id}", response_model=HistoryItem)
def get_history_detail(prediction_id: int, db: DbSession) -> HistoryItem:
    record = crud.get_prediction(db, prediction_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return record
