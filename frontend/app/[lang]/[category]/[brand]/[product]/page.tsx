// app/[lang]/[category]/[brand]/[product]/page.tsx
import { getProducts } from "@/services/api";
import { permanentRedirect, redirect } from "next/navigation";

interface Props {
  params: Promise<{
    lang: string;
    category: string;
    brand: string;
    product: string;
  }>;
}

export default async function ProductFamilyRedirect({ params }: Props) {
  // 1. Resolvemos las promesas de los parámetros (Requisito Next.js 15+)
  const { lang, category, brand, product } = await params;
  
  // 2. Obtenemos el catálogo general (Súper rápido porque 'getProducts' está cacheado por Next.js)
  const allProducts = await getProducts();
  
  // 3. Buscamos el producto exacto que coincida con la URL
  const currentProduct = allProducts.find(
    (p) => 
      p.category_slug?.toLowerCase() === category.toLowerCase() &&
      p.brand_slug?.toLowerCase() === brand.toLowerCase() &&
      p.slug?.toLowerCase() === product.toLowerCase()
  );

  // 4. Fallback de seguridad: Si alguien se inventa un producto en la URL 
  // o la base de datos no tiene una spec por defecto, lo devolvemos a la marca.
  if (!currentProduct || !currentProduct.default_spec_slug) {
    redirect(`/${lang}/${category}/${brand}`);
  }

  // 5. El movimiento maestro SEO: Redirección permanente 308
  // Mandamos a Google y al usuario a la variante por defecto (ej: .../iphone-12-pro/reacondicionado-128gb-grafito)
  permanentRedirect(`/${lang}/${category}/${brand}/${product}/${currentProduct.default_spec_slug}`);
}