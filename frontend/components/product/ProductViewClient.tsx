"use client"

import { useMemo, useState, useEffect, Suspense, useCallback  } from "react"
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation"
import { getOfferHistory } from "@/services/api"
import { cn, getColorHex, CHART_COLORS } from "@/lib/utils"
import { t } from "@/lib/translations"
import { format, roundToNearestMinutes } from "date-fns"
import { es } from "date-fns/locale"

import { Header } from "@/components/header"
import { ProductGallery } from "@/components/product-gallery"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import {
  Bell, TrendingDown, Calendar, ArrowUp, ArrowDown,
  Activity, ExternalLink, Sparkles, Info, Table
} from "lucide-react"
import PriceHistoryChart from "@/components/price-history-chart"
import { ComparisonPopover } from "@/components/comparison-popover"   // FIX 4: restored
import { HistoricalLowsCarousel } from "@/components/historical-lows-carousel"
import { AlertModal } from "@/components/alert-modal"
import type { Offer } from "@/lib/types"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { hubPath } from "@/lib/urls"
import { track } from "@/lib/analytics"

interface ProductViewClientProps {
  initialProduct: any;
  initialHotOffers: any[];
  lang: string;
}

// NOTE (FIX 1): This component calls useSearchParams(), so the parent server
// page.tsx must wrap it in <Suspense> to avoid a build error:
//
//   import { Suspense } from "react"
//   <Suspense fallback={<div>Cargando...</div>}>
//     <ProductViewClient ... />
//   </Suspense>

// 1. EL MICRO-COMPONENTE INVISIBLE
// 1. Micro-componente con las dependencias arregladas para evitar bucles
function ProductParamsSync({ onSync }: { onSync: (c: string, b: boolean) => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    const cond = searchParams.get("condition") || "Fair"
    const batt = searchParams.get("battery") === "new"
    onSync(cond, batt)
    // Ignoramos la regla exhaustiva para onSync, evitando el rebote en cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) 
  return null
}

export default function ProductViewClient({ initialProduct, initialHotOffers, lang }: ProductViewClientProps) {
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname() // <--- NUEVO: Nos da la ruta base actual

  // ─── SPEC ACTIVA (por slug de URL) ───────────────────────────────────────
  const activeSpec = useMemo(() => {
    return initialProduct.specs.find((s: any) => s.slug === params.spec) || initialProduct.specs[0]
  }, [initialProduct, params.spec])

  // ─── GENERADOR DE ENLACES ESTÁTICOS (Para Googlebot) ─────────────
  const getSpecUrl = (newStorage: string, newColor: string) => {
    const targetSpec = initialProduct.specs.find(
      (s: any) => s.storage === newStorage && s.color === newColor
    );
    
    if (!targetSpec) return "#"; // Fallback de seguridad
    
    const path = `/${lang}/${initialProduct.category_slug}/${initialProduct.brand_slug}/${initialProduct.slug}/${targetSpec.slug}`;
    const query = `?condition=${selectedCondition}${selectedBattery ? "&battery=new" : ""}`;
    
    return path + query;
  };

  // ─── ESTADOS INTERNOS (no indexables → query params) ─────────────────────
  // 2. Estados inicializados con valores por defecto seguros
  const [selectedCondition, setSelectedCondition] = useState("Fair")
  const [selectedBattery, setSelectedBattery]     = useState(false)
  const [chartData, setChartData]                 = useState<{ name: string; color?: string; data: any[] }[]>([])
  const [isAlertOpen, setIsAlertOpen]             = useState(false)
  const [country, setCountry]                     = useState("ES")
  const [searchQuery, setSearchQuery]             = useState("")

  // 2. Usamos useCallback para mantener la referencia estable (Soluciona el rebote)
  const handleUrlSync = useCallback((c: string, b: boolean) => {
    setSelectedCondition(prev => prev !== c ? c : prev)
    setSelectedBattery(prev => prev !== b ? b : prev)
  }, [])
  
  const handleHeaderSearch = (query: string) => {
    const trimmed = query.trim()
    // AHORA SÍ: Mantenemos el idioma para no romper la navegación
    router.push(trimmed ? `/${lang}?q=${encodeURIComponent(trimmed)}` : `/${lang}`)
  }

  // Actualiza la URL sin recargar la página (usando JS nativo)
  const updateUrlParams = (key: string, value: string) => {
    // Usamos window.location.search en lugar de searchParams de Next.js
    const current = new URLSearchParams(window.location.search)
    
    if (value) current.set(key, value)
    else current.delete(key)
    
    const search = current.toString()
    const query = search ? `?${search}` : ""
    
    // Usamos replace para no ensuciar el historial del botón "Atrás" del navegador
    router.replace(`${pathname}${query}`, { scroll: false })
  }

  // Modificamos los manejadores para que actualicen el estado Y la URL
  const handleConditionChange = (cond: string) => {
    setSelectedCondition(cond)
    updateUrlParams("condition", cond)
    track('filter_used', { filter: 'condition', value: cond })
  }

  const handleBatteryChange = (isNew: boolean) => {
    setSelectedBattery(isNew)
    updateUrlParams("battery", isNew ? "new" : "standard")
    track('filter_used', { filter: 'battery', value: isNew ? 'new' : 'standard' })
  }

  // ─── OFERTA ACTIVA ────────────────────────────────────────────────────────
  const activeOffer = useMemo(() => {
    return activeSpec?.offers.find(
      (o: any) => o.condition === selectedCondition && o.battery_new === selectedBattery
    )
  }, [activeSpec, selectedCondition, selectedBattery])

  const [timeRange, setTimeRange] = useState<string>('30') // Por defecto 30 días

  // ─── ANALÍTICA: product_view ──────────────────────────────────────────────
  useEffect(() => {
    if (!activeSpec) return
    track('product_view', {
      brand: initialProduct.brand_slug,
      model: initialProduct.name,
      storage: activeSpec.storage,
      color: activeSpec.color,
      price: activeOffer?.current_price ?? activeSpec.min_price_cached ?? 0,
    })
  }, [activeSpec, activeOffer, initialProduct])
  
  // ─── HISTORIAL DEL GRÁFICO ────────────────────────────────────────────────
  // 3. Modifica tu useEffect del historial para que escuche el cambio de tiempo:
  useEffect(() => {
    if (activeOffer) {
      // Le pasamos el timeRange a la función getOfferHistory
      getOfferHistory(activeOffer.id, timeRange).then((history) => {
        setChartData([{
          name:  `${initialProduct.name} ${t(activeSpec.color)} ${activeSpec.storage}GB - ${t(selectedCondition)}`,
          data:  history,
          color: CHART_COLORS[0]
        }])
      })
    }
  // ¡IMPORTANTE! Añade timeRange al array de dependencias para que se vuelva a ejecutar al hacer clic
  }, [activeOffer, activeSpec, selectedCondition, initialProduct.name, timeRange])

  // ─── FIX 4: COMPARACIÓN ───────────────────────────────────────────────────
  // Restored ComparisonPopover + handleAddComparison + handleRemoveSeries,
  // which were silently dropped in the refactor.
  const handleAddComparison = async (targetOffer: Offer, label: string) => {
    if (activeOffer && targetOffer.id === activeOffer.id) return
    if (chartData.length >= 6) return
    if (chartData.some((s) => s.name === label)) return

    track('price_comparison_click', { label })

    try {
      const history = await getOfferHistory(targetOffer.id)
      if (history.length > 0) {
        setChartData((prev) => [
          ...prev,
          { name: label, data: history, color: CHART_COLORS[prev.length] || "#888888" }
        ])
      }
    } catch (e) {
      console.error("Error cargando comparativa", e)
    }
  }

  const handleRemoveSeries = (seriesName: string) => {
    setChartData((prev) => prev.filter((s) => s.name !== seriesName))
  }

  // ─── FIX 3: ESTADÍSTICAS ──────────────────────────────────────────────────
  // Restored the original logic: avg is computed from real chart points,
  // and min/max are corrected against the history if the API cache is stale.
  const priceStats = useMemo(() => {
    if (!activeOffer) return null

    const currentPrice = Number(activeOffer.current_price) || 0

    let min30d   = Number(activeOffer.min_price_30d)
    let max30d   = Number(activeOffer.max_price_30d)
    let minDate  = activeOffer.min_price_30d_date
    let maxDate  = activeOffer.max_price_30d_date

    if (!min30d || isNaN(min30d)) min30d = currentPrice
    if (!max30d || isNaN(max30d)) max30d = currentPrice

    let avg30d = 0
    const historyPoints = chartData.find((s) => s.color === CHART_COLORS[0])?.data || []

    if (historyPoints.length > 0) {
      // Real average from history points
      const sum = historyPoints.reduce((acc: number, curr: any) => acc + Number(curr.price), 0)
      avg30d = Math.round(sum / historyPoints.length)

      // Correct min/max if API cache is stale
      const historyMax = Math.max(...historyPoints.map((p: any) => Number(p.price)))
      const historyMin = Math.min(...historyPoints.map((p: any) => Number(p.price)))

      if (historyMax > max30d) {
        max30d = historyMax
        const point = historyPoints.find((p: any) => Number(p.price) === historyMax)
        if (point) maxDate = point.timestamp
      }
      if (historyMin < min30d && historyMin > 0) {
        min30d = historyMin
        const point = historyPoints.find((p: any) => Number(p.price) === historyMin)
        if (point) minDate = point.timestamp
      }
    } else {
      // Fallback until history loads
      avg30d = Math.round((min30d + max30d) / 2)
    }

    const formatDate = (d: string | null) => {
      if (!d) return "N/A"
      try { return format(new Date(d), "d MMM", { locale: es }) }
      catch { return "N/A" }
    }

    const lastUpdateDate = activeOffer.last_updated
      ? format(
          roundToNearestMinutes(new Date(activeOffer.last_updated), { nearestTo: 30 }),
          "d MMM, HH:mm",
          { locale: es }
        )
      : "N/A"

    return {
      current:  currentPrice,
      min:      min30d,
      minDate:  formatDate(minDate),
      max:      max30d,
      maxDate:  formatDate(maxDate),
      avg:      avg30d,
      date:     lastUpdateDate,
      battery:  activeOffer.battery_new ? "Batería Nueva" : "Batería Estándar"
    }
  }, [activeOffer, chartData])

  // ─── IMAGEN ACTIVA ────────────────────────────────────────────────────────
  const finalImage = useMemo(() => {
    const img = activeSpec?.image || initialProduct.image || "/placeholder.jpg"
    return img.startsWith("/") ? img : `/${img}`
  }, [activeSpec, initialProduct.image])

  const colors   = Array.from(new Set(initialProduct.specs.map((s: any) => s.color))) as string[]
  const storages = Array.from(new Set(initialProduct.specs.map((s: any) => s.storage))) as string[]

  const getMinPriceForStorage = (storageSize: string) => {
    // Usamos initialProduct, que es la prop que viene del servidor
    const specs = initialProduct.specs.filter((s: any) => s.storage === storageSize);
    if (specs.length === 0) return "---";
    const prices = specs.map((s: any) => Number(s.min_price_cached || 999999));
    const min = Math.min(...prices);
    return min === 999999 ? "---" : min;
  }

  // Justo antes del return, define los nodos del breadcrumb:
  const modelHubHref = hubPath(lang, initialProduct.category_slug, initialProduct.brand_slug, initialProduct.slug);
  const breadcrumbNodes = [
    { label: "Inicio", href: `/${lang}` },
    { label: initialProduct.category_slug, href: `/${lang}/${initialProduct.category_slug}` },
    { label: initialProduct.brand_slug, href: `/${lang}/${initialProduct.category_slug}/${initialProduct.brand_slug}` },
    { label: initialProduct.name, href: modelHubHref },
    { label: `${activeSpec.storage} GB` } // Configuración actual, sin href
  ];

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 3. INYECTAMOS LA SINCRONIZACIÓN SILENCIOSA */}
      <Suspense fallback={null}>
        <ProductParamsSync onSync={handleUrlSync} />
      </Suspense>

      <Header
        selectedCountry={country}
        onCountryChange={setCountry}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleHeaderSearch}
      />

      <div className="container mx-auto px-4 py-8">
        {/* BREADCRUMBS (Ruta de navegación SEO) */}
        {/* BREADCRUMBS (Componente Reutilizable) */}
        <Breadcrumbs items={breadcrumbNodes} />

        <div className="grid md:grid-cols-2 gap- items-start">

          {/* GALERÍA */}
          <div className="h-fit w-full max-w-[550px] mx-auto lg:ml-auto">
            {activeOffer?.url ? (
              <a href={activeOffer.url} target="_blank" rel="sponsored noopener"
                 onClick={() => track('outbound_click', { store: 'Back Market', model: initialProduct.name, url: activeOffer.url })}
                 className="block transition-opacity hover:opacity-95">
                <ProductGallery images={[finalImage]} />
              </a>
            ) : (
              <ProductGallery images={[finalImage]} />
            )}
          </div>

          {/* PANEL DERECHO */}
          <div className="flex flex-col gap-2 mt-12">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {initialProduct.name} {activeSpec.storage}GB {t(activeSpec.color)}
                {Number(activeSpec.min_price_cached) > 0 && (
                  <span className="block mt-1 text-xl font-semibold text-emerald-600">
                    Desde {Number(activeSpec.min_price_cached)}€
                  </span>
                )}
              </h1>
              <Link
                href={modelHubHref}
                className="shrink-0 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md text-sm font-medium border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Table className="h-4 w-4" />
                Ver tabla comparativa
              </Link>
            </div>
            <Separator />

            {/* ALMACENAMIENTO (Ahora como Enlaces Estáticos) */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Almacenamiento</h3>
              <div className="flex flex-wrap gap-2">
                {storages.map((storage) => {
                  const isSelected = activeSpec.storage === storage;
                  const price = getMinPriceForStorage(storage);
                  
                  return (
                    <Link
                      key={storage}
                      href={getSpecUrl(storage, activeSpec.color)}
                      scroll={false} // Evita que la página salte arriba al hacer clic
                      // prefetch={true} // Opcional: precarga el JSON de las otras capacidades en background
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-10 rounded-md gap-1.5 px-4 min-w-fit border",
                        isSelected 
                          ? "bg-emerald-600 text-background border-emerald-600" 
                          : "bg-background shadow-sm hover:bg-accent hover:text-accent-foreground border-input"
                      )}
                    >
                      <span className="font-semibold">{storage}GB</span>
                      {/*<span className={cn("ml-2 text-xs", isSelected ? "opacity-90" : "opacity-60")}>
                        (desde {price}€)
                      </span> */}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* COLOR (Ahora como Enlaces Estáticos) */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Color</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <Link
                    key={c}
                    href={getSpecUrl(activeSpec.storage, c)}
                    scroll={false}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-all shadow-sm block", // Añadido 'block' para <a>
                      activeSpec.color === c
                        ? "border-foreground ring-2 ring-offset-2 ring-foreground"
                        : "border-transparent hover:scale-110 hover:border-border"
                    )}
                    style={{ backgroundColor: getColorHex(c) }}
                    title={t(c)}
                    // Aria-label es vital para accesibilidad y SEO si el enlace no tiene texto visible
                    aria-label={`Ver modelo en color ${c}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs font-medium text-muted-foreground">{t(activeSpec.color)}</p>
            </div>

            {/* ESTADO + BATERÍA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Estado</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Fair", "Good", "Excellent", "Premium"].map((cond) => (
                    <Button
                      key={cond}
                      variant={selectedCondition === cond ? "default" : "outline"}
                      onClick={() => handleConditionChange(cond)}
                      disabled={!activeSpec.offers.some((o: any) => o.condition === cond)}
                      className={cn("h-8 text-xs", selectedCondition === cond ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                    >
                      {t(cond)}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Batería</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={!selectedBattery ? "default" : "outline"}
                    onClick={() => handleBatteryChange(false)}
                    className={cn("h-8 text-xs", !selectedBattery ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                  >
                    {t("standard")}
                  </Button>
                  <Button
                    variant={selectedBattery ? "default" : "outline"}
                    onClick={() => handleBatteryChange(true)}
                    className={cn("h-8 text-xs", selectedBattery ? "bg-emerald-600 hover:bg-emerald-700" : "")}
                  >
                    {t("new")}
                  </Button>
                </div>
              </div>
            </div>

            {/* CAJA DE PRECIO */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Configuración seleccionada</p>
                <p className="mt-1 font-semibold text-lg">
                  {initialProduct.name} · {activeSpec.storage}GB · {t(activeSpec.color)} · {t(selectedCondition)} · {priceStats?.battery}
                </p>
              </div>
              <div className="mt-3">
                {activeOffer ? (
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl font-bold text-emerald-600">{activeOffer.current_price}€</p>
                      {priceStats?.date && (
                        <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                            Registrado el {priceStats.date}
                        </span>
                      )}
                    </div>
                    <a
                      href={activeOffer.url}
                      target="_blank"
                      rel="sponsored noopener"
                      onClick={() => track('outbound_click', { store: 'Back Market', model: initialProduct.name, url: activeOffer.url })}
                      className="w-full h-11 inline-flex items-center justify-center rounded-md text-base font-medium shadow-sm bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all"
                    >
                      Ver oferta en Back Market
                      <ExternalLink className="ml-4 w-5 h-5 opacity-80" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xl text-muted-foreground py-2">Sin stock para esta combinación</p>
                )}
              </div>
            </div>

            {/* ALERTA */}
            <Button
              className="w-full h-12 text-lg gap-2 bg-emerald-600 hover:bg-emerald-700"
              size="lg"
              disabled={!activeSpec}
              onClick={() => {
                track('alert_started', { model: initialProduct.name, storage: activeSpec.storage, color: activeSpec.color })
                setIsAlertOpen(true)
              }}
            >
              <Bell className="w-5 h-5" /> Alerta
            </Button>
          </div>
        </div>

        {/* HISTÓRICO */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-primary" /> Histórico de Precios
            </h2>
            {/* FIX 4: ComparisonPopover restored */}
          </div>

          {/* STATS CARDS */}
          {priceStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 border shadow-sm bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Último Registro
                  </span>
                  <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{priceStats.current}€</span>
                  <span className="text-[10px] text-muted-foreground mt-1" suppressHydrationWarning>
                    {priceStats.date}
                  </span>
                </div>
              </Card>
              <Card className="p-4 border shadow-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                    <ArrowDown className="w-3 h-3 text-green-600" /> Mínimo (30d)
                  </span>
                  <span className="text-2xl font-bold mt-1">{priceStats.min}€</span>
                  {/* En la tarjeta de Mínimo */}
                  <span className="text-[10px] text-muted-foreground mt-1" suppressHydrationWarning>
                    {priceStats.minDate !== "N/A" ? `Registrado el ${priceStats.minDate}` : ""}
                  </span>
                </div>
              </Card>
              <Card className="p-4 border shadow-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-600" /> Media (30d)
                  </span>
                  <span className="text-2xl font-bold mt-1">{priceStats.avg}€</span>
                  <span className="text-[10px] text-muted-foreground mt-1">Calculado sobre registros</span>
                </div>
              </Card>
              <Card className="p-4 border shadow-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-red-600" /> Máximo (30d)
                  </span>
                  <span className="text-2xl font-bold mt-1">{priceStats.max}€</span>
                    {/* En la tarjeta de Máximo */}
                    <span className="text-[10px] text-muted-foreground mt-1" suppressHydrationWarning>
                    {priceStats.maxDate !== "N/A" ? `Registrado el ${priceStats.maxDate}` : ""}
                    </span>
                </div>
              </Card>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* 1. Título a la izquierda */}
          <h3 className="text-lg font-semibold text-foreground">
            Evolución del precio
          </h3>
          
          {/* 2. Grupo de controles a la derecha (o debajo en móviles) */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Selector de tiempo (Estilo Tabs) */}
            <div className="flex bg-muted/70 p-1 rounded-lg border shadow-sm">
              <Button
                variant={timeRange === '7' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-3 rounded-md transition-all"
                onClick={() => { setTimeRange('7'); track('filter_used', { filter: 'time_range', value: '7' }) }}
              >
                7d
              </Button>
              <Button
                variant={timeRange === '30' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-3 rounded-md transition-all"
                onClick={() => { setTimeRange('30'); track('filter_used', { filter: 'time_range', value: '30' }) }}
              >
                30d
              </Button>
              <Button
                variant={timeRange === '90' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs px-3 rounded-md transition-all"
                onClick={() => { setTimeRange('90'); track('filter_used', { filter: 'time_range', value: '90' }) }}
              >
                90d
              </Button>
            </div>

            {/* Botón de comparar */}
            <div className="flex-shrink-0">
              <ComparisonPopover onCompare={handleAddComparison} />
            </div>
            
          </div>
        </div>

          <Card className="p-6 bg-card border shadow-sm h-[450px]">
            {chartData.length > 0 ? (
              // FIX 4: onRemoveSeries restored
              <PriceHistoryChart series={chartData} onRemoveSeries={handleRemoveSeries} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <TrendingDown className="w-10 h-10 mb-2 opacity-20" />
                <p>No hay historial suficiente para esta configuración.</p>
              </div>
            )}
          </Card>

          {/* CARRUSEL */}
          {initialHotOffers.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary" /> También te podría interesar
              </h2>
              {/* FIX 2: Internal navigation restored */}
              <HistoricalLowsCarousel
                offers={initialHotOffers}
                onOfferClick={(o) => {
                  const batteryParam = o.battery_new ? "new" : "standard"
                  router.push(
                    `/${lang}/${o.category_slug}/${o.brand_slug}/${o.product_slug}/${o.spec_slug}` +
                    `?condition=${o.condition}&battery=${batteryParam}`
                  )
                }}
              />
            </div>
          )}

          {/* SECCIÓN SEO: TEXTO ESTRUCTURADO */}
          <div className="mt-10 pt-5 border-border">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              {/* Añadimos un icono consistente con el resto del diseño */}
              <Info className="w-6 h-6 text-primary" /> Sobre el {initialProduct.name}
            </h2>
            
            {/* Usamos el mismo diseño de "Card" que usaste en la gráfica para integrarlo */}
            <Card className="p-6 md:p-8 bg-card border shadow-sm">
              <div className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground max-w-none">
                <p>
                  Comprar un <strong>{initialProduct.name} {activeSpec.storage}GB {t(activeSpec.color)}</strong> reacondicionado 
                  es una de las decisiones más inteligentes para ahorrar dinero y reducir la basura electrónica. 
                  Este modelo ha demostrado mantener un excelente valor en el mercado de segunda mano.
                </p>
                
                {priceStats && priceStats.min > 0 && (
                  <p className="mt-4">
                    Según nuestro historial de precios, el <strong>precio más bajo registrado</strong> para esta configuración específica 
                    ha sido de <strong>{priceStats.min}€</strong>. Analizamos diariamente múltiples tiendas como Back Market 
                    para asegurarnos de que no pagues de más. Si su precio actual ronda la media de <strong>{priceStats.avg}€</strong>, 
                    sigue siendo una excelente oportunidad frente al precio de un dispositivo nuevo.
                  </p>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>

      {activeOffer && (
        <AlertModal
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          product={initialProduct}
          currentConfig={{
            color:      activeSpec.color,
            storage:    activeSpec.storage,
            condition:  selectedCondition,
            batteryNew: selectedBattery,
            price:      activeOffer.current_price || 0
          }}
        />
      )}
    </div>
  )
}