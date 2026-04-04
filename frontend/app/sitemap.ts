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
    { url: `${baseUrl}/es/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 }
  ]

  // --- ZONA 2: RUTAS DEL BLOG (SEO Content) ---
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map(slug => ({
    url: `${baseUrl}/es/blog/${slug}`,
    lastModified: new Date(), 
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // --- ZONA 3: RUTAS LEGALES ---
  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/es/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: `${baseUrl}/es/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/es/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    { url: `${baseUrl}/es/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: `${baseUrl}/es/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: `${baseUrl}/es/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
  ]

  // --- ZONA 4: RUTAS DINÁMICAS (Categorías, Marcas y Productos) ---
  let categoryEntries: MetadataRoute.Sitemap = []
  let brandEntries: MetadataRoute.Sitemap = []
  let productEntries: MetadataRoute.Sitemap = []
  
  const API_URL = "http://web:8000/api"

  try {
    const response = await fetch(`${API_URL}/products/sitemap-data/`, {
      next: { revalidate: 86400 } 
    })

    if (response.ok) {
      const data = await response.json()
      
      if (Array.isArray(data)) {
        // Utilizamos Sets para garantizar que no haya URLs duplicadas
        const uniqueCategories = new Set<string>()
        const uniqueBrands = new Set<string>() // Guardaremos el formato "categoria/marca"

        // 1. Extraemos URLs de productos y alimentamos los Sets de categorías/marcas
        productEntries = data.map((item: SitemapItem) => {
          uniqueCategories.add(item.product__category__slug)
          uniqueBrands.add(`${item.product__category__slug}/${item.product__brand__slug}`)

          return {
            url: `${baseUrl}/es/${item.product__category__slug}/${item.product__brand__slug}/${item.product__slug}/${item.slug}`,
            lastModified: new Date(item.last_updated),
            changeFrequency: 'daily',
            priority: 0.8, 
          }
        })

        // 2. Generamos las entradas para las Landing Pages de Categoría
        categoryEntries = Array.from(uniqueCategories).map(category => ({
          url: `${baseUrl}/es/${category}`,
          lastModified: new Date(), // Idealmente, podrías calcular la fecha más reciente de los productos de esta categoría
          changeFrequency: 'daily',
          priority: 0.9, // Muy alta prioridad, es una página pilar
        }))

        // 3. Generamos las entradas para las Landing Pages de Marca
        brandEntries = Array.from(uniqueBrands).map(catBrand => ({
          url: `${baseUrl}/es/${catBrand}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.85, // Alta prioridad, justo debajo de la categoría padre
        }))
      }
    }
  } catch (error) {
    console.error("❌ Error generando sitemap dinámico:", error)
  }

  // Devolvemos el array final combinando todas las zonas generadas
  return [
    ...mainRoutes, 
    ...categoryEntries, 
    ...brandEntries, 
    ...blogRoutes, 
    ...legalRoutes, 
    ...productEntries
  ]
}