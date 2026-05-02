# LoanSight

Aplikasi web klasifikasi kelayakan pinjaman nasabah sesuai `prd.md`.

## Struktur

- `backend/` — FastAPI, SQLite, loader model `.joblib`, endpoint REST.
- `frontend/` — React 18 + Vite 5, Tailwind CSS, dashboard prediksi dan metrik.

## Menjalankan Backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

Backend berjalan di `http://localhost:8000`.

## Menjalankan Frontend

```bash
cd frontend
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

## Model ML

Letakkan model `.joblib` final di `backend/models/`:

- `logistic_regression_tuned.joblib`
- `random_forest_tuned.joblib`
- `lightgbm_tuned.joblib`
- `catboost_tuned.joblib`

Jika model belum tersedia, backend memakai fallback predictor deterministik agar demo tetap bisa dijalankan end-to-end.

## Preprocessing Backend

Feature engineering backend mengikuti notebook `analisis_komparasi_algoritma_loan_approval.ipynb`:

- `total_assets_value = residential_assets_value + commercial_assets_value + luxury_assets_value + bank_asset_value`
- `rasio_pinjaman_pendapatan = loan_amount / income_annum`
- `rasio_agunan_pinjaman = total_assets_value / loan_amount`
