// lib/format.ts
// Utilidades puras de formateo para las páginas SEO. Sin acceso a React ni a la BD.
// Fase 4: formateo dinámico de moneda y fecha según mercado/idioma.

import { getIntlLocale, parseLocale, getLanguage } from "./i18n";
import type { Currency, Language } from "./i18n";
import { dictionaries, toEnglish } from "./translations";

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

// ============================================================================
// TRADUCCIÓN DE URLs DINÁMICAS (mercado / locale)
// ============================================================================
//
// Las rutas de producto tienen la forma:
//   /[locale]/[category]/[brand]/[product]/[specSlug]
// donde `category`, `brand` y `product` son idénticos en ES y EN, pero el slug
// final de la especificación SÍ cambia:
//   ES: /es-es/smartphone/apple/iphone-11-pro/reacondicionado-64gb-oro
//   EN: /en-gb/smartphone/apple/iphone-11-pro/refurbished-64gb-gold
//
// Formato del slug de spec:
//   ES: reacondicionado-{storage}gb-{color_es}
//   EN: refurbished-{storage}gb-{color_en}
// El color puede ser de una o varias palabras (ej. "gris-espacial" / "space-gray").

const LOCALE_RE = /^\/(es-es|en-gb)(?=\/|$)/;
const SPEC_ES_PREFIX = "reacondicionado-";
const SPEC_EN_PREFIX = "refurbished-";

// Mapas de color case-insensitive (slugs en minúsculas con guiones y sin
// acentos, tal y como los genera Django's `slugify` en el backend).
const ES_COLOR_TO_EN: Record<string, string> = {};
const EN_COLOR_TO_ES: Record<string, string> = {};

/** Normaliza un nombre de color a la forma de slug (sin acentos, minúsculas, guiones). */
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildColorMaps() {
  if (Object.keys(ES_COLOR_TO_EN).length > 0) return;

  for (const [enKey, esValue] of Object.entries(dictionaries.es)) {
    // Solo las claves que son colores de BD hacen round-trip con toEnglish.
    if (toEnglish(esValue).toLowerCase() !== enKey.toLowerCase()) continue;

    const esSlug = slugify(esValue);
    const enSlug = slugify(enKey);

    ES_COLOR_TO_EN[esSlug] = enSlug;
    EN_COLOR_TO_ES[enSlug] = esSlug;
  }
}

/** Traduce el segmento de color (slug) entre ES y EN. */
function translateColor(colorSlug: string, targetLang: Language): string {
  buildColorMaps();
  if (targetLang === "en") {
    return ES_COLOR_TO_EN[colorSlug] ?? colorSlug;
  }
  return EN_COLOR_TO_ES[colorSlug] ?? colorSlug;
}

/** Reconstruye el slug de una especificación en el idioma de destino. */
function translateSpecSlug(segment: string, targetLang: Language): string {
  const parts = segment.split("-");
  if (parts.length < 2) return segment;

  const storage = parts[1]; // ej. "64gb"
  const colorSlug = parts.slice(2).join("-");

  const targetPrefix = targetLang === "en" ? "refurbished" : "reacondicionado";
  return `${targetPrefix}-${storage}-${translateColor(colorSlug, targetLang)}`;
}

/**
 * Sustituye el prefijo de locale de una URL y traduce los slugs dinámicos
 * (especificaciones de producto) al idioma del locale de destino.
 *
 * Ejemplos:
 *   translatePathname("/es-es/smartphone/apple/iphone-11-pro/reacondicionado-64gb-oro", "en-gb")
 *     -> "/en-gb/smartphone/apple/iphone-11-pro/refurbished-64gb-gold"
 *   translatePathname("/en-gb/smartphone/apple/iphone-11-pro/refurbished-64gb-gold", "es-es")
 *     -> "/es-es/smartphone/apple/iphone-11-pro/reacondicionado-64gb-oro"
 *   translatePathname("/es-es/blog/guia-compradores-refurbished", "en-gb")
 *     -> "/en-gb/blog/guia-compradores-refurbished" (sin slugs de spec, solo locale)
 */
export function translatePathname(pathname: string, targetLocale: string): string {
  const match = pathname.match(LOCALE_RE);
  if (!match) return pathname;

  const sourceLocale = match[1];
  const resolvedTarget = parseLocale(targetLocale);
  if (sourceLocale === resolvedTarget) return pathname;

  const targetLang: Language = getLanguage(resolvedTarget);
  const segments = pathname.split("/").filter(Boolean);

  const translated = segments.map((seg, i) => {
    if (i === 0) return resolvedTarget;
    if (seg.startsWith(SPEC_ES_PREFIX) || seg.startsWith(SPEC_EN_PREFIX)) {
      return translateSpecSlug(seg, targetLang);
    }
    return seg;
  });

  return "/" + translated.join("/");
}
