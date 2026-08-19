// components/content/blog/MarketplacesEN.tsx
// Traducción al inglés del artículo: Comparativa de marketplaces.
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function MarketplacesEN({ locale }: { locale: string }) {
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
            Comparison
          </span>
          <span className="text-xs text-muted-foreground">10 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          🛍️ Back Market vs Amazon Renewed vs eBay: Full Comparison
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date("2026-01-20").toLocaleDateString(getIntlLocale(locale), { year: "numeric", month: "long", day: "numeric" })}
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
          The refurbished device market is fragmented across several major players. Here we compare the three main marketplaces in depth: what sets them apart, where to find better prices and which one to choose based on your needs.
        </p>

        <h2 className="text-2xl font-bold mt-8">Back Market: The Pure Specialist</h2>
        <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">📌 Features</h4>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Marketplace dedicated 100% to refurbished products</li>
            <li>Verified professional sellers (not P2P)</li>
            <li>Standard warranty: 12 months</li>
            <li>Returns: 30 days, no questions asked</li>
            <li>Community: verified reviews from real buyers</li>
            <li>Presence: Europe, USA and Japan</li>
          </ul>
        </div>

        <h3 className="text-xl font-bold mt-6">Advantages</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Specialisation:</strong> A dedicated refurbishment quality team</li>
          <li><strong>Transparency:</strong> Clear photos of damage, exact battery condition</li>
          <li><strong>Verified reviews:</strong> Only real buyers can rate</li>
          <li><strong>Competitive prices:</strong> Many sellers create downward pressure</li>
          <li><strong>Generous warranty:</strong> 12 months is standard, often up to 24</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Disadvantages</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Less total supply:</strong> Especially for older models</li>
          <li><strong>Slower shipping:</strong> Typically 5-7 days</li>
          <li><strong>Secondary market:</strong> Some sellers have more high ratings than others</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Best for</h3>
        <p className="italic">Buyers who value specialisation, transparency and want no surprises. Ideal if this is your first refurbished purchase.</p>

        <h2 className="text-2xl font-bold mt-8">Amazon Renewed: The Reliable Alternative</h2>
        <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-3">📌 Features</h4>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>A category within the Amazon ecosystem</li>
            <li>Certified sellers + Amazon as guarantor</li>
            <li>Warranty: 90 days to 12 months (depending on the seller)</li>
            <li>Returns: Full Amazon protection (typically 30 days)</li>
            <li>Shipping: Many options include Prime delivery</li>
            <li>Return policy: Very buyer-friendly</li>
          </ul>
        </div>

        <h3 className="text-xl font-bold mt-6">Advantages</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Amazon trust:</strong> Backed by a massive corporation</li>
          <li><strong>Prime Shipping:</strong> Fast delivery if you have a subscription</li>
          <li><strong>Buyer protection:</strong> Amazon steps in if there are issues</li>
          <li><strong>Easy returns:</strong> If something goes wrong, Amazon resolves it</li>
          <li><strong>Varied offer:</strong> Many sellers and models</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Disadvantages</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Less specialisation:</strong> Not a dedicated refurbished marketplace</li>
          <li><strong>Variable warranties:</strong> Heavily dependent on the seller (90 days to 12 months)</li>
          <li><strong>Less detailed information:</strong> The exact battery condition is sometimes not specified</li>
          <li><strong>Variable pricing:</strong> Less transparency in the pricing model</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Best for</h3>
        <p className="italic">Amazon Prime users who value shipping speed and robust protection. If you already have Amazon Prime, it is usually faster.</p>

        <h2 className="text-2xl font-bold mt-8">eBay Refurbished: The Mass Market</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-3">📌 Features</h4>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Hybrid P2P + professional sellers marketplace</li>
            <li>Multiple warranty and seller options</li>
            <li>Returns: Variable (depending on the seller)</li>
            <li>Supply: Massive, including rare models</li>
            <li>Protection: eBay Money Back Guarantee (up to 180 days)</li>
          </ul>
        </div>

        <h3 className="text-xl font-bold mt-6">Advantages</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Largest supply:</strong> Even rare, discontinued models</li>
          <li><strong>Price range:</strong> From extreme deals to premium</li>
          <li><strong>Auctions:</strong> You can get very low prices if you are patient</li>
          <li><strong>Strong protection:</strong> The eBay Money Back Guarantee is rigorous</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Disadvantages</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Variability:</strong> Very inconsistent quality across sellers</li>
          <li><strong>Less specialisation:</strong> Not a refurbished marketplace</li>
          <li><strong>Higher risk:</strong> More low-quality sellers than on Back Market</li>
          <li><strong>Inconsistent information:</strong> Descriptions vary a lot</li>
          <li><strong>More complex process:</strong> More steps and less standardisation</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Best for</h3>
        <p className="italic">Expert buyers who can spot fraud. Deal hunters. People looking for rare, discontinued models.</p>

        <h2 className="text-2xl font-bold mt-8">Side-by-Side Comparison</h2>
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-3 font-bold">Factor</th>
                <th className="text-left p-3 font-bold">Back Market</th>
                <th className="text-left p-3 font-bold">Amazon Renewed</th>
                <th className="text-left p-3 font-bold">eBay</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Specialisation</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐</td>
                <td className="p-3">⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Warranty</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Shipping Speed</td>
                <td className="p-3">⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Variety</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Best Price</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Buyer Protection</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8">Which One Should You Choose?</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <h4 className="font-bold text-lg">🟢 Choose Back Market if...</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>It is your first refurbished purchase (maximum peace of mind)</li>
              <li>You value specialisation and transparency</li>
              <li>You want verified reviews from other buyers</li>
              <li>You prefer the standard 12-month warranty</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-bold text-lg">🔵 Choose Amazon Renewed if...</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>You are an Amazon Prime subscriber (fast shipping)</li>
              <li>You value speed over specialisation</li>
              <li>You prefer Amazon's buyer protection</li>
              <li>You want hassle-free returns</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h4 className="font-bold text-lg">🔴 Choose eBay if...</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>You are an experienced buyer</li>
              <li>You are looking for more aggressive prices (including auctions)</li>
              <li>You need a specific rare or discontinued model</li>
              <li>You have time to research sellers</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Our Recommendation</h2>
        <p>
          <strong>RefurbTrack</strong> does exactly this: it compares prices across all the main marketplaces so you can see at a glance where the best deal is. Because in many cases, the same model is available at different prices on Back Market, Amazon and eBay. We do the work of verifying where it is cheapest and in which conditions.
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