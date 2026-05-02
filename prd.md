# Product Requirements Document
## Aplikasi Web Klasifikasi Kelayakan Pinjaman Nasabah
### LoanSight — ML-Powered Loan Approval Classifier

| | |
|---|---|
| **Versi** | v1.0.0 — Draft |
| **Tanggal** | Mei 2026 |
| **Penulis** | Danu — Universitas AMIKOM Yogyakarta |
| **Frontend** | React 18 + Vite 5 · Light Theme · Tailwind CSS |
| **Backend** | FastAPI (Python 3.11) |
| **Model** | Logistic Regression · Random Forest · LightGBM · CatBoost |
| **Dataset** | Loan Approval Dataset · Mata uang: Indian Rupee (₹) |

---

## 1. Ringkasan Eksekutif

LoanSight adalah aplikasi web berbasis machine learning yang mengintegrasikan empat algoritma klasifikasi — Logistic Regression, Random Forest, LightGBM, dan CatBoost — untuk memprediksi kelayakan pinjaman nasabah secara real-time. Aplikasi ini dikembangkan sebagai demonstrasi hasil penelitian skripsi dan menyajikan perbandingan performa antar-algoritma secara interaktif.

> **Catatan Dataset:** Dataset yang digunakan adalah *Loan Approval Dataset* berbasis India. Seluruh nilai moneter (pendapatan tahunan, jumlah pinjaman, nilai aset) menggunakan satuan **Indian Rupee (₹)**. Skor kredit menggunakan **CIBIL Score** (300–900), yang merupakan sistem penilaian kredit standar di India.

### Tujuan Produk

- Mengubah model ML yang sudah dilatih (`.pkl`) menjadi aplikasi yang dapat dioperasikan melalui browser.
- Memvisualisasikan dan membandingkan hasil prediksi dari keempat algoritma secara bersamaan.
- Menyimpan riwayat prediksi untuk analisis perbandingan antar-nasabah.
- Menampilkan metrik evaluasi model dalam dashboard yang informatif dan visual.

### Ruang Lingkup

| Modul | Deskripsi |
|---|---|
| Form Input & Prediksi | Input data nasabah, tampilkan output ke-4 model |
| Perbandingan Model | Panel 4 card berdampingan dengan probability bar |
| History Prediksi | Tabel riwayat + filter + export CSV |
| Dashboard Metrik | Accuracy/F1/Precision/Recall + confusion matrix |

---

## 2. Target Pengguna

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| Penguji Sidang | Dosen penguji dan pembimbing skripsi yang mengevaluasi penelitian. | Metrik jelas, perbandingan model mudah dibaca. |
| Peserta Demo | Audiens presentasi akademik yang melihat implementasi ML. | UI intuitif, respons cepat, visualisasi menarik. |

---

## 3. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Frontend Framework | React 18 + Vite 5 | SPA, fast HMR, light theme |
| UI Library | Tailwind CSS + shadcn/ui | Komponen siap pakai, responsif |
| HTTP Client | Axios | Komunikasi FE ke BE |
| Backend Framework | FastAPI (Python 3.11) | Async, auto Swagger docs |
| ML Runtime | scikit-learn + LightGBM + CatBoost | Load & serve model `.pkl` |
| Database | SQLite + SQLAlchemy | Simpan riwayat prediksi |

---

## 4. Arsitektur Sistem

Arsitektur dua lapis: Frontend (React + Vite) berkomunikasi dengan Backend (FastAPI) melalui REST API. Backend memuat model `.pkl` saat startup dan melayani inferensi dari ke-4 algoritma secara paralel.

```
Browser (React + Vite)
        │  HTTP REST
        ▼
FastAPI Backend
  ├── /api/predict  ──► [LR · RF · LightGBM · CatBoost] (.pkl)
  ├── /api/history  ──► SQLite DB
  └── /api/metrics  ──► JSON hardcoded (hasil notebook)
```

### Alur Data Prediksi

1. User mengisi form di browser → klik **"Prediksi"**.
2. Frontend kirim `POST /api/predict` dengan payload JSON fitur nasabah.
3. Backend preprocessing → jalankan ke-4 model → simpan ke database.
4. Backend kembalikan response JSON (4 hasil + konsensus).
5. Frontend render card hasil, probability bar, dan rekomendasi konsensus.

---

## 5. Fitur & Requirements

### 5.1 Form Input & Prediksi

Halaman utama. User memasukkan data nasabah dan mendapatkan prediksi dari keempat model.

**Field Input (sesuai fitur dataset):**

| Field | Nama Tampilan | Tipe | Keterangan |
|---|---|---|---|
| `no_of_dependents` | Jumlah Tanggungan | Integer | 0–5 orang |
| `education` | Pendidikan | Dropdown | Graduate / Not Graduate |
| `self_employed` | Pekerjaan Mandiri | Toggle | Yes / No |
| `income_annum` | Pendapatan Tahunan | Number (₹) | Contoh: ₹5.100.000 |
| `loan_amount` | Jumlah Pinjaman | Number (₹) | Contoh: ₹14.500.000 |
| `loan_term` | Jangka Waktu | Integer (tahun) | 2–20 tahun |
| `cibil_score` | Skor CIBIL | Integer | 300–900 |
| `residential_assets_value` | Nilai Aset Residensial | Number (₹) | Bisa 0 |
| `commercial_assets_value` | Nilai Aset Komersial | Number (₹) | Bisa 0 |
| `luxury_assets_value` | Nilai Aset Mewah | Number (₹) | Bisa 0 |
| `bank_asset_value` | Nilai Aset Bank | Number (₹) | Bisa 0 |

> **Catatan UI:** Semua field nilai moneter menggunakan prefiks **₹** dan format ribuan (contoh: `₹ 5.100.000`).  
> CIBIL Score adalah skor kredit standar India; tampilkan tooltip penjelasan singkat di sebelah field.

**Acceptance Criteria**

- Validasi input: field wajib diisi; `cibil_score` harus dalam range 300–900; nilai aset boleh 0 tapi tidak boleh negatif.
- Tombol "Prediksi" nonaktif jika ada field wajib yang kosong atau nilai di luar range.
- Hasil prediksi muncul dalam **≤ 2 detik** setelah submit.
- Setiap model menampilkan: label (**Approved** / **Rejected**), confidence (%), indikator warna (hijau = Approved, merah = Rejected).
- Section **"Konsensus"** merangkum keputusan mayoritas keempat model.

---

### 5.2 Perbandingan Model

Panel perbandingan output keempat algoritma secara berdampingan setelah prediksi dilakukan.

**Acceptance Criteria**

- Empat card sejajar (2×2 grid di tablet) menampilkan: nama algoritma, prediksi, probabilitas.
- Card model dengan confidence tertinggi diberi border highlight biru.
- Bar chart horizontal memvisualisasikan probability approval ke-4 model sekaligus.
- Tombol **"Reset"** membersihkan form dan hasil prediksi.

---

### 5.3 History Prediksi

Halaman riwayat semua prediksi yang tersimpan di database.

**Acceptance Criteria**

- Tabel memuat kolom: No, Waktu, Jumlah Pinjaman (₹), CIBIL Score, LR, RF, LightGBM, CatBoost, Konsensus.
- Data diurutkan dari yang terbaru (DESC). Pagination 20 baris per halaman.
- Filter dropdown: semua / hanya Approved / hanya Rejected.
- Tombol **"Export CSV"** mengunduh seluruh riwayat.
- Klik baris membuka modal detail input lengkap + output prediksi.

---

### 5.4 Dashboard Metrik Model

Halaman performa keempat model berdasarkan evaluasi test set dari notebook.

**Acceptance Criteria**

- Tab **"Baseline"** dan **"Tuning"** untuk memilih versi model.
- Summary card per model: Accuracy, Precision, Recall, F1-Score.
- Grouped bar chart membandingkan keempat metrik untuk keempat model.
- Confusion matrix 2×2 per model: TN, FP, FN, TP.
- Data metrik bersumber dari JSON hardcoded (hasil notebook), tidak re-evaluate saat runtime.

---

## 6. Desain API (FastAPI)

**Base URL:** `http://localhost:8000/api`

| Method | Endpoint | Deskripsi | Response |
|---|---|---|---|
| `POST` | `/predict` | Inferensi ke-4 model sekaligus | `{ predictions, consensus, id }` |
| `GET` | `/history` | Ambil seluruh riwayat prediksi | `[{ id, timestamp, input, result }]` |
| `GET` | `/history/{id}` | Detail satu prediksi berdasarkan ID | `{ id, input, predictions }` |
| `GET` | `/metrics` | Metrik evaluasi model (dari notebook) | `{ baseline: {}, tuning: {} }` |
| `GET` | `/health` | Health check | `{ status: "ok" }` |

### Contoh Request — `POST /api/predict`

```json
{
  "no_of_dependents": 3,
  "education": "Graduate",
  "self_employed": "No",
  "income_annum": 5100000,
  "loan_amount": 14500000,
  "loan_term": 10,
  "cibil_score": 600,
  "residential_assets_value": 5600000,
  "commercial_assets_value": 3700000,
  "luxury_assets_value": 14600000,
  "bank_asset_value": 4600000
}
```

> Semua nilai moneter dalam satuan **Indian Rupee (₹)**, tanpa simbol, tanpa pemisah ribuan.

### Contoh Response — `POST /api/predict`

```json
{
  "predictions": [
    { "model": "Logistic Regression", "label": "Approved", "probability": 0.7234 },
    { "model": "Random Forest",       "label": "Approved", "probability": 0.9531 },
    { "model": "LightGBM",            "label": "Approved", "probability": 0.9965 },
    { "model": "CatBoost",            "label": "Approved", "probability": 0.9532 }
  ],
  "consensus": "Approved",
  "consensus_confidence": 0.9056,
  "prediction_id": 42
}
```

---

## 7. Desain UI/UX

### Prinsip Desain

- **Light theme:** background putih/abu muda (`#F8FAFC`), aksen biru (`#256DB1`), teks gelap (`#444`).
- **Clean & minimal:** tidak ada elemen dekoratif berlebihan, fokus pada data dan keterbacaan.
- **Responsif:** mendukung desktop (≥ 1280 px) dan tablet (≥ 768 px).
- **Feedback visual:** loading spinner saat prediksi, toast notifikasi sukses/error.
- **Format mata uang:** tampilkan nilai moneter dengan simbol ₹ dan pemisah ribuan (contoh: `₹ 14.500.000`).

### Navigasi & Halaman

| Route | Halaman | Komponen Utama |
|---|---|---|
| `/` | Beranda / Prediksi | `PredictionForm`, `ModelCards`, `ConsensusBanner` |
| `/history` | History Prediksi | `HistoryTable`, `FilterDropdown`, `ExportButton` |
| `/dashboard` | Dashboard Metrik | `MetricCards`, `ComparisonChart`, `ConfusionMatrix` |
| `/about` | Tentang | `SkripsiInfo`, `ModelInfo`, `TechStackBadge` |

### Palet Warna

| Nama | Hex | Penggunaan |
|---|---|---|
| Primary Blue | `#256DB1` | Tombol utama, aksen, heading |
| Light Blue | `#D6E8F7` | Background card, header tabel |
| Success Green | `#27AE60` | Label Approved |
| Danger Red | `#C0392B` | Label Rejected |
| Background | `#F8FAFC` | Page background (light theme) |

---

## 8. Struktur Folder Project

### Frontend — `loansight-fe/`

```
loansight-fe/
├── src/
│   ├── components/
│   │   ├── PredictionForm.jsx
│   │   ├── ModelCards.jsx
│   │   ├── ComparisonChart.jsx
│   │   ├── HistoryTable.jsx
│   │   └── MetricDashboard.jsx
│   ├── pages/
│   │   ├── PredictPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── AboutPage.jsx
│   ├── api/
│   │   └── client.js          # Axios instance + semua fungsi API call
│   ├── utils/
│   │   └── currency.js        # Format angka ke ₹ (Indian Rupee)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── tailwind.config.js
```

### Backend — `loansight-be/`

```
loansight-be/
├── app/
│   ├── main.py                # Entry point FastAPI + CORS middleware
│   ├── routers/
│   │   ├── predict.py         # POST /api/predict
│   │   ├── history.py         # GET  /api/history, /history/{id}
│   │   └── metrics.py         # GET  /api/metrics
│   ├── models/
│   │   └── schemas.py         # Pydantic request/response schemas
│   ├── db/
│   │   ├── database.py        # SQLAlchemy engine + session
│   │   └── crud.py            # Operasi database
│   └── ml/
│       ├── loader.py          # Load .pkl saat startup
│       └── predictor.py       # Jalankan inferensi ke-4 model
├── models_pkl/
│   ├── logreg_model.pkl
│   ├── rf_model.pkl
│   ├── lgbm_model.pkl
│   └── catboost_model.pkl
├── requirements.txt
└── README.md
```

---

## 9. Non-Functional Requirements

| Kategori | Requirement | Target |
|---|---|---|
| Performa | Response time prediksi (ke-4 model) | < 2 detik |
| Performa | Page load time awal | < 3 detik |
| Kompatibilitas | Browser yang didukung | Chrome 100+, Firefox 100+, Edge 100+ |
| Kompatibilitas | Resolusi minimum | 768 × 1024 px (tablet landscape) |
| Reliabilitas | Uptime selama sesi demo | 100% (environment lokal) |
| Kemudahan Setup | Instalasi & menjalankan secara lokal | Maksimal 3 perintah terminal |

---

## 10. Out of Scope

| Fitur | Alasan Dikecualikan |
|---|---|
| Autentikasi & manajemen user | Tidak diperlukan untuk demo akademik |
| Deployment ke cloud (AWS/GCP) | Di luar scope skripsi, cukup environment lokal |
| Retraining model dari UI | Model sudah final dari hasil notebook penelitian |
| Multi-bahasa (i18n) | Aplikasi khusus audiens Indonesia |
| Upload dataset baru | Dataset sudah fixed sesuai penelitian skripsi |
| Konversi mata uang (₹ ke Rp/USD) | Di luar scope; dataset native menggunakan ₹ |

---

## 11. Milestone & Roadmap

| Fase | Deliverable | Estimasi |
|---|---|---|
| Fase 1 — Setup | Inisialisasi project FE + BE, koneksi API dasar, load model `.pkl` | 3 hari |
| Fase 2 — Core | Form prediksi + endpoint `/predict` + tampilan 4 model card + chart | 5 hari |
| Fase 3 — History | Tabel history + database SQLite + filter + export CSV | 3 hari |
| Fase 4 — Dashboard | Dashboard metrik + grouped bar chart + confusion matrix per model | 4 hari |

**Total estimasi: ~15 hari kerja**

---

## Appendix — Ringkasan Dataset

| Atribut | Detail |
|---|---|
| Nama Dataset | Loan Approval Dataset |
| Jumlah Data | 4.269 baris |
| Mata Uang | Indian Rupee (₹) |
| Sistem Kredit | CIBIL Score (300–900) |
| Target | `loan_status`: Approved / Rejected |
| Range Pendapatan | ₹200.000 – ₹9.900.000 / tahun |
| Range Jumlah Pinjaman | ₹300.000 – ₹39.500.000 |
| Range Jangka Waktu | 2–20 tahun |

---

*Dokumen ini merupakan bagian dari penelitian skripsi Universitas AMIKOM Yogyakarta.*