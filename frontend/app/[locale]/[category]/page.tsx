// app/[locale]/[category]/page.tsx
import { getProducts } from "@/services/api";
import { FamilyGrid } from "@/components/family-grid"; // Ajusta el import si FamilyGrid está en otro archivo
import { generateCategoryCopy } from "@/lib/seo-utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HeaderWrapper } from "@/components/header-wrapper";
import { parseLocale, getCurrency, getLanguage } from "@/lib/i18n";
import { t } from "@/lib/translations";

// export const revalidate = 600; // Cachear 1 hora (ISR)
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    locale: string;
    category: string;
  }>;
}

// Generación de Metadata dinámica para el SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  const prettyCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const language = getLanguage(locale);

  return {
    title: t("meta_category_title", language, { category: prettyCategory }),
    description: t("meta_category_description", language, { category: prettyCategory }),
    alternates: {
      canonical: `/${locale}/${category}`
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale: rawLocale, category } = await params;
  const locale = parseLocale(rawLocale);
  const language = getLanguage(locale);

  // 1. Obtener TODOS los productos del mercado
  const allProducts = await getProducts(locale);

  // 2. Filtrar solo los de esta categoría (ej: category_slug === 'smartphone')
  const categoryProducts = allProducts.filter(
    (p) => p.category_slug?.toLowerCase() === category.toLowerCase()
  );

  // Si alguien entra a /es-es/inventada y no hay productos, devolvemos 404
  if (categoryProducts.length === 0) {
    notFound();
  }

  const prettyCategory = category.charAt(0).toUpperCase() + category.slice(1);

  // 3. Generar el texto SEO (Pilar 1) con moneda e idioma del mercado
  const seoCopy = generateCategoryCopy(
    prettyCategory,
    categoryProducts,
    getCurrency(locale),
    getLanguage(locale)
  );

  // Definimos la ruta para esta página específica
  const breadcrumbNodes = [
    { label: t("home", language), href: `/${locale}` },
    { label: prettyCategory } // No pasamos href porque es la página actual
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 3. Inyectamos el componente aislado de cliente */}
      <HeaderWrapper />

      <main className="container mx-auto px-4 pt-8">
        
        {/* 2. Red de enlaces internos estáticos */}
        <Breadcrumbs items={breadcrumbNodes} language={language} />
        
        {/* Cabecera SEO */}
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 capitalize">
            {t("category_heading", language, { category: prettyCategory })}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {seoCopy}
          </p>
        </header>

        {/* Cuadrícula de productos */}
        <FamilyGrid products={categoryProducts} locale={locale} />
        
      </main>
    </div>
  );
}
