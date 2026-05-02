export const formatRupee = (value) => {
  const amount = Number(value || 0);
  return `₹ ${new Intl.NumberFormat("id-ID").format(amount)}`;
};

export const formatPercent = (value) => `${(Number(value || 0) * 100).toFixed(2)}%`;

export const toCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  return `"${String(value).replaceAll('"', '""')}"`;
};
