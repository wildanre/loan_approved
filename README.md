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

## Menjalankan Backend dengan Docker

```bash
docker compose up -d --build
```

Backend berjalan di `http://localhost:8000`.

Database SQLite dipersistenkan di volume Docker `backend_data`.

## Deploy Backend ke VPS

Contoh untuk VPS Ubuntu:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Upload project ke VPS, lalu jalankan:

```bash
cd loan_approved
docker compose up -d --build
docker compose logs -f backend
```

Cek health:

```bash
curl http://SERVER_IP:8000/api/health
```

Jika memakai firewall:

```bash
sudo ufw allow 8000/tcp
```

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
