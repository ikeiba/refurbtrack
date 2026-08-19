// components/content/blog/EstrategiaAhorroEN.tsx
// Traducción al inglés del artículo: Estrategias de ahorro.
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function EstrategiaAhorroEN({ locale }: { locale: string }) {
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
            Tips
          </span>
          <span className="text-xs text-muted-foreground">7 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          💰 5 Strategies to Maximise Your Savings: Timing and Price Patterns
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date("2026-01-22").toLocaleDateString(getIntlLocale(locale), { year: "numeric", month: "long", day: "numeric" })}
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
          Refurbished device prices are not random. There are predictable patterns that can help you save even more. Here are 5 strategies based on real data analysis from RefurbTrack.
        </p>

        <h2 className="text-2xl font-bold mt-8">1️⃣ Wait for the Next Generation Launch</h2>
        <p>
          When Apple launches a new iPhone, the previous models drop dramatically in price. Typical pattern:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Week 0 (launch):</strong> The previous model holds its price</li>
          <li><strong>Weeks 2-4:</strong> Gradual 5-10% drop</li>
          <li><strong>Month 2:</strong> 15-25% drop (maximum pressure)</li>
          <li><strong>Months 3-6:</strong> Stabilisation at a new lower floor</li>
        </ul>
        <p className="mt-4">
          <strong>Strategy:</strong> If you do not need the newest model, wait 1-2 months after the official launch for maximum savings.
        </p>

        <h2 className="text-2xl font-bold mt-8">2️⃣ Make the Most of Shopping Events</h2>
        <div className="bg-muted/50 p-6 rounded-lg border">
          <h4 className="font-bold mb-3">📅 Peak Activity Events</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <strong>Black Friday / Cyber Monday (November)</strong><br />
              Discounts: 20-40% extra off base prices<br />
              Risk: Popularity can deplete stock
            </li>
            <li>
              <strong>Prime Day (July)</strong><br />
              Discounts: 15-30% on Amazon Renewed<br />
              Risk: Only if you have Prime
            </li>
            <li>
              <strong>Mid-Year Black Friday</strong><br />
              Discounts: 10-20%<br />
              Opportunity: Less well known, less competition
            </li>
            <li>
              <strong>January Sales (Post-Christmas)</strong><br />
              Discounts: 15-25% (inventory clearance)<br />
              Opportunity: Excellent price-to-quality ratio
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">3️⃣ Buy Discontinued or 2-Year-Old Models</h2>
        <p>
          The iPhone 13 is still an excellent device in 2026, but it costs less because it is "old" out of the box.
        </p>
        <p>
          Typical savings:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Current model: 15-25% off vs new</li>
          <li>1-year-old model: 30-45% off</li>
          <li>2+ year-old model: 45-65% off</li>
        </ul>
        <p className="mt-4 text-sm bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
          <strong>⚠️ Note:</strong> Make sure the model is still supported with manufacturer updates. iOS 18 still supports the iPhone XS (2018), but iOS 17 was the last for the iPhone 6S.
        </p>

        <h2 className="text-2xl font-bold mt-8">4️⃣ Monitor Weekly Trends</h2>
        <p>
          Prices fluctuate. RefurbTrack analysis shows:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Monday-Wednesday:</strong> Prices are typically lower (less weekday demand)</li>
          <li><strong>Thursday-Friday:</strong> Prices rise (weekend shopping)</li>
          <li><strong>Weekend:</strong> Prices are higher (peak demand)</li>
          <li><strong>Nights (10pm-6am):</strong> Occasionally lower in stores that update overnight</li>
        </ul>
        <p className="mt-4">
          <strong>Strategy:</strong> Set up a price alert for the model you want. RefurbTrack will notify you when it drops.
        </p>

        <h2 className="text-2xl font-bold mt-8">5️⃣ Compare Across Marketplaces Constantly</h2>
        <p>
          The SAME device can vary significantly in price:
        </p>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3">📊 Real Example (iPhone 14 Pro, Excellent condition)</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Seller A</span>
              <span className="font-bold">£770</span>
            </li>
            <li className="flex justify-between">
              <span>Seller B</span>
              <span className="font-bold">£810</span>
            </li>
            <li className="flex justify-between">
              <span>Auction - Seller C</span>
              <span className="font-bold">£685 (after bidding)</span>
            </li>
            <li className="flex justify-between text-emerald-700 dark:text-emerald-300 font-bold">
              <span>Potential difference</span>
              <span>£125 (16% saving)</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">Combined Strategy: The Perfect Plan</h2>
        <p>
          If you want to maximise savings, combine them all:
        </p>
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Week 1:</strong> Identify the model you want (it can be 1-2 years older)
          </li>
          <li>
            <strong>Week 2:</strong> Set up RefurbTrack price alerts for all marketplaces
          </li>
          <li>
            <strong>Weeks 3-5:</strong> Wait for the next event (Black Friday, launch, etc.)
          </li>
          <li>
            <strong>Event:</strong> Compare prices in real time across Back Market, Amazon and eBay
          </li>
          <li>
            <strong>Buy:</strong> On the cheapest marketplace, checking the warranty and the seller
          </li>
        </ol>

        <p className="mt-4 text-sm italic">
          Typical result: 40-50% off vs a new device instead of 15-25% off.
        </p>

        <h2 className="text-2xl font-bold mt-8">⚠️ Mistakes to Avoid</h2>

        <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 rounded">
          <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
            <li>❌ <strong>Obsessing over micro-discounts:</strong> Waiting 3 months for £20 of savings is not worth it</li>
            <li>❌ <strong>Ignoring sellers:</strong> The best price is worthless if the seller has poor reviews</li>
            <li>❌ <strong>Buying without a warranty:</strong> Always check the warranty period (minimum 12 months)</li>
            <li>❌ <strong>Forgetting shipping costs:</strong> A "£50 cheaper" deal can have £30 of shipping</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">Conclusion</h2>
        <p>
          It is not magic, it is patience + information. Refurbished prices follow predictable patterns if you know where to look.
        </p>

        <p>
          <strong>RefurbTrack</strong> exists to take away the tedious work: we monitor all marketplaces, identify trends and alert you when the price drops. Your job is simply to wait for the right moment.
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