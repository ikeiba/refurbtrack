"use client"

import PriceHistoryChart from "@/components/price-history-chart"
import { TrendingDown } from "lucide-react"
import type { HistoryPoint } from "@/lib/types"

export function FeaturedPriceChart({ history, name }: { history: HistoryPoint[]; name: string }) {
  if (!history || history.length === 0) {
    return (
      <div className="h-[320px] flex flex-col items-center justify-center text-muted-foreground rounded-lg border border-border bg-card">
        <TrendingDown className="w-10 h-10 mb-2 opacity-20" />
        <p className="text-center max-w-sm px-6">
          Todavía no hay registros de precios suficientes para mostrar una evolución real.
        </p>
      </div>
    )
  }

  return (
    <div className="h-[320px]">
      <PriceHistoryChart
        series={[{ name, data: history, color: "#059669" }]}
      />
    </div>
  )
}
