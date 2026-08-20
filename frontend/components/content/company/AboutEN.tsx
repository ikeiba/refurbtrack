// components/content/company/AboutEN.tsx
// Traducción al inglés (tono formal) de la página "Sobre Nosotros".
import { Leaf, Search, ShieldCheck, Target, Zap, Globe, BarChart3 } from "lucide-react"

export function AboutEN({ locale }: { locale: string }) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Technology with Purpose
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          RefurbTrack was founded with a clear mission: to accelerate the transition to a circular economy by bringing radical transparency to the refurbished technology market.
        </p>
      </section>

      {/* Core Values */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold mb-8">Our Values</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <Search className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Market Intelligence</h3>
              <p className="text-muted-foreground">We are not a store, we are an analyst. We monitor prices daily to spot genuine opportunities and avoid fake discounts.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <Target className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Measurable Impact</h3>
              <p className="text-muted-foreground">Every device has a footprint. We help you calculate not only your financial savings, but also the kilos of CO2 and electronic waste you avoid.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Certified Quality</h3>
              <p className="text-muted-foreground">We only index products from leading marketplaces (such as Back Market) that offer minimum warranties of 12 months and trial periods.</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold mb-8">Our Story</h2>
        <div className="prose prose-stone dark:prose-invert max-w-none space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            RefurbTrack started in 2025 as an answer to a problem facing thousands of consumers: how do you know whether the price of a refurbished phone is genuinely a good deal? Or whether it is cheaper than a month ago?
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The refurbished technology market is booming, but it is fragmented. Every seller has its own prices with no clear correlation. Users had to visit multiple sites, open spreadsheets, or simply accept whatever price they found.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            That is how the idea was born: to build an independent price comparison service that aggregates data from all the major refurbishers (Back Market, Amazon Renewed, eBay Refurbished, etc.) and provides price intelligence to users, free of charge and accessible to everyone.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            But we did not want just another price comparison site. We wanted to align with the circular economy, show the real environmental impact, and maintain the highest transparency about how we can make money (affiliate commissions, with no intrusive advertising).
          </p>
        </div>
      </section>

      {/* Why refurbished */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold mb-8">Why Refurbished Technology?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Circular Economy</h4>
                <p className="text-muted-foreground text-sm">Each refurbished device saves 77 kg of CO2 compared with manufacturing a new one. Let's amplify that impact.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Democratised Access</h4>
                <p className="text-muted-foreground text-sm">Premium technology at fair prices. Owning a quality device should not be a luxury.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Price Transparency</h4>
                <p className="text-muted-foreground text-sm">Customers deserve to know whether they are buying well. Public data, smart decisions.</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-bold mb-4 text-emerald-700 dark:text-emerald-300">Environmental Impact per Device</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>CO2 emissions avoided</span>
                <span className="font-bold">77 kg</span>
              </li>
              <li className="flex justify-between">
                <span>Water saved</span>
                <span className="font-bold">240 L</span>
              </li>
              <li className="flex justify-between">
                <span>Waste avoided</span>
                <span className="font-bold">50 kg</span>
              </li>
              <li className="flex justify-between">
                <span>Energy saved</span>
                <span className="font-bold">240 kWh</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">*Comparison: refurbished device vs. new in the same category</p>
          </div>
        </div>
      </section>

      {/* Affiliate Disclaimer (Crucial for approval) */}
      <section className="bg-muted/50 p-8 rounded-2xl border border-border">
        <h3 className="font-bold text-foreground mb-4 text-lg">✅ Transparency and Business Model</h3>
        <p className="text-muted-foreground mb-4">
          RefurbTrack is an <strong>independent, free price comparison service</strong> for users. We do not sell products directly, nor do we manage stock, deliveries or customer support.
        </p>
        <div className="bg-background p-4 rounded border border-border mb-4">
          <p className="text-muted-foreground text-sm">
            <strong>How do we make money?</strong> Our platform is sustained by affiliate agreements with verified marketplaces. When you find a product you like and decide to buy it through our links, we may receive a small commission at no additional cost to you. This allows us to keep the service free of intrusive advertising and 100% focused on the user.
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          <strong>Our commitment:</strong> Our rankings, recommendations and displayed prices are based exclusively on objective data (price, condition, warranty, verified reviews) and are NOT influenced by affiliate commissions.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Ready to Save?</h2>
        <p className="text-lg text-muted-foreground">Explore our collection of verified refurbished devices and start comparing prices intelligently.</p>
        <div className="flex gap-3 justify-center mt-6">
          <a href={`/${locale}`} className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors">
            Start Searching
          </a>
          <a href={`/${locale}/how-it-works`} className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-medium transition-colors">
            How It Works
          </a>
        </div>
      </section>
    </div>
  )
}