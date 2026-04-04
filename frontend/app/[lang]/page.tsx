// app/[lang]/page.tsx
import { getProducts, getHistoricalLowOffers } from "@/services/api"
import HomePageClient from "@/components/home-page-client"
import { Metadata } from "next"

// Añade esta línea mágica para activar el ISR
export const revalidate = 600;

// Generación de metadata para la Home
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const lang = (await params).lang;
  
  return {
    // Esto asegura que la Home oficial SIEMPRE es /es (sin parámetros)
    alternates: {
      canonical: `/${lang}` 
    }
  }
}

// SEO ELITE: Metadatos estáticos generados en el servidor
export default async function HomePage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  // 2. Resolvemos el idioma (obligatorio en Next.js 16 para rutas dinámicas)
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  // 3. Tu lógica de fetch en paralelo (¡Perfecta!)
  const [products, hotOffers] = await Promise.all([
    getProducts(),
    getHistoricalLowOffers()
  ])

  return (
    <main>
      {/* Pasamos los datos ya resueltos al componente interactivo.
        Si en el futuro HomePageClient necesita traducir algo, 
        solo tendrás que pasarle el lang como prop (lang={lang}).
      */}
      <HomePageClient initialProducts={products} initialHotOffers={hotOffers} />
    </main>
  )
}