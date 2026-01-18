"use client"

import { useEffect, useState, use } from "react"
import { getProductDetail, getOfferHistory } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Bell, TrendingDown, Info } from "lucide-react"
import { ProductGallery } from "@/components/product-gallery"
import PriceHistoryChart from "@/components/price-history-chart"
import { ComparisonPopover } from "@/components/comparison-popover"
import type { Offer } from "@/lib/types"
import { AlertModal } from "@/components/alert-modal"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // --- ESTADOS DE SELECCIÓN ---
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedStorage, setSelectedStorage] = useState<string>("")
  const [selectedCondition, setSelectedCondition] = useState<string>("Good")
  const [selectedBattery, setSelectedBattery] = useState<boolean>(false)

  // --- ESTADO DEL MODAL DE ALERTA ---
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // --- ESTADO DEL GRÁFICO ---
  const [chartData, setChartData] = useState<{ name: string; color?: string; data: any[] }[]>([])

  // 1. CARGA INICIAL
  useEffect(() => {
    getProductDetail(id).then((data) => {
      setProduct(data)
      if (data.specs.length > 0) {
        setSelectedColor(data.specs[0].color)
        setSelectedStorage(data.specs[0].storage)
      }
      setLoading(false)
    })
  }, [id])

  // 2. BUSCAR OFERTA ACTIVA
  const activeSpec = product?.specs.find(
    (s: any) => s.color === selectedColor && s.storage === selectedStorage
  )
  
  const activeOffer = activeSpec?.offers.find(
    (o: any) => o.condition === selectedCondition && o.battery_new === selectedBattery
  )

  // 3. CARGA HISTORIAL PRINCIPAL
  useEffect(() => {
    if (activeOffer) {
      getOfferHistory(activeOffer.id).then((history) => {
        setChartData([
            { 
                name: `${activeSpec?.storage} - ${selectedCondition}`, 
                data: history,
                color: "#2563eb" // Azul
            }
        ])
      })
    } else {
        setChartData([])
    }
  }, [activeOffer, activeSpec, selectedCondition])

  // 4. AÑADIR COMPARACIÓN
  const handleAddComparison = async (targetOffer: Offer, label: string) => {
    if (chartData.some(series => series.name === label)) return; 

    try {
        const history = await getOfferHistory(targetOffer.id);
        if (history.length > 0) {
            setChartData(prev => [
                ...prev,
                {
                    name: label,
                    data: history,
                    color: "#db2777" // Rosa
                }
            ])
        }
    } catch (e) {
        console.error("Error cargando comparativa", e);
    }
  }

  if (loading || !product) return <div className="p-20 text-center text-muted-foreground">Cargando...</div>

  const colors = Array.from(new Set(product.specs.map((s: any) => s.color))) as string[]
  const storages = Array.from(new Set(product.specs.map((s: any) => s.storage))) as string[]

  // ==========================================
  // LÓGICA DE IMAGEN CORREGIDA
  // ==========================================
  
  // 1. Decidir qué ruta usar (Spec > Producto > Placeholder)
  let rawImage = "/placeholder.jpg"; // Por defecto

  if (activeSpec?.image) {
    rawImage = activeSpec.image;
  } else if (product?.image) {
    rawImage = product.image;
  }

  // 2. Asegurar que empieza por "/" para que sea una ruta absoluta desde la raíz
  // Si rawImage ya es "/products/...", lo dejamos. Si es "products/...", le ponemos la barra.
  const finalImage = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;

  // ==========================================
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        
        {/* IMAGEN */}
        <div className="h-fit sticky top-24">
            <ProductGallery images={[finalImage]} />
        </div>

        {/* CONFIGURADOR */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-end gap-3">
                {activeOffer ? (
                    <>
                        <span className="text-4xl font-bold text-primary">{activeOffer.current_price}€</span>
                        {activeOffer.last_updated && (
                            <span className="text-sm text-muted-foreground mb-1">
                                Actualizado: {new Date(activeOffer.last_updated).toLocaleDateString()}
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-2xl text-muted-foreground">No disponible</span>
                )}
            </div>
          </div>

          <Separator />

          {/* COLOR */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-muted-foreground">Color: <span className="text-foreground font-semibold">{selectedColor}</span></span>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  onClick={() => setSelectedColor(color)}
                  className="rounded-full px-6 min-w-[100px]"
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* ALMACENAMIENTO */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-muted-foreground">Almacenamiento</span>
            <div className="flex flex-wrap gap-2">
              {storages.map((storage) => (
                <Button
                  key={storage}
                  variant={selectedStorage === storage ? "default" : "outline"}
                  onClick={() => setSelectedStorage(storage)}
                  className="min-w-[80px]"
                >
                  {storage}
                </Button>
              ))}
            </div>
          </div>

          {/* ESTADO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Estado</span>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["Fair", "Good", "Excellent", "Premium"].map((cond) => (
                <Button
                  key={cond}
                  variant={selectedCondition === cond ? "default" : "outline"}
                  onClick={() => setSelectedCondition(cond)}
                  className="w-full text-xs sm:text-sm px-0"
                >
                  {cond}
                </Button>
              ))}
            </div>
          </div>

          {/* BATERÍA */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-muted-foreground">Batería</span>
            <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={!selectedBattery ? "default" : "outline"}
                  onClick={() => setSelectedBattery(false)}
                >
                  Estándar
                </Button>
                <Button
                  variant={selectedBattery ? "default" : "outline"}
                  onClick={() => setSelectedBattery(true)}
                >
                  Nueva (100%)
                </Button>
            </div>
          </div>

          {/* ALERTA */}
          <div className="pt-4 space-y-3">
            <Button 
                className="w-full h-12 text-lg gap-2" 
                size="lg"
                disabled={!activeSpec}
                onClick={() => setIsAlertOpen(true)} 
            >
                <Bell className="w-5 h-5" />
                Crear Alerta de Precio
            </Button>
          </div>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-primary" />
                Histórico de Precios
            </h2>
            <div className="ml-auto">
                <ComparisonPopover onCompare={handleAddComparison} />
            </div>
        </div>
        
        <Card className="p-6 bg-card border shadow-sm h-[400px]">
             {/* AQUÍ ESTABA EL ERROR: Simplificado */}
             {chartData.length > 0 ? (
                <PriceHistoryChart series={chartData} />
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <TrendingDown className="w-10 h-10 mb-2 opacity-20" />
                    <p>No hay historial suficiente para esta configuración.</p>
                </div>
             )}
        </Card>
      </div>
        {product && activeOffer && (
            <AlertModal 
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                product={product} // Pasamos el producto entero para que sepa qué opciones hay
                currentConfig={{
                    color: selectedColor,
                    storage: selectedStorage,
                    condition: selectedCondition,
                    batteryNew: selectedBattery,
                    price: activeOffer.current_price || 0
                }}
            />
        )}
    </div>
  )
}