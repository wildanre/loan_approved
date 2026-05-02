/**
 * Form field definitions and input configuration.
 * Shared between PredictionForm (input) and DetailModal (display).
 */

/** Fields whose values represent monetary amounts (₹) */
export const MONEY_FIELD_NAMES = new Set([
  "income_annum",
  "loan_amount",
  "residential_assets_value",
  "commercial_assets_value",
  "luxury_assets_value",
  "bank_asset_value",
]);

/** Human-readable labels for every input field */
export const INPUT_LABELS = {
  no_of_dependents: "Jumlah Tanggungan",
  education: "Pendidikan",
  self_employed: "Wiraswasta",
  income_annum: "Pendapatan Tahunan",
  loan_amount: "Jumlah Pinjaman",
  loan_term: "Jangka Waktu (tahun)",
  cibil_score: "Skor CIBIL",
  residential_assets_value: "Aset Residensial",
  commercial_assets_value: "Aset Komersial",
  luxury_assets_value: "Aset Mewah",
  bank_asset_value: "Aset Bank",
};

/** Numeric field definitions with validation constraints */
export const NUMERIC_FIELDS = [
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

/** Logical grouping of fields into form sections */
export const FORM_SECTIONS = [
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

/** Default form values for initial render */
export const DEFAULT_FORM_VALUES = {
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

/**
 * Generate realistic random form values within valid dataset ranges.
 * Values are rounded to the nearest lakh (₹100,000) for currency fields.
 */
export function generateRandomValues() {
  const randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const randLakh = (minLakh, maxLakh) =>
    randInt(minLakh, maxLakh) * 100_000;

  return {
    no_of_dependents: randInt(0, 5),
    education: Math.random() > 0.4 ? "Graduate" : "Not Graduate",
    self_employed: Math.random() > 0.7 ? "Yes" : "No",
    income_annum: randLakh(20, 99),
    loan_amount: randLakh(5, 350),
    loan_term: randInt(2, 20),
    cibil_score: randInt(300, 900),
    residential_assets_value: randLakh(0, 250),
    commercial_assets_value: randLakh(0, 150),
    luxury_assets_value: randLakh(0, 300),
    bank_asset_value: randLakh(0, 120),
  };
}
