import { formatPercent } from "../utils/currency.js";

function ConsensusBanner({ result }) {
  if (!result) return null;
  const approved = result.consensus === "Approved";

  return (
    <section
      className={`relative overflow-hidden rounded-2xl p-6 ${
        approved
          ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
          : "bg-gradient-to-br from-red-500 to-rose-600"
      } text-white shadow-lg`}
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, white 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-4 h-28 w-28 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, white 0%, transparent 70%)",
        }}
      />

      <div className="relative">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
          Konsensus Mayoritas
        </span>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-black leading-none tracking-tight">
              {result.consensus}
            </h2>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">
              Keputusan mayoritas dari 4 algoritma ·{" "}
              <strong className="text-white">
                {formatPercent(result.consensus_confidence)}
              </strong>{" "}
              rata-rata confidence
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold backdrop-blur-sm">
              Prediction #{result.prediction_id}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsensusBanner;
