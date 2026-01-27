// frontend_light/lib/types.ts

// --- NUEVA INTERFAZ (La Verdadera) ---
// Coincide 1:1 con ProductCardSerializer de Django


//? ESTO ES LO QUE RECIBIMOS EN LA PAGINA DE CATALOGO
export interface ProductSummary {
  id: number;
  name: string;
  image: string | null;
  min_price_cached: number;
}

//? ESTO ES LO QUE RECIBIMOS PARA VER EL GRÁFICO DE HISTORIAL DE PRECIOS
export interface HistoryPoint {
  timestamp: string;
  price: number;
}

//? ESTO ES LO QUE RECIBIMOS EN LA PAGINA DE DETALLE
export interface Spec {
  id: number;
  back_market_uuid: string;
  storage: string;
  color: string;
  image: string | null; // <--- NUEVO
  min_price_cached: number | null;
  offers: Offer[];
}

//? ESTO ES CADA OFERTA DENTRO DE UNA SPEC
export interface Offer {
  id: number;
  condition: string; // "Fair", "Good", "Excellent", "Premium"
  battery_new: boolean;
  current_price: number | null;
  last_updated: string | null;
}

//? ESTOS SON TODAS LAS SPECS DENTRO DE UN PRODUCTO
export interface ProductDetail extends ProductSummary {
  specs: Spec[];
}

//? ESTO ES LO QUE ENVIAMOS AL BACKEND PARA CREAR UNA ALERTA
export interface AlertData {
  email: string;
  price_threshold: number;
  product_id: number;
  country: string;
  
  // Coincide con tus JSONFields del backend
  target_colors: string[];     // [] = Cualquiera
  target_storages: string[];   // [] = Cualquiera
  target_conditions: string[]; // [] = Cualquiera
  
  // Coincide con tu BooleanField(null=True)
  battery_new: boolean | null; 
}

//? ESTO ES LO QUE RECIBIMOS EN EL CARRUSEL DE MINIMOS
export interface OfferSummary {
  id: number
  product_id: number
  name: string
  storage: string
  color: string
  condition: string // "Excellent", "Good"...
  battery_new: boolean
  current_price: number
  old_price?: number // Puede ser null
  image?: string
}

//? ESTO ES LO QUE RECIBIMOS EN LA PÁGINA PRINCIPAL PARA VER EL CARRUSEL
export interface HistoricalLowsCarouselProps {
  offers: OfferSummary[] // <--- Recibimos Ofertas, no Productos
  onOfferClick: (offer: OfferSummary) => void
}