import { useEffect, useState } from "react";
import { fetchMetrics } from "../api/client.js";
import MetricDashboard from "../components/MetricDashboard.jsx";

function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [mode, setMode] = useState("baseline");

  useEffect(() => {
    fetchMetrics().then(setMetrics).catch(() => setMetrics(null));
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-label">Dashboard Metrik</span>
          <h1 className="mt-1 text-2xl font-black text-ink">
            Evaluasi Model Klasifikasi
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Metrik bersumber dari hasil evaluasi notebook — JSON hardcoded.
          </p>
        </div>

        {/* Toggle baseline / tuning */}
        <div className="flex self-start sm:self-auto rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
          {["baseline", "tuning"].map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded-lg px-4 py-2 text-sm font-bold capitalize transition-all duration-150 ${
                mode === item
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {metrics ? (
        <MetricDashboard data={metrics[mode]} />
      ) : (
        <div className="card flex h-48 items-center justify-center text-sm text-slate-400">
          Metrics belum tersedia atau backend tidak aktif.
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
