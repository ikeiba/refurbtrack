// app/sitemap.ts
import { MetadataRoute } from 'next'
import { API_URL } from "@/services/api"
import { locales, getMarket, type Locale } from "@/lib/i18n"
import { blogPostSlugsForLocale } from "@/lib/blog"
import { translatePathname } from "@/lib/format"

// Añadimos ISR al sitemap: Que se regenere cada 1 hora (3600) o cada 24h (86400)
// export const revalidate = 3600;
export const dynamic = 'force-dynamic'

// 1. Tipado robusto para el escalado
interface SitemapItem {
  product__category__slug: string;
  product__brand__slug: string;
  product__slug: string;
  slug: string;
  last_updated: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbtrack.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Hreflang bidireccional completo: para cualquier ruta que empiece por un
  // locale, calculamos la URL traducida exacta en AMBOS mercados y la emitimos
  // en `alternates.languages` (slugs de blog y de spec se traducen via
  // translatePathname; si una traducción falla, se mantiene el slug original).
  function push(path: string, extra?: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">): void {
    const languages: Record<Locale, string> = {} as Record<Locale, string>
    for (const locale of locales) {
      languages[locale] = `${baseUrl}${translatePathname(path, locale)}`
    }
    entries.push({
      url: `${baseUrl}${path}`,
      alternates: { languages },
      ...extra,
    })
  }

  // Recorremos cada locale (mercado) y emitimos sus URLs.
  for (const locale of locales) {
    const market = getMarket(locale)

    // --- ZONA 1: RUTAS ESTÁTICAS Y DE EMPRESA ---
    push(`/${locale}`, { lastModified: new Date(), changeFrequency: 'daily', priority: 1 })
    push(`/${locale}/historial-precios-back-market`, { lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 })

    // --- ZONA 2: RUTAS DEL BLOG (slugs localizados por mercado) ---
    push(`/${locale}/blog`, { lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 })
    for (const slug of blogPostSlugsForLocale(locale)) {
      push(`/${locale}/blog/${slug}`, { lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 })
    }

    // --- ZONA 3: RUTAS LEGALES ---
    push(`/${locale}/cookies`, { lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 })
    push(`/${locale}/how-it-works`, { lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 })
    push(`/${locale}/about`, { lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 })
    push(`/${locale}/contact`, { lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 })
    push(`/${locale}/privacy`, { lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 })
    push(`/${locale}/terms`, { lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 })

    // --- ZONA 4: RUTAS DINÁMICAS (Categorías, Marcas, Hubs y Productos) ---
    const uniqueCategories = new Set<string>()
    const uniqueBrands = new Set<string>()
    const uniqueHubs = new Set<string>()

    try {
      const response = await fetch(`${API_URL}/products/sitemap-data/?market=${market}`, {
        next: { revalidate: 3600 }
      })

      if (response.ok) {
        const data = await response.json()

        if (Array.isArray(data)) {
          for (const item of data as SitemapItem[]) {
            uniqueCategories.add(item.product__category__slug)
            uniqueBrands.add(`${item.product__category__slug}/${item.product__brand__slug}`)
            uniqueHubs.add(`${item.product__category__slug}/${item.product__brand__slug}/${item.product__slug}`)

            push(`/${locale}/${item.product__category__slug}/${item.product__brand__slug}/${item.product__slug}/${item.slug}`, {
              lastModified: new Date(item.last_updated),
              changeFrequency: 'daily',
              priority: 0.8,
            })
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error generando sitemap dinámico (${locale}):`, error)
    }

    for (const category of uniqueCategories) {
      push(`/${locale}/${category}`, { lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 })
    }

    for (const catBrand of uniqueBrands) {
      push(`/${locale}/${catBrand}`, { lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 })
    }

    for (const catBrandProduct of uniqueHubs) {
      push(`/${locale}/${catBrandProduct}`, { lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 })
    }
  }

  return entries
}