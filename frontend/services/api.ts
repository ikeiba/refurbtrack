// frontend_light/services/api.ts
import { ProductSummary, AlertData } from "@/lib/types";

// Asegúrate de que esta URL apunta a tu backend corriendo
const API_URL = "http://127.0.0.1:8000/api"; 



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