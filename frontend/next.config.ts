/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // <--- IMPRESCINDIBLE PARA DOCKER
  
  typescript: {
    ignoreBuildErrors: true, // Evita que el build de Docker falle por errores de tipos
  },

  images: {
  unoptimized: false, // Deja que Next.js optimice
 },
 async redirects() {
    return [
      {
        source: '/product/5',
        destination: '/es/smartphone/apple/iphone-13/reacondicionado-128gb-medianoche',
        permanent: true,
      },
      {
        source: '/product/11',
        destination: '/es/smartphone/apple/iphone-16/reacondicionado-128gb-blanco',
        permanent: true,
      },
      // El resto por si Google tiene más indexadas que aún no aparecen
      { source: '/product/1', destination: '/es/smartphone/apple/iphone-11/reacondicionado-64gb-rojo', permanent: true },
      { source: '/product/2', destination: '/es/smartphone/apple/iphone-11-pro/reacondicionado-64gb-gris-espacial', permanent: true },
      { source: '/product/3', destination: '/es/smartphone/apple/iphone-12/reacondicionado-64gb-blanco', permanent: true },
      { source: '/product/4', destination: '/es/smartphone/apple/iphone-12-pro/reacondicionado-128gb-azul-pacifico', permanent: true },
      { source: '/product/6', destination: '/es/smartphone/apple/iphone-13-pro/reacondicionado-128gb-azul-alpino', permanent: true },
      { source: '/product/7', destination: '/es/smartphone/apple/iphone-14/reacondicionado-128gb-medianoche', permanent: true },
      { source: '/product/8', destination: '/es/smartphone/apple/iphone-14-pro/reacondicionado-256gb-morado-oscuro', permanent: true },
      { source: '/product/9', destination: '/es/smartphone/apple/iphone-15/reacondicionado-128gb-amarillo', permanent: true },
      { source: '/product/10', destination: '/es/smartphone/apple/iphone-15-pro/reacondicionado-128gb-titanio-blanco', permanent: true },
      { source: '/product/12', destination: '/es/smartphone/apple/iphone-16-pro/reacondicionado-128gb-titanio-desierto', permanent: true },
    ]
  },
 // Inyección de cabeceras para CDNs

  /*async headers() {
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
  },*/
  
}

export default nextConfig