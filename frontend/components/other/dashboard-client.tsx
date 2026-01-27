"use client"

import { useState, useRef, useMemo } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/other/hero-section"
import { HistoricalLowsCarousel } from "@/components/historical-lows-carousel"
import { FilterSidebar } from "@/components/other/filter-sidebar"
import { ProductGrid } from "@/components/other/product-grid"
import { PriceHistoryModal } from "@/components/other/price-history-modal"
import { Toaster } from "@/components/ui/toaster"
import type { Product, Filters, ScrapedProduct } from "@/lib/types"

// Definimos las props que recibirá este componente desde el servidor
interface DashboardClientProps {
  initialData: ScrapedProduct[]
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  // --- ADAPTER PATTERN ---
  // Convertimos los datos "feos" de la API a los datos "bonitos" que espera tu UI actual.
  // Esto es temporal mientras refactorizamos los componentes visuales en el futuro.
  const adaptedProducts: Product[] = useMemo(() => {
    return initialData.map((item) => ({
      id: item.id.toString(), // La UI espera string, API manda number
      title: item.product_name, // API manda product_name, UI espera title
      model: item.product_name, // Simplificación
      storage: item.storage || "N/A",
      color: item.color || "N/A",
      colorHex: "#333", // Placeholder porque la API aun no manda HEX
      condition: (item.condition as any) || "Good",
      newBattery: false, // Dato pendiente de la API
      price: Number(item.current_price) || 0,
      originalPrice: 0,
      newRetailPrice: 0,
      image: "/placeholder.svg", // Placeholder hasta que scrapeemos imagenes
      images: [],
      // Generamos un historial falso temporal para que no falle el componente visual
      priceHistory: item.current_price 
        ? [{ date: item.last_updated || new Date().toISOString(), price: Number(item.current_price) }] 
        : [],
      variants: []
    }))
  }, [initialData])

  // --- FIN ADAPTER ---

  const [selectedCountry, setSelectedCountry] = useState("ES")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    models: [],
    conditions: [],
    newBatteryOnly: false,
    storages: [],
    colors: [],
    priceRange: [0, 2000],
  })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const gridSectionRef = useRef<HTMLDivElement>(null)

  // Usamos adaptedProducts en lugar de mockProducts
  const filteredProducts = adaptedProducts.filter((product) => {
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filters.models.length > 0 && !filters.models.includes(product.model)) {
      return false
    }
    // Nota: Simplificamos filtros por ahora para probar la conexión
    return true
  })

  const historicalLowProducts = adaptedProducts.filter((product) => {
    if (!product.priceHistory.length) return false
    const minHistoricalPrice = Math.min(...product.priceHistory.map((h) => h.price))
    return product.price <= minHistoricalPrice
  })

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query)
    gridSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleTrendingClick = (term: string) => {
    if (term === "Battery New") {
      setFilters((prev) => ({ ...prev, newBatteryOnly: true }))
    } else {
      setFilters((prev) => ({ ...prev, models: [term] }))
    }
    gridSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <HeroSection onSearch={handleHeroSearch} onTrendingClick={handleTrendingClick} />

      {/* Solo mostramos el carrusel si hay datos reales con historial */}
      {historicalLowProducts.length > 0 && (
         <HistoricalLowsCarousel products={historicalLowProducts} onViewHistory={handleViewHistory} />
      )}

      <div ref={gridSectionRef} className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Catálogo en Vivo (Desde Django)</h2>
        </div>
        <div className="flex">
          {/*<FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />*/}
          <main className="flex-1 p-4 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filteredProducts.length} productos encontrados</p>
            </div>
            <ProductGrid products={filteredProducts} onViewHistory={handleViewHistory} />
          </main>
        </div>
      </div>

      <PriceHistoryModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toaster />
    </div>
  )
}