// frontend_light/lib/types.ts

// --- NUEVA INTERFAZ (La Verdadera) ---
// Coincide 1:1 con ProductCardSerializer de Django
export interface ScrapedProduct {
  id: number;           // Django usa números para IDs por defecto
  uuid: string;         // Nuestro identificador único de variante
  product_name: string; // Vía 'source="product.name"'
  product_type: string; // Vía 'source="product.type"'
  storage: string | null;
  color: string | null;
  current_price: number | null; // Puede ser null si no hay histórico
  condition: string | null;     // El texto legible (ej: "Good")
  last_updated: string | null;  // ISO Date string
}

export interface Product {
  id: string
  title: string
  model: string
  storage: string
  color: string
  colorHex: string
  condition: "Fair" | "Good" | "Excellent" | "Premium"
  newBattery: boolean
  price: number
  originalPrice: number
  newRetailPrice: number
  image: string
  images: string[] // Added images array for carousel
  priceHistory: { date: string; price: number }[]
  variants: { storage: string; color: string; colorHex: string; price: number }[]
}

export interface Filters {
  models: string[]
  conditions: string[]
  newBatteryOnly: boolean
  storages: string[]
  colors: string[]
  priceRange: [number, number]
}

export interface Country {
  code: string
  name: string
  flag: string
}
