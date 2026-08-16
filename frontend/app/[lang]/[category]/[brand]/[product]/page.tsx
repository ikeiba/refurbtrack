// app/[lang]/[category]/[brand]/[product]/page.tsx
import { getProducts, getModelHub } from "@/services/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelHubView } from "@/components/hub/model-hub-view";
import { HeaderWrapper } from "@/components/header-wrapper";
import { absoluteUrl, hubPath } from "@/lib/urls";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface Props {
  params: Promise<{
    lang: string;
    category: string;
    brand: string;
    product: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, brand, product } = await params;
  const hub = await getModelHub(category, brand, product);

  if (!hub) return { title: "Modelo no encontrado" };

  const canonical = absoluteUrl(hubPath(lang, category, brand, product));
  const title = `${hub.name} reacondicionado: precios e historial | RefurbTrack`;
  const description =
    hub.summary.lowest_current_price !== null
      ? `Precios e historial del ${hub.name} reacondicionado en Back Market. Compara sus ${hub.summary.config_count} configuraciones, desde ${hub.summary.lowest_current_price} €.`
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
  const { lang, category, brand, product } = await params;

  const [hub, allProducts] = await Promise.all([
    getModelHub(category, brand, product),
    getProducts(),
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
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/${lang}` },
      { "@type": "ListItem", position: 2, name: category, item: `${base}/${lang}/${category}` },
      { "@type": "ListItem", position: 3, name: brand, item: `${base}/${lang}/${category}/${brand}` },
      { "@type": "ListItem", position: 4, name: hub.name, item: absoluteUrl(hubPath(lang, category, brand, product)) },
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
      url: absoluteUrl(`/${lang}/${category}/${brand}/${product}/${spec.slug}`),
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <HeaderWrapper />
      <ModelHubView hub={hub} lang={lang} siblings={siblings} />
    </div>
  );
}
