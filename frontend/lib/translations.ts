// frontend/lib/translations.ts

export const TRANSLATIONS = {
  // --- ESTADOS (Coinciden con models.py) ---
  "Fair": "Correcto",
  "Good": "Muy Bueno",
  "Excellent": "Excelente",
  "Premium": "Premium",

  // --- BATERÍA ---
  "new": "Nueva",
  "standard": "Estándar",

  // --- COLORES (Añade los que normalizaste en el scraper) ---
  "Black": "Negro",
  "White": "Blanco",
  "Red": "Rojo",
  "Blue": "Azul",
  "Green": "Verde",
  "Yellow": "Amarillo",
  "Purple": "Púrpura",
  "Pink": "Rosa",
  "Gold": "Oro",
  "Silver": "Plata",
  "Space Gray": "Gris Espacial",
  "Midnight": "Medianoche",
  "Midnight Green": "Verde Medianoche",
  "Pacific Blue": "Azul Pacífico",
  "Graphite": "Grafito",
  "Alpine Green": "Verde Alpino",
  "Sierra Blue": "Azul Alpino",
  "Starlight": "Blanco Estrella",
  "Deep Purple": "Morado Oscuro",
  "Space Black": "Negro Espacial",
  "Black Titanium": "Titanio Negro",
  "Blue Titanium": "Titanio Azul",
  "Natural Titanium": "Titanio Natural",
  "White Titanium": "Titanio Blanco",
  "Desert Titanium": "Titanio Desierto",
  "Teal": "Verde Azulado",
  "Ultramarine": "Azul Ultramar"
} as const;

/**
 * Función helper para traducir.
 * Si la clave no existe (ej: "128GB"), devuelve el texto original.
 */
export function t(key: string | undefined | null | boolean): string {
  if (key === null || key === undefined) return "";
  if (typeof key === "boolean") return key ? "Sí" : "No"; // Por si acaso
  
  // Magia: Busca en el diccionario, si no está, devuelve la clave original
  return TRANSLATIONS[key as keyof typeof TRANSLATIONS] || key;
}