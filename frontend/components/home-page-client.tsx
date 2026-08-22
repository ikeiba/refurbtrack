"use client"

// 1. Añadimos Suspense a los imports
import { useState, useEffect, Suspense } from "react"
import { Header } from "@/components/header"
import { HomeHero } from "@/components/home-hero"
import { FamilyGrid } from "@/components/family-grid"
import { HistoricalLowsCarousel } from "@/components/historical-lows-carousel"
import { Toaster } from "@/components/ui/toaster"
import { WhyRefurbished } from "@/components/why-refurbished"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import type { ProductSummary, OfferSummary } from "@/lib/types"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { getSpecSlug } from "@/lib/i18n"

interface HomePageClientProps {
  initialProducts: ProductSummary[];
  initialHotOffers: OfferSummary[];
  locale?: string;
}

// EL MICRO-COMPONENTE INVISIBLE: Su única misión es leer la URL
function SearchQuerySync({ onUpdate }: { onUpdate: (q: string) => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    onUpdate(searchParams.get("q") || "")
  }, [searchParams, onUpdate])
  return null
}

export default function HomePageClient({ initialProducts, initialHotOffers, locale }: HomePageClientProps) {
  const router = useRouter()
  // 2. ¡ELIMINADO useSearchParams de aquí! El padre ya no lo sabe.
  const params = useParams()
  const resolvedLocale = parseLocale(locale ?? (params?.locale as string | undefined))
  const resolvedLanguage = getLanguage(resolvedLocale)
  
  const [selectedCountry, setSelectedCountry] = useState("ES")
  
  // 3. Inicializamos vacío. El micro-componente lo actualizará una fracción de segundo después si hay URL.
  const [searchQuery, setSearchQuery] = useState("")

  // 4. ¡ELIMINADO el useEffect que escuchaba a searchParams!

  const filteredProducts = initialProducts.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInstantSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      router.replace(`/${resolvedLocale}`, { scroll: false })
    }
  }

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim()
    const targetUrl = trimmed 
      ? `/${resolvedLocale}?q=${encodeURIComponent(trimmed)}` 
      : `/${resolvedLocale}`
      
    router.replace(targetUrl, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* 5. INYECTAMOS EL COMPONENTE INVISIBLE PROTEGIDO POR SUSPENSE */}
      <Suspense fallback={null}>
        <SearchQuerySync onUpdate={setSearchQuery} />
      </Suspense>

      <Header 
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        searchQuery={searchQuery} 
        onSearchChange={handleInstantSearch} 
        onSearchSubmit={handleSearchSubmit}
      />
      
      {!searchQuery && <HomeHero />}
      
      {!searchQuery && initialHotOffers.length > 0 && (
          <HistoricalLowsCarousel 
            offers={initialHotOffers} 
            onOfferClick={(o) => {
              const batteryParam = o.battery_new ? 'new' : 'standard'
              const specSlug = getSpecSlug({ slug: o.spec_slug, slug_en: o.spec_slug_en }, resolvedLocale)
              router.push(`/${resolvedLocale}/${o.category_slug}/${o.brand_slug}/${o.product_slug}/${specSlug}?condition=${o.condition}&battery=${batteryParam}`)
            }}
          />
       )}

      <div className="bg-muted/30 border-border min-h-[50vh] py-4">
        <FamilyGrid products={filteredProducts} locale={resolvedLocale} />
      </div>

      {!searchQuery && (
        <div className="mt-12">
          <WhyRefurbished language={resolvedLanguage} />
        </div>
      )}

      <Toaster />
    </div>
  )
}