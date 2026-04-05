// app/[lang]/[category]/[brand]/page.tsx
import { getProducts } from "@/services/api";
import { FamilyGrid } from "@/components/family-grid"; // Ajusta según tu import real
import { generateBrandCopy } from "@/lib/seo-utils";
import { getSEOBrandAlias } from "@/lib/seo-utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { HeaderWrapper } from "@/components/header-wrapper"; 

// export const revalidate = 600; // Cacheamos en servidor por 1 hora
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    lang: string;
    category: string;
    brand: string; // <-- Nuevo parámetro capturado por Next.js
  }>;
}

// SEO Elite: Metadata ultra específica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, brand } = await params;
  const prettyCat = category.charAt(0).toUpperCase() + category.slice(1);
  const seoBrandName = getSEOBrandAlias(category, brand);

  return {
    // Ej: Apple Smartphone Reacondicionados al Mejor Precio
    title: `${seoBrandName} ${prettyCat} Reacondicionados al Mejor Precio | RefurbTrack`,
    description: `Ahorra en tu próximo ${prettyCat} ${seoBrandName}. Compara precios históricos de reacondicionados con garantía.`,
    alternates: { canonical: `/${lang}/${category}/${brand}` }
  };
}

export default async function BrandPage({ params }: Props) {
  const { lang, category, brand } = await params;
  
  const allProducts = await getProducts();
  
  // FILTRO DOBLE: Comprobamos que coincidan categoría Y marca
  const brandProducts = allProducts.filter(
    (p) => p.category_slug?.toLowerCase() === category.toLowerCase() &&
           p.brand_slug?.toLowerCase() === brand.toLowerCase()
  );

  // Si no hay productos (ej: /es/smartphone/marca-inventada), 404
  if (brandProducts.length === 0) notFound();

  // Capitalizamos para usarlos en el texto
  const prettyCat = category.charAt(0).toUpperCase() + category.slice(1);
  const prettyBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
  
  
  // Generamos el texto usando la nueva función
  const seoBrandName = getSEOBrandAlias(category, brand);
  const seoCopy = generateBrandCopy(seoBrandName, prettyCat, brandProducts);

  // BREADCRUMBS: Ahora con 3 niveles (Inicio > Categoría > Marca)
  const breadcrumbNodes = [
    { label: "Inicio", href: `/${lang}` },
    { label: prettyCat, href: `/${lang}/${category}` },
    { label: prettyBrand } // La página actual sin href
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeaderWrapper />

      <main className="container mx-auto px-4 pt-8">
        
        <Breadcrumbs items={breadcrumbNodes} />
        
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 capitalize">
            {seoBrandName} Reacondicionados
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {seoCopy}
          </p>
        </header>

        <FamilyGrid products={brandProducts} />
        
      </main>
    </div>
  );
}