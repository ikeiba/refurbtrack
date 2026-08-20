// lib/seo-utils.ts
import { ProductSummary } from "./types"; // Ajusta al import real de tu tipo
import { formatCurrency } from "./format";
import type { Currency, Language } from "./i18n";

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
  products: ProductSummary[],
  currency: Currency = "EUR",
  language: Language | string = "es"
): string {
  const isEn = language === "en"

  if (products.length === 0) {
    return isEn
      ? `Discover our selection of refurbished ${categoryName}. Compare prices and save.`
      : `Descubre nuestra selección de ${categoryName} reacondicionados. Compara precios y ahorra.`;
  }

  // Lógica de datos para el texto
  const count = products.length;

  // Extraemos todos los precios válidos para buscar el mínimo
  const validPrices = products
    .map(p => Number(p.min_price_cached))
    .filter(p => !isNaN(p) && p > 0);

  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const formattedLowest = formatCurrency(lowestPrice, currency, language);

  // Extraemos las marcas únicas disponibles en esta categoría
  const brands = Array.from(
    new Set(
      products
        .map(p => p.brand_slug)
        .filter((b): b is string => Boolean(b))
    )
  );

  const brandList = brands
    .slice(0, 3)
    .map(b => getSEOBrandAlias(categoryName.toLowerCase(), b))
    .join(", ");

  // Plantillado dinámico
  if (isEn) {
    return `We compare the prices of ${count} different refurbished ${categoryName} models.
  Find the best deals from brands like ${brandList} and save money and CO2 emissions.
  Right now you can get a guaranteed device with prices starting from as little as ${formattedLowest}.
  We analyse the market daily to make sure you get the lowest historical price.`;
  }

  return `Comparamos los precios de ${count} modelos distintos de ${categoryName} reacondicionados. 
  Encuentra las mejores ofertas de marcas como ${brandList} y ahorra dinero y emisiones de CO2. 
  Actualmente, puedes conseguir un dispositivo garantizado con precios que empiezan desde tan solo ${formattedLowest}. 
  Analizamos diariamente el mercado para asegurarte el precio más bajo histórico.`;
}


export function generateBrandCopy(
  brandName: string,
  categoryName: string,
  products: ProductSummary[],
  currency: Currency = "EUR",
  language: Language | string = "es"
): string {
  const isEn = language === "en"

  if (products.length === 0) {
    return isEn
      ? `Find the best deals on guaranteed refurbished ${categoryName} ${brandName}.`
      : `Encuentra las mejores ofertas en ${categoryName} ${brandName} reacondicionados con garantía.`;
  }

  const validPrices = products
    .map(p => Number(p.min_price_cached))
    .filter(p => !isNaN(p) && p > 0);

  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const formattedLowest = formatCurrency(lowestPrice, currency, language);
  const count = products.length;

  if (isEn) {
    return `Discover our exclusive selection of refurbished ${categoryName} ${brandName}.
  We track the market to bring you ${count} guaranteed ${brandName} models at the best price.
  Buy your device from as little as ${formattedLowest} and join the sustainable technology revolution without giving up premium quality.`;
  }

  return `Descubre nuestra selección exclusiva de ${categoryName} ${brandName} reacondicionados. 
  Rastreamos el mercado para ofrecerte ${count} modelos garantizados de ${brandName} al mejor precio. 
  Compra tu dispositivo desde tan solo ${formattedLowest} y únete a la revolución de la tecnología sostenible sin renunciar a la calidad premium.`;
}
