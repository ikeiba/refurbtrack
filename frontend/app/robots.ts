import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isDev = process.env.NODE_ENV === 'development'
  const baseUrl = 'https://refurbtrack.com'

  if (isDev) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',              // Bloqueo genérico de rutas de API
        '/*/login',           // Bloquea /es-es/login, /en-gb/login, etc.
        '/*/register',
        '/*/forgot-password',
        '/*/reset-password',
        '/*/dashboard',       // Bloquea /es-es/dashboard
        '/*/unsubscribe',     // Bloquea páginas de gestión de alertas
        '/*/unsubscribe-all',
        
        // --- GESTIÓN DE NAVEGACIÓN FACETADA ---
        // Bloqueamos rastreo de combinaciones de filtros para ahorrar Crawl Budget
        '/*?*condition=',     
        '/*?*battery=',
        '/*?*sort=',
        '/*?*q='              // Si usas parámetros de búsqueda interna
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}