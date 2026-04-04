// lib/seo-utils.ts
import { ProductSummary } from "./types"; // Ajusta al import real de tu tipo

export function getSEOBrandAlias(categorySlug: string, brandSlug: string): string {
  const cat = categorySlug?.toLowerCase();
  const brand = brandSlug?.toLowerCase();

  // Diccionario de excepciones SEO
  if (cat === "smartphone" && brand === "apple") return "iPhone";
  if (cat === "tablet" && brand === "apple") return "iPad";
  if (cat === "smartwatch" && brand === "apple") return "Apple Watch";
  if (cat === "laptop" && brand === "apple") return "MacBook";
  
  // Si no hay excepción, devolvemos la marca capitalizada normalmente (Ej: Samsung)
  if (!brand) return "";
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

export function generateCategoryCopy(
  categoryName: string, 
  products: ProductSummary[]
): string {
  if (products.length === 0) {
    return `Descubre nuestra selección de ${categoryName} reacondicionados. Compara precios y ahorra.`;
  }

  // Lógica de datos para el texto
  const count = products.length;
  
  // Extraemos todos los precios válidos para buscar el mínimo y el máximo
  const validPrices = products
    .map(p => Number(p.min_price_cached))
    .filter(p => !isNaN(p) && p > 0);

  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;

  // Extraemos las marcas únicas disponibles en esta categoría
  // Extraemos las marcas, filtramos los nulos/undefined, y quitamos duplicados
  // En generateCategoryCopy:
  const brands = Array.from(
    new Set(
      products
        .map(p => p.brand_slug)
        .filter((b): b is string => Boolean(b))
    )
  );

  const brandList = brands
    .slice(0, 3)
    // Usamos el categoryName original (en minúsculas) y el slug de la marca
    .map(b => getSEOBrandAlias(categoryName.toLowerCase(), b)) 
    .join(", ");

  // Spintax / Plantillado dinámico
  return `Comparamos los precios de ${count} modelos distintos de ${categoryName} reacondicionados. 
  Encuentra las mejores ofertas de marcas como ${brandList} y ahorra dinero y emisiones de CO2. 
  Actualmente, puedes conseguir un dispositivo garantizado con precios que empiezan desde tan solo ${lowestPrice}€. 
  Analizamos diariamente el mercado para asegurarte el precio más bajo histórico.`;
}


export function generateBrandCopy(
  brandName: string, 
  categoryName: string,
  products: ProductSummary[]
): string {
  if (products.length === 0) {
    return `Encuentra las mejores ofertas en ${categoryName} ${brandName} reacondicionados con garantía.`;
  }

  const validPrices = products
    .map(p => Number(p.min_price_cached))
    .filter(p => !isNaN(p) && p > 0);

  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const count = products.length;

  return `Descubre nuestra selección exclusiva de ${categoryName} ${brandName} reacondicionados. 
  Rastreamos el mercado para ofrecerte ${count} modelos garantizados de ${brandName} al mejor precio. 
  Compra tu dispositivo desde tan solo ${lowestPrice}€ y únete a la revolución de la tecnología sostenible sin renunciar a la calidad premium.`;
}