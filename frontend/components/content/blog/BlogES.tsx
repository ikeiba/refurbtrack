// components/content/blog/BlogES.tsx
// Índice del blog en español. Las URLs de categoría usan el slug del locale
// (?category=Consejos en ES), compartiendo la fuente de verdad de lib/blog.ts.
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { BLOG_CATEGORIES, blogCategoryLabel, blogCategorySlug, blogPostSlug } from "@/lib/blog"
import type { BlogCategoryKey } from "@/lib/blog"

interface BlogPostData {
  slug: string
  title: string
  excerpt: string
  category: BlogCategoryKey
  date: string
  readTime: string
  author: string
}

const blogPosts: BlogPostData[] = [
  {
    slug: "guia-compradores-refurbished",
    title: "📖 Guía Completa para Compradores de Dispositivos Reacondicionados",
    excerpt: "Todo lo que necesitas saber antes de comprar un móvil, tablet o portátil reacondicionado. Desde qué significa cada categoría de estado hasta cómo evaluar si realmente vale la pena.",
    category: "Educación",
    date: "2026-01-15",
    readTime: "8 min",
    author: "Equipo RefurbTrack"
  },
  {
    slug: "impacto-ambiental-reacondicionado",
    title: "🌱 El Impacto Ambiental Real: Cuánto Ahorras Comprando Reacondicionado",
    excerpt: "Análisis detallado sobre CO2 evitado, agua ahorrada y residuos prevenidos por cada dispositivo reacondicionado. Con datos verificables y comparativas contra dispositivos nuevos.",
    category: "Sostenibilidad",
    date: "2026-01-18",
    readTime: "6 min",
    author: "Equipo RefurbTrack"
  },
  {
    slug: "diferencias-entre-marketplaces",
    title: "🛍️ Back Market vs Amazon Renewed vs eBay: Comparativa Completa",
    excerpt: "Análisis profundo de los principales marketplaces de reacondicionados. Precios, garantías, procesos de devolución y por qué algunos venden los mismos productos a precios diferentes.",
    category: "Comparativa",
    date: "2026-01-20",
    readTime: "10 min",
    author: "Equipo RefurbTrack"
  },
  {
    slug: "estrategia-ahorro-temporal",
    title: "💰 5 Estrategias para Maximizar tu Ahorro: Timing y Patrones de Precio",
    excerpt: "Descubre cuándo son más baratos los dispositivos reacondicionados. Análisis de patrones estacionales, influencia de eventos (Black Friday, lanzamientos de Apple) y cómo RefurbTrack te ayuda a encontrar el momento perfecto.",
    category: "Consejos",
    date: "2026-01-22",
    readTime: "7 min",
    author: "Equipo RefurbTrack"
  },
  {
    slug: "falsos-mitos-reacondicionados",
    title: "❌ 7 Mitos Sobre Dispositivos Reacondicionados (Desmentidos con Datos)",
    excerpt: "Abordamos las dudas más comunes: ¿duran menos? ¿tienen baterías degradadas? ¿es seguro? Respuestas basadas en datos reales y experiencias verificadas.",
    category: "Educación",
    date: "2026-01-24",
    readTime: "5 min",
    author: "Equipo RefurbTrack"
  },
  {
    slug: "tendencias-mercado-refurbished-2026",
    title: "📊 Tendencias del Mercado Refurbished 2026: Crecimiento y Oportunidades",
    excerpt: "Análisis del crecimiento del mercado de reacondicionados, modelos más demandados, precios en caída y predicciones para los próximos meses basadas en datos de RefurbTrack.",
    category: "Mercado",
    date: "2026-01-26",
    readTime: "9 min",
    author: "Equipo RefurbTrack"
  }
]

export function BlogES({ locale, selectedCategory }: { locale: string; selectedCategory: string }) {
  const language = getLanguage(locale)

  const filteredPosts = selectedCategory === "Todas"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Blog de RefurbTrack</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Guías, análisis y consejos sobre cómo ahorrar comprando tecnología reacondicionada de forma inteligente
        </p>
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {BLOG_CATEGORIES.map((cat) => {
          const href = cat.key === "Todas"
            ? `/${locale}/blog`
            : `/${locale}/blog?category=${blogCategorySlug(cat.key, locale)}`

          return (
            <Link
              key={cat.key}
              href={href}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                cat.key === selectedCategory
                  ? "bg-emerald-600 text-white"
                  : "bg-muted hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {blogCategoryLabel(cat.key, locale)}
            </Link>
          )
        })}
      </div>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <div className="mb-12">
          <Link href={`/${locale}/blog/${blogPostSlug(filteredPosts[0].slug, locale)}`}>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                  📌 {t("featured", language)}
                </span>
                <span className="text-xs text-muted-foreground">{blogCategoryLabel(filteredPosts[0].category, locale)}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-900 dark:text-emerald-100">
                {filteredPosts[0].title}
              </h2>
              <p className="text-muted-foreground text-lg mb-4">
                {filteredPosts[0].excerpt}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(filteredPosts[0].date).toLocaleDateString(getIntlLocale(locale), {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                  <span>•</span>
                  <span>{filteredPosts[0].readTime}</span>
                </div>
                <span className="text-emerald-600 font-semibold flex items-center gap-1 group">
                  {t("read_more", language)} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length > 1 && (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.slice(1).map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${blogPostSlug(post.slug, locale)}`}>
              <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow h-full cursor-pointer flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                    {blogCategoryLabel(post.category, locale)}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString(getIntlLocale(locale), {
                      month: "short",
                      day: "numeric"
                    })}
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                    {t("read", language)} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{t("no_posts_in_category", language)}</p>
        </div>
      )}
    </div>
  )
}