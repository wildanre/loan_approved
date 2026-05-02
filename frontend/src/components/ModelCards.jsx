import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { formatPercent } from "../utils/currency.js";
import { MODEL_COLORS, BEST_MODEL_NAME } from "../constants/models.js";

/**
 * Card component for displaying the best performing model prominently.
 */
function BestModelCard({ prediction }) {
  if (!prediction) return null;
  const approved = prediction.label === "Approved";
  const accent = MODEL_COLORS[prediction.model] ?? "#D97706";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card relative overflow-hidden"
    >
      {/* Accent gradient top */}
      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(to right, ${accent}, ${accent}88)`,
        }}
      />

      <div className="p-6">
        {/* Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${accent}18` }}>
              <Crown size={16} style={{ color: accent }} />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Best Model
              </span>
            </div>
          </div>
          <span
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              approved
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {formatPercent(prediction.probability)}
          </span>
        </div>

        {/* Model name & label */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {prediction.model}
          </p>
          <h3
            className="mt-2 text-3xl font-black"
            style={{ color: approved ? "#16a34a" : "#dc2626" }}
          >
            {prediction.label}
          </h3>
        </div>

        {/* Confidence bar */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500">Confidence</span>
            <span className="text-xs font-bold text-slate-700">
              {formatPercent(prediction.probability)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="animated-bar h-full rounded-full"
              style={{
                width: `${prediction.probability * 100}%`,
                background: approved
                  ? "linear-gradient(to right, #4ade80, #16a34a)"
                  : "linear-gradient(to right, #f87171, #dc2626)",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Card component for displaying other evaluated models.
 */
function OtherModelCard({ prediction, index }) {
  const approved = prediction.label === "Approved";
  const accent = MODEL_COLORS[prediction.model] ?? "#256DB1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06 }}
      className="card relative overflow-hidden p-5"
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between gap-2 mt-1">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 truncate">
            {prediction.model}
          </p>
          <h3
            className="mt-1.5 text-xl font-black"
            style={{ color: approved ? "#16a34a" : "#dc2626" }}
          >
            {prediction.label}
          </h3>
        </div>
        <span
          className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            approved
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {formatPercent(prediction.probability)}
        </span>
      </div>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="animated-bar h-full rounded-full"
            style={{
              width: `${prediction.probability * 100}%`,
              background: approved
                ? "linear-gradient(to right, #4ade80, #16a34a)"
                : "linear-gradient(to right, #f87171, #dc2626)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Display grid of predictions from different models, highlighting the best one.
 */
function ModelCards({ predictions = [] }) {
  const bestPrediction = predictions.find((p) => p.model === BEST_MODEL_NAME);
  const otherPredictions = predictions.filter((p) => p.model !== BEST_MODEL_NAME);

  return (
    <div className="space-y-4">
      {/* Best Model – featured */}
      {bestPrediction && <BestModelCard prediction={bestPrediction} />}

      {/* Other Models */}
      {otherPredictions.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="h-px flex-1 bg-slate-200" />
            Other Models
            <span className="h-px flex-1 bg-slate-200" />
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {otherPredictions.map((prediction, index) => (
              <OtherModelCard
                key={prediction.model}
                prediction={prediction}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelCards;
