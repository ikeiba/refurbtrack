// components/content/legal/PrivacyEN.tsx
// Traducción al inglés (tono formal) de la página de Privacidad.
import { getIntlLocale } from "@/lib/i18n";

export function PrivacyEN({ locale }: { locale: string }) {
  return (
    <div className="space-y-6 text-sm md:text-base leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleDateString(getIntlLocale(locale))}</p>

      <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800 dark:text-blue-200">Our Commitment to Transparency</p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          At RefurbTrack we take the protection of your personal data seriously and fully comply with the General Data Protection Regulation (GDPR) of the European Union.
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8">1. Data Controller</h3>
      <p>
        You can contact us <a href={`/${locale}/contact`} className="text-emerald-600 hover:underline">here</a> to exercise your rights or resolve any questions regarding the processing of your data.
      </p>

      <h3 className="text-xl font-bold mt-8">2. Information We Collect</h3>
      <p>
        RefurbTrack is a price comparison service, not a shop. <strong>We do not process payments or manage deliveries.</strong> We therefore do not store bank details or physical delivery addresses.
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Browsing data:</strong> IP address, browser type, operating system and pages visited (via Google Analytics) to improve the user experience and optimise our services.</li>
        <li><strong>Email (optional):</strong> Only if you explicitly subscribe to our price alert service or newsletter. You can unsubscribe at any time.</li>
        <li><strong>User preferences:</strong> Theme settings (dark/light mode), favourite products and saved filters through your browser's local storage.</li>
        <li><strong>Cookies and tracking technologies:</strong> Please see our <a href={`/${locale}/cookies`} className="text-emerald-600 hover:underline">Cookie Policy</a> for further details.</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">3. Purpose of Processing</h3>
      <p>We use your data to:</p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Provide and improve our price comparison service</li>
        <li>Analyse usage trends and aggregate behaviour (without identifying individual users)</li>
        <li>Send price alerts and communications (only with your explicit consent)</li>
        <li>Comply with legal obligations and prevent fraud</li>
        <li>Manage affiliate programmes with partner sales platforms</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">4. Legal Basis for Processing</h3>
      <p>
        The processing of your data is based on:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Consent:</strong> For sending newsletters and personalised alerts</li>
        <li><strong>Legitimate interest:</strong> For statistical analysis and service improvement</li>
        <li><strong>Contractual performance:</strong> To provide the requested services</li>
        <li><strong>Legal obligation:</strong> To comply with tax and commercial regulations</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">5. Affiliate Links and Third Parties</h3>
      <p>
        Our website contains links to third-party sites. If you click on an offer and are redirected, the destination site may collect its own data under its own privacy policies. <strong>RefurbTrack is not responsible for the privacy practices of those sites.</strong>
      </p>
      <p className="mt-4">
        We take part in affiliate marketing programmes. These programmes use tracking codes and cookies to attribute sales generated from our site, which allows us to receive a commission at no additional cost to you.
      </p>

      <h3 className="text-xl font-bold mt-8">6. Sharing Information with Third Parties</h3>
      <p>
        We do not sell or rent your personal data to third parties. We only share information with:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Service providers:</strong> Google Analytics (web analytics), Mailjet (email marketing) under confidentiality agreements</li>
        <li><strong>Affiliate networks:</strong> Only anonymous click and conversion information for commission calculation</li>
        <li><strong>Competent authorities:</strong> When legally required</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">7. Data Retention</h3>
      <p>
        We retain your personal data only while you maintain an active relationship with our service or for as long as necessary to comply with legal obligations:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Browsing data:</strong> Up to 26 months (Google Analytics requirement)</li>
        <li><strong>Email subscriptions:</strong> Until you request to unsubscribe</li>
        <li><strong>Contact enquiries:</strong> Up to 2 years from the last interaction</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">8. Your GDPR Rights</h3>
      <p>You have the right to:</p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Access:</strong> Know what data we hold about you</li>
        <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
        <li><strong>Erasure:</strong> Request the deletion of your data ("right to be forgotten")</li>
        <li><strong>Object:</strong> Object to the processing of your data for certain purposes</li>
        <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
        <li><strong>Restriction:</strong> Restrict processing in certain circumstances</li>
        <li><strong>Withdrawal of consent:</strong> Withdraw your consent at any time</li>
      </ul>
      <p className="mt-4">
        To exercise these rights, contact us <a href={`/${locale}/contact`} className="text-emerald-600 hover:underline">here</a> with your request. We will respond within a maximum of 30 days.
      </p>

      <h3 className="text-xl font-bold mt-8">9. Data Security</h3>
      <p>
        We implement appropriate technical and organisational measures to protect your data against unauthorised access, alteration, disclosure or destruction, including:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>SSL/TLS encryption for all communications</li>
        <li>Restricted access to personal data to authorised personnel only</li>
        <li>Regular backups and recovery protocols</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">10. International Transfers</h3>
      <p>
        Some of our service providers (such as Google) may process data outside the European Economic Area. In these cases, we ensure that adequate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
      </p>

      <h3 className="text-xl font-bold mt-8">11. Children</h3>
      <p>
        RefurbTrack is not directed at children under 16 years of age. We do not knowingly collect data from children. If you are a parent or guardian and you discover that your child has provided personal information, please contact us so that we can delete it.
      </p>

      <h3 className="text-xl font-bold mt-8">12. Changes to this Policy</h3>
      <p>
        We reserve the right to update this Privacy Policy from time to time. We will notify you of significant changes through a prominent notice on our website or by email (if you are subscribed). Continued use of the site after the changes constitute your acceptance of the updated policy.
      </p>

      <h3 className="text-xl font-bold mt-8">13. Contact and Complaints</h3>
      <p>
        If you have any questions about how we process your data or wish to make a complaint:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Contact form:</strong> <a href={`/${locale}/contact`} className="text-emerald-600 hover:underline">contact us here</a></li>
        <li><strong>Supervisory Authority:</strong> You have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK data protection authority, at <a href="https://ico.org.uk" target="_blank" rel="noopener" className="text-emerald-600 hover:underline">ico.org.uk</a></li>
      </ul>

    </div>
  )
}
