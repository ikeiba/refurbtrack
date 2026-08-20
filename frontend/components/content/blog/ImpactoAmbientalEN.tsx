// components/content/blog/ImpactoAmbientalEN.tsx
// Traducción al inglés del artículo: Impacto ambiental.
import Link from "next/link"
import { Calendar, User, ArrowLeft, Leaf } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function ImpactoAmbientalEN({ locale }: { locale: string }) {
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
            Sustainability
          </span>
          <span className="text-xs text-muted-foreground">6 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          🌱 The Real Environmental Impact: How Much You Save Buying Refurbished
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date("2026-01-18").toLocaleDateString(getIntlLocale(locale), { year: "numeric", month: "long", day: "numeric" })}
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
          It is easy to say that buying refurbished is "more eco-friendly", but what is the real impact? In this article we break down the concrete, verifiable numbers that show exactly how much impact you have when you buy a refurbished device instead of a new one.
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-lg">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Impact per Device (vs. New)
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span>CO₂ Equivalent Avoided</span>
              <span className="font-bold text-lg">77 kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Water Saved</span>
              <span className="font-bold text-lg">240 L</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Electronic Waste Prevented</span>
              <span className="font-bold text-lg">50 kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Energy Not Consumed</span>
              <span className="font-bold text-lg">240 kWh</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Breakdown: Where This Impact Comes From</h2>

        <h3 className="text-xl font-bold mt-6">1️⃣ Carbon Emissions (77 kg CO₂)</h3>
        <p>
          Around 80% of an electronic device's carbon emissions come from manufacturing, not from its use. When you buy refurbished:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No mineral extraction:</strong> The mining of copper, gold, coltan and other minerals is avoided</li>
          <li><strong>No manufacturing:</strong> Energy-intensive production processes are avoided</li>
          <li><strong>No initial transport:</strong> The emissions from shipping from factory to distributor are avoided</li>
          <li><strong>Only refurbishment:</strong> A far less energy-intensive process (typically cleaning, testing and minimal repair)</li>
        </ul>

        <p>
          To put it in perspective: 77 kg of CO₂ is equivalent to:
        </p>
        <ul className="list-none pl-5 space-y-1 text-sm">
          <li>🚗 Driving 230 km in a car</li>
          <li>✈️ A short flight (1-2 hours)</li>
          <li>🏠 The daily emissions of an average home over 5 days</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">2️⃣ Water Consumption (240 Litres)</h3>
        <p>
          Manufacturing electronic devices is surprisingly water-intensive:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Mineral refining:</strong> Requires enormous amounts of water</li>
          <li><strong>Manufacturing processes:</strong> Equipment cooling, component cleaning, etc.</li>
          <li><strong>Thermal management:</strong> Factories use water to maintain optimal temperatures</li>
        </ul>

        <p>
          240 litres is equivalent to: 🚿 60 four-minute showers or 💧 48 large bottles of water
        </p>

        <h3 className="text-xl font-bold mt-6">3️⃣ Electronic Waste (50 kg prevented)</h3>
        <p>
          Electronic waste (e-waste) is the fastest-growing waste stream in the world. By buying refurbished:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>A device is kept out of landfill</li>
          <li>Workers are protected from exposure to toxic substances in informal recycling plants</li>
          <li>Valuable materials (gold, silver, copper) are recovered instead of being mined again</li>
        </ul>

        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>⚠️ Important context:</strong> It is estimated that only 20% of global e-waste is properly recycled. Much of it ends up in developing countries, contaminating groundwater with heavy metals.
          </p>
        </div>

        <h3 className="text-xl font-bold mt-6">4️⃣ Energy Not Consumed (240 kWh)</h3>
        <p>
          This includes the direct and indirect energy required to extract raw materials, transport them, manufacture the device and distribute it.
        </p>

        <p>
          240 kWh is equivalent to: 💡 Running a 100W light bulb for 100 days
        </p>

        <h2 className="text-2xl font-bold mt-8">Widening the Perspective: Aggregate Impact</h2>

        <p>
          If RefurbTrack facilitates 10,000 refurbished purchases a year instead of new ones:
        </p>

        <div className="bg-muted/50 p-6 rounded-lg border grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-2">📊 Annual Impact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>CO₂ avoided</span>
                <span className="font-bold">770 tonnes</span>
              </li>
              <li className="flex justify-between">
                <span>Water saved</span>
                <span className="font-bold">2.4M litres</span>
              </li>
              <li className="flex justify-between">
                <span>E-waste prevented</span>
                <span className="font-bold">500 tonnes</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-2">🌍 Equivalents</h4>
            <ul className="space-y-2 text-sm">
              <li>= 2,300 km of flights avoided</li>
              <li>= 1 million showers</li>
              <li>= a small town's worth of waste prevented</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">What About the Refurbishment Process Itself?</h2>

        <p>
          Someone might ask: "But doesn't the refurbishment process pollute?"
        </p>

        <p>
          Yes, but it is minimal compared with manufacturing. It typically involves:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Manual cleaning (no harsh chemicals, typically isopropyl alcohol)</li>
          <li>Component testing (electricity, but in small amounts)</li>
          <li>Replacing damaged parts (battery, screen, etc.) when necessary</li>
          <li>A final test before shipping</li>
        </ul>

        <p className="text-sm text-muted-foreground">
          The total impact of refurbishment is typically less than 5% of the impact of original manufacturing.
        </p>

        <h2 className="text-2xl font-bold mt-8">Beyond the Environmental Impact</h2>

        <p>
          Buying refurbished also has social benefits:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Local jobs:</strong> Refurbishment is a local process that creates employment in your country</li>
          <li><strong>Reducing the digital divide:</strong> It makes technology more accessible to low-income populations</li>
          <li><strong>Circular economy:</strong> It adds value to products without creating unnecessary consumption</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">How Can You Maximise Your Impact?</h2>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200">1. Choose older devices</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">A 2-year-old iPhone bought refurbished instead of new has almost the same impact as buying a new model refurbished, but with greater financial savings.</p>
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200">2. Keep your device longer</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">The best environmental option is to USE what you have. But if you need to change, refurbished is the next best option.</p>
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200">3. Recycle properly at the end</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">When you can no longer use the device, take it to an electronics recycling centre, not the bin.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Conclusion</h2>
        <p>
          Every refurbished purchase avoids 77 kg of CO₂, 240 litres of water and 50 kg of electronic waste. That is not just a number: it is cleaner air, preserved resources and a healthier planet.
        </p>

        <p>
          <strong>RefurbTrack</strong> exists precisely to make it easier for you to make the eco-friendly choice without sacrificing your budget. Because being sustainable does not have to mean sacrifice. It can be a good deal for you and for the planet.
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