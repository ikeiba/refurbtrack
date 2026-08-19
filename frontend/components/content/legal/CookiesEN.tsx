// components/content/legal/CookiesEN.tsx
// Traducción al inglés (tono formal) de la página de Cookies.
import { getIntlLocale } from "@/lib/i18n";

export function CookiesEN({ locale }: { locale: string }) {
  return (
    <div className="space-y-6 text-sm md:text-base leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <p className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleDateString(getIntlLocale(locale))}</p>

      <p className="text-lg">
        At RefurbTrack we use cookies and similar technologies to improve your browsing experience, analyse website traffic and personalise content. This policy explains what cookies are, how we use them and how you can control them.
      </p>

      <h3 className="text-xl font-bold mt-8">What are cookies?</h3>
      <p>
        Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit a website. They allow the site to remember your actions and preferences over a period of time, so you do not have to set them again every time you return.
      </p>

      <h3 className="text-xl font-bold mt-8">Types of cookies we use</h3>

      <div className="space-y-6 mt-4">
        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-900/10 p-4">
          <h4 className="font-bold text-lg mb-2">🔧 Technical Cookies (Strictly Necessary)</h4>
          <p className="mb-2">These cookies are essential for the basic functioning of the website and cannot be disabled.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Preferred theme:</strong> Remembering whether you prefer dark or light mode</li>
            <li><strong>Cookie consent:</strong> Storing your choice regarding the cookie banner</li>
            <li><strong>Browser session:</strong> Keeping your session active while you browse</li>
          </ul>
          <p className="text-xs mt-2 text-muted-foreground"><strong>Duration:</strong> Session or up to 1 year | <strong>Legal basis:</strong> Legitimate interest (site functionality)</p>
        </div>

        <div className="border-l-4 border-green-500 pl-4 bg-green-50 dark:bg-green-900/10 p-4">
          <h4 className="font-bold text-lg mb-2">📊 Analytics Cookies</h4>
          <p className="mb-2">They help us understand how visitors interact with our website by collecting information anonymously.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Google Analytics (_ga, _gid, _gat):</strong> Traffic analysis, most visited pages, time on site, bounce rate</li>
            <li><strong>Data collected:</strong> Pages viewed, traffic source, device type, browser, aggregated demographic data</li>
            <li><strong>Anonymised IP:</strong> We enable IP anonymisation in compliance with the GDPR</li>
          </ul>
          <p className="text-xs mt-2 text-muted-foreground"><strong>Duration:</strong> Up to 26 months | <strong>Legal basis:</strong> User consent</p>
        </div>

        <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 dark:bg-emerald-900/10 p-4">
          <h4 className="font-bold text-lg mb-2">💰 Marketing / Affiliate Cookies</h4>
          <p className="mb-2"><strong>These cookies are crucial to our business model.</strong> When you click on an offer to a partner store, a cookie is stored to track the referral.</p>
          <p className="mt-2 text-sm">
            <strong>What information do they contain?</strong> Only a unique identifier indicating that the visitor came from RefurbTrack. <strong>They do NOT contain personal data</strong> such as name, email or address.
          </p>
          <p className="mt-2 text-sm">
            <strong>How do they work?</strong> If you complete a purchase within the validity period (usually 30 days), the seller pays us a small commission at no additional cost to you.
          </p>
          <p className="text-xs mt-2 text-muted-foreground"><strong>Duration:</strong> 1-90 days depending on the affiliate network | <strong>Legal basis:</strong> Consent + Legitimate interest</p>
        </div>

        <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 dark:bg-purple-900/10 p-4">
          <h4 className="font-bold text-lg mb-2">⚙️ Functionality Cookies</h4>
          <p className="mb-2">They allow us to remember your preferences and offer enhanced functionality.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Saved favourites:</strong> Products you mark as favourites (local storage)</li>
            <li><strong>Preferred filters:</strong> Remembering your search filters (brand, condition, price range)</li>
            <li><strong>Language:</strong> Language preference (once multilingual support is in place)</li>
          </ul>
          <p className="text-xs mt-2 text-muted-foreground"><strong>Duration:</strong> Up to 1 year | <strong>Legal basis:</strong> Implied consent (experience improvement)</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8">Third-party cookies</h3>
      <p>
        Some external services we use may set their own cookies when you interact with them:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Google Fonts:</strong> Optimised typography (may store cache)</li>
        <li><strong>Seller sites:</strong> When you are redirected to Back Market, Amazon, etc., those sites set their own cookies under their own policies</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">Why do we need affiliate cookies?</h3>
      <div className="bg-muted p-6 rounded-lg border my-4">
        <p className="mb-2">
          RefurbTrack is a service that is <strong>100% free for the end user</strong>. We do not charge subscriptions, we do not show intrusive third-party advertising, and we do not sell your data.
        </p>
        <p className="mb-2">
          To maintain the infrastructure (servers, databases, price tracking, development) and continue offering a quality service, we rely on affiliate commissions when we help connect users with verified sellers.
        </p>
        <p className="font-semibold text-emerald-700 dark:text-emerald-300">
          ✅ Without affiliate cookies → We could not attribute sales → We would not receive commissions → The service would not be sustainable
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8">Managing and controlling cookies</h3>
      <p>
        You have full control over cookies. You can manage them in the following ways:
      </p>

      <h4 className="font-bold text-lg mt-6">1. Cookie preferences panel</h4>
      <p className="mb-2">
        When you visit RefurbTrack for the first time, a banner appears where you can:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Accept all cookies (recommended for the best experience)</li>
        <li>Reject non-essential cookies (only technical ones will be used)</li>
        <li>Customise your choice (choose which types you accept)</li>
      </ul>
      <h4 className="font-bold text-lg mt-6">2. Browser settings</h4>
      <p className="mb-2">
        You can configure your browser to block or warn you about cookies. See the instructions for your browser:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
        <li><strong>Firefox:</strong> Options → Privacy and security → Cookies and site data</li>
        <li><strong>Safari:</strong> Preferences → Privacy → Manage website data</li>
        <li><strong>Edge:</strong> Settings → Privacy, search and services → Cookies</li>
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        ⚠️ <strong>Note:</strong> Blocking essential cookies may affect site functionality (e.g. not remembering your theme preference).
      </p>

      <h4 className="font-bold text-lg mt-6">3. Private / incognito browsing</h4>
      <p>
        Private browsing modes automatically delete cookies when you close the window. However, during the active session cookies continue to work normally.
      </p>

      <h4 className="font-bold text-lg mt-6">4. Blocking extensions</h4>
      <p>
        You can use extensions such as <strong>uBlock Origin</strong>, <strong>Privacy Badger</strong> or <strong>Ghostery</strong> for more granular control. Please note that they may break affiliate functionality.
      </p>

      <h3 className="text-xl font-bold mt-8">What happens if you reject cookies?</h3>
      <div className="grid md:grid-cols-2 gap-4 my-4">
        <div className="border rounded-lg p-4">
          <h5 className="font-bold text-green-600 dark:text-green-400 mb-2">✅ You will still be able to:</h5>
          <ul className="text-sm space-y-1">
            <li>• Browse RefurbTrack</li>
            <li>• View products and prices</li>
            <li>• Access price history charts</li>
            <li>• Be redirected to external stores</li>
          </ul>
        </div>
        <div className="border rounded-lg p-4">
          <h5 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ We will not be able to:</h5>
          <ul className="text-sm space-y-1">
            <li>• Remember your theme preference</li>
            <li>• Save your favourites between sessions</li>
            <li>• Analyse which products interest you most</li>
            <li>• Receive commissions for your purchases</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8">Cookies and mobile devices</h3>
      <p>
        If you access RefurbTrack from a smartphone or tablet, cookies work in a similar way. You can manage them from:
      </p>
      <ul className="list-disc pl-5 space-y-1 my-4">
        <li><strong>Safari (iOS):</strong> Settings → Safari → Block cookies</li>
        <li><strong>Chrome (Android):</strong> Chrome → Settings → Site settings → Cookies</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">Policy updates</h3>
      <p>
        We may update this Cookie Policy to reflect changes in our technology, applicable legislation or service improvements. We will notify you of significant changes through:
      </p>
      <ul className="list-disc pl-5 space-y-1 my-4">
        <li>A prominent banner on the website</li>
        <li>Email (if you are subscribed to alerts)</li>
        <li>An update to the date on this page</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">More information</h3>
      <p>
        If you have questions about our cookie policy, you can contact us at:
      </p>
      <ul className="list-none space-y-2 my-4">
        <li><strong>Contact form:</strong> <a href={`/${locale}/contact`} className="text-emerald-600 hover:underline">contact us here</a></li>
        <li><strong>See also:</strong> <a href={`/${locale}/privacy`} className="text-emerald-600 hover:underline">Privacy Policy</a></li>
      </ul>

      <h3 className="text-xl font-bold mt-8">Useful external resources</h3>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener" className="text-emerald-600 hover:underline">All About Cookies - Comprehensive information about cookies</a></li>
        <li><a href="https://cookiepedia.co.uk/" target="_blank" rel="noopener" className="text-emerald-600 hover:underline">Cookiepedia - Cookie database</a></li>
      </ul>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-lg mt-8">
        <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">💚 Our Commitment to Transparency</h4>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          We believe in a transparent web that respects privacy. We never sell user data, we do not use invasive tracking cookies and we do not share personal information with third parties without your explicit consent. If you have any questions, just ask us!
        </p>
      </div>
    </div>
  )
}