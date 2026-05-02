import { useQuery } from "@tanstack/react-query";
import { fetchMetrics } from "../api/client.js";
import MetricDashboard from "../components/MetricDashboard.jsx";
import { DashboardSkeleton } from "../components/ui/Skeleton.jsx";

/**
 * Dashboard page displaying evaluation metrics of the currently deployed ML models.
 */
function DashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const data = await fetchMetrics();
      return data.tuning || data.baseline || data;
    },
  });

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
            Metrik performa dari model klasifikasi yang saat ini berjalan di backend.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex self-start sm:self-auto rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 gap-2 items-center">
          <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-xs font-bold text-emerald-700">Tuned Models Deployed</span>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : metrics && Object.keys(metrics).length > 0 ? (
        <MetricDashboard data={metrics} />
      ) : (
        <div className="card flex h-48 items-center justify-center text-sm text-slate-400">
          Metrics belum tersedia atau backend tidak aktif.
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
