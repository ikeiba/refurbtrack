// app/[locale]/[category]/[brand]/page.tsx
import { getProducts } from "@/services/api";
import { FamilyGrid } from "@/components/family-grid"; // Ajusta según tu import real
import { generateBrandCopy } from "@/lib/seo-utils";
import { getSEOBrandAlias } from "@/lib/seo-utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { HeaderWrapper } from "@/components/header-wrapper"; 
import { parseLocale, getCurrency, getLanguage } from "@/lib/i18n";
import { t } from "@/lib/translations";

// export const revalidate = 600; // Cacheamos en servidor por 1 hora
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    locale: string;
    category: string;
    brand: string; // <-- Nuevo parámetro capturado por Next.js
  }>;
}

// SEO Elite: Metadata ultra específica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, brand } = await params;
  const prettyCat = category.charAt(0).toUpperCase() + category.slice(1);
  const seoBrandName = getSEOBrandAlias(category, brand);
  const language = getLanguage(locale);

  return {
    // Ej: Apple Smartphone Reacondicionados al Mejor Precio
    title: t("meta_brand_title", language, { brand: seoBrandName }),
    description: t("meta_brand_description", language, { category: prettyCat, brand: seoBrandName }),
    alternates: { canonical: `/${locale}/${category}/${brand}` }
  };
}

export default async function BrandPage({ params }: Props) {
  const { locale: rawLocale, category, brand } = await params;
  const locale = parseLocale(rawLocale);
  const language = getLanguage(locale);
  
  const allProducts = await getProducts(locale);
  
  // FILTRO DOBLE: Comprobamos que coincidan categoría Y marca
  const brandProducts = allProducts.filter(
    (p) => p.category_slug?.toLowerCase() === category.toLowerCase() &&
           p.brand_slug?.toLowerCase() === brand.toLowerCase()
  );

  // Si no hay productos (ej: /es-es/smartphone/marca-inventada), 404
  if (brandProducts.length === 0) notFound();

  // Capitalizamos para usarlos en el texto
  const prettyCat = category.charAt(0).toUpperCase() + category.slice(1);
  const prettyBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
  
  
  // Generamos el texto usando la nueva función (moneda e idioma del mercado)
  const seoBrandName = getSEOBrandAlias(category, brand);
  const seoCopy = generateBrandCopy(
    seoBrandName,
    prettyCat,
    brandProducts,
    getCurrency(locale),
    getLanguage(locale)
  );

  // BREADCRUMBS: Ahora con 3 niveles (Inicio > Categoría > Marca)
  const breadcrumbNodes = [
    { label: t("home", language), href: `/${locale}` },
    { label: prettyCat, href: `/${locale}/${category}` },
    { label: prettyBrand } // La página actual sin href
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeaderWrapper />

      <main className="container mx-auto px-4 pt-8">
        
        <Breadcrumbs items={breadcrumbNodes} language={language} />
        
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 capitalize">
            {t("category_heading", language, { category: seoBrandName })}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {seoCopy}
          </p>
        </header>

        <FamilyGrid products={brandProducts} locale={locale} />
        
      </main>
    </div>
  );
}
