// components/content/company/ContactEN.tsx
// Traducción al inglés (tono formal) de la página de Contacto.
import { AlertCircle } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"

export function ContactEN({ locale }: { locale: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Contact</h1>
        <p className="text-muted-foreground text-lg">
          Have questions about how the comparison service works, want to report an error in the data or suggest an improvement? We are here to listen.
        </p>
      </div>

      {/* Important Note about Orders */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Important: orders and products</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>RefurbTrack does NOT sell products directly.</strong> If you have a problem with an order, a return, a warranty, a delayed delivery or a defective product, you must contact the seller where you made the purchase (e.g. Back Market, Amazon, etc.) through their customer service.
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
              ℹ️ Only contact us for questions about the platform, errors in the prices/data shown, or suggestions for improvement.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">💡 Frequently Asked Questions</h4>
            <div className="text-sm text-emerald-700 dark:text-emerald-300 space-y-3">
              <div>
                <p className="font-semibold">Why is the price on the seller's website different?</p>
                <p className="text-xs">Prices are updated periodically, always at least once a day. Check the last updated date on the product page.</p>
              </div>
              <div>
                <p className="font-semibold">How do I report a broken link?</p>
                <p className="text-xs">Send us an email with the URL of the affected product and we will fix it.</p>
              </div>
              <div>
                <p className="font-semibold">Can I suggest a store to add?</p>
                <p className="text-xs">Yes! Tell us which store you would like to see and we will evaluate integrating it.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="font-bold text-xl mb-4">Send Us a Message</h3>
          <ContactForm />
        </div>
      </div>

      {/* Additional help section */}
      <div className="mt-12 pt-8 border-t">
        <h3 className="font-bold text-xl mb-4 text-center">Other Ways to Get Help</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg border">
            <div className="text-3xl mb-2">📚</div>
            <h4 className="font-bold mb-1">Usage Guide</h4>
            <p className="text-sm text-muted-foreground">
              Check our documentation on {" "}
              <a href={`/${locale}/how-it-works`} className="text-emerald-600 hover:underline">
                how it works
              </a>
              {" "} for the comparison service
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg border">
            <div className="text-3xl mb-2">🌱</div>
            <h4 className="font-bold mb-1">About Us</h4>
            <p className="text-sm text-muted-foreground">
              <a href={`/${locale}/about`} className="text-emerald-600 hover:underline">
                Learn more about RefurbTrack
              </a>
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg border">
            <div className="text-3xl mb-2">⚖️</div>
            <h4 className="font-bold mb-1">Legal</h4>
            <p className="text-sm text-muted-foreground">
              <a href={`/${locale}/terms`} className="text-emerald-600 hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}