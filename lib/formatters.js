// app/lib/formatters.js
export const fmtCLP = (n) =>
  (n ?? 0).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });
