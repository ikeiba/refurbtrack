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
import { cn, getColorHex } from "@/lib/utils" // <--- Importamos tus nuevas funciones
import { Header } from "@/components/header" // El componente visual
import { useRouter, useSearchParams } from "next/navigation" // <--- ¡IMPORTANTE: next/navigation!
import { useToast } from "@/hooks/use-toast" // Asegúrate de importar esto para las alertas
import { CHART_COLORS } from "@/lib/utils" // Importa la paleta de colores
import { t } from "@/lib/translations"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
    
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Estado para el selector de país del header
  const [country, setCountry] = useState("ES")

  // 2. AÑADE ESTA LÍNEA AQUÍ (Faltaba esto):
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- ESTADOS DE SELECCIÓN ---
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedStorage, setSelectedStorage] = useState<string>("")
  const [selectedCondition, setSelectedCondition] = useState<string>("Fair")
  const [selectedBattery, setSelectedBattery] = useState<boolean>(false)

  // --- ESTADO DEL MODAL DE ALERTA ---
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // --- ESTADO DEL GRÁFICO ---
  const [chartData, setChartData] = useState<{ name: string; color?: string; data: any[] }[]>([])

  const { toast } = useToast() // Hook para notificaciones

  // 1. Función auxiliar para actualizar la URL sin recargar
  const updateUrl = (key: string, value: string) => {
    // Copiamos los parámetros actuales
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    // Actualizamos o borramos la clave que ha cambiado
    if (value) {
        current.set(key, value)
    } else {
        current.delete(key)
    }

    // Construimos la nueva URL
    const search = current.toString()
    const query = search ? `?${search}` : ""
    
    // Navegamos (scroll: false es importante para que no salte arriba)
    router.replace(`/product/${id}${query}`, { scroll: false })
  }

  // 2. Wrappers: Funciones puente que actualizan Estado + URL
  const changeColor = (color: string) => {
      setSelectedColor(color)
      updateUrl("color", color)
  }
  const changeStorage = (storage: string) => {
      setSelectedStorage(storage)
      updateUrl("storage", storage)
  }
  const changeCondition = (condition: string) => {
      setSelectedCondition(condition)
      updateUrl("condition", condition)
  }
  const changeBattery = (isNew: boolean) => {
      setSelectedBattery(isNew)
      updateUrl("battery", isNew ? "new" : "standard")
  }


  // 1. CARGA INICIAL
  useEffect(() => {
    getProductDetail(id).then((data) => {
      setProduct(data)
      
      if (data.specs.length > 0) {
        // 1. LEER URL
        const paramColor = searchParams.get("color")
        const paramStorage = searchParams.get("storage")
        const paramCondition = searchParams.get("condition")
        const paramBattery = searchParams.get("battery")

        // 2. CALCULAR VALORES FINALES (Prioridad: URL > Defecto)
        const availableColors = Array.from(new Set(data.specs.map((s: any) => s.color)))
        const availableStorages = Array.from(new Set(data.specs.map((s: any) => s.storage)))

        // Color
        const finalColor = (paramColor && availableColors.includes(paramColor)) 
            ? paramColor 
            : data.specs[0].color

        // Storage
        const finalStorage = (paramStorage && availableStorages.includes(paramStorage)) 
            ? paramStorage 
            : data.specs[0].storage

        // Condición (Default: Fair)
        const finalCondition = paramCondition || "Fair"
        
        // Batería (Default: Standard/false)
        let finalBattery = false
        if (paramBattery === "new") finalBattery = true
        // Si no hay param o es "standard", se queda en false
        
        // 3. ACTUALIZAR ESTADOS VISUALES
        setSelectedColor(finalColor as string)
        setSelectedStorage(finalStorage as string)
        setSelectedCondition(finalCondition)
        setSelectedBattery(finalBattery)

        // 4. SINCRONIZAR URL (La clave de todo)
        // Construimos la URL perfecta con los valores finales y reemplazamos la actual
        const newParams = new URLSearchParams()
        newParams.set("color", finalColor as string)
        newParams.set("storage", finalStorage as string)
        newParams.set("condition", finalCondition)
        newParams.set("battery", finalBattery ? "new" : "standard")
        
        // router.replace cambia la URL sin recargar la página
        router.replace(`/product/${id}?${newParams.toString()}`, { scroll: false })
      }
      setLoading(false)
    })
    // IMPORTANTE: Añade searchParams al array de dependencias para silenciar warnings,
    // aunque en este caso solo queremos que corra al montar (id).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // 2. BUSCAR OFERTA ACTIVA
  const activeSpec = product?.specs.find(
    (s: any) => s.color === selectedColor && s.storage === selectedStorage
  )
  
  const activeOffer = activeSpec?.offers.find(
    (o: any) => o.condition === selectedCondition && o.battery_new === selectedBattery
  )

  // 3. CARGA HISTORIAL PRINCIPAL (MODIFICADO)
  useEffect(() => {
    if (activeOffer && product) { // Aseguramos que product existe para usar su nombre
      getOfferHistory(activeOffer.id).then((history) => {
        // Mantenemos las comparaciones existentes si las hubiera, pero actualizamos la primera (Principal)
        setChartData(prevData => {
            // Nombre completo: "iPhone 13 - 128GB - Fair"
            const mainSeriesName = `${product.name} ${t(activeSpec?.color)} ${activeSpec?.storage}GB - ${t(selectedCondition)}`;
            
            const mainSeries = { 
                name: mainSeriesName, 
                data: history,
                color: CHART_COLORS[0] // Siempre el verde esmeralda para el principal
            };

            return [mainSeries];
        })
      })
    } else {
        // Si no hay oferta activa, podríamos vaciar o dejarlo.
        // setChartData([]) 
    }
  }, [activeOffer, activeSpec, selectedCondition, product]) // Añadimos 'product' a dependencias

  // 4. AÑADIR COMPARACIÓN (MODIFICADO)
  const handleAddComparison = async (targetOffer: Offer, label: string) => {
    // 1. NUEVA COMPROBACIÓN: ¿Es el mismo que el principal?
    if (activeOffer && targetOffer.id === activeOffer.id) {
        toast({
            title: "Modelo actual",
            description: "No puedes comparar el producto con sí mismo.",
            variant: "default" // O "destructive" si prefieres rojo
        })
        return;
    }
    // A. Límite de 6 modelos
    if (chartData.length >= 6) {
        toast({
            title: "Límite alcanzado",
            description: "Solo puedes comparar hasta 6 modelos a la vez.",
            variant: "default"
        })
        return;
    }

    if (chartData.some(series => series.name === label)) {
        toast({ title: "Ya añadido", description: "Este modelo ya está en la gráfica." })
        return; 
    }

    try {
        const history = await getOfferHistory(targetOffer.id);
        if (history.length > 0) {
            setChartData(prev => [
                ...prev,
                {
                    name: label,
                    data: history,
                    // B. Asignación de color: Cogemos el color correspondiente al índice actual
                    color: CHART_COLORS[prev.length] || "#888888" 
                }
            ])
        }
    } catch (e) {
        console.error("Error cargando comparativa", e);
    }
  }

  // 5. NUEVA FUNCIÓN: ELIMINAR SERIE
  const handleRemoveSeries = (seriesName: string) => {
      setChartData(prev => prev.filter(s => s.name !== seriesName));
      // Nota: Al borrar, los colores de los que quedan NO cambian, lo cual es bueno para no confundir.
      // Si añades uno nuevo después de borrar, cogerá el slot de color libre al final.
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

  // HELPER: Calcula el precio "desde" para cada botón de almacenamiento
  const getMinPriceForStorage = (storageSize: string) => {
    // Filtramos todas las specs que tengan este almacenamiento
    const specs = product.specs.filter((s: any) => s.storage === storageSize);
    if (specs.length === 0) return "---";

    // Sacamos los precios. Si es null, ponemos un número alto para que no sea el mínimo
    const prices = specs.map((s: any) => Number(s.min_price_cached || 999999));
    const min = Math.min(...prices);
    
    return min === 999999 ? "---" : min;
  }
  return (
    <div className="min-h-screen bg-background pb-20"> {/* Wrapper general */}
    {/* --- HEADER AÑADIDO --- */}
      <Header 
        selectedCountry={country}
        onCountryChange={setCountry}
        showBackButton={true} // Activamos la flecha
        onBackClick={() => router.push("/")} // Al hacer clic, vuelve a la Home
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 items-start">
          
          {/* COLUMNA IZQUIERDA: IMAGEN */}
          {/* CAMBIO 2: Añadimos restricciones de anchura */}
          {/* 'w-full': Ocupa todo el ancho disponible... */}
          {/* 'max-w-[550px]': ...pero nunca pases de 550px. */}
          {/* 'mx-auto lg:ml-auto': Centrado en móviles, alineado a la derecha en PC. */}
          <div className="h-fit sticky top-24 w-full max-w-[550px] mx-auto lg:ml-auto">
              <ProductGallery images={[finalImage]} />
          </div>

          {/* CONFIGURADOR */}
          {/* === COLUMNA DERECHA (NUEVO DISEÑO) === */}
          <div className="flex flex-col gap-3 mt-12">
              
              {/* 1. HEADER (Título y Estrellas) */}
              <div className="flex items-start justify-between">
                  <div>
                      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{product.name}</h1>
                      <div className="mt-2 flex items-center gap-2">
                      </div>
                  </div>
              </div>

              <Separator />

              {/* 2. SELECTOR ALMACENAMIENTO (Botones rectangulares con precio) */}
              <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Almacenamiento</h3>
                  <div className="flex flex-wrap gap-2">
                      {storages.map((storage) => {
                          const isSelected = selectedStorage === storage;
                          const price = getMinPriceForStorage(storage);
                          
                          return (
                              <button
                                  key={storage}
                                  // Antes: onClick={() => setSelectedStorage(storage)}
                                  // AHORA:
                                  onClick={() => changeStorage(storage)}
                                  className={cn(
                                      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-10 rounded-md gap-1.5 px-4 min-w-fit border",
                                      isSelected 
                                          ? "bg-emerald-600 text-background" 
                                          : "bg-background shadow-sm hover:bg-accent hover:text-accent-foreground border-input"
                                  )}
                              >
                                  <span className="font-semibold">{storage}GB</span>
                                  <span className={cn("ml-2 text-xs", isSelected ? "opacity-90" : "opacity-60")}>
                                      (desde {price}€)
                                  </span>
                              </button>
                          )
                      })}
                  </div>
              </div>

              {/* 3. SELECTOR COLOR (Círculos) */}
              <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Color</h3>
                  <div className="flex flex-wrap gap-3">
                      {colors.map((color) => {
                          const isSelected = selectedColor === color;
                          return (
                              <button 
                                  key={color}
                                  // Antes: onClick={() => setSelectedColor(color)}
                                  // AHORA:
                                  onClick={() => changeColor(color)}
                                  className={cn(
                                      "h-10 w-10 rounded-full border-2 transition-all shadow-sm",
                                      isSelected 
                                          ? "border-foreground ring-2 ring-offset-2 ring-foreground" 
                                          : "border-transparent hover:scale-110 hover:border-border"
                                  )}
                                  style={{ backgroundColor: getColorHex(color) }}
                                  title={t(color)}
                              >
                                  <span className="sr-only">{color}</span>
                              </button>
                          )
                      })}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground font-medium">
                    {t(selectedColor)} {/* Muestra "Azul" aunque selectedColor sea "Blue" */}
                  </p>
              </div>

              {/* 4. SELECTOR ESTADO & BATERÍA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Estado */}
                  <div>
                      <h3 className="mb-3 text-sm font-medium text-muted-foreground flex items-center gap-1">
                          Estado <Info className="w-3 h-3 cursor-help"/>
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                          {["Fair", "Good", "Excellent", "Premium"].map((cond) => {
                              const hasStock = activeSpec?.offers.some((o: any) => o.condition === cond);
                              return (
                                  <Button
                                      key={cond}
                                      variant={selectedCondition === cond ? "default" : "outline"}
                                      // Antes: onClick={() => setSelectedCondition(cond)}
                                      // AHORA:
                                      onClick={() => changeCondition(cond)}
                                      disabled={!hasStock}
                                      className={cn("h-8 text-xs", selectedCondition === cond ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                                  >
                                      {t(cond)}
                                  </Button>
                              )
                          })}
                      </div>
                  </div>
                  {/* Batería */}
                  <div>
                      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Batería</h3>
                      <div className="grid grid-cols-2 gap-2">
                          <Button
                              variant={!selectedBattery ? "default" : "outline"}
                              // Antes: onClick={() => setSelectedBattery(false)}
                              // AHORA:
                              onClick={() => changeBattery(false)} 
                              className={cn("h-8 text-xs", !selectedBattery ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                          >
                              {t("standard")} {/* Muestra "Estándar" */}
                          </Button>
                          <Button
                              variant={selectedBattery ? "default" : "outline"}
                              // Antes: onClick={() => setSelectedBattery(true)}
                              // AHORA:
                              onClick={() => changeBattery(true)}
                              className={cn("h-8 text-xs", selectedBattery ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                          >
                              {t("new")} {/* Muestra "Nueva" */}
                          </Button>
                      </div>
                  </div>
              </div>

              {/* 5. RESUMEN FINAL Y PRECIO */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Configuración seleccionada</p>
                  <p className="mt-1 font-semibold text-lg">
                      {product.name} · {selectedStorage}GB · {t(selectedColor)} · {t(selectedCondition)}
                  </p>
                  
                  <div className="mt-2 flex items-baseline gap-3">
                      {activeOffer ? (
                          <>
                              <p className="text-3xl font-bold text-emerald-600">
                                  {activeOffer.current_price}€
                              </p>
                              <span className="text-sm text-muted-foreground">
                                  {activeOffer.battery_new ? "Batería Nueva" : "Batería Estándar"}
                              </span>
                          </>
                      ) : (
                          <p className="text-xl text-muted-foreground">Sin stock para esta combinación</p>
                      )}
                  </div>
              </div>

              {/* 6. BOTÓN DE ALERTA */}
              <div>
                  <Button 
                      className="w-full h-12 text-lg gap-2 bg-emerald-600 hover:bg-emerald-700" 
                      size="lg"
                      disabled={!activeSpec} // Si no existe la combinación (ej: Color raro + GB raros)
                      onClick={() => setIsAlertOpen(true)}
                  >
                      <Bell className="w-5 h-5" />
                      Alerta
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
          
          <Card className="p-6 bg-card border shadow-sm h-[450px]"> {/* Aumenté un poco la altura para la leyenda */}
              {chartData.length > 0 ? (
                  <PriceHistoryChart 
                    series={chartData} 
                    onRemoveSeries={handleRemoveSeries} // <--- Pasamos la función
                  />
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
    </div>
  )
}