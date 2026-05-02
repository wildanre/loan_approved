import { Info } from "lucide-react";

const defaultValues = {
  no_of_dependents: 3,
  education: "Graduate",
  self_employed: "No",
  income_annum: 5100000,
  loan_amount: 14500000,
  loan_term: 10,
  cibil_score: 600,
  residential_assets_value: 5600000,
  commercial_assets_value: 3700000,
  luxury_assets_value: 14600000,
  bank_asset_value: 4600000,
};

const moneyFields = new Set([
  "income_annum",
  "loan_amount",
  "residential_assets_value",
  "commercial_assets_value",
  "luxury_assets_value",
  "bank_asset_value",
]);

const fields = [
  { name: "no_of_dependents", label: "Jumlah Tanggungan", min: 0, max: 5, unit: "orang" },
  { name: "income_annum", label: "Pendapatan Tahunan", min: 0 },
  { name: "loan_amount", label: "Jumlah Pinjaman", min: 1 },
  { name: "loan_term", label: "Jangka Waktu", min: 2, max: 20, unit: "tahun" },
  { name: "cibil_score", label: "Skor CIBIL", min: 300, max: 900, tooltip: true },
  { name: "residential_assets_value", label: "Aset Residensial", min: 0 },
  { name: "commercial_assets_value", label: "Aset Komersial", min: 0 },
  { name: "luxury_assets_value", label: "Aset Mewah", min: 0 },
  { name: "bank_asset_value", label: "Aset Bank", min: 0 },
];

// Group fields into logical sections
const sections = [
  {
    title: "Data Pribadi",
    fields: ["no_of_dependents", "education", "self_employed"],
  },
  {
    title: "Pinjaman",
    fields: ["loan_amount", "loan_term", "cibil_score"],
  },
  {
    title: "Pendapatan & Aset",
    fields: [
      "income_annum",
      "residential_assets_value",
      "commercial_assets_value",
      "luxury_assets_value",
      "bank_asset_value",
    ],
  },
];

function FieldInput({ field, value, onChange }) {
  const isMoney = moneyFields.has(field.name);
  return (
    <label key={field.name} className="block space-y-1.5">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        {field.label}
        {field.unit && (
          <span className="text-slate-400 font-normal">({field.unit})</span>
        )}
        {field.tooltip && (
          <span
            title="CIBIL Score adalah skor kredit India dengan rentang 300–900. Semakin tinggi skor, semakin baik riwayat kredit."
            className="cursor-help"
          >
            <Info size={13} className="text-primary/70" />
          </span>
        )}
      </span>
      <div className="relative">
        {isMoney && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
            ₹
          </span>
        )}
        <input
          type="number"
          min={field.min}
          max={field.max}
          value={value}
          onChange={onChange}
          className={`input-base ${isMoney ? "pl-7" : ""}`}
        />
      </div>
    </label>
  );
}

function PredictionForm({ values, setValues, onSubmit, loading, onReset, hasResult }) {
  const updateValue = (name, value) => {
    setValues((current) => ({
      ...current,
      [name]:
        moneyFields.has(name) ||
        name.includes("score") ||
        name.includes("term") ||
        name.includes("dependents")
          ? Number(value)
          : value,
    }));
  };

  const isInvalid = fields.some((field) => {
    const value = Number(values[field.name]);
    return (
      Number.isNaN(value) ||
      value < field.min ||
      (field.max !== undefined && value > field.max)
    );
  });

  const fieldMap = Object.fromEntries(fields.map((f) => [f.name, f]));

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-7">
      {/* Header */}
      <div>
        <span className="section-label">Input Nasabah</span>
        <h2 className="mt-2 text-xl font-bold text-ink">Simulasi Kelayakan Pinjaman</h2>
        <p className="mt-1 text-xs text-slate-400 leading-5">
          Semua nilai moneter dalam Indian Rupee (₹).
        </p>
      </div>

      {/* Sectioned fields */}
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {section.title}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {section.fields.map((name) => {
              if (name === "education") {
                return (
                  <label key={name} className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">Pendidikan</span>
                    <select
                      value={values.education}
                      onChange={(e) => updateValue("education", e.target.value)}
                      className="input-base"
                    >
                      <option>Graduate</option>
                      <option>Not Graduate</option>
                    </select>
                  </label>
                );
              }
              if (name === "self_employed") {
                return (
                  <label key={name} className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-600">Wiraswasta</span>
                    <select
                      value={values.self_employed}
                      onChange={(e) => updateValue("self_employed", e.target.value)}
                      className="input-base"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </label>
                );
              }
              const field = fieldMap[name];
              if (!field) return null;
              return (
                <FieldInput
                  key={name}
                  field={field}
                  value={values[name]}
                  onChange={(e) => updateValue(name, e.target.value)}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isInvalid || loading}
          className="focus-ring flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3
                     text-sm font-bold text-white transition-all duration-200
                     hover:-translate-y-0.5 hover:bg-[#1a5490] hover:shadow-lg
                     disabled:cursor-not-allowed disabled:bg-slate-300 disabled:translate-y-0 disabled:shadow-none"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Memproses...
            </>
          ) : (
            "Prediksi Sekarang"
          )}
        </button>
        <button
          type="button"
          onClick={() => onReset(defaultValues)}
          className="focus-ring rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold
                     text-slate-600 transition hover:border-primary/50 hover:text-primary"
        >
          {hasResult ? "Reset" : "Contoh Data"}
        </button>
      </div>
    </form>
  );
}

PredictionForm.defaultValues = defaultValues;
export default PredictionForm;
