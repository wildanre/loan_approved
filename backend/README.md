# LoanSight Backend

FastAPI backend untuk klasifikasi kelayakan pinjaman nasabah.

## Menjalankan

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API tersedia di `http://localhost:8000/api`.

## Menjalankan dengan Docker

Dari root project:

```bash
docker compose up -d --build
```

API tersedia di `http://localhost:3001/api`.

Database SQLite disimpan di volume Docker `backend_data` melalui path container `/app/data/loansight.db`.

## Redeploy ke VPS

Dari root project:

```bash
./scripts/deploy-backend-vps.sh
```

Endpoint production:

- `https://api-loansight.staifdev.codes/api`
- health check: `https://api-loansight.staifdev.codes/api/health`

Perintah operasional:

```bash
docker compose logs -f backend
docker compose restart backend
docker compose down
```

## Model `.joblib`

Letakkan model final di `models/`:

- `logistic_regression_tuned.joblib`
- `random_forest_tuned.joblib`
- `lightgbm_tuned.joblib`
- `catboost_tuned.joblib`

Jika file belum ada, backend memakai fallback predictor deterministik agar demo end-to-end tetap bisa berjalan.

## Preprocessing

Feature engineering mengikuti notebook `analisis_komparasi_algoritma_loan_approval.ipynb`:

- `total_assets_value = residential_assets_value + commercial_assets_value + luxury_assets_value + bank_asset_value`
- `rasio_pinjaman_pendapatan = loan_amount / income_annum`
- `rasio_agunan_pinjaman = total_assets_value / loan_amount`
