"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { HomeHero } from "@/components/home-hero"
import { FamilyGrid } from "@/components/family-grid"
import { HistoricalLowsCarousel } from "@/components/historical-lows-carousel"
import { Toaster } from "@/components/ui/toaster"
import { WhyRefurbished } from "@/components/why-refurbished"
import { useRouter, useSearchParams } from "next/navigation"
import type { ProductSummary, OfferSummary } from "@/lib/types"

interface HomePageClientProps {
  initialProducts: ProductSummary[];
  initialHotOffers: OfferSummary[];
}

export default function HomePageClient({ initialProducts, initialHotOffers }: HomePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedCountry, setSelectedCountry] = useState("ES")
  const [searchQuery, setSearchQuery] = useState("")

  // Sincronizar búsqueda con URL (esto sí se queda en el cliente)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || ""
    setSearchQuery(urlQuery)
  }, [searchParams])

  // Filtrado instantáneo (ya tenemos los datos)
  const filteredProducts = initialProducts.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleHeaderSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onMenuClick={() => console.log("Menú click")} 
      />
      
      {!searchQuery && <HomeHero />}
      
      {!searchQuery && initialHotOffers.length > 0 && (
          <HistoricalLowsCarousel 
            offers={initialHotOffers} 
            onOfferClick={(o) => {
              const batteryParam = o.battery_new ? 'new' : 'standard'
              router.push(`/es/${o.category_slug}/${o.brand_slug}/${o.product_slug}/${o.spec_slug}?condition=${o.condition}&battery=${batteryParam}`)
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