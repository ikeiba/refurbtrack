"use client"

import { useState } from "react"
import { History, Bell, BatteryFull } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  onViewHistory: (product: Product) => void
}

const conditionColors: Record<string, string> = {
  Fair: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Excellent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  Premium: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
}

function getDealScore(product: Product): { score: "great" | "good" | "fair"; label: string } {
  const avgPrice = product.priceHistory.reduce((sum, p) => sum + p.price, 0) / product.priceHistory.length
  const percentBelowAvg = ((avgPrice - product.price) / avgPrice) * 100

  if (percentBelowAvg >= 5) {
    return { score: "great", label: "Great Deal" }
  } else if (percentBelowAvg >= 0) {
    return { score: "good", label: "Good Deal" }
  } else {
    return { score: "fair", label: "Fair Deal" }
  }
}

const dealScoreColors = {
  great: "bg-emerald-500",
  good: "bg-amber-500",
  fair: "bg-red-500",
}

export function ProductGrid({ products, onViewHistory }: ProductGridProps) {
  const [loadingItems, setLoadingItems] = useState<string[]>([])
  const { toast } = useToast()

  const handleSetAlert = (product: Product) => {
    setLoadingItems((prev) => [...prev, product.id])

    setTimeout(() => {
      setLoadingItems((prev) => prev.filter((id) => id !== product.id))
      toast({
        title: "Price Alert Set!",
        description: `You'll be notified when ${product.title} drops in price.`,
      })
    }, 800)
  }

  if (products.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-muted-foreground">No products found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewHistory={onViewHistory}
          onSetAlert={handleSetAlert}
          isLoading={loadingItems.includes(product.id)}
        />
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  onViewHistory: (product: Product) => void
  onSetAlert: (product: Product) => void
  isLoading: boolean
}

function ProductCard({ product, onViewHistory, onSetAlert, isLoading }: ProductCardProps) {
  const savingsVsNew = product.newRetailPrice - product.price
  const savingsVsNewPercent = Math.round((savingsVsNew / product.newRetailPrice) * 100)
  const dealScore = getDealScore(product)

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-4">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            <Badge variant="secondary" className={cn("text-xs", conditionColors[product.condition])}>
              {product.condition}
            </Badge>
            {product.newBattery && (
              <Badge className="gap-1 bg-emerald-600 text-xs text-white hover:bg-emerald-700">
                <BatteryFull className="h-3 w-3" />
                New
              </Badge>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-1 backdrop-blur-sm">
                  <div className={cn("h-2.5 w-2.5 rounded-full", dealScoreColors[dealScore.score])} />
                  <span className="text-[10px] font-medium text-foreground">{dealScore.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">
                  {dealScore.score === "great" && "Below 30-day average price"}
                  {dealScore.score === "good" && "At or near 30-day average price"}
                  {dealScore.score === "fair" && "Above 30-day average price"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div
              className="mt-1 h-4 w-4 shrink-0 rounded-full border border-border"
              style={{ backgroundColor: product.colorHex }}
              title={product.color}
            />
            <h3 className="line-clamp-2 text-sm font-medium leading-tight">{product.title}</h3>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">€{product.price}</span>
              <span className="text-xs text-muted-foreground line-through">vs ~€{product.newRetailPrice} new</span>
            </div>
            <Badge className="bg-emerald-600 text-xs text-white hover:bg-emerald-700">
              -{savingsVsNewPercent}% vs new
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 border-t p-3">
        <Button variant="outline" size="sm" className="gap-1.5 bg-transparent" onClick={() => onViewHistory(product)}>
          <History className="h-4 w-4" />
          History
        </Button>
        <Button
          size="sm"
          className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => onSetAlert(product)}
          disabled={isLoading}
        >
          {isLoading ? <Skeleton className="h-4 w-4 rounded-full" /> : <Bell className="h-4 w-4" />}
          Alert
        </Button>
      </CardFooter>
    </Card>
  )
}
