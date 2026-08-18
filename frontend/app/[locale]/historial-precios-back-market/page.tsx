// app/[locale]/historial-precios-back-market/page.tsx
import type { Metadata } from "next";
import { getProducts, getFeaturedHistory } from "@/services/api";
import { PriceHistoryLanding } from "@/components/landing/price-history-landing";
import { HeaderWrapper } from "@/components/header-wrapper";
import { absoluteUrl, historyLandingPath } from "@/lib/urls";
import { parseLocale, getLanguage } from "@/lib/i18n";
import { t } from "@/lib/translations";

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

  const [products, featured] = await Promise.all([
    getProducts(locale),
    getFeaturedHistory(locale),
  ]);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es un rastreador de precios de Back Market?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Es una herramienta que registra de forma periódica los precios de los productos reacondicionados que se venden en Back Market y guarda esa información para mostrar su evolución. En RefurbTrack lo usamos para calcular el mínimo, la media y el máximo de cada configuración y ayudarte a decidir cuándo comprar.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo puedo consultar el historial de precios de Back Market?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Elige un modelo, entra en su página y selecciona la configuración que te interese. Allí verás la gráfica de evolución, el mínimo y el máximo de los últimos 30 días y el enlace a la oferta en Back Market.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo saber si un precio de Back Market es bueno?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Compara el precio actual con su mínimo y su media de los últimos 30 días. Si el precio actual está cerca del mínimo reciente o por debajo de la media, suele ser una buena señal.",
        },
      },
      {
        "@type": "Question",
        name: "¿Back Market muestra el historial de precios?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Back Market no ofrece un historial completo y consultable de cada producto. RefurbTrack reconstruye esa evolución guardando registros periódicos de los precios.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo funciona el seguimiento de precios?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RefurbTrack registra los precios de las configuraciones de Back Market, guarda la evolución histórica, calcula estadísticas a partir de esos registros y te permite consultar el historial para saber si el precio actual es una buena oferta.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuándo es mejor comprar un móvil reacondicionado?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Un buen momento suele ser cuando el precio de la configuración que buscas está cerca de su mínimo reciente y por debajo de su media de los últimos 30 días.",
        },
      },
    ],
  };

  const base = absoluteUrl("").replace(/\/$/, "");
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home", getLanguage(locale)), item: `${base}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Historial de precios de Back Market",
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
