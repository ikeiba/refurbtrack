// lib/urls.ts
// Helpers centrales para construir URLs internas de forma consistente.
// Evitan dispersar la construcción de rutas por los componentes.
// Fase 4: el primer parámetro es el `locale` ('es-es' | 'en-gb').

export const HISTORY_LANDING_SLUG = "historial-precios-back-market";

export function historyLandingPath(locale: string): string {
  return `/${locale}/${HISTORY_LANDING_SLUG}`;
}

export function hubPath(locale: string, category: string, brand: string, product: string): string {
  return `/${locale}/${category}/${brand}/${product}`;
}

export function specPath(
  locale: string,
  category: string,
  brand: string,
  product: string,
  spec: string
): string {
  return `/${locale}/${category}/${brand}/${product}/${spec}`;
}

export function brandPath(locale: string, category: string, brand: string): string {
  return `/${locale}/${category}/${brand}`;
}

export function categoryPath(locale: string, category: string): string {
  return `/${locale}/${category}`;
}

export function blogIndexPath(locale: string): string {
  return `/${locale}/blog`;
}

export function blogPostPath(locale: string, slug: string): string {
  return `/${locale}/blog/${slug}`;
}

export function absoluteUrl(path: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://refurbtrack.com";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
