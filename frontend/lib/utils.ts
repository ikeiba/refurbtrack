import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mapa de colores Apple -> CSS Hex
export const colorMap: Record<string, string> = {
  "Midnight": "#1d1d1f",
  "Black": "#1d1d1f",
  "Starlight": "#f5f5dc",
  "White": "#f5f5f7",
  "Red": "#bf0013",
  "Blue": "#276787",
  "Pink": "#faddd7",
  "Green": "#394c38",
  "Yellow": "#f5e488",
  "Purple": "#e5ddea",
  "Silver": "#e2e4e1",
  "Gold": "#fcebd3",
  "Graphite": "#5e5e5f",
  "Gray": "#4e4e50",
  "Natural": "#bab5a8",
  "Titanium": "#8b8b8b",
  "Teal": "#008080",
  "Ultramarine": "#120a8f",
  "Desert": "#c19a6b",
  // Añade más según necesites
};

export function getColorHex(colorName: string) {
  return colorMap[colorName] || "#888888"; // Gris por defecto si no encuentra
}

// 1. DEFINIMOS LA PALETA DE COLORES (Fuera del componente o arriba)
export const CHART_COLORS = [
    "#059669", // Esmeralda (Principal)
    "#2563eb", // Azul
    "#db2777", // Rosa
    "#d97706", // Naranja
    "#7c3aed", // Violeta (Reserva)
];

// Interfaz para mostrar la alerta en el Dashboard
export interface AlertItem {
  id: number
  product_id: number
  price_threshold: number
  target_colors: string[]
  target_storages: string[]
  target_conditions: string[]
  battery_new: boolean | null
  product_name?: string     // Lo necesitaremos (si el backend no lo manda, habrá que ajustarlo o hacer trampa visual)
  product_image?: string
}