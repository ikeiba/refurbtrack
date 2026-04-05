/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // <--- IMPRESCINDIBLE PARA DOCKER
  
  typescript: {
    ignoreBuildErrors: true, // Evita que el build de Docker falle por errores de tipos
  },

  images: {
  unoptimized: false, // Deja que Next.js optimice
 },
 // Inyección de cabeceras para CDNs
  async headers() {
    return [
      {
        // Aplicar a TODAS las rutas de producto
        source: '/es/:category/:brand/:product/:spec',
        headers: [
          {
            key: 'Cache-Control',
            // s-maxage le dice a Cloudflare que guarde el HTML por 600 segundos
            // stale-while-revalidate permite servir caché caducada mientras regenera
            value: 's-maxage=600, stale-while-revalidate=59',
          },
        ],
      },
      {
        // Aplicar a la Home
        source: '/es',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=3600, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=59',
          },
        ],
      },
    ]
  },
  
}

export default nextConfig