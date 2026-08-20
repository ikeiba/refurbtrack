// lib/seo-content.ts
// Párrafos SEO de longitud media que mezclan texto con datos dinámicos
// (Patrón Data-Splitting). Cada bloque se resuelve con funciones por idioma
// (ES/EN) que aceptan las variables necesarias (productName, precios,
// contadores, configuraciones...).
//
// REGLAS:
//  - Nada de este contenido vive en lib/translations.ts: son párrafos largos
//    dependientes del backend, no claves de UI corta.
//  - Los textos se devuelven ya formateados con la moneda del mercado.
//  - El idioma se recibe como `Language` ('es' | 'en').

import { formatCurrency, formatSignedPercent } from "./format";
import type { Currency, Language } from "./i18n";

// ===================== HUB / MODELO =====================

export interface HubSeoData {
  productName: string
  configCount: number
  lowest: number | null
  avg: number | null
  histMin: number | null
}

/** Párrafos SEO dinámicos de la página Hub de un modelo. */
export function getHubSeoParagraphs(
  language: Language | string,
  currency: Currency,
  data: HubSeoData
): string[] {
  const isEn = language === "en"
  const paragraphs: string[] = []

  if (data.lowest !== null) {
    paragraphs.push(
      isEn
        ? `The lowest price available right now for a refurbished ${data.productName} is ${formatCurrency(data.lowest, currency, language)}. We have analysed its ${data.configCount} configurations across capacities, colours and conditions.`
        : `El precio más bajo disponible ahora mismo para un ${data.productName} reacondicionado es de ${formatCurrency(data.lowest, currency, language)}. Hemos analizado sus ${data.configCount} configuraciones entre capacidades, colores y estados.`
    )
  } else {
    paragraphs.push(
      isEn
        ? `We are tracking the ${data.configCount} configurations of the refurbished ${data.productName} on Back Market. As soon as there are price records, you will be able to see its full evolution here.`
        : `Estamos rastreando las ${data.configCount} configuraciones del ${data.productName} reacondicionado en Back Market. En cuanto haya registros de precios, podrás ver aquí su evolución completa.`
    )
  }

  if (data.avg !== null && data.lowest !== null && data.lowest !== data.avg) {
    const aboveBelow = data.lowest < data.avg
      ? (isEn ? "below" : "por debajo")
      : (isEn ? "above" : "por encima")
    paragraphs.push(
      isEn
        ? `The current average price of the ${data.productName} is ${formatCurrency(data.avg, currency, language)}, and the cheapest option sits ${aboveBelow} that average.`
        : `El precio medio actual del ${data.productName} es de ${formatCurrency(data.avg, currency, language)}, y la opción más barata se sitúa ${aboveBelow} de esa media.`
    )
  }

  if (data.histMin !== null) {
    paragraphs.push(
      isEn
        ? `The lowest recorded price for the ${data.productName} has been ${formatCurrency(data.histMin, currency, language)}, although it does not always match the cheapest offer available right now.`
        : `El mínimo histórico registrado para el ${data.productName} ha sido de ${formatCurrency(data.histMin, currency, language)}, aunque no siempre coincide con el precio más bajo disponible en este momento.`
    )
  }

  return paragraphs
}

/** Intro de la sección "Evolución del precio" del Hub. */
export function getHubEvolutionIntro(
  language: Language | string,
  productName: string
): string {
  return language === "en"
    ? `Each configuration of the ${productName} (capacity, colour and condition) has its own price evolution. To avoid mixing incompatible series, the history is shown per configuration:`
    : `Cada configuración del ${productName} (capacidad, color y estado) tiene su propia evolución de precios. Para evitar mezclar series incompatibles, el historial se consulta por configuración:`
}

export interface HubInsightData {
  productName: string
  storage: string | number
  color: string
  price?: number | null
  pct?: number | null
}

/** Texto del insight "configuración más barata" (va seguido del enlace "Ver historial"). */
export function getHubCheapestInsight(
  language: Language | string,
  currency: Currency,
  data: HubInsightData
): string {
  const price = formatCurrency(data.price ?? null, currency, language)
  return language === "en"
    ? `The cheapest configuration right now is the ${data.productName} ${data.storage} GB ${data.color} at ${price}.`
    : `La configuración más barata ahora mismo es el ${data.productName} ${data.storage} GB ${data.color} a ${price}.`
}

/** Texto del insight "configuración más cercana a su mínimo reciente". */
export function getHubClosestMinInsight(
  language: Language | string,
  data: HubInsightData
): string {
  const pct = formatSignedPercent(data.pct)
  return language === "en"
    ? `The ${data.productName} ${data.storage} GB ${data.color} is the configuration closest to its recent minimum (it sits ${pct} above it).`
    : `El ${data.productName} ${data.storage} GB ${data.color} es la configuración más cercana a su mínimo reciente (está un ${pct} por encima de él).`
}

/** Texto del insight "configuración con mayor caída reciente". */
export function getHubBiggestDropInsight(
  language: Language | string,
  data: HubInsightData
): string {
  const pct = formatSignedPercent(data.pct)
  return language === "en"
    ? `The ${data.productName} ${data.storage} GB ${data.color} is the configuration with the biggest recent drop, ${pct} compared with its 30-day maximum.`
    : `El ${data.productName} ${data.storage} GB ${data.color} es la configuración con mayor caída reciente, un ${pct} respecto a su máximo de los últimos 30 días.`
}

/** Texto del insight cuando aún no hay datos de precios. */
export function getHubNoDataInsight(
  language: Language | string,
  productName: string
): string {
  return language === "en"
    ? `There is not enough price data yet to work out which configuration of the ${productName} is the cheapest.`
    : `Aún no hay suficientes datos de precios para calcular qué configuración del ${productName} es la más barata.`
}

// ===================== LANDING (historial de precios) =====================

/** Párrafo hero de la landing "historial de precios de Back Market". */
export function getLandingHeroParagraph(language: Language | string): string {
  return language === "en"
    ? "See how refurbished phone prices evolve on Back Market, follow the changes with our price tracker and find out whether the current price is really a good deal."
    : "Consulta cómo evolucionan los precios de móviles reacondicionados en Back Market, sigue sus cambios con nuestro rastreador de precios y descubre si el precio actual es realmente una buena oferta."
}

/** Pasos de la sección "Cómo funciona el rastreador de precios". */
export function getTrackerSteps(language: Language | string): string[] {
  if (language === "en") {
    return [
      "RefurbTrack records the prices of the configurations available on Back Market.",
      "It stores the historical evolution of each configuration over time.",
      "It calculates statistics (minimum, average and maximum) from the available records.",
      "You can check the history to decide whether the current price is a good deal.",
    ]
  }
  return [
    "RefurbTrack registra los precios de las configuraciones disponibles en Back Market.",
    "Guarda la evolución histórica de cada configuración a lo largo del tiempo.",
    "Calcula estadísticas (mínimo, media y máximo) a partir de los registros disponibles.",
    "Puedes consultar el historial para valorar si el precio actual es una buena oferta.",
  ]
}

export interface LandingVsAverageData {
  productName: string
  storage: string | number
  color: string
  avg: number | null
}

/**
 * Texto que compara el precio actual con la media de 30 días.
 * Devuelve las partes antes y después del porcentaje (que se resalta en <strong>).
 */
export function getLandingVsAverage(
  language: Language | string,
  currency: Currency,
  data: LandingVsAverageData
): { before: string; after: string } {
  const before = language === "en"
    ? `The current price of the ${data.productName} (${data.storage} GB · ${data.color}) is `
    : `El precio actual del ${data.productName} (${data.storage} GB · ${data.color}) está un `
  const after = language === "en"
    ? ` compared to the 30-day average (${formatCurrency(data.avg, currency, language)}).`
    : ` respecto a la media de los últimos 30 días (${formatCurrency(data.avg, currency, language)}).`
  return { before, after }
}

/** Fallback de la sección de datos cuando no hay registros suficientes. */
export function getLandingNoRecordsText(language: Language | string): string {
  return language === "en"
    ? "There are not enough price records yet to show a real evolution. As soon as our tracker records data, it will appear here automatically."
    : "Todavía no hay registros de precios suficientes para mostrar una evolución real. En cuanto nuestro rastreador registre datos, aparecerán aquí automáticamente."
}

export type GoodTimeToBuy =
  | { before: string; strong: string; after: string }
  | { message: string }

/**
 * Texto de la sección "¿Es un buen momento para comprar?".
 * Si hay position_label devuelve las partes con la etiqueta resaltada;
 * si no, devuelve un mensaje genérico.
 */
export function getLandingGoodTimeBuy(
  language: Language | string,
  productName: string,
  positionLabel: string | null | undefined
): GoodTimeToBuy {
  if (positionLabel) {
    const before = language === "en"
      ? `According to the latest records, the current price of the ${productName} is `
      : `Según los últimos registros, el precio actual del ${productName} se encuentra `
    const after = language === "en"
      ? `. This assessment is based solely on its position within the available history; it is not a prediction of the future.`
      : `. Esta valoración se basa únicamente en su posición respecto al histórico disponible, no es una predicción de futuro.`
    return { before, strong: positionLabel, after }
  }
  return {
    message: language === "en"
      ? "There is not enough data to determine whether now is a good time to buy. Check the history of each model to make an informed decision."
      : "No hay suficientes datos para determinar si ahora es un buen momento de compra. Consulta el historial de cada modelo para tomar una decisión informada.",
  }
}

/** Intro de la sección "Historial de precios por modelo". */
export function getLandingHistoryIntro(language: Language | string): string {
  return language === "en"
    ? "Check the price of each refurbished iPhone, compare its configurations and review its evolution on Back Market before you buy."
    : "Consulta el precio de cada iPhone reacondicionado, compara sus configuraciones y revisa su evolución en Back Market antes de comprar."
}

// ===================== PÁGINA DE SPEC (ProductViewClient) =====================

export interface SeoTextSegment {
  text: string
  strong?: boolean
}

export type SeoParagraph = SeoTextSegment[]

export interface ProductSeoData {
  productName: string
  storage: string | number
  color: string
  min: number | null
  avg: number | null
}

/**
 * Párrafos SEO de la página de configuración (spec) de un producto.
 * Cada párrafo es un array de segmentos para poder resaltar partes en <strong>.
 */
export function getProductSeoParagraphs(
  language: Language | string,
  currency: Currency,
  data: ProductSeoData
): SeoParagraph[] {
  const isEn = language === "en"
  const paragraphs: SeoParagraph[] = []

  const name = `${data.productName} ${data.storage}GB ${data.color}`

  paragraphs.push(
    isEn
      ? [
          { text: "Buying a refurbished " },
          { text: name, strong: true },
          { text: " is one of the smartest decisions to save money and reduce e-waste. This model has proven to hold excellent value on the second-hand market." },
        ]
      : [
          { text: "Comprar un " },
          { text: name, strong: true },
          { text: " reacondicionado es una de las decisiones más inteligentes para ahorrar dinero y reducir la basura electrónica. Este modelo ha demostrado mantener un excelente valor en el mercado de segunda mano." },
        ]
  )

  if (data.min !== null && data.min > 0) {
    const min = formatCurrency(data.min, currency, language)
    const avg = formatCurrency(data.avg, currency, language)
    paragraphs.push(
      isEn
        ? [
            { text: "According to our price history, the " },
            { text: "lowest recorded price", strong: true },
            { text: " for this specific configuration has been " },
            { text: min, strong: true },
            { text: ". We analyse multiple stores like Back Market daily to make sure you don't overpay. If the current price is around the " },
            { text: avg, strong: true },
            { text: " average, it is still an excellent opportunity compared with the price of a new device." },
          ]
        : [
            { text: "Según nuestro historial de precios, el " },
            { text: "precio más bajo registrado", strong: true },
            { text: " para esta configuración específica ha sido de " },
            { text: min, strong: true },
            { text: ". Analizamos diariamente múltiples tiendas como Back Market para asegurarnos de que no pagues de más. Si su precio actual ronda la media de " },
            { text: avg, strong: true },
            { text: ", sigue siendo una excelente oportunidad frente al precio de un dispositivo nuevo." },
          ]
    )
  }

  return paragraphs
}
