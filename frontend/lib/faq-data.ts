// lib/faq-data.ts
// Preguntas frecuentes separadas por idioma (Patrón Component-Splitting).
//
// Hay dos familias de FAQs:
//  1. Landing "historial de precios de Back Market": textos estáticos
//     (faqDataES / faqDataEN).
//  2. Hub de modelo: dependen del productName y de datos dinámicos del hub
//     (precio mínimo, mínimo histórico, capacidad más barata) →
//     getFaqsES(productName) / getFaqsEN(productName).
//
// El mismo array se usa para dos propósitos:
//  1. Poblar el acordeón visual de la FAQ (components/faq.tsx).
//  2. Poblar el script JSON-LD (FAQPage) en la página correspondiente.
//
// Nada de este contenido vive en lib/translations.ts.

import type { FaqItem } from "@/components/faq";
import { formatCurrency } from "./format";
import type { Currency, Language } from "./i18n";

export const faqDataES: FaqItem[] = [
  {
    question: "¿Qué es un rastreador de precios de Back Market?",
    answer:
      "Es una herramienta que registra de forma periódica los precios de los productos reacondicionados que se venden en Back Market y guarda esa información para mostrar su evolución. En RefurbTrack lo usamos para calcular el mínimo, la media y el máximo de cada configuración y ayudarte a decidir cuándo comprar.",
  },
  {
    question: "¿Cómo puedo consultar el historial de precios de Back Market?",
    answer:
      "Elige un modelo (por ejemplo, el iPhone 15), entra en su página y selecciona la configuración que te interese. Allí verás la gráfica de evolución, el mínimo y el máximo de los últimos 30 días y el enlace a la oferta en Back Market.",
  },
  {
    question: "¿Cómo saber si un precio de Back Market es bueno?",
    answer:
      "Compara el precio actual con su mínimo y su media de los últimos 30 días. Si el precio actual está cerca del mínimo reciente o por debajo de la media, suele ser una buena señal. En RefurbTrack mostramos esos datos para que puedas valorarlo sin tener que hacer tú las cuentas.",
  },
  {
    question: "¿Back Market muestra el historial de precios?",
    answer:
      "Back Market no ofrece un historial completo y consultable de cada producto. RefurbTrack reconstruye esa evolución guardando registros periódicos de los precios y poniéndolos a tu disposición en gráficas y tablas.",
  },
  {
    question: "¿Cómo funciona el seguimiento de precios?",
    answer:
      "RefurbTrack registra los precios de las configuraciones de Back Market, guarda la evolución histórica, calcula estadísticas a partir de esos registros y te permite consultar el historial para saber si el precio actual es realmente una buena oferta.",
  },
  {
    question: "¿Cuándo es mejor comprar un móvil reacondicionado?",
    answer:
      "No hay una regla infalible, pero un buen momento suele ser cuando el precio de la configuración que buscas está cerca de su mínimo reciente y por debajo de su media de los últimos 30 días. Con el historial de RefurbTrack puedes comprobar en qué punto se encuentra ahora mismo.",
  },
];

export const faqDataEN: FaqItem[] = [
  {
    question: "What is a Back Market price tracker?",
    answer:
      "It is a tool that periodically records the prices of refurbished products sold on Back Market and stores that information to show how they change over time. At RefurbTrack we use it to calculate the minimum, average and maximum of each configuration and help you decide when to buy.",
  },
  {
    question: "How can I check the Back Market price history?",
    answer:
      "Choose a model (for example, the iPhone 15), open its page and select the configuration you are interested in. There you will see the price evolution chart, the minimum and maximum of the last 30 days and the link to the offer on Back Market.",
  },
  {
    question: "How do I know if a Back Market price is good?",
    answer:
      "Compare the current price with its minimum and its 30-day average. If the current price is close to the recent minimum or below the average, it is usually a good sign. At RefurbTrack we show you those figures so you can judge for yourself without having to do the maths.",
  },
  {
    question: "Does Back Market show price history?",
    answer:
      "Back Market does not offer a complete, searchable price history for each product. RefurbTrack rebuilds that evolution by storing periodic price records and making them available to you in charts and tables.",
  },
  {
    question: "How does the price tracking work?",
    answer:
      "RefurbTrack records the prices of Back Market configurations, stores their historical evolution, calculates statistics from those records and lets you check the history to find out whether the current price is really a good deal.",
  },
  {
    question: "When is the best time to buy a refurbished phone?",
    answer:
      "There is no infallible rule, but a good time is usually when the price of the configuration you are looking for is close to its recent minimum and below its 30-day average. With the RefurbTrack history you can check exactly where it stands right now.",
  },
];

/** Devuelve el array de FAQ según el idioma ('es' | 'en'). */
export function getFaqData(language: string | undefined | null): FaqItem[] {
  return language === "en" ? faqDataEN : faqDataES;
}

// ============================================================================
// FAQS DEL HUB DE MODELOS
// ============================================================================

/** Datos dinámicos del hub que pueden aparecer dentro de las respuestas. */
export interface HubFaqData {
  lowest: number | null
  histMin: number | null
  cheapestStorage: string | null
}

/** FAQs del Hub de modelo en español. */
export function getFaqsES(
  productName: string,
  data: HubFaqData = { lowest: null, histMin: null, cheapestStorage: null },
  currency: Currency = "EUR"
): FaqItem[] {
  const items: FaqItem[] = []

  if (data.lowest !== null) {
    items.push({
      question: `¿Cuánto cuesta el ${productName} reacondicionado?`,
      answer: `El precio más bajo disponible ahora mismo para el ${productName} reacondicionado en Back Market es de ${formatCurrency(data.lowest, currency, "es")}. Los precios varían según la capacidad, el color y el estado del dispositivo, por eso te recomendamos revisar todas las configuraciones antes de decidir.`,
    })
  } else {
    items.push({
      question: `¿Cuánto cuesta el ${productName} reacondicionado?`,
      answer: `Todavía no tenemos registros de precios suficientes para el ${productName} reacondicionado. En cuanto nuestro rastreador registre su evolución, mostraremos aquí el precio más bajo y su historial.`,
    })
  }

  if (data.histMin !== null) {
    items.push({
      question: `¿Cuál es el precio mínimo del ${productName}?`,
      answer: `El mínimo histórico registrado para el ${productName} es de ${formatCurrency(data.histMin, currency, "es")}. Recuerda que es un precio que se alcanzó en un momento concreto; el precio actual puede ser distinto.`,
    })
  }

  if (data.cheapestStorage) {
    items.push({
      question: `¿Qué capacidad del ${productName} sale más barata?`,
      answer: `Actualmente, la configuración de ${data.cheapestStorage} GB es la más económica que tenemos registrada para el ${productName}. Consulta sus colores y estados para encontrar la oferta exacta.`,
    })
  }

  items.push({
    question: `¿Cómo ha evolucionado el precio del ${productName}?`,
    answer: `RefurbTrack registra periódicamente los precios del ${productName} en Back Market y calcula el mínimo, la media y el máximo de cada configuración. Puedes consultar el historial individual de cada capacidad y color desde esta página.`,
  })

  return items
}

/** FAQs del Hub de modelo en inglés. */
export function getFaqsEN(
  productName: string,
  data: HubFaqData = { lowest: null, histMin: null, cheapestStorage: null },
  currency: Currency = "GBP"
): FaqItem[] {
  const items: FaqItem[] = []

  if (data.lowest !== null) {
    items.push({
      question: `How much does a refurbished ${productName} cost?`,
      answer: `The lowest price available right now for the refurbished ${productName} on Back Market is ${formatCurrency(data.lowest, currency, "en")}. Prices vary depending on the capacity, colour and condition of the device, so we recommend checking all the configurations before you decide.`,
    })
  } else {
    items.push({
      question: `How much does a refurbished ${productName} cost?`,
      answer: `We don't have enough price records for the refurbished ${productName} yet. As soon as our tracker records its evolution, we will show the lowest price and its history here.`,
    })
  }

  if (data.histMin !== null) {
    items.push({
      question: `What is the minimum price of the ${productName}?`,
      answer: `The lowest price ever recorded for the ${productName} is ${formatCurrency(data.histMin, currency, "en")}. Keep in mind that it is a price reached at a specific moment; the current price may be different.`,
    })
  }

  if (data.cheapestStorage) {
    items.push({
      question: `Which capacity of the ${productName} is cheapest?`,
      answer: `Right now, the ${data.cheapestStorage} GB configuration is the most economical one we have recorded for the ${productName}. Check its colours and conditions to find the exact offer.`,
    })
  }

  items.push({
    question: `How has the price of the ${productName} changed?`,
    answer: `RefurbTrack periodically records the prices of the ${productName} on Back Market and calculates the minimum, average and maximum of each configuration. You can check the individual history of each capacity and colour from this page.`,
  })

  return items
}

/** Conveniencia: devuelve las FAQs del Hub según el idioma del mercado. */
export function getHubFaqs(
  language: Language | string,
  productName: string,
  data?: HubFaqData,
  currency?: Currency
): FaqItem[] {
  const resolvedCurrency: Currency = currency ?? (language === "en" ? "GBP" : "EUR")
  return language === "en"
    ? getFaqsEN(productName, data, resolvedCurrency)
    : getFaqsES(productName, data, resolvedCurrency)
}
