// frontend_light/services/api.ts
import { ScrapedProduct } from "@/lib/types";

// Asegúrate de que esta URL apunta a tu backend corriendo
const API_URL = "http://127.0.0.1:8000"; 

export async function getCatalog(): Promise<ScrapedProduct[]> {
  try {
    // Llamamos al endpoint 'catalog' que creamos en Django
    const res = await fetch(`${API_URL}/api/catalog/`, {
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
}