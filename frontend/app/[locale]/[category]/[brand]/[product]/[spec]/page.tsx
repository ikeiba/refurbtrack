// app/[locale]/[category]/[brand]/[product]/[spec]/page.tsx

import { getProductBySlugs, getHistoricalLowOffers } from "@/services/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { API_URL } from "@/services/api"
import { absoluteUrl, hubPath, specPath, brandPath, categoryPath } from "@/lib/urls";
import { t } from "@/lib/translations";
import { formatCurrency } from "@/lib/format";
import { parseLocale, getCurrency, getLanguage, locales, getMarket } from "@/lib/i18n";
import { hreflangLanguages } from "@/lib/i18n-seo";

// --- IMPORTANTE: Aquí extraemos los componentes interactivos a "Islas" ---
import ProductViewClient from "@/components/product/ProductViewClient"; 

// 1. REVALIDACIÓN ISR: Guarda las páginas generadas en caché durante 10 minutos
// export const revalidate = 600;
export const dynamic = 'force-dynamic'

// 2. DINAMISMO (TIER 2): Si un usuario entra a una URL que NO se pre-renderizó en el build, 
// permítele pasar y genérala bajo demanda (true). Si fuera false, daría un error 404.
export const dynamicParams = true;

// 3. GENERACIÓN DEL TIER 1 EN EL BUILD (por cada locale/mercado)
export async function generateStaticParams() {
  const entries: { locale: string; category: string; brand: string; product: string; spec: string }[] = [];

  for (const locale of locales) {
    try {
      const market = getMarket(locale);
      const res = await fetch(`${API_URL}/products/top-specs/?market=${market}`);
      
      if (!res.ok) continue;
      
      const topSpecs = await res.json();
      
      topSpecs.forEach((item: any) => {
        entries.push({
          locale,
          category: item.product__category__slug,
          brand: item.product__brand__slug,
          product: item.product__slug,
          spec: item.slug
        });
      });
    } catch (error) {
      console.error(`Error en generateStaticParams (${locale}):`, error);
    }
  }

  return entries;
}

interface Props {
  params: Promise<{
    locale: string;
    category: string;
    brand: string;
    product: string;
    spec: string;
  }>;
}

// --- HELPERS DE VARIANTE (capacidad/color/precio) ---
// Se comparten entre generateMetadata y la página para que título, meta y
// JSON-LD cuenten siempre la misma historia de la spec activa.
function getActiveSpec(data: any) {
  return data?.specs?.find((s: any) => s.id === data.current_spec_id);
}

function getLowPrice(spec: any): number {
  const offers = spec?.offers || [];
  const valid = offers
    .map((o: any) => parseFloat(o.current_price))
    .filter((p: number) => !isNaN(p) && p > 0);
  if (valid.length > 0) return Math.min(...valid);
  return parseFloat(spec?.min_price_cached) || 0;
}

// Mínimo de los últimos 30 días para esta spec (mínimo de min_price_30d de sus ofertas).
function getMin30(spec: any): number {
  const offers = spec?.offers || [];
  const valid = offers
    .map((o: any) => parseFloat(o.min_price_30d))
    .filter((p: number) => !isNaN(p) && p > 0);
  return valid.length > 0 ? Math.min(...valid) : 0;
}

// 1. GENERACIÓN DE METADATA DINÁMICA (SEO ELITE)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, category, brand, product: productSlug, spec: specSlug } = await params;
  const locale = parseLocale(rawLocale);
  const currency = getCurrency(locale);
  const language = getLanguage(locale);

  const data = await getProductBySlugs(category, brand, productSlug, specSlug, locale);

  if (!data) return { title: t("product_not_found", language) };

  // Diferenciamos cada variante con su capacidad, color y precio (patrón comparador)
  const spec = getActiveSpec(data);
  const variant = [spec?.storage ? `${spec.storage}GB` : "", spec?.color ? t(spec.color, language) : ""]
    .filter(Boolean)
    .join(" ");
  const price = formatCurrency(getLowPrice(spec), currency, language);
  const min30 = formatCurrency(getMin30(spec), currency, language);

  const pricePart = price !== "—" ? t("hub_price_suffix", language, { price }) : "";
  const minPart = min30 !== "—" ? t("hub_min_suffix", language, { price: min30 }) : "";
  const priceSuffix = pricePart ? ` — ${pricePart}${minPart}` : "";

  // Construimos la URL canónica que nos dio el Backend
  const canonicalPath = specPath(locale, data.category_slug, data.brand_slug, data.slug, specSlug);
  const canonicalUrl = absoluteUrl(canonicalPath);
  // Hreflang bidireccional: disecciona el specSlug (reacondicionado-64gb-oro)
  // y lo reconstruye en el idioma alternativo (refurbished-64gb-gold).
  const languages = hreflangLanguages(canonicalPath, absoluteUrl(""));

  return {
    title: `${data.name}${variant ? ` ${variant}` : ""} ${t("refurbished", language)}${priceSuffix} | RefurbTrack`,
    description: t("spec_meta_description", language, {
      productName: `${data.name}${variant ? ` ${variant}` : ""}`,
      priceNow: price !== "—" ? ` — ${t("hub_price_suffix", language, { price })}` : "",
      minPart: min30 !== "—" ? t("hub_meta_min_part", language, { price: min30 }) : "",
    }),
    alternates: { canonical: canonicalUrl, languages },
    openGraph: {
      images: [data.image],
    },
  };
}

// 2. EL COMPONENTE DE SERVIDOR
export default async function Page({ params }: Props) {
  const { locale: rawLocale, category, brand, product: productSlug, spec: specSlug } = await params;
  const locale = parseLocale(rawLocale);
  const currency = getCurrency(locale);
  const language = getLanguage(locale);
  
  const [productData, hotOffers] = await Promise.all([
    getProductBySlugs(category, brand, productSlug, specSlug, locale),
    getHistoricalLowOffers(locale)
  ]);

  if (!productData) {
    notFound(); 
  }

  // 1. ENCONTRAR LA SPEC ACTIVA
const specDetails = productData.specs?.find(
  (s: any) => s.id === productData.current_spec_id
);

if (!specDetails) return notFound();

// 2. EXTRACCIÓN Y LIMPIEZA DE PRECIOS (Mentalidad de Datos)
const activeOffers = specDetails.offers || [];

// Ofertas reales: solo las que tienen un precio válido (> 0) en el último scrape
const validOffers = activeOffers.filter((o: any) => {
  const p = parseFloat(o.current_price);
  return !isNaN(p) && p > 0;
});

const offerCount = validOffers.length;
const validPrices = validOffers.map((o: any) => parseFloat(o.current_price));

// 3. CONSTRUCCIÓN DEL JSON-LD REFORZADO
// URL canónica de esta variante (la misma que en generateMetadata)
const canonicalUrl = absoluteUrl(
  specPath(locale, productData.category_slug, productData.brand_slug, productData.slug, specSlug)
);

// Las imágenes llegan como rutas relativas ("products/xxx.avif") desde el backend.
// Schema.org exige URL absoluta, así que las normalizamos contra el dominio.
const toAbsoluteUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return absoluteUrl(path.startsWith("/") ? path : `/${path}`);
};

const productImage = toAbsoluteUrl(specDetails.image || productData.image);

// Marca real (viene del backend como brand_name). Fallback al slug capitalizado
// mientras no esté desplegado el cambio del serializer.
const brandName =
  productData.brand_name ||
  (productData.brand_slug
    ? productData.brand_slug.charAt(0).toUpperCase() + productData.brand_slug.slice(1)
    : "Back Market");

// Moneda dinámica por mercado (Fase 4): EUR en es-es, GBP en en-gb.
const priceCurrency = currency;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `${productData.name} ${specDetails.storage}GB ${specDetails.color}`,
  "description": `Compara precios de Back Market para el ${productData.name} ${specDetails.storage}GB ${specDetails.color}.`,
  "image": productImage,
  "url": canonicalUrl,
  "sku": specDetails.back_market_uuid,
  "brand": {
    "@type": "Brand",
    "name": brandName,
  },
  // Solo emitimos el bloque de ofertas si hay stock real.
  ...(offerCount > 0
    ? {
        offers: [
          {
            "@type": "AggregateOffer",
            "priceCurrency": priceCurrency,
            "lowPrice": Math.min(...validPrices).toFixed(2),
            "highPrice": Math.max(...validPrices).toFixed(2),
            "offerCount": offerCount,
            "itemCondition": "https://schema.org/RefurbishedCondition",
            "seller": { "@type": "Organization", "name": "Back Market" },
          },
          ...validOffers.map((o: any) => ({
            "@type": "Offer",
            "price": parseFloat(o.current_price).toFixed(2),
            "priceCurrency": priceCurrency,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/RefurbishedCondition",
            "url": toAbsoluteUrl(o.url),
            "seller": { "@type": "Organization", "name": "Back Market" },
          })),
        ],
      }
    : {}),
};

// 1. Construimos las URLs base para el JSON-LD
const baseUrl = absoluteUrl("").replace(/\/$/, "");

// 2. Definimos la jerarquía de migas de pan
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": t("home", language),
      "item": `${baseUrl}/${locale}`
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": category.charAt(0).toUpperCase() + category.slice(1),
      "item": absoluteUrl(categoryPath(locale, category))
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": productData.brand_slug,
      "item": absoluteUrl(brandPath(locale, category, brand))
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": productData.name,
      "item": absoluteUrl(hubPath(locale, category, brand, productSlug))
    }
  ]
};

  return (
    <main className="min-h-screen bg-background">
      {/* EL CHIVATO SEO PARA GOOGLEBOT */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 2. NUEVO: JSON-LD de las Migas de Pan */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <ProductViewClient 
        initialProduct={productData} 
        initialHotOffers={hotOffers}
        locale={locale}
      />
    </main>
  );
}
