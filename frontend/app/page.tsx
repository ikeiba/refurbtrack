"use client"

import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/header"
import { HomeHero } from "@/components/home-hero"
import { FamilyGrid } from "@/components/family-grid"
import { HistoricalLowsCarousel } from "@/components/historical-lows-carousel"
import { Toaster } from "@/components/ui/toaster"
import { getProducts, getHistoricalLowOffers } from "@/services/api"
import type { ProductSummary, OfferSummary } from "@/lib/types"
import { useRouter, useSearchParams } from "next/navigation"
import { WhyRefurbished } from "@/components/why-refurbished"

function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // ESTADOS
  const [selectedCountry, setSelectedCountry] = useState("ES")
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [hotOffers, setHotOffers] = useState<OfferSummary[]>([]) // <--- Nuevo Estado
  const [loading, setLoading] = useState(true)
  
  // 1. SOLUCIÓN: Definimos el estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState("") // <--- AÑADIDO

  useEffect(() => {
    const urlQuery = searchParams.get("q") || ""
    setSearchQuery(urlQuery)
  }, [searchParams])

  // CARGA DE DATOS
  // CARGA DE DATOS
  useEffect(() => {
    setLoading(true)
    
    // Usamos Promise.all para cargar las dos cosas a la vez (paralelo)
    Promise.all([
        getProducts(),
        getHistoricalLowOffers()
    ])
      .then(([productsData, offersData]) => {
        setProducts(productsData)
        setHotOffers(offersData) // <--- Guardamos las ofertas
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // (OPCIONAL) Filtrado: Si escribes, que el grid cambie
  const filteredProducts = products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleHeaderSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* HEADER CONECTADO AL ESTADO */}
      <Header 
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        
        // 2. SOLUCIÓN: Pasamos las variables de verdad
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        
        // Evitamos que explote si das click al menú en móvil
        onMenuClick={() => console.log("Menú click")} 
      />
      
      {/* HERO (Solo mostrar si no se busca nada, queda mejor) */}
      {!searchQuery && <HomeHero />}
      
      {/* CARRUSEL DE OFERTAS CONCRETAS */}
      {/* Usamos hotOffers en vez de products */}
      {!searchQuery && hotOffers.length > 0 && (
          <HistoricalLowsCarousel 
            offers={hotOffers} 
            // Truco: Al hacer click, vamos al producto pero con params para pre-seleccionar
            // url: /product/12?color=Blue&storage=128GB&condition=Good
            
            onOfferClick={
              (o) => {
                const batteryParam = o.battery_new ? 'new' : 'standard'
                router.push(`/product/${o.product_id}?color=${o.color}&storage=${o.storage}&condition=${o.condition}&battery=${batteryParam}`)
              }
            }
          />
       )}

      {/* Grid (Gris otra vez) */}
      {/* 3. CAMBIO: Envolvemos el grid en un div con fondo gris */}
      <div className="bg-muted/30 border-border min-h-[50vh] py-4">
        {loading ? (
            <div className="text-center text-muted-foreground">Cargando catálogo...</div>
        ) : (
            <FamilyGrid products={filteredProducts} />
        )}
      </div>

      {/* --- AÑADIR AQUÍ LA SECCIÓN --- */}
        {/* Solo la mostramos si no están buscando, para no ensuciar los resultados */}
        {!searchQuery && (
          <div className="mt-12">
            <WhyRefurbished />
          </div>
        )}

      <Toaster />
    </div>
  )
}


export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}