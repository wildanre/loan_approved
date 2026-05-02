import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { predictLoan } from "../api/client.js";
import ComparisonChart from "../components/ComparisonChart.jsx";
import ConsensusBanner from "../components/ConsensusBanner.jsx";
import ModelCards from "../components/ModelCards.jsx";
import PredictionForm from "../components/PredictionForm.jsx";
import { ALGORITHM_LIST } from "../constants/models.js";

/**
 * Placeholder component displayed before any prediction is made.
 */
function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white border border-slate-100 p-10 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Brain size={32} className="text-primary" />
      </div>
      <span className="section-label">Real-time Inference</span>
      <h2 className="mt-3 max-w-sm text-2xl font-black text-slate-900 leading-snug">
        Empat algoritma ML dalam satu keputusan
      </h2>
      <p className="mt-3 max-w-md text-sm text-slate-500 leading-relaxed">
        Isi form di atas dan klik <strong>Prediksi Sekarang</strong> untuk
        mendapatkan label, confidence, dan konsensus mayoritas dari:
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {ALGORITHM_LIST.map((name) => (
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

/**
 * Main prediction page connecting the input form to the prediction API
 * and displaying the resulting models' evaluations.
 */
function PredictPage() {
  const queryClient = useQueryClient();
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
      // Invalidate history cache to ensure fresh data on next visit
      queryClient.invalidateQueries({ queryKey: ["history"] });
    } catch (err) {
      setError(
        err.response?.data?.detail ??
          err.message ??
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
    <div className="space-y-8">

      {/* Form – full width */}
      <PredictionForm
        values={values}
        setValues={setValues}
        onSubmit={handleSubmit}
        loading={loading}
        onReset={handleReset}
        hasResult={Boolean(result)}
      />

      {/* Results */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {result ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ConsensusBanner result={result} />
          <ModelCards predictions={result.predictions} />
          <ComparisonChart predictions={result.predictions} />
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default PredictPage;
