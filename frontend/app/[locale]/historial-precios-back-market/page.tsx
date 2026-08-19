// app/[locale]/historial-precios-back-market/page.tsx
import type { Metadata } from "next";
import { getProducts, getFeaturedHistory } from "@/services/api";
import { PriceHistoryLanding } from "@/components/landing/price-history-landing";
import { HeaderWrapper } from "@/components/header-wrapper";
import { absoluteUrl, historyLandingPath } from "@/lib/urls";
import { parseLocale, getLanguage } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { getFaqData } from "@/lib/faq-data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const language = getLanguage(locale);
  const canonical = absoluteUrl(historyLandingPath(locale));

  const title = t("meta_history_title", language);
  const description = t("meta_history_description", language);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description },
  };
}

export default async function PriceHistoryLandingPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = parseLocale(rawLocale);
  const language = getLanguage(locale);

  const [products, featured] = await Promise.all([
    getProducts(locale),
    getFeaturedHistory(locale),
  ]);

  const faqData = getFaqData(language);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  const base = absoluteUrl("").replace(/\/$/, "");
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home", language), item: `${base}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: t("history_landing_title", language),
        item: absoluteUrl(historyLandingPath(locale)),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <HeaderWrapper />
      <PriceHistoryLanding locale={locale} products={products} featured={featured} />
    </div>
  );
}
