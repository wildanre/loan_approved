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
      <section className="card p-8 overflow-x-auto">
        <h2 className="text-base font-bold text-ink text-center mb-8">
          Confusion Matrix Model Setelah Hyperparameter Tuning
        </h2>
        <div className="grid sm:grid-cols-2">
          {Object.entries(data).map(([model, metrics]) => {
            const cmValues = Object.values(metrics.confusion_matrix);
            const maxVal = Math.max(...cmValues);

            return (
              <div key={model} className="flex flex-col items-center mb-8">
              <h3 className="text-sm font-semibold text-slate-700 mb-6 text-center">
                {model}
              </h3>
              
              <div className="flex flex-col items-center">
                <div className="flex">
                  {/* Y-axis title */}
                  <div
                    className="flex items-center justify-center mr-2"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    <span className="text-xs font-medium text-slate-700">True label</span>
                  </div>
                  
                  {/* Y-axis ticks */}
                  <div className="flex flex-col justify-around text-xs text-slate-600 mr-2">
                    <span>Ditolak</span>
                    <span>Disetujui</span>
                  </div>

                  {/* Grid */}
                  <div>
                    <div className="grid grid-cols-2 border-t border-l border-slate-300">
                      {Object.entries(metrics.confusion_matrix).map(([key, value]) => {
                        // Dynamic alpha for Blues colormap effect
                        const alpha = maxVal > 0 ? value / maxVal : 0;
                        // Use a slightly darker base blue (like scikit-learn Blues)
                        const bgColor = `rgba(8, 48, 107, ${Math.max(0.02, alpha)})`;
                        const textColor = alpha > 0.4 ? "#ffffff" : "#08306b";

                        return (
                          <div
                            key={key}
                            className="flex items-center justify-center w-28 h-28 border-r border-b border-slate-300 transition-colors"
                            style={{ backgroundColor: bgColor }}
                          >
                            <span className="text-sm" style={{ color: textColor }}>
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* X-axis ticks */}
                    <div className="flex justify-around text-xs text-slate-600 mt-2">
                      <span>Ditolak</span>
                      <span>Disetujui</span>
                    </div>
                  </div>
                </div>

                {/* X-axis title */}
                <div className="mt-2 text-xs font-medium text-slate-700 ml-12">
                  Predicted label
                </div>
              </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default MetricDashboard;
