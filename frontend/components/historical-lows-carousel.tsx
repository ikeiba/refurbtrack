"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Flame, TrendingDown, BatteryFull, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OfferSummary, HistoricalLowsCarouselProps } from "@/lib/types"
import { t } from "@/lib/translations"

export const getConditionStyles = (condition: string) => {
  switch (condition) {
    case "Fair":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
    case "Good":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
    case "Excellent":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
    case "Premium":
      return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export function HistoricalLowsCarousel({ offers, onOfferClick }: HistoricalLowsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (offers.length === 0) return null

  return (
    <section className="w-full border-b border-border bg-background dark:bg-background py-6">
      <div className="container mx-auto px-4">
        
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                <Flame className="h-5 w-5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Mínimos sostenibles</h2>
                <p className="text-sm text-muted-foreground hidden sm:block">Precios mensuales más bajos en productos que dan una segunda vida a la tecnología.</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("left")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("right")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {offers.map((offer) => (
            // CAMBIA AQUÍ ENTRE 'CompactOfferCardOption1' Y 'CompactOfferCardOption2' PARA PROBAR
            <CompactOfferCardOption2 
                key={offer.id} 
                offer={offer} 
                onClick={() => onOfferClick(offer)} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// =====================================================================
// OPCIÓN 1: Botón pequeño a la derecha alineado con el precio
// =====================================================================

interface CompactOfferCardProps {
  offer: OfferSummary
  onClick: () => void
}

function CompactOfferCardOption1({ offer, onClick }: CompactOfferCardProps) {
  const current = Number(offer.current_price)
  const previous = Number(offer.old_price) 
  const savings = Math.round(((previous - current) / previous) * 100)

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 cursor-pointer snap-start",
        "w-[270px] rounded-xl border bg-card transition-all duration-300",
        "hover:shadow-lg hover:border-emerald-500/30"
      )}
    >
        {/* Badge Flotante: CONDICIÓN */}
        <Badge className={cn(
            "absolute left-2 top-2 z-10 px-2 py-0.5 text-[10px] border-transparent font-medium shadow-sm",
            getConditionStyles(offer.condition)
        )}>
            {t(offer.condition)}
        </Badge>

        {/* Badge Batería */}
        {offer.battery_new && (
             <Badge className="absolute right-2 top-2 z-10 bg-emerald-600 px-1.5 py-0.5 text-[10px] border-0 gap-1">
                <BatteryFull className="w-3 h-3" /> {t("new")}
             </Badge>
        )}

        {/* Imagen + Porcentaje de Descuento (Movido aquí) */}
        <div className="aspect-square relative p-4 bg-white dark:bg-secondary/20 rounded-t-xl overflow-hidden">
             {offer.image ? (
                  <Image
                      // CORRECCIÓN AQUÍ: Comprobamos si ya tiene barra antes de añadirla
                      src={offer.image.startsWith('/') ? offer.image : `/${offer.image}`}
                      alt={offer.name}
                      fill
                      className="object-contain p-7 pb-0 transition-transform duration-500 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📱</div>
              )}
             
             {/* PORCENTAJE DE AHORRO: Parte inferior derecha de la imagen */}
             {savings > 0 && (
                <div className="absolute bottom-2 right-2 flex items-center text-xs font-bold text-orange-700 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400 px-2 py-1 rounded-md shadow-sm border border-orange-200/50">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -{savings}%
                </div>
             )}
        </div>

        {/* Info Detallada */}
        <div className="p-4 border-t bg-muted/20">
            {/* Contenedor Flex para alinear Info a la Izq y Botón a la Der */}
            <div className="flex items-end justify-between gap-2">
                
                {/* COLUMNA IZQUIERDA: Info + Precios */}
                <div className="flex flex-col gap-1 min-w-0">
                    {/* Nombre */}
                    <h3 className="truncate text-sm font-bold text-foreground" title={offer.name}>
                        {offer.name}
                    </h3>
                    
                    {/* Specs */}
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>{offer.storage}</span>
                        <span className="text-[8px] opacity-40">●</span>
                        <span>{t(offer.color)}</span>
                    </p>

                    {/* Precios (Vertical) */}
                    <div className="mt-1">
                        {previous > current && (
                            <p className="text-[11px] text-muted-foreground line-through decoration-muted-foreground/60">
                                {previous}€
                            </p>
                        )}
                        <p className="text-xl font-bold text-orange-600 dark:text-orange-500 leading-none">
                            {current}€
                        </p>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Botón Link */}
                {offer?.url ? (
                  <a 
                    href={offer.url}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Evita que se dispare el onClick de la tarjeta
                    className="h-9 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm shrink-0 group transition-colors"
                  >
                    Ver en Back Market <ExternalLink className="ml-2 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <button 
                    disabled
                    onClick={(e) => e.stopPropagation()}
                    className="h-9 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-200 text-gray-500 shadow-sm shrink-0 cursor-not-allowed"
                  >
                    No disponible
                  </button>
                )}
            </div>
        </div>
    </div>
  )
}

// =====================================================================
// OPCIÓN 2: Precios arriba derecha y Botón ancho abajo
// =====================================================================

function CompactOfferCardOption2({ offer, onClick }: CompactOfferCardProps) {
    const current = Number(offer.current_price)
    const previous = Number(offer.old_price)
    const savings = Math.round(((previous - current) / previous) * 100)
  
    return (
      <div 
        onClick={onClick}
        className={cn(
          "group relative flex-shrink-0 cursor-pointer snap-start",
          "w-[270px] rounded-xl border bg-card transition-all duration-300",
          "hover:shadow-lg hover:border-emerald-500/30"
        )}
      >
          {/* Badges Superiores (Igual) */}
          <Badge className={cn(
              "absolute left-2 top-2 z-10 px-2 py-0.5 text-[10px] border-transparent font-medium shadow-sm",
              getConditionStyles(offer.condition)
          )}>
              {t(offer.condition)}
          </Badge>
  
          {offer.battery_new && (
               <Badge className="absolute right-2 top-2 z-10 bg-emerald-600 px-1.5 py-0.5 text-[10px] border-0 gap-1">
                  <BatteryFull className="w-3 h-3" /> {t("new")}
               </Badge>
          )}
  
          {/* Imagen + Porcentaje (Igual) */}
          <div className="aspect-square relative p-4 bg-white dark:bg-secondary/20 rounded-t-xl overflow-hidden">
            {offer.image ? (
            <Image
                // CORRECCIÓN AQUÍ: Comprobamos si ya tiene barra antes de añadirla
                src={offer.image.startsWith('/') ? offer.image : `/${offer.image}`}
                alt={offer.name}
                fill
                className="object-contain p-7 pb-0 transition-transform duration-500 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">📱</div>
            )}
            
            {/* PORCENTAJE DE AHORRO */}
            {savings > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md shadow-sm border border-emerald-200/50">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -{savings}%
              </div>
            )}
          </div>
  
          {/* Info Detallada */}
          <div className="p-4 border-t bg-muted/20">
              
              {/* FILA SUPERIOR: Info (Izq) vs Precios (Der) */}
              <div className="flex justify-between items-start mb-3">
                  {/* Izquierda: Datos */}
                  <div className="flex flex-col min-w-0 pr-2">
                      <h3 className="truncate text-sm font-bold text-foreground" title={offer.name}>
                          {offer.name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>{offer.storage}</span>
                          <span className="text-[8px] opacity-40">●</span>
                          <span>{t(offer.color)}</span>
                      </p>
                  </div>

                  {/* Derecha: Precios Alineados a la derecha */}
                  <div className="flex flex-col items-end shrink-0">
                        {previous > current && (
                            <p className="text-[10px] text-muted-foreground line-through">
                                {previous}€
                            </p>
                        )}
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-500 leading-none">
                            {current}€
                        </p>
                  </div>
              </div>
  
              {/* FILA INFERIOR: Botón Ancho */}
              {offer?.url ? (
                <a
                  href={offer.url} // Ahora contiene /api/out/tu-uuid/
                  target="_blank"
                  rel="sponsored noopener noreferrer" // 'sponsored' es obligatorio para SEO de afiliación
                  onClick={(e) => e.stopPropagation()} // Evita que se disparen eventos del contenedor padre
                  className="w-full flex justify-center items-center px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm transition-colors rounded-md group/btn font-medium"                >
                  Ver en Back Market <ExternalLink className="ml-4 w-4 h-4 opacity-70 group-hover/btn:opacity-100" />
                </a>
              ) : (
                <button 
                  disabled
                  className="w-full px-4 py-2 bg-gray-200 text-gray-500 cursor-not-allowed rounded-md"
                >
                  Sin enlace disponible
                </button>
              )}
          </div>
      </div>
    )
  }