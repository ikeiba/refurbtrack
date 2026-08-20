// components/content/blog/GuiaCompradoresEN.tsx
// Traducción al inglés del artículo: Guía para compradores.
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function GuiaCompradoresEN({ locale }: { locale: string }) {
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
          <span className="text-xs text-muted-foreground">8 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          📖 The Complete Guide to Buying Refurbished Devices
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date("2026-01-15").toLocaleDateString(getIntlLocale(locale), { year: "numeric", month: "long", day: "numeric" })}
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
          Buying a refurbished device can be a smart, eco-friendly decision. But it can also be a source of anxiety if you are not sure exactly what you are buying. This guide will help you make informed decisions.
        </p>

        <h2 className="text-2xl font-bold mt-8">What does "refurbished" mean?</h2>
        <p>
          "Refurbished" refers to a device that has been returned, repaired and/or fully restored to factory working condition. It is not synonymous with broken, damaged or low quality.
        </p>

        <p>
          Here are some common scenarios:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Customer returns:</strong> Someone bought it, changed their mind during the return period, and returned it barely used</li>
          <li><strong>Factory defects:</strong> A problem was detected, properly repaired and tested</li>
          <li><strong>Warranty replacements:</strong> The manufacturer refurbished it as part of a warranty service</li>
          <li><strong>Device trade-ins:</strong> After being used by a customer for a while, the device is sold to a refurbishment company where it is refurbished for resale</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">Refurbishment Grades</h2>
        <p>
          Different marketplaces use different classifications, but here are the most common ones:
        </p>

        <div className="bg-muted/50 p-6 rounded-lg border space-y-4">
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300">🟢 EXCELLENT / Like New</h4>
            <p className="text-sm text-muted-foreground mt-1">Practically indistinguishable from new. May have minor, barely visible signs of use. Battery at 85-100% capacity.</p>
            <p className="text-xs text-muted-foreground mt-2"><strong>Best for:</strong> Perfectionists, gifts</p>
          </div>

          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300">🟡 VERY GOOD / Excellent</h4>
            <p className="text-sm text-muted-foreground mt-1">Minimal signs of use. Works perfectly. Battery at 80-85% capacity.</p>
            <p className="text-xs text-muted-foreground mt-2"><strong>Best for:</strong> Most users. Best price-to-quality ratio</p>
          </div>

          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300">🟠 GOOD / Fair / Acceptable</h4>
            <p className="text-sm text-muted-foreground mt-1">Visible signs of use. Works perfectly, but the appearance is not pristine. Battery at around 80% capacity.</p>
            <p className="text-xs text-muted-foreground mt-2"><strong>Best for:</strong> Maximum savings, heavy users</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded mt-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Tip:</strong> For more information about grades, check the marketplace where you plan to buy. For example: <a href="https://www.backmarket.co.uk/en-gb/quality" className="underline hover:text-blue-800 dark:hover:text-blue-200">Back Market - Quality Grades</a>
          </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Quality Indicators to Check</h2>
        <p>
          When considering a refurbished device, these are the most important factors:
        </p>

        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Battery health:</strong> This is the most critical factor. A degraded battery significantly affects usability. Look for capacity percentages (ideally 80%+)
          </li>
          <li>
            <strong>Warranty:</strong> Minimum 12 months. Some sellers offer up to 24 months. A long warranty is a sign of confidence in the product
          </li>
          <li>
            <strong>Trial period:</strong> 14-30 days with no questions asked. It lets you return the device if you are not satisfied
          </li>
          <li>
            <strong>Functional testing:</strong> Check that the seller has tested all functions (screen, camera, microphone, speaker, buttons)
          </li>
          <li>
            <strong>Included accessories:</strong> Does it come with the original box? Charging cable? This affects overall value
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-8">Questions You Should Ask</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Does the device have any unmentioned physical damage?</li>
          <li>Has it been opened? Have any parts been replaced?</li>
          <li>Does it come with the original battery or has it been replaced?</li>
          <li>Is it compatible with my carrier / region?</li>
          <li>What is the exact return policy?</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">Risks to Avoid</h2>
        <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 rounded">
          <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">❌ Avoid these sellers:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-red-700 dark:text-red-300">
            <li>No warranty or a very short warranty (less than 6 months)</li>
            <li>No trial period, or a very restrictive one</li>
            <li>No clear information about battery condition</li>
            <li>Very poor reviews or patterns of similar complaints</li>
            <li>Abnormally low prices (too good to be true)</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">Conclusion</h2>
        <p>
          Buying refurbished can save you hundreds of pounds and is a sustainable choice. With this guide, you should be prepared to make smart decisions and avoid unpleasant surprises.
        </p>

        <p>
          <strong>RefurbTrack</strong> is designed exactly for this: helping you compare prices across different sellers and find the best deals on verified refurbished devices.
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