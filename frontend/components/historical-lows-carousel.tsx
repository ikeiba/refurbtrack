"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface HistoricalLowsCarouselProps {
  products: Product[]
  onViewHistory: (product: Product) => void
}

export function HistoricalLowsCarousel({ products, onViewHistory }: HistoricalLowsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (products.length === 0) return null

  return (
    <section className="border-b border-border bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold tracking-tight">Products at Minimum Price</h2>
          </div>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("left")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => scroll("right")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex flex-nowrap gap-4 overflow-x-auto pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {products.map((product) => (
            <CompactProductCard key={product.id} product={product} onClick={() => onViewHistory(product)} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface CompactProductCardProps {
  product: Product
  onClick: () => void
}

function CompactProductCard({ product, onClick }: CompactProductCardProps) {
  const savingsPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl",
        "border border-border bg-card text-left transition-all",
        "hover:border-orange-300 hover:shadow-md dark:hover:border-orange-700",
        "w-[180px] min-w-[180px] flex-shrink-0",
      )}
    >
      {/* Min Price Badge */}
      <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
        <Flame className="h-2.5 w-2.5" />
        Min Price
      </div>

      {/* Square Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Minimal Info */}
      <div className="p-3">
        <p className="truncate text-xs font-medium text-foreground">{product.title}</p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-base font-bold text-foreground">€{product.price}</span>
          <span className="text-[10px] text-muted-foreground line-through">€{product.originalPrice}</span>
          <span className="ml-auto text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            -{savingsPercent}%
          </span>
        </div>
      </div>
    </button>
  )
}
