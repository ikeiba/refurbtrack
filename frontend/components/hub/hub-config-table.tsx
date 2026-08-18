"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/alert-modal"
import { t } from "@/lib/translations"
import { formatCurrency } from "@/lib/format"
import { specPath } from "@/lib/urls"
import type { ModelHub, HubSpec } from "@/lib/types"
import { parseLocale, getCurrency, getLanguage, getSpecSlug } from "@/lib/i18n"

interface HubConfigTableProps {
  hub: ModelHub
  locale: string
}

function cheapestOffer(spec: HubSpec) {
  const withPrice = spec.offers.filter((o) => o.current_price !== null)
  if (withPrice.length === 0) return null
  return withPrice.reduce((best, o) =>
    (best === null || (o.current_price ?? Infinity) < (best.current_price ?? Infinity)) ? o : best,
    null as HubSpec["offers"][number] | null
  )
}

export function HubConfigTable({ hub, locale }: HubConfigTableProps) {
  const resolvedLocale = parseLocale(locale)
  const language = getLanguage(resolvedLocale)
  const currency = getCurrency(resolvedLocale)
  const [alertSpec, setAlertSpec] = useState<HubSpec | null>(null)

  const productForAlert = {
    id: hub.id,
    name: hub.name,
    specs: hub.storage_groups.flatMap((g) =>
      g.specs.map((s) => ({ storage: s.storage, color: s.color }))
    ),
  }

  const currentConfig = alertSpec
    ? (() => {
        const cheapest = cheapestOffer(alertSpec)
        return {
          color: alertSpec.color,
          storage: alertSpec.storage,
          condition: cheapest?.condition ?? "Fair",
          batteryNew: cheapest?.battery_new ?? false,
          price: alertSpec.current_price ?? 0,
        }
      })()
    : null

  return (
    <div>
      {hub.storage_groups.map((group) => (
        <div key={group.storage} className="mb-10">
          <h3 className="text-xl font-bold tracking-tight mb-4">
            {hub.name} {group.storage} GB
          </h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Configuración</th>
                  <th className="px-4 py-3 font-medium">Precio actual</th>
                  <th className="px-4 py-3 font-medium">Mínimo 30d</th>
                  <th className="px-4 py-3 font-medium">Media 30d</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Alerta</th>
                  <th className="px-4 py-3 font-medium">Back Market</th>
                  <th className="px-4 py-3 font-medium">Histórico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {group.specs.map((spec) => {
                  const cheapest = cheapestOffer(spec)
                  return (
                    <tr key={spec.slug} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">
                        {group.storage} GB · {t(spec.color, language)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-400">
                        {spec.current_price !== null ? formatCurrency(spec.current_price, currency, language) : "—"}
                      </td>
                      <td className="px-4 py-3">{spec.min_price_30d !== null ? formatCurrency(spec.min_price_30d, currency, language) : "—"}</td>
                      <td className="px-4 py-3">{spec.avg_price_30d !== null ? formatCurrency(spec.avg_price_30d, currency, language) : "—"}</td>
                      <td className="px-4 py-3">{cheapest ? t(cheapest.condition, language) : "—"}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => setAlertSpec(spec)}
                          aria-label={`Crear alerta para ${hub.name} ${spec.storage} GB ${t(spec.color, language)}`}
                        >
                          <Bell className="h-4 w-4" />
                          Alerta
                        </Button>
                      </td>
                      <td className="px-4 py-3">
                        {spec.best_offer_url ? (
                          <a
                            href={spec.best_offer_url}
                            target="_blank"
                            rel="sponsored noopener"
                            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                          >
                            Ver oferta
                            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={specPath(resolvedLocale, hub.category_slug, hub.brand_slug, hub.slug, getSpecSlug(spec, resolvedLocale))}
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          Ver historial
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {alertSpec && currentConfig && (
        <AlertModal
          isOpen
          onClose={() => setAlertSpec(null)}
          product={productForAlert}
          currentConfig={currentConfig}
        />
      )}
    </div>
  )
}
