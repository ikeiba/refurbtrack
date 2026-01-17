"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { HomeHero } from "@/components/home-hero"
import { FamilyGrid } from "@/components/family-grid" // Usaremos el de v0 adaptado
import { Toaster } from "@/components/ui/toaster"
import { getProducts } from "@/services/api" // Tu API real
import type { ProductSummary } from "@/lib/types" // Tu tipo real

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState("ES")
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Cargar datos reales de Django al iniciar
  useEffect(() => {
    getProducts()
      .then((data) => {
        console.log("Productos cargados:", data)
        setProducts(data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Usamos el Header de v0 */}
      <Header 
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry} searchQuery={""} onSearchChange={function (query: string): void {
          throw new Error("Function not implemented.")
        } } onMenuClick={function (): void {
          throw new Error("Function not implemented.")
        } }      />
      
      {/* Usamos el Hero de v0 */}
      <HomeHero />
      
      {/* Aquí está la clave: Pasamos los productos reales al Grid.
         Nota: Hemos quitado 'onSelectFamily' porque ahora usaremos Links directos.
      */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Cargando catálogo...</div>
      ) : (
        <FamilyGrid products={products} />
      )}

      {/* Nota: He quitado la CompareBar global por ahora. 
        Como dijiste, prefieres la comparación dentro del gráfico del producto.
      */}
      
      <Toaster />
    </div>
  )
}