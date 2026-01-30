// frontend_light/services/api.ts
import { ProductSummary, AlertData, OfferSummary } from "@/lib/types";

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

// 1. OBTENER MIS ALERTAS
export async function getUserAlerts(token: string) {
  const res = await fetch(`${API_URL}/alerts/`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // <--- CLAVE: Enviamos el token
    },
  })

  if (!res.ok) throw new Error("Error al cargar alertas")
  return res.json()
}

// 2. BORRAR ALERTA
export async function deleteAlert(id: number, token: string) {
  const res = await fetch(`${API_URL}/alerts/${id}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  if (!res.ok) throw new Error("Error al eliminar alerta")
  return true
}