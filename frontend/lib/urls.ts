// lib/urls.ts
// Helpers centrales para construir URLs internas de forma consistente.
// Evitan dispersar la construcción de rutas por los componentes.

export const HISTORY_LANDING_SLUG = "historial-precios-back-market";

export function historyLandingPath(lang: string): string {
  return `/${lang}/${HISTORY_LANDING_SLUG}`;
}

export function hubPath(lang: string, category: string, brand: string, product: string): string {
  return `/${lang}/${category}/${brand}/${product}`;
}

export function specPath(
  lang: string,
  category: string,
  brand: string,
  product: string,
  spec: string
): string {
  return `/${lang}/${category}/${brand}/${product}/${spec}`;
}

export function brandPath(lang: string, category: string, brand: string): string {
  return `/${lang}/${category}/${brand}`;
}

export function categoryPath(lang: string, category: string): string {
  return `/${lang}/${category}`;
}

export function absoluteUrl(path: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://refurbtrack.com";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
