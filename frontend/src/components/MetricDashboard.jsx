import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPercent } from "../utils/currency.js";

const METRIC_COLORS = {
  Accuracy: "#256DB1",
  Precision: "#27AE60",
  Recall: "#7C3AED",
  F1: "#D97706",
};

const METRIC_DESC = {
  Accuracy: "Akurasi keseluruhan",
  Precision: "Ketepatan prediksi positif",
  Recall: "Cakupan prediksi positif",
  F1: "Harmonic mean Precision & Recall",
};

function ScoreBar({ value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full animated-bar"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums w-10 text-right" style={{ color }}>
        {formatPercent(value)}
      </span>
    </div>
  );
}

function MetricDashboard({ data }) {
  if (!data) return null;

  const chartData = Object.entries(data).map(([model, metrics]) => ({
    model: model.replace("Logistic Regression", "LogReg"),
    Accuracy: Number((metrics.accuracy * 100).toFixed(2)),
    Precision: Number((metrics.precision * 100).toFixed(2)),
    Recall: Number((metrics.recall * 100).toFixed(2)),
    F1: Number((metrics.f1_score * 100).toFixed(2)),
  }));

  return (
    <div className="space-y-5">
      {/* Model cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(data).map(([model, metrics]) => (
          <section key={model} className="card p-5 space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {model}
              </p>
              <h3 className="mt-2 text-3xl font-black text-primary">
                {formatPercent(metrics.f1_score)}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">F1-Score</p>
            </div>

            <div className="space-y-2.5">
              {[
                { key: "accuracy", label: "Accuracy", val: metrics.accuracy, color: METRIC_COLORS.Accuracy },
                { key: "precision", label: "Precision", val: metrics.precision, color: METRIC_COLORS.Precision },
                { key: "recall", label: "Recall", val: metrics.recall, color: METRIC_COLORS.Recall },
                { key: "f1", label: "F1", val: metrics.f1_score, color: METRIC_COLORS.F1 },
              ].map(({ key, label, val, color }) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-slate-500 font-medium">{label}</span>
                  </div>
                  <ScoreBar value={val} color={color} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bar chart */}
      <section className="card p-5">
        <div className="mb-5">
          <span className="section-label">Perbandingan Metrik</span>
          <h2 className="mt-1.5 text-base font-bold text-ink">Grouped Metrics Comparison</h2>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="model"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[75, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value}%`]}
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
              />
              {Object.entries(METRIC_COLORS).map(([key, color]) => (
                <Bar key={key} dataKey={key} fill={color} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Confusion matrices */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(data).map(([model, metrics]) => (
          <section key={model} className="card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              {model}{" "}
              <span className="text-slate-400 font-normal">— Confusion Matrix</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              {Object.entries(metrics.confusion_matrix).map(([key, value]) => {
                const isPositive = key === "TP" || key === "TN";
                return (
                  <div
                    key={key}
                    className={`rounded-xl p-4 ${
                      isPositive ? "bg-emerald-50" : "bg-red-50"
                    }`}
                  >
                    <p
                      className={`text-[11px] font-bold uppercase tracking-widest ${
                        isPositive ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {key}
                    </p>
                    <p
                      className={`mt-1 text-2xl font-black ${
                        isPositive ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default MetricDashboard;
