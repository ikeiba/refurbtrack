// lib/blog.ts
// Datos compartidos del blog: categorías y slugs de artículos por idioma.
// Fase 4: las URLs del blog son locales:
//   /en-gb/blog?category=tips   (no /en-gb/blog?category=Consejos)
//   /en-gb/blog/savings-strategy-timing  (no /en-gb/blog/estrategia-ahorro-temporal)

// Claves internas de categoría (canónicas, se usan como valor en los posts).
export type BlogCategoryKey =
  | "Todas"
  | "Educación"
  | "Sostenibilidad"
  | "Comparativa"
  | "Consejos"
  | "Mercado";

export interface BlogCategory {
  key: BlogCategoryKey;
  labelES: string;
  labelEN: string;
  /** Valor del query param `?category=` para el locale ES (backward-compatible). */
  slugES: string;
  /** Valor del query param `?category=` para el locale EN. */
  slugEN: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { key: "Todas", labelES: "Todas", labelEN: "All", slugES: "Todas", slugEN: "all" },
  { key: "Educación", labelES: "Educación", labelEN: "Education", slugES: "Educación", slugEN: "education" },
  { key: "Sostenibilidad", labelES: "Sostenibilidad", labelEN: "Sustainability", slugES: "Sostenibilidad", slugEN: "sustainability" },
  { key: "Comparativa", labelES: "Comparativa", labelEN: "Comparison", slugES: "Comparativa", slugEN: "comparison" },
  { key: "Consejos", labelES: "Consejos", labelEN: "Tips", slugES: "Consejos", slugEN: "tips" },
  { key: "Mercado", labelES: "Mercado", labelEN: "Market", slugES: "Mercado", slugEN: "market" },
];

function normalizeCategorySlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

const CATEGORY_BY_SLUG: Record<string, BlogCategoryKey> = {};
for (const cat of BLOG_CATEGORIES) {
  CATEGORY_BY_SLUG[normalizeCategorySlug(cat.slugES)] = cat.key;
  CATEGORY_BY_SLUG[normalizeCategorySlug(cat.slugEN)] = cat.key;
  CATEGORY_BY_SLUG[normalizeCategorySlug(cat.labelES)] = cat.key;
  CATEGORY_BY_SLUG[normalizeCategorySlug(cat.labelEN)] = cat.key;
}

/** Resuelve la clave interna a partir del valor del query param `?category=`. */
export function blogCategoryKeyFromUrl(
  value: string | undefined | null,
  locale: string
): BlogCategoryKey {
  if (!value) return "Todas";
  return CATEGORY_BY_SLUG[normalizeCategorySlug(value)] ?? "Todas";
}

/** Valor del query param `?category=` para el locale indicado. */
export function blogCategorySlug(key: BlogCategoryKey, locale: string): string {
  const cat = BLOG_CATEGORIES.find((c) => c.key === key);
  if (!cat) return key;
  return locale === "en-gb" ? cat.slugEN : cat.slugES;
}

/** Etiqueta visible de la categoría para el locale indicado. */
export function blogCategoryLabel(key: BlogCategoryKey, locale: string): string {
  const cat = BLOG_CATEGORIES.find((c) => c.key === key);
  if (!cat) return key;
  return locale === "en-gb" ? cat.labelEN : cat.labelES;
}

// --- Slugs de artículos (ES y EN) -----------------------------------------

export interface BlogPostSlugs {
  slugES: string;
  slugEN: string;
}

export const BLOG_POST_SLUGS: BlogPostSlugs[] = [
  { slugES: "guia-compradores-refurbished", slugEN: "refurbished-buying-guide" },
  { slugES: "impacto-ambiental-reacondicionado", slugEN: "refurbished-environmental-impact" },
  { slugES: "diferencias-entre-marketplaces", slugEN: "marketplace-comparison" },
  { slugES: "estrategia-ahorro-temporal", slugEN: "savings-strategy-timing" },
  { slugES: "falsos-mitos-reacondicionados", slugEN: "refurbished-myths-debunked" },
  { slugES: "tendencias-mercado-refurbished-2026", slugEN: "refurbished-market-trends-2026" },
];

const POST_SLUG_MAP: Record<string, BlogPostSlugs> = {};
for (const pair of BLOG_POST_SLUGS) {
  POST_SLUG_MAP[pair.slugES] = pair;
  POST_SLUG_MAP[pair.slugEN] = pair;
}

/** Slugs de artículo válidos para el locale indicado. */
export function blogPostSlugsForLocale(locale: string): string[] {
  return locale === "en-gb"
    ? BLOG_POST_SLUGS.map((p) => p.slugEN)
    : BLOG_POST_SLUGS.map((p) => p.slugES);
}

/** Slug del artículo para el locale indicado (a partir del slug ES canónico). */
export function blogPostSlug(slugES: string, locale: string): string {
  const pair = POST_SLUG_MAP[slugES];
  if (!pair) return slugES;
  return locale === "en-gb" ? pair.slugEN : pair.slugES;
}

/** Resuelve un slug de la URL (ES o EN) a su par de slugs. */
export function blogPostBySlug(slug: string): BlogPostSlugs | undefined {
  return POST_SLUG_MAP[slug];
}