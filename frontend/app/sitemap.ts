import { MetadataRoute } from 'next'

// Definimos el tipo de datos que viene de Django
interface SitemapItem {
  product__category__slug: string;
  product__brand__slug: string;
  product__slug: string;
  slug: string;
  last_updated: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://refurbtrack.com'
  let productEntries: MetadataRoute.Sitemap = []

  // Usamos la URL interna de la red de Docker: http://nombre_servicio:puerto
  // Probablemente sea http://web:8000/api o http://localhost:8000/api si no usas red interna
  const API_URL = "http://web:8000/api";  

  try {
    const response = await fetch(`${API_URL}/products/sitemap-data/`, {
      next: { revalidate: 86400 }
    })

    // VALIDACIÓN: Si no es 200 OK, lanzamos error para ir al catch
    if (!response.ok) {
        console.error(`Sitemap error: Backend respondió con status ${response.status}`);
    } else {
        const data = await response.json();
        
        // COMPROBACIÓN EXTRA: ¿Es realmente un array?
        if (Array.isArray(data)) {
            productEntries = data.map((item: SitemapItem) => ({
                url: `${baseUrl}/es/${item.product__category__slug}/${item.product__brand__slug}/${item.product__slug}/${item.slug}`,
                lastModified: new Date(item.last_updated),
                changeFrequency: 'daily' as const,
                priority: 0.8,
            }));
        }
    }
  } catch (error) {
    console.error("Error generating sitemap entries:", error)
  }

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'always', priority: 1 },
    { url: `${baseUrl}/es`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...productEntries,
  ]
}