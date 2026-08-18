// app/[locale]/page.tsx
import { getProducts, getHistoricalLowOffers } from "@/services/api"
import HomePageClient from "@/components/home-page-client"
import { Metadata } from "next"
import { parseLocale } from "@/lib/i18n"

// Añade esta línea mágica para activar el ISR
// export const revalidate = 600;
export const dynamic = 'force-dynamic'

// Generación de metadata para la Home
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    // La Home oficial SIEMPRE apunta al locale correcto
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "es-es": "/es-es",
        "en-gb": "/en-gb",
      },
    }
  }
}

// SEO ELITE: Metadatos estáticos generados en el servidor
export default async function HomePage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  // 2. Resolvemos el locale (obligatorio en Next.js 16 para rutas dinámicas)
  const resolvedParams = await params;
  const locale = parseLocale(resolvedParams.locale);

  // 3. Fetch en paralelo filtrando por mercado (Fase 4)
  const [products, hotOffers] = await Promise.all([
    getProducts(locale),
    getHistoricalLowOffers(locale)
  ])

  return (
    <main>
      <HomePageClient initialProducts={products} initialHotOffers={hotOffers} locale={locale} />
    </main>
  )
}
