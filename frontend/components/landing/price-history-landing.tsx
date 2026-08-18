// components/landing/price-history-landing.tsx
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Faq, type FaqItem } from "@/components/faq"
import { FeaturedPriceChart } from "@/components/landing/featured-price-chart"
import { formatCurrency, formatDate, formatSignedPercent } from "@/lib/format"
import { hubPath, categoryPath } from "@/lib/urls"
import { getColorHex } from "@/lib/utils"
import { t } from "@/lib/translations"
import type { ProductSummary, FeaturedHistory } from "@/lib/types"
import { parseLocale, getCurrency, getLanguage } from "@/lib/i18n"

interface PriceHistoryLandingProps {
  locale: string
  products: ProductSummary[]
  featured: FeaturedHistory
}

const LANDING_FAQ: FaqItem[] = [
  {
    question: "¿Qué es un rastreador de precios de Back Market?",
    answer:
      "Es una herramienta que registra de forma periódica los precios de los productos reacondicionados que se venden en Back Market y guarda esa información para mostrar su evolución. En RefurbTrack lo usamos para calcular el mínimo, la media y el máximo de cada configuración y ayudarte a decidir cuándo comprar.",
  },
  {
    question: "¿Cómo puedo consultar el historial de precios de Back Market?",
    answer:
      "Elige un modelo (por ejemplo, el iPhone 15), entra en su página y selecciona la configuración que te interese. Allí verás la gráfica de evolución, el mínimo y el máximo de los últimos 30 días y el enlace a la oferta en Back Market.",
  },
  {
    question: "¿Cómo saber si un precio de Back Market es bueno?",
    answer:
      "Compara el precio actual con su mínimo y su media de los últimos 30 días. Si el precio actual está cerca del mínimo reciente o por debajo de la media, suele ser una buena señal. En RefurbTrack mostramos esos datos para que puedas valorarlo sin tener que hacer tú las cuentas.",
  },
  {
    question: "¿Back Market muestra el historial de precios?",
    answer:
      "Back Market no ofrece un historial completo y consultable de cada producto. RefurbTrack reconstruye esa evolución guardando registros periódicos de los precios y poniéndolos a tu disposición en gráficas y tablas.",
  },
  {
    question: "¿Cómo funciona el seguimiento de precios?",
    answer:
      "RefurbTrack registra los precios de las configuraciones de Back Market, guarda la evolución histórica, calcula estadísticas a partir de esos registros y te permite consultar el historial para saber si el precio actual es realmente una buena oferta.",
  },
  {
    question: "¿Cuándo es mejor comprar un móvil reacondicionado?",
    answer:
      "No hay una regla infalible, pero un buen momento suele ser cuando el precio de la configuración que buscas está cerca de su mínimo reciente y por debajo de su media de los últimos 30 días. Con el historial de RefurbTrack puedes comprobar en qué punto se encuentra ahora mismo.",
  },
]

export function PriceHistoryLanding({ locale, products, featured }: PriceHistoryLandingProps) {
  const resolvedLocale = parseLocale(locale)
  const language = getLanguage(resolvedLocale)
  const currency = getCurrency(resolvedLocale)

  const breadcrumbNodes = [
    { label: t("home", language), href: `/${resolvedLocale}` },
    { label: t("history_landing_title", language) },
  ]

  const stats = featured.stats
  const models = products.filter((p) => p.category_slug && p.brand_slug && p.slug)

  const firstHub = models.length > 0
    ? hubPath(resolvedLocale, models[0].category_slug!, models[0].brand_slug!, models[0].slug)
    : null

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 pt-8">
        <Breadcrumbs items={breadcrumbNodes} language={language} />

        {/* HERO */}
        <header className="max-w-3xl mb-14">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            {t("history_landing_title", language)}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Consulta cómo evolucionan los precios de móviles reacondicionados en Back Market,
            sigue sus cambios con nuestro rastreador de precios y descubre si el precio actual
            es realmente una buena oferta.
          </p>
          {firstHub && (
            <Link
              href={firstHub}
              className="mt-6 inline-flex items-center justify-center h-11 px-6 rounded-md text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              {t("view_price_history", language)}
            </Link>
          )}
        </header>

        {/* PRODUCTOS QUE RASTREAMOS */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-2">{t("tracked_products", language)}</h2>
          <p className="text-muted-foreground mb-6">
            {t("tracked_products_desc", language)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((product) => {
              const href = hubPath(resolvedLocale, product.category_slug!, product.brand_slug!, product.slug)
              const colors = product.available_colors ?? []
              const storages = product.available_storages ?? []
              return (
                <div key={product.id} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 shrink-0 bg-secondary/60 rounded-xl p-2 flex items-center justify-center">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image.startsWith("/") ? product.image : `/${product.image}`}
                          alt={product.name}
                          className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal"
                        />
                      ) : (
                        <span className="text-3xl">📱</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={href} className="font-bold text-lg hover:text-emerald-600 transition-colors">
                        {product.name}
                      </Link>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {product.min_price_cached ? `${t("from", language)} ${formatCurrency(product.min_price_cached, currency, language)}` : t("pending_price", language)}
                        </span>
                      </div>
                      {typeof product.spec_count === "number" && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t("configs_suffix", language, { count: product.spec_count })}
                        </p>
                      )}
                    </div>
                  </div>

                  {colors.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {colors.map((color) => (
                        <span
                          key={color}
                          className="h-4 w-4 rounded-full border border-border"
                          style={{ backgroundColor: getColorHex(color) }}
                          title={t(color, language)}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {t("colors_count", language, { count: colors.length })}
                      </span>
                    </div>
                  )}

                  {storages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {storages.map((storage) => (
                        <span key={storage} className="text-xs rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
                          {storage} GB
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={href} className="text-sm font-medium text-emerald-600 hover:underline mt-auto">
                    {t("view_price_history", language)}
                  </Link>
                </div>
              )
            })}
          </div>
        </section>

        {/* CÓMO FUNCIONA EL RASTREADOR DE PRECIOS */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t("how_tracker_works", language)}</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "RefurbTrack registra los precios de las configuraciones disponibles en Back Market.",
              "Guarda la evolución histórica de cada configuración a lo largo del tiempo.",
              "Calcula estadísticas (mínimo, media y máximo) a partir de los registros disponibles.",
              "Puedes consultar el historial para valorar si el precio actual es una buena oferta.",
            ].map((step, i) => (
              <li key={i} className="rounded-xl border border-border bg-card p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 font-bold mb-3">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* SECCIÓN PRINCIPAL DE DATOS (DEMO REAL) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t("real_history_example", language)}</h2>

          {stats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <StatCard label={t("current_price_stat", language)} value={formatCurrency(stats.current, currency, language)} />
                <StatCard label={t("min_30_days", language)} value={formatCurrency(stats.min30d, currency, language)} />
                <StatCard label={t("avg_30_days", language)} value={formatCurrency(stats.avg30d, currency, language)} />
                <StatCard label={t("max_30_days", language)} value={formatCurrency(stats.max30d, currency, language)} />
                <StatCard label={t("last_record", language)} value={formatDate(stats.last_updated, language) || "—"} />
              </div>

              <FeaturedPriceChart history={featured.history} name={stats.product_name} locale={resolvedLocale} />

              {stats.percentage_vs_average !== null && stats.avg30d !== null && stats.current !== null && (
                <p className="mt-4 text-muted-foreground">
                  El precio actual del {stats.product_name} ({stats.storage} GB · {stats.color}) está un{" "}
                  <strong>{formatSignedPercent(stats.percentage_vs_average)}</strong> respecto a la media de los
                  últimos 30 días ({formatCurrency(stats.avg30d, currency, language)}).
                </p>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
              Todavía no hay registros de precios suficientes para mostrar una evolución real.
              En cuanto nuestro rastreador registre datos, aparecerán aquí automáticamente.
            </div>
          )}
        </section>

        {/* ¿ES UN BUEN MOMENTO PARA COMPRAR? */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">{t("good_time_buy", language)}</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            {stats?.position_label ? (
              <p className="text-lg text-muted-foreground leading-relaxed">
                Según los últimos registros, el precio actual del {stats.product_name} se encuentra{" "}
                <strong className="text-foreground">{stats.position_label}</strong>. Esta valoración se basa
                únicamente en su posición respecto al histórico disponible, no es una predicción de futuro.
              </p>
            ) : (
              <p className="text-lg text-muted-foreground leading-relaxed">
                No hay suficientes datos para determinar si ahora es un buen momento de compra. Consulta el
                historial de cada modelo para tomar una decisión informada.
              </p>
            )}
          </div>
        </section>

        {/* HISTORIAL POR MODELO */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-2">{t("history_by_model", language)}</h2>
          <p className="text-muted-foreground mb-6">
            Consulta el precio de cada iPhone reacondicionado, compara sus configuraciones y revisa
            su evolución en Back Market antes de comprar.
          </p>
          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            {models.map((product) => {
              const href = hubPath(resolvedLocale, product.category_slug!, product.brand_slug!, product.slug)
              const colors = product.available_colors ?? []
              const details = [
                `${t("configs_suffix", language, { count: product.spec_count ?? 0 })}`,
                `${t("colors_count", language, { count: colors.length })}`,
                product.min_price_cached ? `${t("from_lower", language, { price: formatCurrency(product.min_price_cached, currency, language) })}` : null,
              ].filter(Boolean).join(" · ")

              return (
                <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <Link href={href} className="font-semibold text-foreground hover:text-emerald-600 transition-colors">
                      {product.name} {t("refurbished", language).toLowerCase()}
                    </Link>
                    <p className="text-sm text-muted-foreground">{details}</p>
                  </div>
                  <Link
                    href={href}
                    className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline"
                  >
                    {t("compare_prices", language)}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )
            })}
          </div>
        </section>

        {/* FAQ */}
        <Faq items={LANDING_FAQ} title={t("faq_title", language)} />

        {/* ENLACES INTERNOS */}
        <section className="mt-16 border-t border-border pt-8">
          <h2 className="text-xl font-bold tracking-tight mb-4">{t("explore", language)}</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href={categoryPath(resolvedLocale, "smartphone")} className="text-muted-foreground hover:text-emerald-600 transition-colors">
              {t("smartphones_refurbished", language)}
            </Link>
            {models.slice(0, 6).map((p) => (
              <Link
                key={p.id}
                href={hubPath(resolvedLocale, p.category_slug!, p.brand_slug!, p.slug)}
                className="text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                {t("price_of_refurbished", language, { name: p.name })}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  )
}
