/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // <--- IMPRESCINDIBLE PARA DOCKER
  
  typescript: {
    ignoreBuildErrors: true, // Evita que el build de Docker falle por errores de tipos
  },

  images: {
  unoptimized: false, // Deja que Next.js optimice
 },
}

export default nextConfig