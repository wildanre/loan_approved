import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BarChart2, Brain } from "lucide-react";
import { predictLoan } from "../api/client.js";
import ComparisonChart from "../components/ComparisonChart.jsx";
import ConsensusBanner from "../components/ConsensusBanner.jsx";
import ModelCards from "../components/ModelCards.jsx";
import PredictionForm from "../components/PredictionForm.jsx";

const ALGO_LIST = ["Logistic Regression", "Random Forest", "LightGBM", "CatBoost"];

function EmptyState() {
  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center rounded-2xl bg-white border border-slate-100 p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Brain size={32} className="text-primary" />
      </div>
      <span className="section-label">Real-time Inference</span>
      <h2 className="mt-3 max-w-sm text-2xl font-black text-slate-900 leading-snug">
        Empat algoritma ML dalam satu keputusan
      </h2>
      <p className="mt-3 max-w-sm text-sm text-slate-500 leading-relaxed">
        Isi form di kiri dan klik <strong>Prediksi Sekarang</strong> untuk
        mendapatkan label, confidence, dan konsensus mayoritas dari:
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {ALGO_LIST.map((name) => (
          <span
            key={name}
            className="rounded-full bg-lightBlue px-3 py-1.5 text-xs font-semibold text-primary"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function PredictPage() {
  const [values, setValues] = useState(PredictionForm.defaultValues);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await predictLoan(values);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          "Gagal memproses prediksi. Pastikan backend berjalan."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (nextValues) => {
    setValues(nextValues);
    setResult(null);
    setError("");
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <span className="section-label">Prediksi Pinjaman</span>
        <h1 className="mt-1 text-2xl font-black text-ink">
          Simulasi Kelayakan Nasabah
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Input data nasabah dan bandingkan hasil keempat algoritma sekaligus.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        {/* Form panel */}
        <div>
          <PredictionForm
            values={values}
            setValues={setValues}
            onSubmit={handleSubmit}
            loading={loading}
            onReset={handleReset}
            hasResult={Boolean(result)}
          />
        </div>

        {/* Result panel */}
        <div className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <ConsensusBanner result={result} />
              <ModelCards predictions={result.predictions} />
              <ComparisonChart predictions={result.predictions} />
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

export default PredictPage;
