// components/content/blog/TendenciasEN.tsx
// Traducción al inglés del artículo: Tendencias del mercado.
import Link from "next/link"
import { Calendar, User, ArrowLeft, TrendingUp } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function TendenciasEN({ locale }: { locale: string }) {
  const language = getLanguage(locale)

  return (
    <div className="space-y-8">
      <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        {t("back_to_blog", language)}
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
            Market
          </span>
          <span className="text-xs text-muted-foreground">9 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          📊 2026 Refurbished Market Trends: Growth and Opportunities
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date("2026-01-26").toLocaleDateString(getIntlLocale(locale), { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            RefurbTrack Team
          </span>
        </div>
      </div>

      <article className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-base leading-relaxed">
        <p className="text-lg text-muted-foreground">
          The refurbished device market is growing at an unprecedented pace. Here we analyse the main trends, what they mean for buyers and what we can expect in the coming months.
        </p>

        <h2 className="text-2xl font-bold mt-8">📈 Growth Numbers</h2>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Global Market Data
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Refurbished market size 2023</span>
              <span className="font-bold">$36B USD</span>
            </li>
            <li className="flex justify-between">
              <span>Projected annual growth rate</span>
              <span className="font-bold">13% CAGR</span>
            </li>
            <li className="flex justify-between">
              <span>2027 projection</span>
              <span className="font-bold">$61B USD</span>
            </li>
            <li className="flex justify-between">
              <span>European adoption rate 2024</span>
              <span className="font-bold">22% of all electronics</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">1️⃣ Most In-Demand Devices</h2>
        <p>
          According to RefurbTrack analysis and market data:
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 text-lg">🥇 N°1: iPhones</h4>
            <p className="text-sm text-muted-foreground mb-3">
              45% of search traffic. Most popular models:
            </p>
            <ul className="text-xs space-y-1">
              <li>• iPhone 14 Pro Max</li>
              <li>• iPhone 15 Pro</li>
              <li>• iPhone 13 (value)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 text-lg">🥈 N°2: MacBooks</h4>
            <p className="text-sm text-muted-foreground mb-3">
              30% of traffic. 28% YoY growth:
            </p>
            <ul className="text-xs space-y-1">
              <li>• M1/M2 Pro</li>
              <li>• M3 (new)</li>
              <li>• Intel models (value)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 text-lg">🥉 N°3: iPads</h4>
            <p className="text-sm text-muted-foreground mb-3">
              15% of traffic. Education-driven growth:
            </p>
            <ul className="text-xs space-y-1">
              <li>• iPad Pro (M1/M2)</li>
              <li>• iPad Air (value)</li>
              <li>• iPad Standard (entry)</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">2️⃣ Marketplace Innovations</h2>
        <h3 className="text-xl font-bold mt-6">✅ Positive Trends</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Longer warranties:</strong> Some sellers already offer 18-24 months (previously 12 months was standard)</li>
          <li><strong>Extended trial periods:</strong> 60 days is becoming more common</li>
          <li><strong>Certified battery:</strong> Reports with the exact capacity percentage (a radical improvement in transparency)</li>
          <li><strong>AI for matching:</strong> Personalised recommendation systems based on history</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">3️⃣ Current Market Challenges</h2>
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-3">
          <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200">⚠️ Persistent Fragmentation</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Prices vary 15-30% for the same product across marketplaces. This is exactly the reason RefurbTrack exists.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200">⚠️ Inconsistent Standards</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              There is no global standard. "Excellent" on Back Market can be slightly different from "Excellent" on eBay.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200">⚠️ Small-Scale Fraud</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Although rare (1-2%), some sellers sell products "labelled as refurbished" that are simply unverified returns.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">4️⃣ Opportunities for Consumers</h2>
        <h3 className="text-xl font-bold mt-6">🎯 Make the Most of These Trends</h3>
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Negotiate longer warranties:</strong> If you see a product, you can contact the seller and negotiate 18 months where possible
          </li>
          <li>
            <strong>Take part in new programmes:</strong> Back Market and others launch rewards programmes regularly
          </li>
          <li>
            <strong>Buy before launches:</strong> Prices rise 5-10% before Apple events (in anticipation of post-launch drops)
          </li>
          <li>
            <strong>Use price comparison tools:</strong> Price fragmentation is growing. Tools like RefurbTrack are key
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-8">Conclusion</h2>
        <p>
          The refurbished market is at a turning point:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>✅ Growing 13% annually (vs 2-3% for new devices)</li>
          <li>✅ Standards constantly improving</li>
          <li>✅ Environmental awareness driving demand</li>
          <li>✅ Increasingly competitive prices</li>
          <li>✅ Ever-better warranties and protections</li>
        </ul>

        <p className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <strong>Final tip:</strong> 2026 is an excellent year to buy refurbished. Prices are low, competition is high, and quality and protections have never been better. Use tools like RefurbTrack to find the best deal and ride this upward trend.
        </p>
      </article>

      <div className="pt-8 border-t space-y-4">
        <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_blog", language)}
        </Link>
      </div>
    </div>
  )
}