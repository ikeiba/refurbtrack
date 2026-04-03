// app/sitemap.ts
import { MetadataRoute } from 'next'

// 1. Tipado robusto para el escalado
interface SitemapItem {
  product__category__slug: string;
  product__brand__slug: string;
  product__slug: string;
  slug: string;
  last_updated: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbtrack.com'

// Simulación de los slugs del blog (Podrías traerlos de una API o constante)
const blogSlugs = [
  'guia-compradores-refurbished',
  'impacto-ambiental-reacondicionado',
  'diferencias-entre-marketplaces',
  'estrategia-ahorro-temporal',
  'falsos-mitos-reacondicionados',
  'tendencias-mercado-refurbished-2026'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- ZONA 1: RUTAS ESTÁTICAS Y DE EMPRESA ---
  const mainRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/es`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    {url: `${baseUrl}/es/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 }
  ]

  // --- ZONA 2: RUTAS DEL BLOG (SEO Content) ---
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map(slug => ({
    url: `${baseUrl}/es/blog/${slug}`,
    lastModified: new Date(), // En el futuro, traer de la fecha real del post
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // --- 2. RUTAS LEGALES (Opcional, pero ayudan a la confianza/E-E-A-T) ---
  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/es/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: `${baseUrl}/es/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/es/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/es/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: `${baseUrl}/es/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: `${baseUrl}/es/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
  ]

  // --- ZONA 3: PRODUCTOS DINÁMICOS (Tier 1 + Tier 2) ---
  let productEntries: MetadataRoute.Sitemap = []
  
  // OJO: Usamos la URL de Docker interna si estamos en el build de producción
  const API_URL = "http://web:8000/api"

  try {
    const response = await fetch(`${API_URL}/products/sitemap-data/`, {
      next: { revalidate: 86400 } // Cacheamos la lista de URLs por 24h
    })

    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data)) {
        productEntries = data.map((item: SitemapItem) => ({
          url: `${baseUrl}/es/${item.product__category__slug}/${item.product__brand__slug}/${item.product__slug}/${item.slug}`,
          lastModified: new Date(item.last_updated),
          changeFrequency: 'daily',
          // Los productos tienen más peso que un login pero menos que la home
          priority: 0.8, 
        }))
      }
    }
  } catch (error) {
    console.error("❌ Error generando sitemap de productos:", error)
  }

  return [...mainRoutes, ...blogRoutes, ...legalRoutes, ...productEntries]
}