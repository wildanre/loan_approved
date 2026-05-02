import { X } from "lucide-react";
import { formatPercent, formatRupee } from "../utils/currency.js";
import { INPUT_LABELS, MONEY_FIELD_NAMES } from "../constants/fields.js";
import { BEST_MODEL_NAME } from "../constants/models.js";

/**
 * Modal to display detailed information about a specific prediction record.
 * Shows both the input data and the outputs from all evaluated models.
 */
function DetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-modal="true"
      role="dialog"
    >
      <div className="card max-h-[88vh] w-full max-w-3xl overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-sm rounded-t-2xl">
          <div>
            <span className="section-label">Detail Prediksi</span>
            <h2 className="mt-0.5 text-lg font-bold text-ink">
              Prediction #{item.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Left: Input data */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              Input Nasabah
            </h3>
            <div className="space-y-1.5">
              {Object.entries(item.input).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-2.5"
                >
                  <span className="text-xs text-slate-500">
                    {INPUT_LABELS[key] ?? key}
                  </span>
                  <strong className="text-xs text-slate-800 text-right">
                    {MONEY_FIELD_NAMES.has(key) ? formatRupee(value) : value}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          {/* Right: Model outputs */}
          <section className="flex flex-col">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              Output Model
            </h3>
            
            <div className="space-y-4">
              {/* Best Model Section */}
              <div className="space-y-2.5">
                {(() => {
                  const prediction = item.predictions.find(p => p.model === BEST_MODEL_NAME);
                  if (!prediction) return null;
                  const approved = prediction.label === "Approved";
                  
                  return (
                    <div className="rounded-xl border-2 border-amber-100 bg-white p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-200" />
                      <div className="flex items-center justify-between mb-3 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          Best Model
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          {prediction.model}
                        </span>
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                            approved
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {prediction.label}
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full animated-bar"
                          style={{
                            width: `${prediction.probability * 100}%`,
                            background: approved ? "#16a34a" : "#dc2626",
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-right text-xs text-slate-400 font-medium">
                        {formatPercent(prediction.probability)}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Other Models */}
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <span className="h-px flex-1 bg-slate-100" />
                  Other Models
                  <span className="h-px flex-1 bg-slate-100" />
                </p>
                <div className="space-y-2.5">
                  {item.predictions.filter(p => p.model !== BEST_MODEL_NAME).map((prediction) => {
                    const approved = prediction.label === "Approved";
                    return (
                      <div
                        key={prediction.model}
                        className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-600">
                            {prediction.model}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              approved
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {prediction.label}
                          </span>
                        </div>
                        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full animated-bar"
                            style={{
                              width: `${prediction.probability * 100}%`,
                              background: approved ? "#4ade80" : "#f87171",
                            }}
                          />
                        </div>
                        <p className="mt-1 text-right text-[11px] text-slate-400 font-medium">
                          {formatPercent(prediction.probability)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Consensus summary */}
              <div
                className={`rounded-xl p-4 mt-1 ${
                  item.consensus === "Approved"
                    ? "bg-emerald-50 border border-emerald-100"
                    : "bg-red-50 border border-red-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Konsensus
                  </span>
                  <span
                    className={`text-sm font-black ${
                      item.consensus === "Approved"
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {item.consensus}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Rata-rata confidence:{" "}
                  <strong>{formatPercent(item.consensus_confidence)}</strong>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
