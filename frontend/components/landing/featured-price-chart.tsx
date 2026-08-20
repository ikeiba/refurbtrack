"use client"

import dynamic from "next/dynamic"
import { TrendingDown } from "lucide-react"
import type { HistoryPoint } from "@/lib/types"
import { getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

// Recharts sale del bundle inicial de la landing de historial.
const PriceHistoryChart = dynamic(
  () => import("@/components/price-history-chart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <TrendingDown className="w-8 h-8 opacity-20 animate-pulse" />
      </div>
    ),
  }
)

export function FeaturedPriceChart({ history, name, locale }: { history: HistoryPoint[]; name: string; locale?: string }) {
  const language = getLanguage(locale)

  if (!history || history.length === 0) {
    return (
      <div className="h-[320px] flex flex-col items-center justify-center text-muted-foreground rounded-lg border border-border bg-card">
        <TrendingDown className="w-10 h-10 mb-2 opacity-20" />
        <p className="text-center max-w-sm px-6">
          {t("no_price_records", language)}
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
