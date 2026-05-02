from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import init_db
from app.ml.loader import load_models
from app.ml.predictor import LoanPredictor
from app.models.schemas import HealthResponse
from app.routers import history, metrics, predict


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    app.state.predictor = LoanPredictor(load_models())
    yield


app = FastAPI(
    title="LoanSight API",
    version="1.0.0",
    description="FastAPI backend for ML-powered loan approval classification.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(history.router)
app.include_router(metrics.router)


@app.get("/api/health", response_model=HealthResponse, tags=["health"])
def health_check() -> HealthResponse:
    return HealthResponse(status="ok")
