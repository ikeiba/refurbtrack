// components/content/blog/BlogEN.tsx
// Índice del blog en inglés (traducción). Las categorías se mantienen como
// valores compartidos del query param (?category=) para preservar URLs.
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

const CATEGORIES = ["Todas", "Educación", "Sostenibilidad", "Comparativa", "Consejos", "Mercado"]

const CATEGORY_LABELS: Record<string, string> = {
  Todas: "All",
  Educación: "Education",
  Sostenibilidad: "Sustainability",
  Comparativa: "Comparison",
  Consejos: "Tips",
  Mercado: "Market",
}

const blogPosts = [
  {
    slug: "guia-compradores-refurbished",
    title: "📖 The Complete Guide to Buying Refurbished Devices",
    excerpt: "Everything you need to know before buying a refurbished phone, tablet or laptop. From what each condition grade means to how to tell whether it is really worth it.",
    category: "Educación",
    date: "2026-01-15",
    readTime: "8 min",
    author: "RefurbTrack Team"
  },
  {
    slug: "impacto-ambiental-reacondicionado",
    title: "🌱 The Real Environmental Impact: How Much You Save Buying Refurbished",
    excerpt: "A detailed analysis of the CO2 avoided, water saved and waste prevented by each refurbished device, with verifiable data and comparisons against new devices.",
    category: "Sostenibilidad",
    date: "2026-01-18",
    readTime: "6 min",
    author: "RefurbTrack Team"
  },
  {
    slug: "diferencias-entre-marketplaces",
    title: "🛍️ Back Market vs Amazon Renewed vs eBay: Full Comparison",
    excerpt: "An in-depth analysis of the main refurbished marketplaces. Prices, warranties, return processes and why some sell the same products at different prices.",
    category: "Comparativa",
    date: "2026-01-20",
    readTime: "10 min",
    author: "RefurbTrack Team"
  },
  {
    slug: "estrategia-ahorro-temporal",
    title: "💰 5 Strategies to Maximise Your Savings: Timing and Price Patterns",
    excerpt: "Discover when refurbished devices are cheapest. An analysis of seasonal patterns, the impact of events (Black Friday, Apple launches) and how RefurbTrack helps you find the perfect moment.",
    category: "Consejos",
    date: "2026-01-22",
    readTime: "7 min",
    author: "RefurbTrack Team"
  },
  {
    slug: "falsos-mitos-reacondicionados",
    title: "❌ 7 Myths About Refurbished Devices (Debunked with Data)",
    excerpt: "We tackle the most common doubts: do they last less? do they have degraded batteries? is it safe? Answers based on real data and verified experiences.",
    category: "Educación",
    date: "2026-01-24",
    readTime: "5 min",
    author: "RefurbTrack Team"
  },
  {
    slug: "tendencias-mercado-refurbished-2026",
    title: "📊 2026 Refurbished Market Trends: Growth and Opportunities",
    excerpt: "An analysis of the refurbished market's growth, the most in-demand models, falling prices and predictions for the coming months based on RefurbTrack data.",
    category: "Mercado",
    date: "2026-01-26",
    readTime: "9 min",
    author: "RefurbTrack Team"
  }
]

export function BlogEN({ locale, selectedCategory }: { locale: string; selectedCategory: string }) {
  const language = getLanguage(locale)

  const filteredPosts = selectedCategory === "Todas"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">RefurbTrack Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Guides, analysis and tips on how to save money by buying refurbished technology smartly
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {CATEGORIES.map((cat) => {
          const href = cat === "Todas"
            ? `/${locale}/blog`
            : `/${locale}/blog?category=${cat}`

          return (
            <Link
              key={cat}
              href={href}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                cat === selectedCategory
                  ? "bg-emerald-600 text-white"
                  : "bg-muted hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          )
        })}
      </div>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <div className="mb-12">
          <Link href={`/${locale}/blog/${filteredPosts[0].slug}`}>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                  📌 {t("featured", language)}
                </span>
                <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[filteredPosts[0].category]}</span>
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
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}>
              <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow h-full cursor-pointer flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                    {CATEGORY_LABELS[post.category]}
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