// components/content/legal/TermsEN.tsx
// Traducción al inglés (tono formal) de la página de Términos.
import { getIntlLocale } from "@/lib/i18n";

export function TermsEN({ locale }: { locale: string }) {
  return (
    <div className="space-y-6 text-sm md:text-base leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions of Use</h1>
      <p className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleDateString(getIntlLocale(locale))}</p>

      <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-4 my-6">
        <p className="font-bold text-yellow-800 dark:text-yellow-200">Important Notice</p>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
            RefurbTrack is an information and comparison service. <strong>We are not sellers</strong> of the products shown. Any transaction is carried out solely and exclusively between the User and the Final Seller on the destination platform.
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8">1. Acceptance of the Terms</h3>
      <p>
        By accessing and using RefurbTrack (hereinafter "the Service"), you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and you agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
      </p>

      <h3 className="text-xl font-bold mt-8">2. Nature of the Service</h3>
      <p>
        RefurbTrack is an information platform that offers:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Price comparison of refurbished electronic products from multiple sellers</li>
        <li>Price history tracking and discount alerts</li>
        <li>Information on refurbishment grades (Excellent, Good, Fair)</li>
        <li>Direct links to verified stores where you can complete your purchase</li>
      </ul>
      <p className="mt-4">
        The information displayed (prices, condition) is updated periodically, but may differ from real-time information on the seller's website due to technical latency or sudden changes in inventory.
      </p>

      <h3 className="text-xl font-bold mt-8">3. Relationship with External Sellers</h3>
      <p>
        <strong>RefurbTrack is NOT an online store.</strong> We do not hold physical inventory, we do not process payments, we do not manage deliveries, and we do not offer warranties on the products.
      </p>
      <p className="mt-4">
        When you click on "View Offer" or similar links:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>You will be redirected to the external seller's website (e.g. Back Market, Amazon Renewed, etc.)</li>
        <li>Any purchase, return, warranty or after-sales service is the sole responsibility of the seller</li>
        <li>RefurbTrack may receive an affiliate commission if you complete a purchase, at no additional cost to you</li>
        <li>You should review the seller's terms of service and privacy policy before completing your purchase</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">4. Accuracy of Information</h3>
      <p>
        Although we use advanced technology and strive to ensure data accuracy, <strong>we do not guarantee</strong> that all product descriptions, prices, stock availability, images or technical specifications are free from errors or completely up to date.
      </p>
      <p className="mt-4">
        <strong>The final valid price will always be the one shown at the time of payment on the seller's website.</strong> We accept no liability for price differences, stock changes or typographical errors.
      </p>

      <h3 className="text-xl font-bold mt-8">5. Acceptable Use of the Service</h3>
      <p>By using RefurbTrack, you agree to:</p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Not attempt to compromise</strong> the security or integrity of our systems</li>
        <li><strong>Not use</strong> our data to create competing services or commercial databases</li>
        <li><strong>Not manipulate</strong> affiliate links for your own or third parties' benefit</li>
        <li><strong>Use the service</strong> solely for personal, non-commercial purposes, unless otherwise agreed</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">6. Intellectual Property</h3>
      <p>
        The original content of RefurbTrack (design, code, analysis, price charts, data structure) is protected by copyright and is owned by RefurbTrack or its licensors.
      </p>
      <p className="mt-4">
        Third-party trademarks (Apple®, Samsung®, Back Market®, etc.) are the property of their respective owners. They are used on this site solely for informational and product identification purposes, under the principle of nominative fair use or affiliate agreements. They do not imply endorsement or official association.
      </p>
      <p className="mt-4">
        Product images may be owned by the manufacturers or sellers and are shown for informational purposes under fair use.
      </p>

      <h3 className="text-xl font-bold mt-8">7. Affiliate Programme and Transparency</h3>
      <p>
        RefurbTrack MAY participate in affiliate marketing programmes with platforms such as:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Back Market</li>
        <li>Amazon Associates</li>
        <li>Other affiliate networks depending on regional availability</li>
      </ul>
      <p className="mt-4">
        This means that we may receive a small commission when you make a purchase through our links, at no additional cost to you. This commission allows us to keep the service free and free of intrusive advertising.
      </p>
      <p className="mt-4">
        <strong>Commitment to neutrality:</strong> Our rankings and recommendations are based on objective data (price, condition, history) and are not influenced by affiliate commissions.
      </p>

      <h3 className="text-xl font-bold mt-8">8. Limitation of Liability</h3>
      <p>
        To the fullest extent permitted by applicable law:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>RefurbTrack is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
        <li>We do not guarantee that the service will be uninterrupted, secure or error-free</li>
        <li>We are not liable for direct, indirect, incidental, special or consequential damages arising from the use or inability to use the service</li>
        <li>We accept no responsibility for the quality, authenticity, safety or legality of products purchased from external sellers</li>
        <li>We are not responsible for disputes between users and sellers (lost shipments, defective products, returns, etc.)</li>
      </ul>
      <p className="mt-4">
        Your only course of action regarding problems with a purchased product is to contact the seller where you made the purchase directly.
      </p>

      <h3 className="text-xl font-bold mt-8">9. Warranties and Returns</h3>
      <p>
        Since RefurbTrack does not sell products, we do not offer our own warranties. However, the refurbished products shown on our site come from sellers that generally offer:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Minimum warranty:</strong> 12/24 months (standard on Back Market)</li>
        <li><strong>Trial period:</strong> Generally 30 days for returns</li>
        <li><strong>Certification:</strong> Refurbishment carried out by qualified technicians</li>
      </ul>
      <p className="mt-4">
        <strong>Important:</strong> These conditions may vary depending on the seller and country. Always verify the specific terms on the seller's page before purchasing.
      </p>

      <h3 className="text-xl font-bold mt-8">10. Links to Third Parties</h3>
      <p>
        Our service contains links to third-party websites not operated by us. We have no control over the content, privacy policies or practices of these sites. By clicking on an external link, you acknowledge and accept that RefurbTrack is not responsible for those sites.
      </p>

      <h3 className="text-xl font-bold mt-8">11. Suspension and Termination</h3>
      <p>
        We reserve the right to:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Suspend or terminate your access to the service in the event of a breach of these terms</li>
        <li>Modify or discontinue any aspect of the service without prior notice</li>
        <li>Remove content or user data that infringes these terms</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">12. Modifications to the Terms</h3>
      <p>
        We reserve the right to modify these terms at any time. Significant changes will be notified through:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>A prominent notice on the homepage</li>
        <li>Email to registered users (where applicable)</li>
        <li>An update to the "Last updated" date on this page</li>
      </ul>
      <p className="mt-4">
        Continued use of the service after changes are published constitutes your acceptance of the modified terms.
      </p>

      <h3 className="text-xl font-bold mt-8">13. Indemnification</h3>
      <p>
        You agree to indemnify and hold harmless RefurbTrack, its affiliates, directors, employees and agents from any claim, damage, obligation, loss, liability, cost or debt, and expense (including, without limitation, attorneys' fees) arising from:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Your use or misuse of the service</li>
        <li>Your breach of these terms</li>
        <li>Your violation of third-party rights</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">14. Governing Law and Jurisdiction</h3>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to any conflict of laws principles.
      </p>

      <h3 className="text-xl font-bold mt-8">15. Severability</h3>
      <p>
        If any provision of these terms is held to be invalid or unenforceable, that provision shall be removed or limited to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.
      </p>

      <h3 className="text-xl font-bold mt-8">16. Contact</h3>
      <p>
        For questions about these Terms and Conditions, you can contact us at:
      </p>
      <ul className="list-none space-y-2 my-4">
        <li><strong>Contact form:</strong> <a href={`/${locale}/contact`} className="text-emerald-600 hover:underline">contact us here</a></li>
      </ul>
    </div>
  )
}