"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Flame, TrendingDown, BatteryFull } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OfferSummary } from "@/lib/types" // <--- CAMBIO IMPORTANTE: Usamos OfferSummary
import { t } from "@/lib/translations"

interface HistoricalLowsCarouselProps {
  offers: OfferSummary[] // <--- Recibimos Ofertas, no Productos
  onOfferClick: (offer: OfferSummary) => void
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
    <section className="w-full border-b border-border bg-orange-50/50 dark:bg-orange-950/10 py-6">
      <div className="container mx-auto px-4">
        
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400 fill-orange-600 dark:fill-orange-400" />
            </div>
            <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">Mínimos de 30 Días</h2>
                <p className="text-xs text-muted-foreground hidden sm:block">Ofertas específicas en su precio más bajo del mes</p>
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
            <CompactOfferCard 
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

// --- NUEVA TARJETA DE OFERTA ---
interface CompactOfferCardProps {
  offer: OfferSummary
  onClick: () => void
}

function CompactOfferCard({ offer, onClick }: CompactOfferCardProps) {
  // Calculamos ahorro respecto al máximo de 30 días (si existe)
  const current = Number(offer.current_price)
  const previous = Number(offer.old_price) || current * 1.15
  const savings = Math.round(((previous - current) / previous) * 100)

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 cursor-pointer snap-start",
        "w-[210px] rounded-xl border bg-card transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 hover:border-orange-500/30"
      )}
    >
        {/* Badge Flotante: CONDICIÓN */}
        <Badge className="absolute left-2 top-2 z-10 bg-black/70 hover:bg-black/80 px-2 py-0.5 text-[10px] backdrop-blur-md border-0">
            {t(offer.condition)}
        </Badge>

        {/* Badge Batería (si es nueva) */}
        {offer.battery_new && (
             <Badge className="absolute right-2 top-2 z-10 bg-emerald-600 px-1.5 py-0.5 text-[10px] border-0 gap-1">
                <BatteryFull className="w-3 h-3" /> {t("new")}
             </Badge>
        )}

        {/* Imagen */}
        <div className="aspect-square relative p-4 bg-white dark:bg-secondary/20 rounded-t-xl overflow-hidden">
             {offer.image ? (
                <Image
                    src={offer.image}
                    alt={offer.name}
                    fill
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                    sizes="200px"
                />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">📱</div>
             )}
        </div>

        {/* Info Detallada */}
        <div className="p-3 border-t bg-muted/20">
            {/* Nombre Producto */}
            <h3 className="truncate text-sm font-bold text-foreground" title={offer.name}>
                {offer.name}
            </h3>
            
            {/* Specs: 128GB · Azul */}
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <span>{offer.storage}</span>
                <span className="text-[8px] opacity-40">●</span>
                <span>{t(offer.color)}</span>
            </p>
            
            {/* Precios */}
            <div className="mt-2 flex items-end justify-between">
                <div>
                    {previous > current && (
                        <p className="text-[10px] text-muted-foreground line-through">
                            era ~{Math.round(previous)}€
                        </p>
                    )}
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-500 leading-none">
                        {current}€
                    </p>
                </div>
                {savings > 0 && (
                    <div className="flex items-center text-xs font-bold text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-1.5 py-0.5 rounded">
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                        {savings}%
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}