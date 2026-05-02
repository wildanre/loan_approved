import { Database, Layers, Code2 } from "lucide-react";
import { MODEL_COLORS } from "../constants/models.js";

const techStack = [
  { name: "React 18", group: "Frontend" },
  { name: "Vite 5", group: "Frontend" },
  { name: "Tailwind CSS", group: "Frontend" },
  { name: "Recharts", group: "Frontend" },
  { name: "FastAPI", group: "Backend" },
  { name: "SQLite", group: "Backend" },
  { name: "SQLAlchemy", group: "Backend" },
  { name: "scikit-learn", group: "ML" },
  { name: "LightGBM", group: "ML" },
  { name: "CatBoost", group: "ML" },
];

const groupColors = {
  Frontend: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  Backend: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
  ML: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
};

const datasetRows = [
  { label: "Nama Dataset", value: "Loan Approval Dataset" },
  { label: "Jumlah Data", value: "4.269 baris" },
  { label: "Mata Uang", value: "Indian Rupee (₹)" },
  { label: "Skor Kredit", value: "CIBIL Score 300–900" },
  { label: "Target Label", value: "Approved / Rejected" },
];

/**
 * About page displaying application information, dataset details, and tech stack.
 */
function AboutPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <span className="section-label">Tentang</span>
        <h1 className="mt-1 text-2xl font-black text-ink">LoanSight</h1>
        <p className="mt-1 text-sm text-slate-500">
          Demonstrasi skripsi — klasifikasi kelayakan pinjaman berbasis Machine Learning.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* About card */}
        <section className="card p-6 space-y-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Layers size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Deskripsi Aplikasi</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              LoanSight mengintegrasikan empat algoritma klasifikasi ML untuk
              memprediksi kelayakan pengajuan pinjaman secara real-time. Setiap
              prediksi menyajikan label, confidence score, dan keputusan
              konsensus mayoritas.
            </p>
          </div>

          {/* Model list */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Model Algoritma
            </p>
            {Object.entries(MODEL_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-3">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-sm font-semibold text-slate-700">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Dataset card */}
        <section className="card p-6 space-y-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Database size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Informasi Dataset</h2>
          </div>
          <div className="space-y-2">
            {datasetRows.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3"
              >
                <span className="text-xs text-slate-500">{label}</span>
                <strong className="text-xs text-slate-800">{value}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack card – full width */}
        <section className="card p-6 lg:col-span-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Code2 size={24} className="text-primary" />
          </div>
          <h2 className="text-lg font-bold text-ink mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map(({ name, group }) => {
              const style = groupColors[group];
              return (
                <span
                  key={name}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${style.bg} ${style.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {name}
                </span>
              );
            })}
          </div>
          <div className="mt-4 flex gap-4 flex-wrap">
            {Object.entries(groupColors).map(([group, style]) => (
              <span key={group} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                {group}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
