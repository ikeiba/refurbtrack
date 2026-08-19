// components/content/blog/MitosEN.tsx
// Traducción al inglés del artículo: Mitos sobre reacondicionados.
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function MitosEN({ locale }: { locale: string }) {
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
            Education
          </span>
          <span className="text-xs text-muted-foreground">5 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          ❌ 7 Myths About Refurbished Devices (Debunked with Data)
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date("2026-01-24").toLocaleDateString(getIntlLocale(locale), { year: "numeric", month: "long", day: "numeric" })}
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
          There is a lot of misinformation about refurbished devices. We separate fact from fiction with concrete data.
        </p>

        <h2 className="text-2xl font-bold mt-8">Myth #1: "Refurbished Products Are Basically Stolen Goods"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSE</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            The reality: approximately 70% of refurbished devices come from...
          </p>
          <ul className="space-y-1 text-sm list-disc pl-5">
            <li>Store returns (change of mind within the return period)</li>
            <li>Unsold surplus stock</li>
            <li>In-store demo units</li>
            <li>Manufacturer warranty replacements</li>
            <li>Insurance returns</li>
            <li>Sales from individuals who no longer want them</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">Myth #2: "The Battery Dies Within 6 Months"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSE</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            The battery is the most important component. Certified marketplaces report its exact condition:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>"Excellent" device (85-100% battery):</strong> Will last 4-5 years with normal use
            </li>
            <li>
              <strong>"Very Good" device (80-85%):</strong> Will last 3-4 years
            </li>
            <li>
              <strong>"Good" device (~80%):</strong> Will last 2-3 years
            </li>
          </ul>
          <p className="text-xs italic mt-2 text-red-600 dark:text-red-400">Note: A battery at 75% still has YEARS of life left. Even a new device loses 5% in its first year.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Myth #3: "No Warranty, You're On Your Own"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSE</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            Certified marketplaces ALWAYS offer a warranty:
          </p>
          <ul className="space-y-1 text-sm list-disc pl-5">
            <li>Back Market: 12 months standard (up to 24 months with some sellers)</li>
            <li>Amazon Renewed: 12 months + Amazon Buyer Protection</li>
            <li>eBay: 12 months + eBay Money Back Guarantee (up to 180 days for returns)</li>
          </ul>
          <p className="text-sm mt-3 font-semibold italic">Even better: 30-60 day no-questions-asked trial periods in most cases.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Myth #4: "It's the Same as Buying Used on a Marketplace"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSE - MASSIVE difference</h4>
          <div className="space-y-3 text-sm mt-3">
            <div>
              <h5 className="font-semibold mb-1">🟢 Refurbished (Certified)</h5>
              <ul className="pl-5 list-disc space-y-1">
                <li>Fully tested by technicians</li>
                <li>Professionally cleaned</li>
                <li>Battery certified and reported</li>
                <li>All components verified</li>
                <li>Mandatory 12+ month warranty</li>
                <li>30+ day trial period</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-1">🔴 Used (Private seller)</h5>
              <ul className="pl-5 list-disc space-y-1">
                <li>Typically no warranty</li>
                <li>No professional testing</li>
                <li>Risks of hidden problems</li>
                <li>No seller protection</li>
                <li>May have malware or restrictions</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Myth #5: "Refurbished Devices Never Meet Specifications"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSE</h4>
          <p className="text-sm text-red-700 dark:text-red-300">
            Certified marketplaces carry out exhaustive functional testing. Back Market data shows that 98% of devices meet 100% of specifications. The remaining 2% is rejected before sale.
          </p>
          <p className="text-xs italic mt-2">For comparison: 95% of new devices arrive in perfect condition. It is not that different.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Myth #6: "You Can Get a Virus or Malware"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSE (With Proper Handling)</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            All certified refurbished devices are cleaned and "flashed" (software restored) to a clean version:
          </p>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>iPhone: Restored to clean, factory-fresh iOS</li>
            <li>Android: Flashed with the manufacturer's clean ROM</li>
            <li>All hardware components are verified</li>
          </ul>
          <p className="text-sm mt-2">The risk is the SAME as a brand-new device fresh out of the box. In fact, some refurbished devices are more secure if they are cleaned more thoroughly.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Myth #7: "You Save Too Little, It's Not Worth It"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSE - The Numbers Speak</h4>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded border border-emerald-200 dark:border-emerald-800 mt-3">
            <p className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Real Example: iPhone 15 Pro Max</p>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span>NEW price</span>
                <span className="font-bold">£1,199</span>
              </li>
              <li className="flex justify-between">
                <span>Refurbished (Excellent)</span>
                <span className="font-bold">£899</span>
              </li>
              <li className="flex justify-between text-emerald-700 dark:text-emerald-300 font-bold">
                <span>SAVINGS</span>
                <span>£300 (25%)</span>
              </li>
            </ul>
          </div>
          <p className="text-sm mt-3">And that is conservative. 2-year-old models can save you 40-50%.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Conclusion: The Truth</h2>
        <p>
          Certified refurbished devices are:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>✅ <strong>Safe and reliable</strong> (tested, warranted, with a trial period)</li>
          <li>✅ <strong>Significantly cheaper</strong> (20-50% off is common)</li>
          <li>✅ <strong>Better for the planet</strong> (77 kg less CO₂ per device)</li>
          <li>✅ <strong>Not a risk</strong> (warranty and easy returns)</li>
        </ul>

        <p className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          The only reason NOT to buy refurbished is if you have unlimited money. The rest of us should be using platforms like RefurbTrack to find the best deals.
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