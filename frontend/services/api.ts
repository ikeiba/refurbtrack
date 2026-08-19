// frontend_light/services/api.ts
import { ProductSummary, AlertData, OfferSummary, ContactData, ModelHub, FeaturedHistory } from "@/lib/types";
import { authService } from "./auth" // <--- 1. Importamos el servicio de auth
import { getMarket, getLanguage } from "@/lib/i18n";
import type { MarketCode } from "@/lib/i18n";

// Asegúrate de que esta URL apunta a tu backend corriendo
// CAMBIO: En producción usará /api, en desarrollo 127.0.0.1:8000
// export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// frontend/services/api.ts

// frontend/services/api.ts
const IS_SERVER = typeof window === 'undefined';

// Esta constante ahora es 100% segura. Siempre será "http://web:8000/api" o "http://127.0.0.1:8000/api"
// export const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://127.0.0.1:8000/api";

// services/api.ts

// 2. Enrutamiento Isomórfico (Dependiente del contexto)
// Función inquebrantable para obtener la base de la API
const getBaseUrl = () => {
  if (!IS_SERVER) {
    // Entorno de Navegador (Cliente)
    const publicUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    return publicUrl.endsWith('/api') ? publicUrl : `${publicUrl}/api`;
  }
  
  // Entorno de Node.js (Servidor / Docker Build)
  // Usamos el nombre del servicio de Docker ("web")
  const internalUrl = process.env.INTERNAL_API_URL || process.env.API_URL || "http://web:8000/api";
  return internalUrl.endsWith('/api') ? internalUrl : `${internalUrl}/api`;
};

export const API_URL = getBaseUrl();

// --- FASE 4: Resolución de mercado -------------------------------------------------
// Convierte un locale ('es-es' | 'en-gb') en el código de mercado que espera el
// backend ('ES' | 'UK') para el parámetro `?market=`.

/** Añade `?market=` a una URL (respetando query params ya existentes). */
function withMarket(url: string, market: MarketCode | string = "ES"): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}market=${encodeURIComponent(market)}`;
}

/** Deriva el código de mercado desde un locale (o usa el valor directamente). */
function resolveMarketCode(localeOrMarket?: string | null): MarketCode {
  if (!localeOrMarket) return "ES";
  // Si ya es un código de mercado ('ES' | 'UK'), lo devolvemos tal cual.
  if (localeOrMarket === "ES" || localeOrMarket === "UK") return localeOrMarket;
  return getMarket(localeOrMarket);
}

// ... resto de tus funciones ...

export const getProducts = async (localeOrMarket?: string | null): Promise<ProductSummary[]> => {
  try {
    const market = resolveMarketCode(localeOrMarket);
    // Llamamos al endpoint 'catalog' que creamos en Django
    const res = await fetch(withMarket(`${API_URL}/products/`, market), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // IMPORTANTE: 'no-store' asegura que siempre veamos datos frescos (SSR real)
      // Si quisieras ISR (actualizar cada hora), usarías { next: { revalidate: 3600 } }
      next: { revalidate: 600 } // Sincronizado con el revalidate de la página 
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();
    return data;
    
  } catch (error) {
    console.error("Error fetching catalog:", error);
    // En caso de error, devolvemos un array vacío para que la UI no explote
    return [];
  }
};

// Para el Detalle (fetch pesado)
export const getProductDetail = async (id: string, localeOrMarket?: string | null) => {
  const market = resolveMarketCode(localeOrMarket);
  const res = await fetch(withMarket(`${API_URL}/products/${id}/`, market));
  if (!res.ok) throw new Error('Error fetching product detail');
  return res.json();
};

// Para el Historial (Gráfica)
export const getOfferHistory = async (offerId: number, days: string = '30') => {
  // Ahora la URL siempre lleva el parámetro
  const url = `${API_URL}/offers/${offerId}/history/?days=${days}`;
  
  const res = await fetch(url);
  if (!res.ok) return []; 
  return res.json();
};

export const createAlert = async (data: AlertData) => {
  const res = await fetch(`${API_URL}/alerts/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Error en el servidor";
    try {
      const errorData = await res.json();
      errorMessage = JSON.stringify(errorData);
    } catch (e) {
      // Si entra aquí, es que Django devolvió un HTML (Error 500)
      errorMessage = `Error del servidor (Status: ${res.status})`;
    }
    throw new Error(errorMessage);
  }
  
  return res.json();
};

export const getHistoricalLowOffers = async (localeOrMarket?: string | null): Promise<OfferSummary[]> => {
  try {
    const market = resolveMarketCode(localeOrMarket);
    const res = await fetch(withMarket(`${API_URL}/offers/historical-lows/`, market), {
      next: { revalidate: 600 } // <-- AÑADIDO PARA ALINEAR LA CACHÉ
    })
    if (!res.ok) throw new Error("Error fetching offers")
    return await res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  // 1. Buscamos el token actual
  let token = localStorage.getItem("accessToken")
  
  // Configuración inicial de cabeceras
  const headers = {
    "Content-Type": "application/json",
    ...((options.headers as any) || {}),
    "Authorization": token ? `Bearer ${token}` : ""
  }

  // 2. Primer intento
  let res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  // 3. SI FALLA CON 401 (UNAUTHORIZED) -> INTENTAMOS REFRESACAR
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken")
    
    if (refreshToken) {
      try {
        console.log("Token caducado. Intentando renovar sesión...")
        
        // A. Pedimos nuevo token a Django
        const newTokens = await authService.refreshToken(refreshToken)
        
        // B. Guardamos el nuevo token
        localStorage.setItem("accessToken", newTokens.access)
        // Opcional: Si el backend devuelve un refresh nuevo, guardarlo también
        // localStorage.setItem("refreshToken", newTokens.refresh) 

        // C. Actualizamos la cabecera con el nuevo token
        headers["Authorization"] = `Bearer ${newTokens.access}`

        // D. Reintentamos la petición original
        res = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers
        })
        
      } catch (refreshError) {
        // Si el refresh también falla (ej: pasaron 7 días), no hay nada que hacer.
        // Borramos todo para forzar login limpio la próxima vez.
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userEmail")
        window.location.href = "/auth/login" // Redirigir a login
        throw new Error("Sesión expirada. Por favor, inicia sesión de nuevo.")
      }
    }
  }

  return res
}

// --- TUS FUNCIONES ACTUALIZADAS ---

// Ya no hace falta pasarle el token por parámetro, lo coge él solo de localStorage
export async function getUserAlerts() {
  const res = await authenticatedFetch("/alerts/") // Usamos la función mágica

  if (!res.ok) throw new Error("Error al cargar alertas")
  return res.json()
}

export async function deleteAlert(id: number) {
  const res = await authenticatedFetch(`/alerts/${id}/`, {
    method: "DELETE",
  })

  if (!res.ok) throw new Error("Error al eliminar alerta")
  return true
}

export async function unsubscribeAllAlerts() {
  const res = await authenticatedFetch("/user/unsubscribe-all/", {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Error al darse de baja")
  return true
}

export async function deleteUserAccount() {
  const res = await authenticatedFetch("/user/delete/", {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Error al eliminar cuenta")
  return true
}

// 1. Solicitar el email de recuperación
// `locale` (ej. 'es-es' | 'en-gb') permite al backend construir el enlace
// de reset con el prefijo de locale correcto en vez de hardcodear /es/.
export async function requestPasswordReset(email: string, locale?: string | null) {
  const res = await fetch(`${API_URL}/auth/forgot-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, locale }),
  })

  // Si el backend devuelve error (ej: 404), lanzamos excepción para que la capture el componente
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "No se pudo enviar el correo")
  }

  return true
}

// 2. Confirmar el cambio de contraseña
export async function confirmPasswordReset(data: { uid: string; token: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "El enlace ha caducado o es inválido")
  }

  return await res.json()
}

// 1. Darse de baja de UNA alerta específica (vía Email/Token)
export async function unsubscribeAlert(token: string) {
  const res = await fetch(`${API_URL}/alerts/unsubscribe/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })

  if (!res.ok) throw new Error("Error al eliminar la alerta")
  return true
}

// 2. Darse de baja de TODO (vía Email/Token)
export async function unsubscribeSubscriber(token: string) {
  // Nota: Usamos la ruta 'alerts/unsubscribe-all' que definimos en urls.py
  const res = await fetch(`${API_URL}/alerts/unsubscribe-all/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })

  if (!res.ok) throw new Error("Error al eliminar todas las alertas")
  return true
}

// frontend/services/api.ts

export const getProductBySlugs = async (category: string, brand: string, product: string, spec: string, locale?: string | null) => {
  const market = resolveMarketCode(locale);
  const lang = locale ? getLanguage(locale) : "es";
  const params = new URLSearchParams({
    cat: category,
    brand: brand,
    prod: product,
    spec: spec,
    market: market,
    lang: lang
  });

  const urlToFetch = `${API_URL}/products/resolve/?${params.toString()}`;
  console.log("🚀 [NEXT.JS FETCH] Intentando llamar a:", urlToFetch); // <-- EL CHIVATO

  try {
    const res = await fetch(urlToFetch, {
      next: { revalidate: 600, tags: ['products'] }
    });

    console.log("✅ [NEXT.JS RESPONSE] Status:", res.status); // <-- EL RESULTADO

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Error del servidor: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("❌ [NEXT.JS ERROR FATAL]", error);
    throw error;
  }
};

export const getModelHub = async (category: string, brand: string, product: string, locale?: string | null): Promise<ModelHub | null> => {
  const market = resolveMarketCode(locale);
  const params = new URLSearchParams({ cat: category, brand, prod: product, market });
  try {
    const res = await fetch(`${API_URL}/products/model-hub/?${params.toString()}`, {
      next: { revalidate: 600, tags: ['model-hub'] }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Error del servidor: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("❌ Error cargando hub de modelo:", error);
    return null;
  }
};

export const getFeaturedHistory = async (localeOrMarket?: string | null): Promise<FeaturedHistory> => {
  try {
    const market = resolveMarketCode(localeOrMarket);
    const res = await fetch(withMarket(`${API_URL}/offers/featured/`, market), {
      next: { revalidate: 600, tags: ['featured-history'] }
    });
    if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("❌ Error cargando historial destacado:", error);
    return { model: null, history: [], stats: null };
  }
};

export const sendContactMessage = async (data: ContactData) => {
  const res = await fetch(`${API_URL}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "No se pudo enviar el mensaje";
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || JSON.stringify(errorData);
    } catch (e) {
      errorMessage = `Error del servidor (Status: ${res.status})`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
};