// components/content/company/HowItWorksEN.tsx
// Traducción al inglés (tono formal) de la página "Cómo Funciona".
import { Search, BarChart3, ShoppingBag, Truck, Zap, TrendingDown, Lock, AlertCircle } from "lucide-react"

export function HowItWorksEN({ locale }: { locale: string }) {
  const steps = [
    {
      icon: Search,
      title: "1. Continuous Tracking",
      desc: "We scan product listings daily for price and stock changes across the main verified refurbishers (Back Market, Amazon Renewed, eBay Refurbished, etc.)."
    },
    {
      icon: BarChart3,
      title: "2. Smart Analysis",
      desc: "We compare the current price against the 30, 60 and 90-day history, and against the official launch price, to determine whether it is a genuine good deal or a marketing trick."
    },
    {
      icon: TrendingDown,
      title: "3. Personalised Alerts",
      desc: "Set up alerts for the products you care about. We will notify you when the price drops below your target threshold or when there are significant changes."
    },
    {
      icon: ShoppingBag,
      title: "4. Safe Purchase",
      desc: "When you click 'View Offer', we redirect you straight to the seller's official platform so you can complete your purchase with all its guarantees and buyer protection."
    },
    {
      icon: Truck,
      title: "5. Delivery and Warranty",
      desc: "The seller manages delivery and provides a legal warranty (minimum 12 months). You enjoy the marketplace's full buyer protection while we keep tracking the market."
    }
  ]

  const faqs = [
    {
      q: "Why is the price on RefurbTrack different from the store's price?",
      a: "Prices change constantly. If you see a small difference, it is probably because RefurbTrack updates periodically while there may be real-time changes (real-time updates are impossible and would be too intrusive for our partners). Always check the final price on the seller's page before buying."
    },
    {
      q: "Does RefurbTrack sell products directly?",
      a: "No. We are an independent price comparison service, not a store. We do not manage inventory, payments, deliveries or customer service. We act as an intermediary connecting you with verified sellers."
    },
    {
      q: "How do you make money from this?",
      a: "Through affiliate commissions. When you buy through our links and the purchase is completed, the seller pays us a small commission (typically 0.5% - 5%) at no additional cost to you. There are no intrusive ads and we never sell your data."
    },
    {
      q: "Are refurbished products safe?",
      a: "Completely. We only work with certified marketplaces that guarantee a minimum of 12 months of warranty and trial periods (30-60 days). Devices are tested and certified by qualified technicians."
    },
    {
      q: "What happens if I have a problem with my purchase?",
      a: "Contact the seller directly (Back Market, Amazon, etc.). RefurbTrack does not handle returns or warranties, but sellers have very robust buyer protection policies."
    },
    {
      q: "How often do you update prices?",
      a: "We update all prices daily, and some even more frequently. Our goal is not to offer real-time prices, but a comparison over time. If you need the exact real-time price, go directly to the seller's site."
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How RefurbTrack Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A simple 5-step process to find the best deals on refurbished technology that is verified and comes with a warranty.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-sm">
              {idx + 1}
            </div>
            <div className="space-y-2 flex-1 pt-1">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <step.icon className="w-5 h-5 text-emerald-600" />
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Key features */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Price History</h4>
                <p className="text-sm text-muted-foreground">30-day charts to spot trends and avoid buying at price peaks.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Price Alerts</h4>
                <p className="text-sm text-muted-foreground">Get notified when the price drops below your target.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <Lock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Verified Purchases</h4>
                <p className="text-sm text-muted-foreground">We only connect with certified marketplaces offering a minimum 12-month warranty.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <AlertCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Environmental Impact</h4>
                <p className="text-sm text-muted-foreground">A reflection on the CO2, water and waste you avoid with every refurbished purchase.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-card">
              <h4 className="font-bold mb-2 text-emerald-700 dark:text-emerald-300">{faq.q}</h4>
              <p className="text-muted-foreground text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center space-y-4 py-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground">Explore thousands of verified refurbished products and start saving today.</p>
        <a href={`/${locale}`} className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors">
          Start Searching
        </a>
      </div>
    </div>
  )
}