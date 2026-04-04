"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { HomeHero } from "@/components/home-hero"
import { FamilyGrid } from "@/components/family-grid"
import { HistoricalLowsCarousel } from "@/components/historical-lows-carousel"
import { Toaster } from "@/components/ui/toaster"
import { WhyRefurbished } from "@/components/why-refurbished"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import type { ProductSummary, OfferSummary } from "@/lib/types"

interface HomePageClientProps {
  initialProducts: ProductSummary[];
  initialHotOffers: OfferSummary[];
}

export default function HomePageClient({ initialProducts, initialHotOffers }: HomePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const lang = params?.lang || "es" // Capturamos el idioma
  
  const [selectedCountry, setSelectedCountry] = useState("ES")
  // 1. Inicializamos el estado leyendo directamente de la URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  // 2. Si la URL cambia (porque alguien usó las flechas de Atrás/Adelante), actualizamos el input
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "")
  }, [searchParams])

  const filteredProducts = initialProducts.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 3. Manejador para el filtrado INSTANTÁNEO (Mientras el usuario teclea)
  const handleInstantSearch = (query: string) => {
    setSearchQuery(query)

    // FIX: Si el usuario borra todo el texto, limpiamos la URL automáticamente
    // para mantener sincronizada la interfaz con el enlace.
    if (query.trim() === "") {
      router.replace(`/${lang}`, { scroll: false })
    }
  }

  // 4. Manejador para cuando el usuario pulsa ENTER (Fijamos la URL)
  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim()
    const targetUrl = trimmed 
      ? `/${lang}?q=${encodeURIComponent(trimmed)}` 
      : `/${lang}`
      
    // Usamos replace para no ensuciar el historial de navegación excesivamente
    router.replace(targetUrl, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        searchQuery={searchQuery} 
        
        // Pasamos ambos manejadores al Header
        onSearchChange={handleInstantSearch} 
        onSearchSubmit={handleSearchSubmit}
        
        onMenuClick={() => console.log("Menú click")} 
      />
      
      {!searchQuery && <HomeHero />}
      
      {!searchQuery && initialHotOffers.length > 0 && (
          <HistoricalLowsCarousel 
            offers={initialHotOffers} 
            onOfferClick={(o) => {
              const batteryParam = o.battery_new ? 'new' : 'standard'
              // Usamos la variable de idioma dinámica
              router.push(`/${lang}/${o.category_slug}/${o.brand_slug}/${o.product_slug}/${o.spec_slug}?condition=${o.condition}&battery=${batteryParam}`)
            }}
          />
       )}

      <div className="bg-muted/30 border-border min-h-[50vh] py-4">
        {/* Desaparece el condicional de loading. El Grid se pinta al instante */}
        <FamilyGrid products={filteredProducts} />
      </div>

      {!searchQuery && (
        <div className="mt-12">
          <WhyRefurbished />
        </div>
      )}

      <Toaster />
    </div>
  )
}