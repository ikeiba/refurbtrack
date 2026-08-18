// app/[locale]/[category]/[brand]/[product]/page.tsx
import { getProducts, getModelHub } from "@/services/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelHubView } from "@/components/hub/model-hub-view";
import { HeaderWrapper } from "@/components/header-wrapper";
import { absoluteUrl, hubPath } from "@/lib/urls";
import { formatCurrency } from "@/lib/format";
import { parseLocale, getCurrency, getLanguage, getSpecSlug } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface Props {
  params: Promise<{
    locale: string;
    category: string;
    brand: string;
    product: string;
  }>;
}

// Mínimo de los últimos 30 días a nivel de modelo (mínimo entre todas sus configuraciones).
function getHubMin30(hub: any): number {
  const specs = hub?.storage_groups?.flatMap((g: any) => g.specs) || [];
  const vals = specs
    .map((s: any) => parseFloat(s.min_price_30d))
    .filter((p: number) => !isNaN(p) && p > 0);
  return vals.length > 0 ? Math.min(...vals) : 0;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, category, brand, product } = await params;
  const locale = parseLocale(rawLocale);
  const currency = getCurrency(locale);
  const language = getLanguage(locale);

  const hub = await getModelHub(category, brand, product, locale);

  if (!hub) return { title: "Modelo no encontrado" };

  const canonical = absoluteUrl(hubPath(locale, category, brand, product));

  // Patrón comparador: precio actual y mínimo 30d en el snippet.
  const current = hub.summary.lowest_current_price;
  const price = formatCurrency(current, currency, language);
  const min30 = formatCurrency(getHubMin30(hub), currency, language);

  const pricePart = price !== "—" ? `${price} ahora` : "";
  const minPart = min30 !== "—" ? ` (mín ${min30})` : "";

  const title = `${hub.name} reacondicionado${pricePart ? ` — ${pricePart}${minPart}` : ""} | RefurbTrack`;
  const description =
    current !== null
      ? `Precios e historial del ${hub.name} reacondicionado en Back Market. Compara sus ${hub.summary.config_count} configuraciones — ${price} ahora${min30 !== "—" ? `, mínimo 30 días ${min30}` : ""}.`
      : `Precios e historial del ${hub.name} reacondicionado en Back Market. Compara sus ${hub.summary.config_count} configuraciones y su evolución de precios.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      images: hub.image ? [hub.image.startsWith("/") ? hub.image : `/${hub.image}`] : [],
    },
  };
}

export default async function ProductHubPage({ params }: Props) {
  const { locale: rawLocale, category, brand, product } = await params;
  const locale = parseLocale(rawLocale);

  const [hub, allProducts] = await Promise.all([
    getModelHub(category, brand, product, locale),
    getProducts(locale),
  ]);

  if (!hub) notFound();

  const siblings = allProducts
    .filter(
      (p) =>
        p.category_slug?.toLowerCase() === category.toLowerCase() &&
        p.brand_slug?.toLowerCase() === brand.toLowerCase()
    )
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      category_slug: p.category_slug ?? category,
      brand_slug: p.brand_slug ?? brand,
    }));

  // JSON-LD: migas de pan + lista de configuraciones visibles.
  const base = absoluteUrl("").replace(/\/$/, "");
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/${locale}` },
      { "@type": "ListItem", position: 2, name: category, item: `${base}/${locale}/${category}` },
      { "@type": "ListItem", position: 3, name: brand, item: `${base}/${locale}/${category}/${brand}` },
      { "@type": "ListItem", position: 4, name: hub.name, item: absoluteUrl(hubPath(locale, category, brand, product)) },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Configuraciones del ${hub.name} reacondicionado`,
    numberOfItems: hub.summary.config_count,
    itemListElement: hub.storage_groups.flatMap((g) => g.specs).map((spec, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${hub.name} ${spec.storage} GB ${spec.color}`,
      url: absoluteUrl(`/${locale}/${category}/${brand}/${product}/${getSpecSlug(spec, locale)}`),
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <HeaderWrapper />
      <ModelHubView hub={hub} locale={locale} siblings={siblings} />
    </div>
  );
}
