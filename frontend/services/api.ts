// frontend_light/services/api.ts
import { ProductSummary, AlertData, OfferSummary } from "@/lib/types";
import { authService } from "./auth" // <--- 1. Importamos el servicio de auth

// Asegúrate de que esta URL apunta a tu backend corriendo
export const API_URL = "http://127.0.0.1:8000/api"; 



export const getProducts = async (): Promise<ProductSummary[]> => {
  try {
    // Llamamos al endpoint 'catalog' que creamos en Django
    const res = await fetch(`${API_URL}/products/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // IMPORTANTE: 'no-store' asegura que siempre veamos datos frescos (SSR real)
      // Si quisieras ISR (actualizar cada hora), usarías { next: { revalidate: 3600 } }
      cache: 'no-store', 
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
export const getProductDetail = async (id: string) => {
  const res = await fetch(`${API_URL}/products/${id}/`);
  if (!res.ok) throw new Error('Error fetching product detail');
  return res.json();
};

// Para el Historial (Gráfica)
export const getOfferHistory = async (offerId: number) => {
  const res = await fetch(`${API_URL}/offers/${offerId}/history/`);
  if (!res.ok) return []; // Si falla, devolvemos array vacío
  return res.json();
};

export const createAlert = async (data: AlertData) => {
  const res = await fetch(`${API_URL}/alerts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    // Lanzamos error con detalle para mostrarlo en el Toast
    throw new Error(JSON.stringify(errorData));
  }
  
  return res.json();
};

export const getHistoricalLowOffers = async (): Promise<OfferSummary[]> => {
  try {
    const res = await fetch(`${API_URL}/offers/historical-lows/`)
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
export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
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