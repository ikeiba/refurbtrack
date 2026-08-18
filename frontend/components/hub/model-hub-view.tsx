// components/hub/model-hub-view.tsx
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Faq, type FaqItem } from "@/components/faq"
import { HubConfigTable } from "@/components/hub/hub-config-table"
import { t } from "@/lib/translations"
import { formatCurrency, formatSignedPercent, formatDate } from "@/lib/format"
import { historyLandingPath, hubPath, specPath } from "@/lib/urls"
import type { ModelHub } from "@/lib/types"
import { parseLocale, getCurrency, getLanguage, getSpecSlug } from "@/lib/i18n"
import type { Currency, Language } from "@/lib/i18n"

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
}

function buildFaq(hub: ModelHub, language: Language, currency: Currency): FaqItem[] {
  const name = hub.name
  const lowest = hub.summary.lowest_current_price
  const histMin = hub.summary.historical_min ?? hub.lowest_ever_price
  const cheapestGroup = hub.insights.cheapest_spec
    ? hub.storage_groups.flatMap((g) => g.specs).find((s) => s.slug === hub.insights.cheapest_spec)
    : undefined
  const cheapestStorage = cheapestGroup?.storage

  const items: FaqItem[] = []

  if (lowest !== null) {
    items.push({
      question: `¿Cuánto cuesta el ${name} reacondicionado?`,
      answer: `El precio más bajo disponible ahora mismo para el ${name} reacondicionado en Back Market es de ${formatCurrency(lowest, currency, language)}. Los precios varían según la capacidad, el color y el estado del dispositivo, por eso te recomendamos revisar todas las configuraciones antes de decidir.`,
    })
  } else {
    items.push({
      question: `¿Cuánto cuesta el ${name} reacondicionado?`,
      answer: `Todavía no tenemos registros de precios suficientes para el ${name} reacondicionado. En cuanto nuestro rastreador registre su evolución, mostraremos aquí el precio más bajo y su historial.`,
    })
  }

  if (histMin !== null) {
    items.push({
      question: `¿Cuál es el precio mínimo del ${name}?`,
      answer: `El mínimo histórico registrado para el ${name} es de ${formatCurrency(histMin, currency, language)}. Recuerda que es un precio que se alcanzó en un momento concreto; el precio actual puede ser distinto.`,
    })
  }

  if (cheapestStorage) {
    items.push({
      question: `¿Qué capacidad del ${name} sale más barata?`,
      answer: `Actualmente, la configuración de ${cheapestStorage} GB es la más económica que tenemos registrada para el ${name}. Consulta sus colores y estados para encontrar la oferta exacta.`,
    })
  }

  items.push({
    question: `¿Cómo ha evolucionado el precio del ${name}?`,
    answer: `RefurbTrack registra periódicamente los precios del ${name} en Back Market y calcula el mínimo, la media y el máximo de cada configuración. Puedes consultar el historial individual de cada capacidad y color desde esta página.`,
  })

  return items
}

function buildSeoContent(hub: ModelHub, language: Language, currency: Currency): string[] {
  const name = hub.name
  const lowest = hub.summary.lowest_current_price
  const avg = hub.summary.avg_current_price
  const histMin = hub.summary.historical_min ?? hub.lowest_ever_price
  const paragraphs: string[] = []

  if (lowest !== null) {
    paragraphs.push(
      `El precio más bajo disponible ahora mismo para un ${name} reacondicionado es de ${formatCurrency(lowest, currency, language)}. Hemos analizado sus ${hub.summary.config_count} configuraciones entre capacidades, colores y estados.`
    )
  } else {
    paragraphs.push(
      `Estamos rastreando las ${hub.summary.config_count} configuraciones del ${name} reacondicionado en Back Market. En cuanto haya registros de precios, podrás ver aquí su evolución completa.`
    )
  }

  if (avg !== null && lowest !== null && lowest !== avg) {
    const pct = lowest < avg ? "por debajo" : "por encima"
    paragraphs.push(
      `El precio medio actual del ${name} es de ${formatCurrency(avg, currency, language)}, y la opción más barata se sitúa ${pct} de esa media.`
    )
  }

  if (histMin !== null) {
    paragraphs.push(
      `El mínimo histórico registrado para el ${name} ha sido de ${formatCurrency(histMin, currency, language)}, aunque no siempre coincide con el precio más bajo disponible en este momento.`
    )
  }

  return paragraphs
}

export function ModelHubView({ hub, locale, siblings }: ModelHubViewProps) {
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
    { label: "Inicio", href: `/${resolvedLocale}` },
    { label: category, href: `/${resolvedLocale}/${category}` },
    { label: brand, href: `/${resolvedLocale}/${category}/${brand}` },
    { label: hub.name },
  ]

  const imageSrc = hub.image
    ? hub.image.startsWith("/") ? hub.image : `/${hub.image}`
    : "/placeholder.jpg"

  const faq = buildFaq(hub, language, currency)
  const seoParagraphs = buildSeoContent(hub, language, currency)

  const otherModels = siblings.filter((s) => s.slug !== product)

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 pt-8">
        <Breadcrumbs items={breadcrumbNodes} />

        {/* HERO + RESUMEN DE PRECIOS (imagen y resumen en paralelo) */}
        <header className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            {hub.name} reacondicionado: precios e historial
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Consulta los precios e historial del {hub.name} reacondicionado en Back Market
            y compara sus distintas configuraciones para comprar en el momento justo.
          </p>

          <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 mx-auto md:mx-0 bg-secondary/60 rounded-2xl p-5 flex items-center justify-center">
              {hub.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt={`${hub.name} reacondicionado`}
                  className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal"
                />
              ) : (
                <span className="text-5xl">📱</span>
              )}
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              <SummaryCard label="Precio actual más bajo" value={formatCurrency(lowest, currency, language)} hint="Lo más barato ahora" />
              <SummaryCard label="Precio medio actual" value={formatCurrency(avg, currency, language)} hint="Media de configuraciones" />
              <SummaryCard label="Mínimo histórico" value={formatCurrency(histMin, currency, language)} hint="Lo más barato registrado" />
              <SummaryCard
                label="Configuraciones"
                value={String(hub.summary.config_count)}
                hint={`Actualizado: ${formatDate(lastUpdated, language) || "—"}`}
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
          <h2 className="text-2xl font-bold tracking-tight mb-6">Evolución del precio</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Cada configuración del {hub.name} (capacidad, color y estado) tiene su propia evolución
            de precios. Para evitar mezclar series incompatibles, el historial se consulta por
            configuración:
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {hub.storage_groups.flatMap((g) => g.specs).slice(0, 6).map((spec) => (
              <li key={spec.slug}>
                <Link
                  href={specPath(resolvedLocale, category, brand, product, getSpecSlug(spec, resolvedLocale))}
                  className="block rounded-lg border border-border px-4 py-3 hover:border-emerald-500/40 hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium">Ver historial de precios del {hub.name} {spec.storage} GB {t(spec.color, language)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* MEJOR PRECIO / INSIGHTS */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">¿Cuál es el mejor precio?</h2>
          <div className="space-y-3">
            {hub.insights.cheapest_spec && (() => {
              const spec = hub.storage_groups.flatMap((g) => g.specs).find((s) => s.slug === hub.insights.cheapest_spec)
              if (!spec) return null
              return (
                <InsightCard>
                  La configuración más barata ahora mismo es el {hub.name} {spec.storage} GB {t(spec.color, language)} a {formatCurrency(spec.current_price, currency, language)}.{" "}
                  <Link href={specPath(resolvedLocale, category, brand, product, getSpecSlug(spec, resolvedLocale))} className="text-emerald-600 hover:underline">Ver historial</Link>
                </InsightCard>
              )
            })()}
            {hub.insights.closest_to_min_spec && hub.insights.closest_to_min_gap !== null && (() => {
              const spec = hub.storage_groups.flatMap((g) => g.specs).find((s) => s.slug === hub.insights.closest_to_min_spec)
              if (!spec) return null
              return (
                <InsightCard>
                  El {hub.name} {spec.storage} GB {t(spec.color, language)} es la configuración más cercana a su mínimo reciente
                  (está un {formatSignedPercent(hub.insights.closest_to_min_gap)} por encima de él).
                </InsightCard>
              )
            })()}
            {hub.insights.biggest_drop_spec && hub.insights.biggest_drop_value !== null && (() => {
              const spec = hub.storage_groups.flatMap((g) => g.specs).find((s) => s.slug === hub.insights.biggest_drop_spec)
              if (!spec) return null
              return (
                <InsightCard>
                  El {hub.name} {spec.storage} GB {t(spec.color, language)} es la configuración con mayor caída reciente,
                  un {formatSignedPercent(hub.insights.biggest_drop_value)} respecto a su máximo de los últimos 30 días.
                </InsightCard>
              )
            })()}
            {!hub.insights.cheapest_spec && (
              <InsightCard>
                Aún no hay suficientes datos de precios para calcular qué configuración del {hub.name} es la más barata.
              </InsightCard>
            )}
          </div>
        </section>

        {/* CONTENIDO SEO ÚTIL */}
        {seoParagraphs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Precios e historial del {hub.name}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {seoParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>
        )}

        {/* FAQ */}
        <Faq items={faq} />

        {/* ENLACES INTERNOS */}
        <section className="mt-16 border-t border-border pt-8">
          <h2 className="text-xl font-bold tracking-tight mb-4">Explorar más</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href={historyLandingPath(resolvedLocale)} className="text-emerald-600 hover:underline font-medium">
              Ver historial de precios de Back Market
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
            Ver otros modelos de iPhone
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
