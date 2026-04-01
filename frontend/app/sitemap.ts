import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://refurbtrack.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Aquí en el futuro podrás mapear dinámicamente tus URLs de productos
    // extrayéndolas directamente de tu base de datos PostgreSQL
  ]
}