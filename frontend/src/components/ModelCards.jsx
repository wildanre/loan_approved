import { motion } from "framer-motion";
import { formatPercent } from "../utils/currency.js";

const modelColors = {
  "Logistic Regression": "#256DB1",
  "Random Forest": "#27AE60",
  LightGBM: "#7C3AED",
  CatBoost: "#D97706",
};

function ModelCards({ predictions = [] }) {
  const topConfidence = Math.max(
    ...predictions.map((p) => p.probability),
    0
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {predictions.map((prediction, index) => {
        const approved = prediction.label === "Approved";
        const highlighted = prediction.probability === topConfidence;
        const accent = modelColors[prediction.model] ?? "#256DB1";

        return (
          <motion.div
            key={prediction.model}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className={`card relative overflow-hidden p-5 transition-shadow duration-200 hover:shadow-md ${
              highlighted ? "ring-2 ring-primary/30" : ""
            }`}
          >
            {/* Accent bar on top */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
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
            <div className="mt-4 space-y-1">
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

            {highlighted && (
              <p className="mt-2.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                ★ Confidence Tertinggi
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default ModelCards;
