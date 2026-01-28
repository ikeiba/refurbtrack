"use client"

import { useEffect, useState, use, useMemo } from "react"
import { getProductDetail, getOfferHistory } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Bell, TrendingDown, Info, Calendar, ArrowUp, ArrowDown, Activity, ExternalLink } from "lucide-react"
import { ProductGallery } from "@/components/product-gallery"
import PriceHistoryChart from "@/components/price-history-chart"
import { ComparisonPopover } from "@/components/comparison-popover"
import type { Offer } from "@/lib/types"
import { AlertModal } from "@/components/alert-modal"
import { cn, getColorHex, CHART_COLORS } from "@/lib/utils"
import { Header } from "@/components/header"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { t } from "@/lib/translations"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
    
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState("ES")

  const router = useRouter()
  const searchParams = useSearchParams()

  // ESTADOS DE SELECCIÓN
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedStorage, setSelectedStorage] = useState<string>("")
  const [selectedCondition, setSelectedCondition] = useState<string>("Fair")
  const [selectedBattery, setSelectedBattery] = useState<boolean>(false)

  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [chartData, setChartData] = useState<{ name: string; color?: string; data: any[] }[]>([])

  const { toast } = useToast()

  // 1. URL UPDATER
  const updateUrl = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (value) current.set(key, value)
    else current.delete(key)
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.replace(`/product/${id}${query}`, { scroll: false })
  }

  const changeColor = (color: string) => { setSelectedColor(color); updateUrl("color", color) }
  const changeStorage = (storage: string) => { setSelectedStorage(storage); updateUrl("storage", storage) }
  const changeCondition = (condition: string) => { setSelectedCondition(condition); updateUrl("condition", condition) }
  const changeBattery = (isNew: boolean) => { setSelectedBattery(isNew); updateUrl("battery", isNew ? "new" : "standard") }

  // 2. CARGA INICIAL
  useEffect(() => {
    getProductDetail(id).then((data) => {
      setProduct(data)
      
      if (data.specs.length > 0) {
        const paramColor = searchParams.get("color")
        const paramStorage = searchParams.get("storage")
        const paramCondition = searchParams.get("condition")
        const paramBattery = searchParams.get("battery")

        const availableColors = Array.from(new Set(data.specs.map((s: any) => s.color)))
        const availableStorages = Array.from(new Set(data.specs.map((s: any) => s.storage)))

        const finalColor = (paramColor && availableColors.includes(paramColor)) ? paramColor : data.specs[0].color
        const finalStorage = (paramStorage && availableStorages.includes(paramStorage)) ? paramStorage : data.specs[0].storage
        const finalCondition = paramCondition || "Fair"
        let finalBattery = false
        if (paramBattery === "new") finalBattery = true
        
        setSelectedColor(finalColor as string)
        setSelectedStorage(finalStorage as string)
        setSelectedCondition(finalCondition)
        setSelectedBattery(finalBattery)

        const newParams = new URLSearchParams()
        newParams.set("color", finalColor as string)
        newParams.set("storage", finalStorage as string)
        newParams.set("condition", finalCondition)
        newParams.set("battery", finalBattery ? "new" : "standard")
        
        router.replace(`/product/${id}?${newParams.toString()}`, { scroll: false })
      }
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const activeSpec = product?.specs.find(
    (s: any) => s.color === selectedColor && s.storage === selectedStorage
  )
  
  const activeOffer = activeSpec?.offers.find(
    (o: any) => o.condition === selectedCondition && o.battery_new === selectedBattery
  )

  // 3. CARGA HISTORIAL
  useEffect(() => {
    if (activeOffer && product) {
      getOfferHistory(activeOffer.id).then((history) => {
        setChartData(prevData => {
            const mainSeriesName = `${product.name} ${t(activeSpec?.color)} ${activeSpec?.storage}GB - ${t(selectedCondition)}`;
            const mainSeries = { 
                name: mainSeriesName, 
                data: history,
                color: CHART_COLORS[0]
            };
            return [mainSeries];
        })
      })
    }
  }, [activeOffer, activeSpec, selectedCondition, product])

  // 4. CALCULAR ESTADÍSTICAS EN TIEMPO REAL (Memoizado)
  const priceStats = useMemo(() => {
    if (!activeOffer) return null;

    // A. Datos básicos con protección anti-NaN
    const currentPrice = Number(activeOffer.current_price) || 0;
    
    // Si la API devuelve null o 0, usamos el precio actual como fallback
    let min30d = Number(activeOffer.min_price_30d);
    let max30d = Number(activeOffer.max_price_30d);

    // Fechas que vienen de la API
    let minDate = activeOffer.min_price_30d_date;
    let maxDate = activeOffer.max_price_30d_date;

    if (!min30d || isNaN(min30d)) min30d = currentPrice;
    if (!max30d || isNaN(max30d)) max30d = currentPrice;
    
    // B. Cálculo del Promedio (usando el historial cargado del gráfico)
    let avg30d = 0;
    // Buscamos los datos de la serie principal (la verde esmeralda)
    const historyPoints = chartData.find(s => s.color === CHART_COLORS[0])?.data || [];
    
    if (historyPoints.length > 0) {
        // Si hay gráfico, calculamos la media real exacta
        const sum = historyPoints.reduce((acc: number, curr: any) => acc + Number(curr.price), 0);
        avg30d = Math.round(sum / historyPoints.length);
        
        // CORRECCIÓN EXTRA: Si el historial tiene picos más altos que lo que dice la API (por lag de caché), 
        // actualizamos localmente y buscamos la fecha en el historial.
        const historyMax = Math.max(...historyPoints.map((p:any) => Number(p.price)));
        const historyMin = Math.min(...historyPoints.map((p:any) => Number(p.price)));
        
        if (historyMax > max30d) {
             max30d = historyMax;
             const point = historyPoints.find((p:any) => Number(p.price) === historyMax);
             if (point) maxDate = point.timestamp;
        }
        if (historyMin < min30d && historyMin > 0) {
             min30d = historyMin;
             const point = historyPoints.find((p:any) => Number(p.price) === historyMin);
             if (point) minDate = point.timestamp;
        }

    } else {
        // Fallback si no hay historial cargado aún
        avg30d = Math.round((min30d + max30d) / 2);
    }

    // C. Formateo de fechas
    const formatDate = (d: string | null) => {
        if (!d) return "N/A";
        try { return format(new Date(d), "d MMM", { locale: es }); } 
        catch { return "N/A"; }
    };

    const lastUpdateDate = activeOffer.last_updated 
        ? format(new Date(activeOffer.last_updated), "d MMM, HH:mm", { locale: es })
        : "N/A";

    return {
        current: currentPrice,
        min: min30d,
        minDate: formatDate(minDate),
        max: max30d,
        maxDate: formatDate(maxDate),
        avg: avg30d,
        date: lastUpdateDate
    };
  }, [activeOffer, chartData]);


  const handleAddComparison = async (targetOffer: Offer, label: string) => {
    if (activeOffer && targetOffer.id === activeOffer.id) return;
    if (chartData.length >= 6) return;
    if (chartData.some(series => series.name === label)) return; 

    try {
        const history = await getOfferHistory(targetOffer.id);
        if (history.length > 0) {
            setChartData(prev => [
                ...prev,
                {
                    name: label,
                    data: history,
                    color: CHART_COLORS[prev.length] || "#888888" 
                }
            ])
        }
    } catch (e) {
        console.error("Error cargando comparativa", e);
    }
  }

  const handleRemoveSeries = (seriesName: string) => {
      setChartData(prev => prev.filter(s => s.name !== seriesName));
  }

  if (loading || !product) return <div className="p-20 text-center text-muted-foreground">Cargando...</div>

  const colors = Array.from(new Set(product.specs.map((s: any) => s.color))) as string[]
  const storages = Array.from(new Set(product.specs.map((s: any) => s.storage))) as string[]

  let rawImage = "/placeholder.jpg"; 
  if (activeSpec?.image) rawImage = activeSpec.image;
  else if (product?.image) rawImage = product.image;
  const finalImage = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;

  const getMinPriceForStorage = (storageSize: string) => {
    const specs = product.specs.filter((s: any) => s.storage === storageSize);
    if (specs.length === 0) return "---";
    const prices = specs.map((s: any) => Number(s.min_price_cached || 999999));
    const min = Math.min(...prices);
    return min === 999999 ? "---" : min;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        selectedCountry={country}
        onCountryChange={setCountry}
        showBackButton={true}
        onBackClick={() => router.push("/")}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 items-start">
          
          <div className="h-fit w-full max-w-[550px] mx-auto lg:ml-auto">
              <ProductGallery 
                images={[finalImage]} 
                onImageClick={() => {
                    if (activeOffer) {
                        if (activeOffer?.url) {
                            window.open(activeOffer.url, '_blank', 'noopener,noreferrer');
                            console.log("Redirigiendo a Back Market desde la imagen...")
                        } else {
                            console.warn("Esta oferta no tiene link");
                        }
                    }
                }}
            />
          </div>

          <div className="flex flex-col gap-3 mt-12">
              <div className="flex items-start justify-between">
                  <div>
                      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{product.name}</h1>
                  </div>
              </div>
              <Separator />

              <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Almacenamiento</h3>
                  <div className="flex flex-wrap gap-2">
                      {storages.map((storage) => {
                          const isSelected = selectedStorage === storage;
                          const price = getMinPriceForStorage(storage);
                          return (
                              <button
                                  key={storage}
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

              <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">Color</h3>
                  <div className="flex flex-wrap gap-3">
                      {colors.map((color) => {
                          const isSelected = selectedColor === color;
                          return (
                              <button 
                                  key={color}
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
                  <p className="mt-2 text-xs text-muted-foreground font-medium">{t(selectedColor)}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <div>
                      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Batería</h3>
                      <div className="grid grid-cols-2 gap-2">
                          <Button
                              variant={!selectedBattery ? "default" : "outline"}
                              onClick={() => changeBattery(false)} 
                              className={cn("h-8 text-xs", !selectedBattery ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                          >
                              {t("standard")}
                          </Button>
                          <Button
                              variant={selectedBattery ? "default" : "outline"}
                              onClick={() => changeBattery(true)}
                              className={cn("h-8 text-xs", selectedBattery ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                          >
                              {t("new")}
                          </Button>
                      </div>
                  </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Configuración seleccionada</p>
                        <p className="mt-1 font-semibold text-lg">
                            {product.name} · {selectedStorage}GB · {t(selectedColor)} · {t(selectedCondition)}
                        </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                      {activeOffer ? (
                          <div className="space-y-3">
                              <div className="flex items-baseline gap-3">
                                <p className="text-3xl font-bold text-emerald-600">
                                    {activeOffer.current_price}€
                                </p>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    {activeOffer.battery_new ? (
                                        <span className="text-emerald-600 font-medium">Batería Nueva (100%)</span>
                                    ) : (
                                        <span>Batería Estándar</span>
                                    )}
                                </span>
                              </div>

                              <Button 
                                className="w-full h-11 text-base font-medium shadow-sm bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all"
                                onClick={() => {
                                    if (activeOffer?.url) {
                                        window.open(activeOffer.url, '_blank', 'noopener,noreferrer');
                                    } else {
                                        console.warn("Esta oferta no tiene link");
                                    }
                                }}
                              >
                                Ver oferta en Back Market
                                <ExternalLink className="ml-2 w-4 h-4 opacity-80" />
                              </Button>
                          </div>
                      ) : (
                          <p className="text-xl text-muted-foreground py-2">Sin stock para esta combinación</p>
                      )}
                  </div>
              </div>

              <div>
                  <Button 
                      className="w-full h-12 text-lg gap-2 bg-emerald-600 hover:bg-emerald-700" 
                      size="lg"
                      disabled={!activeSpec} 
                      onClick={() => setIsAlertOpen(true)}
                  >
                      <Bell className="w-5 h-5" />
                      Alerta
                  </Button>
              </div>

          </div>
        </div>

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

          {priceStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 border shadow-sm bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Último Registro
                        </span>
                        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                            {priceStats.current}€
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1">
                            {priceStats.date}
                        </span>
                    </div>
                </Card>

                <Card className="p-4 border shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                            <ArrowDown className="w-3 h-3 text-green-600" /> Mínimo (30d)
                        </span>
                        <span className="text-2xl font-bold text-foreground mt-1">
                            {priceStats.min}€
                        </span>
                        {/* Fecha Mínimo */}
                        <span className="text-[10px] text-muted-foreground mt-1">
                            {priceStats.minDate !== "N/A" ? `Registrado el ${priceStats.minDate}` : ""}
                        </span>
                    </div>
                </Card>

                <Card className="p-4 border shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                            <Activity className="w-3 h-3 text-blue-600" /> Media (30d)
                        </span>
                        <span className="text-2xl font-bold text-foreground mt-1">
                            {priceStats.avg}€
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1">
                            Calculado sobre registros
                        </span>
                    </div>
                </Card>

                <Card className="p-4 border shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                            <ArrowUp className="w-3 h-3 text-red-600" /> Máximo (30d)
                        </span>
                        <span className="text-2xl font-bold text-foreground mt-1">
                            {priceStats.max}€
                        </span>
                        {/* Fecha Máximo */}
                        <span className="text-[10px] text-muted-foreground mt-1">
                            {priceStats.maxDate !== "N/A" ? `Registrado el ${priceStats.maxDate}` : ""}
                        </span>
                    </div>
                </Card>
            </div>
          )}
          
          <Card className="p-6 bg-card border shadow-sm h-[450px]"> 
              {chartData.length > 0 ? (
                  <PriceHistoryChart 
                    series={chartData} 
                    onRemoveSeries={handleRemoveSeries} 
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
                  product={product} 
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