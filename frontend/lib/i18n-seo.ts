// lib/i18n-seo.ts
// Hreflang bidireccional completo ("Standard de Oro" de SEO internacional).
// Genera el mapa `languages` de la propiedad `alternates` tanto para el
// `generateMetadata` de cada página como para el sitemap.xml.
//
// El núcleo es `translatePathname` (lib/format.ts): resuelve la URL traducida
// exacta en ambos mercados — slugs de categoría/marca idénticos, slugs de blog
// vía lib/blog.ts y slugs de especificación (reacondicionado-64gb-oro ↔
// refurbished-64gb-gold) mediante el diccionario de colores.

import type { Locale } from "./i18n";
import { locales } from "./i18n";
import { translatePathname } from "./format";

export type HreflangLanguages = Partial<Record<Locale, string>>;

/**
 * Devuelve el mapa `{ 'es-es': '...', 'en-gb': '...' }` para una ruta que ya
 * empieza por un locale (`/es-es/...`). Devuelve rutas relativas, o absolutas
 * si se pasa `baseUrl`.
 *
 * Ejemplos:
 *   hreflangLanguages("/es-es/smartphone/apple/iphone-11-pro/reacondicionado-64gb-oro")
 *     -> { 'es-es': '/es-es/smartphone/apple/iphone-11-pro/reacondicionado-64gb-oro',
 *          'en-gb': '/en-gb/smartphone/apple/iphone-11-pro/refurbished-64gb-gold' }
 *   hreflangLanguages("/en-gb/blog/refurbished-buying-guide", "https://refurbtrack.com")
 *     -> { 'es-es': 'https://refurbtrack.com/es-es/blog/guia-compradores-refurbished',
 *          'en-gb': 'https://refurbtrack.com/en-gb/blog/refurbished-buying-guide' }
 */
export function hreflangLanguages(pathname: string, baseUrl?: string): HreflangLanguages {
  const base = baseUrl ? baseUrl.replace(/\/$/, "") : "";
  const result: HreflangLanguages = {};
  for (const locale of locales) {
    result[locale] = `${base}${translatePathname(pathname, locale)}`;
  }
  return result;
}