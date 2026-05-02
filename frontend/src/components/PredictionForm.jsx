import { Info, Shuffle } from "lucide-react";
import {
  DEFAULT_FORM_VALUES,
  FORM_SECTIONS,
  MONEY_FIELD_NAMES,
  NUMERIC_FIELDS,
  generateRandomValues,
} from "../constants/fields.js";

/**
 * Individual input field component with formatting and validation handling.
 * Displays currency symbols for monetary fields and tooltips where configured.
 */
function FieldInput({ field, value, onChange }) {
  const isMoney = MONEY_FIELD_NAMES.has(field.name);
  return (
    <label key={field.name} className="block space-y-2">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {field.label}
        {field.unit && (
          <span className="text-slate-400 font-normal text-xs">({field.unit})</span>
        )}
        {field.tooltip && (
          <span
            title="CIBIL Score adalah skor kredit India dengan rentang 300–900. Semakin tinggi skor, semakin baik riwayat kredit."
            className="cursor-help"
          >
            <Info size={14} className="text-primary opacity-70" />
          </span>
        )}
      </span>
      <div className="relative">
        {isMoney && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">
            ₹
          </span>
        )}
        <input
          type="number"
          min={field.min}
          max={field.max}
          value={value}
          onChange={onChange}
          className={`input-field ${isMoney ? "!pl-11" : ""}`}
        />
      </div>
    </label>
  );
}

/**
 * Main form for inputting customer data for loan prediction.
 * Handles state validation and rendering fields grouped by section.
 */
function PredictionForm({ values, setValues, onSubmit, loading, onReset, hasResult }) {
  const updateValue = (name, value) => {
    setValues((current) => ({
      ...current,
      [name]:
        MONEY_FIELD_NAMES.has(name) ||
        name.includes("score") ||
        name.includes("term") ||
        name.includes("dependents")
          ? (value === "" ? "" : Number(value))
          : value,
    }));
  };

  // Validate fields against their min/max constraints
  const isInvalid = NUMERIC_FIELDS.some((field) => {
    const rawValue = values[field.name];
    if (rawValue === "") return true;
    
    const value = Number(rawValue);
    return (
      Number.isNaN(value) ||
      value < field.min ||
      (field.max !== undefined && value > field.max)
    );
  });

  const fieldMap = Object.fromEntries(NUMERIC_FIELDS.map((f) => [f.name, f]));

  return (
    <form onSubmit={onSubmit} className="card p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <span className="section-label">Input Nasabah</span>
        <h2 className="mt-2 text-2xl font-bold text-ink">Simulasi Kelayakan Pinjaman</h2>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Semua nilai moneter menggunakan Indian Rupee (₹). Isi data nasabah lalu klik prediksi.
        </p>
      </div>

      {/* Sectioned fields */}
      {FORM_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="h-px flex-1 bg-slate-100" />
            {section.title}
            <span className="h-px flex-1 bg-slate-100" />
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.fields.map((name) => {
              if (name === "education") {
                return (
                  <label key={name} className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Pendidikan</span>
                    <select
                      value={values.education}
                      onChange={(e) => updateValue("education", e.target.value)}
                      className="input-field"
                    >
                      <option>Graduate</option>
                      <option>Not Graduate</option>
                    </select>
                  </label>
                );
              }
              if (name === "self_employed") {
                return (
                  <label key={name} className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Wiraswasta</span>
                    <select
                      value={values.self_employed}
                      onChange={(e) => updateValue("self_employed", e.target.value)}
                      className="input-field"
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
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={isInvalid || loading}
          className="focus-ring flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5
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
          onClick={() => onReset(hasResult ? DEFAULT_FORM_VALUES : generateRandomValues())}
          className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold
                     text-slate-600 transition hover:border-primary hover:text-primary"
        >
          {hasResult ? (
            "Reset"
          ) : (
            <>
              <Shuffle size={14} />
              Random Data
            </>
          )}
        </button>
      </div>
    </form>
  );
}

PredictionForm.defaultValues = DEFAULT_FORM_VALUES;
export default PredictionForm;
