// app/[lang]/[category]/[brand]/[product]/[spec]/page.tsx

import { getProductBySlugs, getHistoricalLowOffers } from "@/services/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// --- IMPORTANTE: Aquí extraemos los componentes interactivos a "Islas" ---
import ProductViewClient from "@/components/product/ProductViewClient"; 

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
  
  // Fetch en paralelo para optimizar el tiempo de carga
  const [productData, hotOffers] = await Promise.all([
    getProductBySlugs(category, brand, productSlug, specSlug),
    getHistoricalLowOffers()
  ]);

  if (!productData) {
    notFound(); // Lanza el 404 de Next.js si Django no encuentra los slugs
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Pasamos los datos al componente de cliente. 
         A partir de aquí, el usuario ya puede interactuar con los estados.
      */}
      <ProductViewClient 
        initialProduct={productData} 
        initialHotOffers={hotOffers}
        lang={lang}
      />
    </main>
  );
}