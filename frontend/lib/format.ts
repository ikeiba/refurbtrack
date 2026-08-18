// lib/format.ts
// Utilidades puras de formateo para las páginas SEO. Sin acceso a React ni a la BD.
// Fase 4: formateo dinámico de moneda y fecha según mercado/idioma.

import { getIntlLocale } from "./i18n";
import type { Currency, Language } from "./i18n";

/**
 * Formatea un valor como moneda según el mercado.
 * Ejemplos: formatCurrency(749, 'EUR', 'es') -> "749 €"
 *           formatCurrency(749, 'GBP', 'en') -> "£749"
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: Currency = "EUR",
  language: Language | string = "es"
): string {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (isNaN(n)) return "—";

  const intlLocale = getIntlLocale(language);
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    // Fallback por si `currency` no es válido en este entorno
    return new Intl.NumberFormat(intlLocale, {
      maximumFractionDigits: 0,
    }).format(n);
  }
}

/**
 * Formatea una fecha ISO al idioma del mercado.
 * Ejemplos: formatDate('2026-08-18', 'es') -> "18 ago 2026"
 *           formatDate('2026-08-18', 'en') -> "18 Aug 2026"
 */
export function formatDate(iso: string | null | undefined, language: Language | string = "es"): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(getIntlLocale(language), {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatSignedPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const n = Number(value);
  if (isNaN(n)) return "";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} %`;
}

/** Devuelve el número sin decimales de sobra (para textos/URLs que ya añaden símbolo). */
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const n = Number(value);
  if (isNaN(n) || n <= 0) return "";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

// --- Aliases retrocompatibles (Fase 4 los elimina del resto de módulos) ---
export function formatEur(value: number | null | undefined): string {
  return formatCurrency(value, "EUR", "es");
}

export function formatDateEs(iso: string | null | undefined): string {
  return formatDate(iso, "es");
}
