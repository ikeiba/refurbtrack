import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Opcional: Leer variable de entorno para saber si estamos en producción real
  const isDev = process.env.NODE_ENV === 'development'
  const baseUrl = 'https://refurbtrack.com'

  if (isDev) {
    // En local o entornos de prueba, bloqueamos TODO para que Google no nos indexe basura
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  // En producción, aplicamos las reglas reales
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/out/',        // ⛔️ CRÍTICO: Bloqueamos la telemetría y afiliación
        '/api/auth/',       // ⛔️ Bloqueamos endpoints de autenticación
        '/dashboard/',      // ⛔️ Bloqueamos áreas privadas de usuario (si las tienes)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}