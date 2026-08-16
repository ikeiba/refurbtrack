// lib/format.ts
// Utilidades puras de formateo para las páginas SEO. Sin acceso a React ni a la BD.

export function formatEur(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (isNaN(n)) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatSignedPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const n = Number(value);
  if (isNaN(n)) return "";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} %`;
}

export function formatDateEs(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
