// components/hub/model-hub-view.tsx
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Faq, type FaqItem } from "@/components/faq"
import { HubConfigTable } from "@/components/hub/hub-config-table"
import { t } from "@/lib/translations"
import { formatCurrency, formatDate } from "@/lib/format"
import {
  getHubCheapestInsight,
  getHubClosestMinInsight,
  getHubBiggestDropInsight,
  getHubNoDataInsight,
  getHubEvolutionIntro,
  getHubSeoParagraphs,
} from "@/lib/seo-content"
import { historyLandingPath, hubPath, specPath } from "@/lib/urls"
import type { ModelHub } from "@/lib/types"
import { parseLocale, getCurrency, getLanguage, getSpecSlug } from "@/lib/i18n"

interface SiblingModel {
  name: string
  slug: string
  category_slug: string
  brand_slug: string
}

interface ModelHubViewProps {
  hub: ModelHub
  locale: string
  siblings: SiblingModel[]
  faqItems: FaqItem[]
}

export function ModelHubView({ hub, locale, siblings, faqItems }: ModelHubViewProps) {
  const resolvedLocale = parseLocale(locale)
  const language = getLanguage(resolvedLocale)
  const currency = getCurrency(resolvedLocale)

  const category = hub.category_slug
  const brand = hub.brand_slug
  const product = hub.slug

  const lowest = hub.summary.lowest_current_price
  const avg = hub.summary.avg_current_price
  const histMin = hub.summary.historical_min ?? hub.lowest_ever_price
  const lastUpdated = hub.summary.last_updated

  const breadcrumbNodes = [
    { label: t("home", language), href: `/${resolvedLocale}` },
    { label: category, href: `/${resolvedLocale}/${category}` },
    { label: brand, href: `/${resolvedLocale}/${category}/${brand}` },
    { label: hub.name },
  ]

  const imageSrc = hub.image
    ? hub.image.startsWith("/") ? hub.image : `/${hub.image}`
    : "/placeholder.jpg"

  const seoParagraphs = getHubSeoParagraphs(language, currency, {
    productName: hub.name,
    configCount: hub.summary.config_count,
    lowest,
    avg,
    histMin,
  })

  const otherModels = siblings.filter((s) => s.slug !== product)

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 pt-8">
        <Breadcrumbs items={breadcrumbNodes} language={language} />

        {/* HERO + RESUMEN DE PRECIOS (imagen y resumen en paralelo) */}
        <header className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            {t("hub_title", language, { productName: hub.name })}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {t("hub_subtitle", language, { productName: hub.name })}
          </p>

          <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 mx-auto md:mx-0 bg-secondary/60 rounded-2xl p-5 flex items-center justify-center">
              {hub.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt={`${hub.name} ${t("refurbished", language).toLowerCase()}`}
                  className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal"
                />
              ) : (
                <span className="text-5xl">📱</span>
              )}
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              <SummaryCard label={t("lowest_current", language)} value={formatCurrency(lowest, currency, language)} hint={t("cheapest_now_hint", language)} />
              <SummaryCard label={t("avg_current", language)} value={formatCurrency(avg, currency, language)} hint={t("avg_configs_hint", language)} />
              <SummaryCard label={t("historical_min", language)} value={formatCurrency(histMin, currency, language)} hint={t("cheapest_recorded_hint", language)} />
              <SummaryCard
                label={t("configurations", language)}
                value={String(hub.summary.config_count)}
                hint={t("updated_suffix", language, { date: formatDate(lastUpdated, language) || "—" })}
              />
            </div>
          </div>
        </header>

        {/* CONFIGURACIONES */}
        <section className="mb-12">
          <HubConfigTable hub={hub} locale={locale} />
        </section>

        {/* EVOLUCIÓN DEL PRECIO */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t("price_evolution", language)}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {getHubEvolutionIntro(language, hub.name)}
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {hub.storage_groups.flatMap((g) => g.specs).slice(0, 6).map((spec) => (
              <li key={spec.slug}>
                <Link
                  href={specPath(resolvedLocale, category, brand, product, getSpecSlug(spec, resolvedLocale))}
                  className="block rounded-lg border border-border px-4 py-3 hover:border-emerald-500/40 hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium">{t("view_price_history_of", language, { name: hub.name, storage: spec.storage, color: t(spec.color, language) })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* MEJOR PRECIO / INSIGHTS */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t("best_price", language)}</h2>
          <div className="space-y-3">
            {hub.insights.cheapest_spec && (() => {
              const spec = hub.storage_groups.flatMap((g) => g.specs).find((s) => s.slug === hub.insights.cheapest_spec)
              if (!spec) return null
              return (
                <InsightCard>
                  {getHubCheapestInsight(language, currency, {
                    productName: hub.name,
                    storage: spec.storage,
                    color: t(spec.color, language),
                    price: spec.current_price,
                  })}{" "}
                  <Link href={specPath(resolvedLocale, category, brand, product, getSpecSlug(spec, resolvedLocale))} className="text-emerald-600 hover:underline">{t("view_history", language)}</Link>
                </InsightCard>
              )
            })()}
            {hub.insights.closest_to_min_spec && hub.insights.closest_to_min_gap !== null && (() => {
              const spec = hub.storage_groups.flatMap((g) => g.specs).find((s) => s.slug === hub.insights.closest_to_min_spec)
              if (!spec) return null
              return (
                <InsightCard>
                  {getHubClosestMinInsight(language, {
                    productName: hub.name,
                    storage: spec.storage,
                    color: t(spec.color, language),
                    pct: hub.insights.closest_to_min_gap,
                  })}
                </InsightCard>
              )
            })()}
            {hub.insights.biggest_drop_spec && hub.insights.biggest_drop_value !== null && (() => {
              const spec = hub.storage_groups.flatMap((g) => g.specs).find((s) => s.slug === hub.insights.biggest_drop_spec)
              if (!spec) return null
              return (
                <InsightCard>
                  {getHubBiggestDropInsight(language, {
                    productName: hub.name,
                    storage: spec.storage,
                    color: t(spec.color, language),
                    pct: hub.insights.biggest_drop_value,
                  })}
                </InsightCard>
              )
            })()}
            {!hub.insights.cheapest_spec && (
              <InsightCard>
                {getHubNoDataInsight(language, hub.name)}
              </InsightCard>
            )}
          </div>
        </section>

        {/* CONTENIDO SEO ÚTIL */}
        {seoParagraphs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">{t("seo_section_title", language, { productName: hub.name })}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {seoParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        {/* FAQ */}
        <Faq items={faqItems} title={t("faq_title", language)} />

        {/* ENLACES INTERNOS */}
        <section className="mt-16 border-t border-border pt-8">
          <h2 className="text-xl font-bold tracking-tight mb-4">{t("explore_more", language)}</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href={historyLandingPath(resolvedLocale)} className="text-emerald-600 hover:underline font-medium">
              {t("view_bm_history", language)}
            </Link>
            {otherModels.slice(0, 8).map((m) => (
              <Link
                key={m.slug}
                href={hubPath(resolvedLocale, m.category_slug, m.brand_slug, m.slug)}
                className="text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                {m.name}
              </Link>
            ))}
          </div>
          <Link href={historyLandingPath(resolvedLocale)} className="text-sm text-muted-foreground hover:underline">
            {t("view_other_iphones", language)}
          </Link>
        </section>
      </main>
    </div>
  )
}

function SummaryCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  )
}

function InsightCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">
      {children}
    </div>
  )
}
