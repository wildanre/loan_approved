import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPercent, formatRupee, toCsvValue } from "../utils/currency.js";

/**
 * Format a UTC timestamp string to a human-readable date/time string
 * automatically adjusted to the user's local timezone and locale.
 * Example output (WIB): "3 Mei 2025, 17.05.12"
 */
const userLocale = navigator.language || "id-ID";
function formatTimestamp(raw) {
  if (!raw) return "-";
  // Backend stores timestamps without TZ info (assumed UTC); appending 'Z' forces correct parsing.
  const date = new Date(raw.endsWith("Z") ? raw : raw + "Z");
  return date.toLocaleString(userLocale, {
    dateStyle: "medium",
    timeStyle: "medium",
    hour12: false,
  });
}

function HistoryTable({ rows, filter, setFilter, page, setPage, onOpenDetail }) {
  const pageSize = 20;
  const pageCount = Math.max(Math.ceil(rows.length / pageSize), 1);
  const visibleRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const exportCsv = () => {
    const header = ["No", "Waktu", "Jumlah Pinjaman", "CIBIL Score", "LR", "RF", "LightGBM", "CatBoost", "Konsensus"];
    const csvRows = rows.map((row, index) => {
      const predictions = Object.fromEntries(
        row.predictions.map((p) => [p.model, p])
      );
      return [
        index + 1,
        formatTimestamp(row.timestamp),
        row.input.loan_amount,
        row.input.cibil_score,
        predictions["Logistic Regression"]?.label,
        predictions["Random Forest"]?.label,
        predictions.LightGBM?.label,
        predictions.CatBoost?.label,
        row.consensus,
      ]
        .map(toCsvValue)
        .join(",");
    });
    const blob = new Blob([[header.join(","), ...csvRows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "loansight-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filters = ["all", "Approved", "Rejected"];

  return (
    <section className="card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="section-label">History Prediksi</span>
          <h2 className="mt-1 text-lg font-bold text-ink">
            {rows.length} catatan tersimpan
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter tabs */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-150 ${
                  filter === f
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f === "all" ? "Semua" : f}
              </button>
            ))}
          </div>

          <button
            onClick={exportCsv}
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a5490]"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Belum ada data prediksi.
          </div>
        ) : (
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {["No", "Waktu", "Pinjaman", "CIBIL", "LR", "RF", "LGB", "Cat", "Konsensus"].map(
                  (head) => (
                    <th key={head} className="px-4 py-3 whitespace-nowrap">
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleRows.map((row, index) => {
                const preds = Object.fromEntries(
                  row.predictions.map((p) => [p.model, p])
                );
                const approved = row.consensus === "Approved";
                return (
                  <tr
                    key={row.id}
                    onClick={() => onOpenDetail(row)}
                    className="cursor-pointer transition-colors duration-100 hover:bg-slate-50 group"
                  >
                    <td className="px-4 py-3.5 text-slate-400 text-xs">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      {formatTimestamp(row.timestamp)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs whitespace-nowrap">
                      {formatRupee(row.input.loan_amount)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {row.input.cibil_score}
                    </td>
                    <PredCell pred={preds["Logistic Regression"]} />
                    <PredCell pred={preds["Random Forest"]} />
                    <PredCell pred={preds["LightGBM"]} />
                    <PredCell pred={preds["CatBoost"]} />
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          approved
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {row.consensus}
                        <span className="opacity-60">
                          · {formatPercent(row.consensus_confidence)}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <span className="text-xs text-slate-400">
          Halaman <strong className="text-slate-600">{page}</strong> dari{" "}
          <strong className="text-slate-600">{pageCount}</strong>
        </span>
        <div className="flex gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-primary/40 hover:text-primary disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            disabled={page === pageCount}
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-primary/40 hover:text-primary disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

function PredCell({ pred }) {
  if (!pred) return <td className="px-4 py-3.5 text-slate-300 text-xs">—</td>;
  const approved = pred.label === "Approved";
  return (
    <td className="px-4 py-3.5">
      <span
        className={`text-[11px] font-bold ${
          approved ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {approved ? "✓" : "✗"}
      </span>
    </td>
  );
}

export default HistoryTable;
