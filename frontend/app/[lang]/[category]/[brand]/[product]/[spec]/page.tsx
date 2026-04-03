// app/[lang]/[category]/[brand]/[product]/[spec]/page.tsx

import { getProductBySlugs, getHistoricalLowOffers } from "@/services/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// --- IMPORTANTE: Aquí extraemos los componentes interactivos a "Islas" ---
import ProductViewClient from "@/components/product/ProductViewClient"; 

// 1. REVALIDACIÓN ISR: Guarda las páginas generadas en caché durante 10 minutos
export const revalidate = 600;

// 2. DINAMISMO (TIER 2): Si un usuario entra a una URL que NO se pre-renderizó en el build, 
// permítele pasar y genérala bajo demanda (true). Si fuera false, daría un error 404.
export const dynamicParams = true;

// 3. GENERACIÓN DEL TIER 1 EN EL BUILD
export async function generateStaticParams() {
  try {
    // Usamos la URL interna de tu API. 
    // OJO: Al ejecutarse en el servidor (Docker), asegúrate de que esta variable 
    // apunta al contenedor de Django (ej: http://backend:8000/api) y no a localhost.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/top-specs/`);
    
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