// app/sitemap.ts
import { MetadataRoute } from 'next'
import { API_URL } from "@/services/api"
import { locales, getMarket } from "@/lib/i18n"

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

const blogSlugs = [
  'guia-compradores-refurbished',
  'impacto-ambiental-reacondicionado',
  'diferencias-entre-marketplaces',
  'estrategia-ahorro-temporal',
  'falsos-mitos-reacondicionados',
  'tendencias-mercado-refurbished-2026'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Recorremos cada locale (mercado) y emitimos sus URLs.
  for (const locale of locales) {
    const market = getMarket(locale)

    // --- ZONA 1: RUTAS ESTÁTICAS Y DE EMPRESA ---
    entries.push(
      { url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${baseUrl}/${locale}/historial-precios-back-market`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 }
    )

    // --- ZONA 2: RUTAS DEL BLOG (solo es-es: el contenido está en español) ---
    if (locale === 'es-es') {
      entries.push(
        { url: `${baseUrl}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        ...blogSlugs.map(slug => ({
          url: `${baseUrl}/${locale}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      )
    }

    // --- ZONA 3: RUTAS LEGALES ---
    entries.push(
      { url: `${baseUrl}/${locale}/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
      { url: `${baseUrl}/${locale}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
      { url: `${baseUrl}/${locale}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
      { url: `${baseUrl}/${locale}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
      { url: `${baseUrl}/${locale}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
      { url: `${baseUrl}/${locale}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    )

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

            entries.push({
              url: `${baseUrl}/${locale}/${item.product__category__slug}/${item.product__brand__slug}/${item.product__slug}/${item.slug}`,
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
      entries.push({
        url: `${baseUrl}/${locale}/${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      })
    }

    for (const catBrand of uniqueBrands) {
      entries.push({
        url: `${baseUrl}/${locale}/${catBrand}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.85,
      })
    }

    for (const catBrandProduct of uniqueHubs) {
      entries.push({
        url: `${baseUrl}/${locale}/${catBrandProduct}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.85,
      })
    }
  }

  return entries
}
