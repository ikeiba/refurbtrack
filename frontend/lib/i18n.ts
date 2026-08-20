// lib/i18n.ts
// Configuración central de internacionalización (Fase 4).
// Fuente de verdad de locales, mercados, monedas y dominios.

export type Locale = "es-es" | "en-gb";
export type Language = "es" | "en";
export type Currency = "EUR" | "GBP";
export type MarketCode = "ES" | "UK";

export const locales = ["es-es", "en-gb"] as const;

export const defaultLocale: Locale = "es-es";

export interface LocaleMeta {
  language: Language;
  region: MarketCode;
  currency: Currency;
  domain: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  "es-es": { language: "es", region: "ES", currency: "EUR", domain: "backmarket.es" },
  "en-gb": { language: "en", region: "UK", currency: "GBP", domain: "backmarket.co.uk" },
};

/**
 * Normaliza cualquier cadena a un Locale válido ('es-es' | 'en-gb').
 * Acepta locales completos ('es-es'), códigos de idioma ('es', 'en'),
 * o códigos de mercado ('ES', 'UK'). Fallback a `defaultLocale`.
 */
export function parseLocale(value: string | undefined | null): Locale {
  if (!value) return defaultLocale;
  const v = value.toLowerCase();

  if (v === "en-gb" || v === "en" || v === "gb" || v === "uk") return "en-gb";
  if (v === "es-es" || v === "es" || v === "sp" || v === "españa") return "es-es";

  // Último recurso: si empieza por 'en' → en-gb, si no → es-es
  if (v.startsWith("en")) return "en-gb";
  return defaultLocale;
}

/** Devuelve el código de mercado ('ES' | 'UK') que espera el backend (`?market=`). */
export function getMarket(locale: string | undefined | null): MarketCode {
  return localeMeta[parseLocale(locale)].region;
}

/** Devuelve el idioma ('es' | 'en') a partir de un locale. */
export function getLanguage(locale: string | undefined | null): Language {
  return localeMeta[parseLocale(locale)].language;
}

/** Devuelve la moneda ISO ('EUR' | 'GBP') a partir de un locale. */
export function getCurrency(locale: string | undefined | null): Currency {
  return localeMeta[parseLocale(locale)].currency;
}

/** Devuelve el dominio de Back Market del mercado ('backmarket.es' | 'backmarket.co.uk'). */
export function getDomain(locale: string | undefined | null): string {
  return localeMeta[parseLocale(locale)].domain;
}

/** Devuelve el meta completo del locale, con fallback al default. */
export function getLocaleMeta(locale: string | undefined | null): LocaleMeta {
  return localeMeta[parseLocale(locale)];
}

/** Devuelve el tag de idioma para Intl ('es-ES' | 'en-GB'). */
export function getIntlLocale(locale: string | undefined | null): string {
  return localeMeta[parseLocale(locale)].language === "en" ? "en-GB" : "es-ES";
}

/**
 * Devuelve el slug de una Spec correcto para el idioma indicado:
 * `slug_en` en inglés ('en') y `slug` en español. Con fallback al slug ES si
 * no existe variante EN (por seguridad durante la transición).
 */
export function getSpecSlug(
  spec: { slug?: string | null; slug_en?: string | null } | null | undefined,
  locale: string | undefined | null
): string {
  if (!spec) return "";
  const language = getLanguage(locale);
  if (language === "en" && spec.slug_en) return spec.slug_en;
  return spec.slug || "";
}
