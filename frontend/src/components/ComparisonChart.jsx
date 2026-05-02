import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPercent } from "../utils/currency.js";

function ComparisonChart({ predictions = [] }) {
  const data = predictions.map((p) => ({
    model: p.model.replace("Logistic Regression", "LogReg"),
    Probability: Number((p.probability * 100).toFixed(2)),
    approved: p.label === "Approved",
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg text-sm">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <p
          className="font-semibold"
          style={{ color: payload[0].payload.approved ? "#16a34a" : "#dc2626" }}
        >
          {formatPercent(Number(payload[0].value) / 100)}
        </p>
      </div>
    );
  };

  return (
    <section className="card p-5">
      <div className="mb-5">
        <span className="section-label">Perbandingan Model</span>
        <h2 className="mt-1.5 text-base font-bold text-ink">
          Probability Approval per Model
        </h2>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="model"
              width={72}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(37,109,177,0.05)" }} />
            <Bar
              dataKey="Probability"
              radius={[0, 8, 8, 0]}
              fill="#256DB1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ComparisonChart;
