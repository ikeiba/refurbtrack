// app/[lang]/[category]/[brand]/[product]/[spec]/page.tsx

import { getProductBySlugs, getHistoricalLowOffers } from "@/services/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { API_URL } from "@/services/api"

// --- IMPORTANTE: Aquí extraemos los componentes interactivos a "Islas" ---
import ProductViewClient from "@/components/product/ProductViewClient"; 

// 1. REVALIDACIÓN ISR: Guarda las páginas generadas en caché durante 10 minutos
// export const revalidate = 600;
export const dynamic = 'force-dynamic'

// 2. DINAMISMO (TIER 2): Si un usuario entra a una URL que NO se pre-renderizó en el build, 
// permítele pasar y genérala bajo demanda (true). Si fuera false, daría un error 404.
export const dynamicParams = true;

// 3. GENERACIÓN DEL TIER 1 EN EL BUILD
export async function generateStaticParams() {
  try {
    // Usamos la URL interna de tu API. 
    // OJO: Al ejecutarse en el servidor (Docker), asegúrate de que esta variable 
    // apunta al contenedor de Django (ej: http://backend:8000/api) y no a localhost.
    const res = await fetch(`${API_URL}/products/top-specs/`);
    
    if (!res.ok) {
      console.warn("No se pudo cargar el Tier 1, saltando pre-renderizado...");
      return [];
    }
    
    const topSpecs = await res.json();
    
    // Mapeamos las claves de Django a los [parámetros] exactos de tu carpeta en Next.js
    return topSpecs.map((item: any) => ({
      lang: 'es', // Dejamos 'es' fijo hasta que implementemos el multi-idioma real
      category: item.product__category__slug,
      brand: item.product__brand__slug,
      product: item.product__slug,
      spec: item.slug
    }));
  } catch (error) {
    console.error("Error en generateStaticParams:", error);
    return []; // Si hay un error, el build no explota, simplemente todo el catálogo será Tier 2
  }
}

interface Props {
  params: Promise<{
    lang: string;
    category: string;
    brand: string;
    product: string;
    spec: string;
  }>;
}

// 1. GENERACIÓN DE METADATA DINÁMICA (SEO ELITE)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, brand, product: productSlug, spec: specSlug } = await params;
  const data = await getProductBySlugs(category, brand, productSlug, specSlug);

  if (!data) return { title: "Producto no encontrado" };

  // Construimos la URL canónica que nos dio el Backend
  const canonicalUrl = `https://refurbtrack.com/${lang}/${data.category_slug}/${data.brand_slug}/${data.slug}/${specSlug}`;

  return {
    title: `${data.name} Reacondicionado al mejor precio | RefurbTrack`,
    description: `Compara precios históricos del ${data.name}. Ahorra comprando tecnología reacondicionada con garantía.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      images: [data.image],
    },
  };
}

// 2. EL COMPONENTE DE SERVIDOR
export default async function Page({ params }: Props) {
  const { lang, category, brand, product: productSlug, spec: specSlug } = await params;
  
  const [productData, hotOffers] = await Promise.all([
    getProductBySlugs(category, brand, productSlug, specSlug),
    getHistoricalLowOffers()
  ]);

  if (!productData) {
    notFound(); 
  }

  // 1. ENCONTRAR LA SPEC ACTIVA
  // Gracias a tu vista en Django, sabemos exactamente qué spec de la lista es la de esta URL
// 1. ENCONTRAR LA SPEC ACTIVA
const specDetails = productData.specs?.find(
  (s: any) => s.id === productData.current_spec_id
);

if (!specDetails) return notFound();

// 2. EXTRACCIÓN Y LIMPIEZA DE PRECIOS (Mentalidad de Datos)
const activeOffers = specDetails.offers || [];

// Filtramos solo precios válidos y mayores que 0 para evitar fallos de Google
const validPrices = activeOffers
  .map((o: any) => parseFloat(o.current_price))
  .filter((p: number) => !isNaN(p) && p > 0);

const offerCount = validPrices.length;

// Definimos los precios con fallbacks seguros
// Si no hay ofertas activas, usamos el min_price_cached de la base de datos
const fallbackPrice = parseFloat(specDetails.min_price_cached) || 0;

const finalLowPrice = offerCount > 0 ? Math.min(...validPrices) : fallbackPrice;
const finalHighPrice = offerCount > 0 ? Math.max(...validPrices) : fallbackPrice;

// 3. CONSTRUCCIÓN DEL JSON-LD REFORZADO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": `${productData.name} (${specDetails.storage} - ${specDetails.color})`,
  "image": specDetails.image || productData.image, // URL simple
  "description": `Compara precios de Back Market para el ${productData.name} ${specDetails.storage} ${specDetails.color}.`,
  "brand": {
    "@type": "Brand",
    "name": "Apple" // O productData.brand_name
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    // IMPORTANTE: Forzamos que sean strings con 2 decimales para Google
    "lowPrice": finalLowPrice.toFixed(2),
    "highPrice": finalHighPrice.toFixed(2),
    "offerCount": offerCount > 0 ? offerCount : 1,
    "itemCondition": "https://schema.org/RefurbishedCondition",
    "availability": offerCount > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": "Back Market"
    }
  }
};

// 1. Construimos las URLs base para el JSON-LD
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbtrack.com';

// 2. Definimos la jerarquía de migas de pan
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": `${baseUrl}/${lang}`
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": category.charAt(0).toUpperCase() + category.slice(1),
      "item": `${baseUrl}/${lang}/${category}`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Apple", // Usamos la variable que ya tienes definida para el JSON de Product
      "item": `${baseUrl}/${lang}/${category}/${brand}`
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": productData.name,
      "item": `${baseUrl}/${lang}/${category}/${brand}/${productSlug}`
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
        lang={lang}
      />
    </main>
  );
}