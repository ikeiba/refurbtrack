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
        '/*/*/login',         // Bloquea /es/login, /en/login, etc.
        '/*/*/register',
        '/*/*/dashboard',     // Bloquea /es/dashboard
        '/*/*/unsubscribe',   // Bloquea páginas de gestión de alertas
        
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