// app/page.tsx
import { getProducts, getHistoricalLowOffers } from "@/services/api"
import HomePageClient from "@/components/home-page-client"
import { Metadata } from "next"

// SEO ELITE: Metadatos estáticos generados en el servidor
export const metadata: Metadata = {
  title: "RefurbTrack | Compara precios de tecnología reacondicionada",
  description: "Encuentra los mejores chollos en iPhone, Samsung y más. Histórico de precios y alertas de bajada.",
  alternates: { canonical: "https://refurbtrack.com" }
}

export default async function HomePage() {
  // Fetch en paralelo directo desde el servidor (sin 'Cargando...')
  const [products, hotOffers] = await Promise.all([
    getProducts(),
    getHistoricalLowOffers()
  ])

  return (
    <main>
      {/* Pasamos los datos ya resueltos al componente interactivo */}
      <HomePageClient initialProducts={products} initialHotOffers={hotOffers} />
    </main>
  )
}