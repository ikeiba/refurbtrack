// frontend/lib/translations.ts
// Diccionarios por idioma (Fase 4).
//
// Dos tipos de claves conviven en el mismo diccionario:
//  1. Datos de la base de datos: claves = valores crudos del backend (inglés
//     para colores/estados, y 'new'/'standard' para batería).
//  2. Textos de interfaz (UI): claves descriptivas en snake_case con su
//     traducción ES y EN. `t()` traduce según idioma.
//
// REGLAS:
//  - Solo UI corta (botones, navegación, etiquetas, títulos genéricos, meta
//    SEO corta). Nada de contenido largo/legal/blog: eso vive en componentes
//    React separados por idioma.
//  - Los textos con variables se expresan con placeholders {nombre} y se
//    interpola con `t('clave', language, { nombre: 'valor' })`.

import type { Language } from "./i18n";

// Diccionario Español (clave EN → valor ES)
const ES: Record<string, string> = {
  // ==================== DATOS DE LA BASE DE DATOS ====================

  // --- ESTADOS (Coinciden con models.py) ---
  Fair: "Correcto",
  Good: "Muy Bueno",
  Excellent: "Excelente",
  Premium: "Premium",

  // --- BATERÍA ---
  new: "Nueva",
  standard: "Estándar",

  // --- COLORES (los que normalizó el scraper) ---
  Black: "Negro",
  White: "Blanco",
  Red: "Rojo",
  Blue: "Azul",
  Green: "Verde",
  Yellow: "Amarillo",
  Purple: "Púrpura",
  Pink: "Rosa",
  Gold: "Oro",
  Silver: "Plata",
  "Space Gray": "Gris Espacial",
  Midnight: "Medianoche",
  "Midnight Green": "Verde Medianoche",
  "Pacific Blue": "Azul Pacífico",
  Graphite: "Grafito",
  "Alpine Green": "Verde Alpino",
  "Sierra Blue": "Azul Alpino",
  Starlight: "Blanco Estrella",
  "Deep Purple": "Morado Oscuro",
  "Space Black": "Negro Espacial",
  "Black Titanium": "Titanio Negro",
  "Blue Titanium": "Titanio Azul",
  "Natural Titanium": "Titanio Natural",
  "White Titanium": "Titanio Blanco",
  "Desert Titanium": "Titanio Desierto",
  Teal: "Verde Azulado",
  Ultramarine: "Azul Ultramar",

  // ==================== TEXTO DE INTERFAZ (UI) ====================

  // --- COMÚN ---
  home: "Inicio",
  cancel: "Cancelar",
  error: "Error",
  loading: "Cargando...",
  from: "Desde",
  alert: "Alerta",
  any: "Cualquiera",
  storage: "Almacenamiento",
  color: "Color",
  condition: "Estado",
  battery: "Batería",
  view_history: "Ver historial",
  history: "Historial",
  price_history_title: "Histórico de Precios",
  price_evolution: "Evolución del precio",
  see_offer: "Ver oferta",
  buy: "Comprar",
  not_available: "No disponible",
  back_home: "Volver al inicio",
  refurbished: "Reacondicionado",
  now: "ahora",
  min_abbr: "mín",
  product_not_found: "Producto no encontrado",
  model_not_found: "Modelo no encontrado",

  // --- NAVEGACIÓN / HEADER ---
  search_placeholder: "Buscar productos...",
  toggle_theme: "Cambiar tema",
  user_menu: "Menú de usuario",
  logo_alt: "Logo de RefurbTrack",
  my_account: "Mi Cuenta",
  my_panel: "Mi Panel",
  my_dashboard: "Mi Panel",
  logout: "Cerrar Sesión",
  user_access: "Acceso Usuarios",
  login: "Iniciar Sesión",
  register: "Registrarse",

  // --- FOOTER ---
  footer_tagline:
    "Facilitando la transición hacia una economía circular y sostenible a través de la transparencia en precios de tecnología reacondicionada.",
  footer_products: "Productos",
  footer_iphones: "iPhones",
  footer_coming_soon: "En breve...",
  footer_company: "Compañía",
  about_us: "Sobre Nosotros",
  how_it_works: "Cómo funciona",
  blog: "Blog",
  contact: "Contacto",
  footer_legal: "Legal",
  privacy: "Privacidad",
  terms: "Términos",
  cookies: "Cookies",
  footer_copyright: "© 2026 RefurbTrack. Todos los derechos reservados.",
  affiliate_disclosure:
    "Podemos ganar una comisión cuando entras en los enlaces para hacer una compra. Haz clic ",
  affiliate_disclosure_after:
    " para saber con más detalle cómo ganamos dinero.",
  footer_here: "aquí",

  // --- BREADCRUMBS ---
  breadcrumb: "Migas de pan",

  // --- HOME / HERO ---
  conscious_consumption: "Consumo Consciente: Ahorra CO2 y Dinero",
  hero_title_1: "iPhones reacondicionados:",
  hero_title_2: "compara precios y ahorra",
  hero_subtitle:
    "Consulta el historial de precios de iPhones reacondicionados en Back Market con gráficos interactivos. Crea alertas de precio y compra en el momento justo.",
  choose_your_model: "Elige tu modelo",
  out_of_stock: "Sin Stock",
  vs_new: "vs {price} new",
  reference_source: "Fuente de referencia: Back Market.",
  why_refurbished_title: "¿Por qué comprar reacondicionado?",
  why_refurbished_text:
    "Un teléfono nuevo requiere la extracción de 200kg de materias primas. Al elegir uno reacondicionado, evitas el 90% de ese impacto y prolongas la vida de un producto perfectamente funcional.",

  // --- VISTA DE PRODUCTO ---
  view_comparison_table: "Ver tabla comparativa",
  selected_configuration: "Configuración seleccionada",
  recorded_on: "Registrado el {date}",
  view_offer_on: "Ver oferta en Back Market",
  out_of_stock_combination: "Sin stock para esta combinación",
  last_record: "Último Registro",
  min_30d: "Mínimo (30d)",
  avg_30d: "Media (30d)",
  max_30d: "Máximo (30d)",
  calculated_from_records: "Calculado sobre registros",
  no_history_for_config: "No hay historial suficiente para esta configuración.",
  no_price_records: "Todavía no hay registros de precios suficientes para mostrar una evolución real.",
  also_interesting: "También te podría interesar",
  about_product: "Sobre el {productName}",
  new_battery: "Batería Nueva",
  standard_battery: "Batería Estándar",
  view_model_in_color: "Ver modelo en color {color}",
  remove_from_comparison: "Eliminar de la comparativa",

  // --- COMPARADOR ---
  add_comparison: "Añadir Comparación",
  compare_prices: "Comparar precios",
  add_line_hint: "Añade otra línea al gráfico.",
  model_label: "Modelo",
  select: "Seleccionar",
  loading_options: "Cargando opciones...",
  capacity: "Capacidad",
  view_on_chart: "Ver en gráfico",
  combination_not_found: "Esa combinación de Color/GB no existe.",
  no_data_combination: "No hay datos para esta combinación.",

  // --- MODAL DE ALERTA ---
  create_price_alert: "Crear Alerta de Precio",
  configure_prefs_hint: "Configura tus preferencias abajo",
  current_price: "Precio actual",
  your_email: "Tu Email",
  notify_if_below: "Avísame si baja de",
  any_storage: "Cualquier almacenamiento",
  any_color: "Cualquier color",
  any_condition: "Cualquier estado",
  any_battery: "Cualquier batería",
  selected_suffix: "Seleccionado: {values}",
  summary_label: "Resumen:",
  notify_to: "Avisar a {email} cuando {description} baje de {price}",
  create_alert: "Crear Alerta",
  alert_created: "¡Alerta Creada!",
  alert_created_desc: "Te avisaremos en {email} cuando baje de precio.",
  go_to_dashboard: "Ir a mi panel",
  missing_data: "Faltan datos",
  missing_data_desc: "Asegúrate de que todos los campos tengan algo seleccionado.",
  could_not_save_alert: "No se pudo guardar la alerta.",

  // --- CARRUSEL DE MÍNIMOS ---
  sustainable_lows: "Mínimos sostenibles",
  sustainable_lows_desc:
    "Precios mensuales más bajos en productos que dan una segunda vida a la tecnología.",
  view_on_backmarket: "Ver en Back Market",
  no_link_available: "Sin enlace disponible",

  // --- TABLA DE CONFIGURACIONES (HUB) ---
  configuration: "Configuración",
  current_price_col: "Precio actual",
  min_30d_col: "Mínimo 30d",
  avg_30d_col: "Media 30d",
  condition_col: "Estado",
  alert_col: "Alerta",
  backmarket_col: "Back Market",
  history_col: "Histórico",
  create_alert_for: "Crear alerta para {name}",

  // --- HUB / MODELO ---
  hub_title: "{productName} reacondicionado: precios e historial",
  hub_subtitle:
    "Consulta los precios e historial del {productName} reacondicionado en Back Market y compara sus distintas configuraciones para comprar en el momento justo.",
  lowest_current: "Precio actual más bajo",
  cheapest_now_hint: "Lo más barato ahora",
  avg_current: "Precio medio actual",
  avg_configs_hint: "Media de configuraciones",
  historical_min: "Mínimo histórico",
  cheapest_recorded_hint: "Lo más barato registrado",
  configurations: "Configuraciones",
  updated_suffix: "Actualizado: {date}",
  best_price: "¿Cuál es el mejor precio?",
  view_price_history_of: "Ver historial de precios del {name} {storage} GB {color}",
  explore_more: "Explorar más",
  view_bm_history: "Ver historial de precios de Back Market",
  view_other_iphones: "Ver otros modelos de iPhone",
  seo_section_title: "Precios e historial del {productName}",
  faq_title: "Preguntas frecuentes",

  // --- DASHBOARD ---
  manage_alerts_for: "Gestiona tus alertas de precios activas para {user}",
  no_active_alerts: "No tienes alertas activas",
  no_active_alerts_desc:
    "Busca un producto que te guste y crea una alerta para que te avisemos cuando baje de precio.",
  explore_products: "Explorar Productos",
  active: "Activa",
  notify_drop_below: "Avisar si baja de {price}",
  storage_suffix: "Almacenamiento: {values}",
  color_suffix: "Color: {values}",
  condition_suffix: "Estado: {values}",
  battery_suffix: "Batería: {values}",
  danger_zone: "Zona de Peligro",
  stop_notifications: "Detener Notificaciones",
  stop_notifications_desc: "Elimina todas tus alertas sin borrar tu cuenta.",
  delete_alerts: "Eliminar alertas",
  are_you_sure: "¿Estás seguro?",
  will_delete_n_alerts: "Esto eliminará tus {count} alertas activas.",
  yes_delete: "Sí, eliminar",
  delete_account: "Eliminar Cuenta",
  delete_account_desc: "Borra permanentemente tu cuenta y todos tus datos.",
  delete_account_confirm: "¿Eliminar cuenta permanentemente?",
  delete_account_confirm_desc:
    "Esto borrará tu usuario {user} y todos tus datos. No se puede deshacer.",
  unsubscribe_completed: "Baja completada",
  unsubscribed_all: "Has dejado de seguir todos los productos.",
  could_not_process: "No se pudo procesar la baja",
  alert_deleted: "Alerta eliminada",
  could_not_delete: "No se pudo eliminar",
  could_not_delete_account: "No se pudo eliminar la cuenta",

  // --- AUTENTICACIÓN ---
  welcome_back: "Bienvenido de nuevo",
  welcome_back_desc: "Introduce tus credenciales para acceder a tu panel",
  email: "Email",
  email_placeholder: "tu@email.com",
  password: "Contraseña",
  forgot_password: "¿Olvidaste tu contraseña?",
  connecting: "Conectando...",
  or_continue_with: "O continúa con",
  dont_have_account: "¿No tienes cuenta?",
  sign_up_free: "Regístrate gratis",
  login_error: "Error al iniciar sesión",
  google_connect_error: "Error al conectar con Google",
  google_popup_error: "Error en el pop-up de Google",
  create_account: "Crea tu cuenta",
  create_account_desc:
    "Únete a RefurbTrack para gestionar tus alertas y guardar favoritos",
  confirm_password: "Confirmar Contraseña",
  passwords_mismatch: "Las contraseñas no coinciden",
  password_too_short: "La contraseña debe tener al menos 6 caracteres",
  creating_account: "Creando cuenta...",
  account_creation_error: "Error al crear la cuenta",
  already_have_account: "¿Ya tienes cuenta?",
  sign_in: "Inicia sesión",
  recover_password: "Recuperar contraseña",
  recover_password_desc:
    "Ingresa tu email y te enviaremos un enlace para restaurar tu contraseña",
  sending: "Enviando...",
  send_recovery_link: "Enviar enlace de recuperación",
  back_to_login: "Volver al login",
  email_sent: "✓ Email enviado correctamente",
  email_sent_desc:
    "Hemos enviado un enlace de recuperación a {email}. Revisa tu bandeja de entrada (y la carpeta de spam) en los próximos minutos.",
  reset_password: "Restablecer Contraseña",
  enter_new_password: "Introduce tu nueva contraseña",
  new_password: "Nueva Contraseña",
  password_updated: "¡Contraseña actualizada correctamente!",
  redirecting_to_login: "Redirigiendo al login...",
  go_to_login_now: "Ir al Login ahora",
  saving: "Guardando...",
  change_password: "Cambiar Contraseña",

  // --- BAJAS (UNSUBSCRIBE) ---
  processing: "Procesando...",
  alert_removed: "Alerta Eliminada",
  unsubscribe_success_desc:
    "Has dejado de seguir este producto. Ya no recibirás más correos sobre él.",
  unsubscribe_error_desc:
    "El enlace ha caducado o no es válido. Ve a tu panel para gestionar tus alertas.",
  unsubscribe_all_confirm: "¿Darte de baja de todo?",
  unsubscribe_all_loading: "Procesando baja...",
  miss_you: "Te echaremos de menos",
  unsubscribe_all_desc:
    "Estás a punto de eliminar todas tus alertas y tu cuenta de suscriptor. Dejarás de recibir cualquier correo nuestro.",
  unsubscribe_all_confirm_btn: "Sí, eliminar todas mis alertas",
  cancel_back_home: "Cancelar y volver al inicio",
  unsubscribe_all_success_desc:
    "Has sido dado de baja correctamente. Todas tus alertas han sido eliminadas de nuestro sistema.",

  // --- COOKIES ---
  cookie_banner_text:
    "Utilizamos cookies propias y de terceros para analizar nuestro tráfico y mejorar tu experiencia. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias. Lee nuestra ",
  cookie_policy_link: "Política de Cookies",
  configure: "Configurar",
  reject: "Rechazar",
  accept_all: "Aceptar todas",
  cookie_config_title: "Configuración de Cookies",
  cookie_config_desc:
    "Selecciona qué tipo de cookies permites instalar en tu navegador.",
  technical_cookies: "Cookies Técnicas (Estrictamente necesarias)",
  technical_cookies_desc: "Necesarias para que la web funcione. No se pueden desactivar.",
  analytics_cookies: "Cookies de Analítica",
  analytics_cookies_desc:
    "Nos permiten entender cómo interactúas con la web (Google Analytics, Clarity).",
  marketing_cookies: "Cookies de Marketing / Afiliación",
  marketing_cookies_desc:
    "Necesarias para el seguimiento de compras y enlaces de afiliados (Awin).",
  save_preferences: "Guardar preferencias",

  // --- METADATA SEO CORTA ---
  meta_default_title:
    "RefurbTrack - Compara Precios de iPhones Reacondicionados en Back Market",
  meta_default_description:
    "Compara precios históricos de iPhones reacondicionados en Back Market. Encuentra las mejores ofertas en tecnología reacondicionada.",
  meta_category_title: "Compara {category} Reacondicionados | RefurbTrack",
  meta_category_description:
    "Compara precios históricos de {category} reacondicionados en Back Market. Encuentra la mejor oferta con garantía.",
  meta_brand_title:
    "{brand} Reacondicionados - Historial de Precios | RefurbTrack",
  meta_brand_description:
    "Compara precios históricos de {category}s {brand} reacondicionados en Back Market. Encuentra la mejor oferta con garantía.",
  category_heading: "{category} Reacondicionados",
  meta_history_title:
    "Historial y rastreador de precios Back Market | RefurbTrack",
  meta_history_description:
    "Consulta el historial de precios de Back Market y sigue la evolución de los móviles reacondicionados. Descubre si el precio actual es una buena oferta antes de comprar.",
  history_landing_title: "Historial de precios de Back Market",
  view_price_history: "Ver historial de precios",
  tracked_products: "Productos que rastreamos",
  tracked_products_desc: "Estos son los modelos cuyo precio estamos siguiendo en Back Market.",
  pending_price: "Precio pendiente de registro",
  configs_suffix: "{count} configuraciones",
  how_tracker_works: "Cómo funciona el rastreador de precios",
  real_history_example: "Ejemplo real de historial de precios",
  current_price_stat: "Precio actual",
  min_30_days: "Mínimo 30 días",
  avg_30_days: "Media 30 días",
  max_30_days: "Máximo 30 días",
  good_time_buy: "¿Es un buen momento para comprar?",
  history_by_model: "Historial de precios por modelo",
  explore: "Explora RefurbTrack",
  smartphones_refurbished: "Smartphones reacondicionados",
  price_of_refurbished: "Precio del {name} reacondicionado",
  colors_count: "{count} colores",
  from_lower: "desde {price}",
  hub_price_suffix: "{price} ahora",
  hub_min_suffix: " (mín {price})",
  configurations_of: "Configuraciones del {productName} reacondicionado",
  hub_meta_desc_with:
    "Precios e historial del {productName} reacondicionado en Back Market. Compara sus {count} configuraciones — {price} ahora{minPart}.",
  hub_meta_desc_without:
    "Precios e historial del {productName} reacondicionado en Back Market. Compara sus {count} configuraciones y su evolución de precios.",
  hub_meta_min_part: ", mínimo 30 días {price}",
  spec_meta_description:
    "Historial de precios del {productName} reacondicionado en Back Market{priceNow}{minPart}. Compara condiciones y ahorra con garantía.",
};

// Diccionario Inglés (clave EN → valor EN).
// Los colores y estados ya llegan en inglés desde el backend, así que solo
// necesitamos normalizar la batería y cualquier término que difiera.
const EN: Record<string, string> = {
  // ==================== DATOS DE LA BASE DE DATOS ====================

  // --- ESTADOS (identidad) ---
  Fair: "Fair",
  Good: "Good",
  Excellent: "Excellent",
  Premium: "Premium",

  // --- BATERÍA ---
  new: "New",
  standard: "Standard",

  // --- COLORES (identidad) ---
  Black: "Black",
  White: "White",
  Red: "Red",
  Blue: "Blue",
  Green: "Green",
  Yellow: "Yellow",
  Purple: "Purple",
  Pink: "Pink",
  Gold: "Gold",
  Silver: "Silver",
  "Space Gray": "Space Gray",
  Midnight: "Midnight",
  "Midnight Green": "Midnight Green",
  "Pacific Blue": "Pacific Blue",
  Graphite: "Graphite",
  "Alpine Green": "Alpine Green",
  "Sierra Blue": "Sierra Blue",
  Starlight: "Starlight",
  "Deep Purple": "Deep Purple",
  "Space Black": "Space Black",
  "Black Titanium": "Black Titanium",
  "Blue Titanium": "Blue Titanium",
  "Natural Titanium": "Natural Titanium",
  "White Titanium": "White Titanium",
  "Desert Titanium": "Desert Titanium",
  Teal: "Teal",
  Ultramarine: "Ultramarine",

  // ==================== TEXTO DE INTERFAZ (UI) ====================

  // --- COMÚN ---
  home: "Home",
  cancel: "Cancel",
  error: "Error",
  loading: "Loading...",
  from: "From",
  alert: "Alert",
  any: "Any",
  storage: "Storage",
  color: "Color",
  condition: "Condition",
  battery: "Battery",
  view_history: "View history",
  history: "History",
  price_history_title: "Price History",
  price_evolution: "Price evolution",
  see_offer: "View offer",
  buy: "Buy",
  not_available: "Not available",
  back_home: "Back to home",
  refurbished: "Refurbished",
  now: "now",
  min_abbr: "min",
  product_not_found: "Product not found",
  model_not_found: "Model not found",

  // --- NAVEGACIÓN / HEADER ---
  search_placeholder: "Search products...",
  toggle_theme: "Toggle theme",
  user_menu: "User menu",
  logo_alt: "RefurbTrack logo",
  my_account: "My Account",
  my_panel: "My Panel",
  my_dashboard: "My Dashboard",
  logout: "Log out",
  user_access: "User Access",
  login: "Log in",
  register: "Sign up",

  // --- FOOTER ---
  footer_tagline:
    "Helping the transition to a circular economy through price transparency for refurbished tech.",
  footer_products: "Products",
  footer_iphones: "iPhones",
  footer_coming_soon: "Coming soon...",
  footer_company: "Company",
  about_us: "About Us",
  how_it_works: "How it works",
  blog: "Blog",
  contact: "Contact",
  footer_legal: "Legal",
  privacy: "Privacy",
  terms: "Terms",
  cookies: "Cookies",
  footer_copyright: "© 2026 RefurbTrack. All rights reserved.",
  affiliate_disclosure:
    "We may earn a commission when you click links to make a purchase. Click ",
  affiliate_disclosure_after:
    " to learn more about how we make money.",
  footer_here: "here",

  // --- BREADCRUMBS ---
  breadcrumb: "Breadcrumb",

  // --- HOME / HERO ---
  conscious_consumption: "Conscious Consumption: Save CO2 and Money",
  hero_title_1: "Refurbished iPhones:",
  hero_title_2: "compare prices and save",
  hero_subtitle:
    "Check the price history of refurbished iPhones on Back Market with interactive charts. Set price alerts and buy at the right moment.",
  choose_your_model: "Choose your model",
  out_of_stock: "Out of stock",
  vs_new: "vs {price} new",
  reference_source: "Reference source: Back Market.",
  why_refurbished_title: "Why buy refurbished?",
  why_refurbished_text:
    "A new phone requires extracting 200kg of raw materials. By choosing a refurbished one, you avoid 90% of that impact and extend the life of a perfectly functional product.",

  // --- VISTA DE PRODUCTO ---
  view_comparison_table: "View comparison table",
  selected_configuration: "Selected configuration",
  recorded_on: "Recorded on {date}",
  view_offer_on: "View offer on Back Market",
  out_of_stock_combination: "Out of stock for this combination",
  last_record: "Last Record",
  min_30d: "Min (30d)",
  avg_30d: "Avg (30d)",
  max_30d: "Max (30d)",
  calculated_from_records: "Calculated from records",
  no_history_for_config: "Not enough history for this configuration.",
  no_price_records: "Not enough price records yet to show a real evolution.",
  also_interesting: "You might also like",
  about_product: "About the {productName}",
  new_battery: "New Battery",
  standard_battery: "Standard Battery",
  view_model_in_color: "View model in {color} color",
  remove_from_comparison: "Remove from comparison",

  // --- COMPARADOR ---
  add_comparison: "Add Comparison",
  compare_prices: "Compare prices",
  add_line_hint: "Add another line to the chart.",
  model_label: "Model",
  select: "Select",
  loading_options: "Loading options...",
  capacity: "Capacity",
  view_on_chart: "View on chart",
  combination_not_found: "That Color/GB combination does not exist.",
  no_data_combination: "No data for this combination.",

  // --- MODAL DE ALERTA ---
  create_price_alert: "Create Price Alert",
  configure_prefs_hint: "Configure your preferences below",
  current_price: "Current price",
  your_email: "Your Email",
  notify_if_below: "Notify me if it drops below",
  any_storage: "Any storage",
  any_color: "Any color",
  any_condition: "Any condition",
  any_battery: "Any battery",
  selected_suffix: "Selected: {values}",
  summary_label: "Summary:",
  notify_to: "Notify {email} when {description} drops below {price}",
  create_alert: "Create Alert",
  alert_created: "Alert Created!",
  alert_created_desc: "We'll notify you at {email} when the price drops.",
  go_to_dashboard: "Go to my dashboard",
  missing_data: "Missing data",
  missing_data_desc: "Make sure all fields have something selected.",
  could_not_save_alert: "Could not save the alert.",

  // --- CARRUSEL DE MÍNIMOS ---
  sustainable_lows: "Sustainable lows",
  sustainable_lows_desc:
    "Lowest monthly prices on products that give tech a second life.",
  view_on_backmarket: "View on Back Market",
  no_link_available: "No link available",

  // --- TABLA DE CONFIGURACIONES (HUB) ---
  configuration: "Configuration",
  current_price_col: "Current price",
  min_30d_col: "Min 30d",
  avg_30d_col: "Avg 30d",
  condition_col: "Condition",
  alert_col: "Alert",
  backmarket_col: "Back Market",
  history_col: "History",
  create_alert_for: "Create alert for {name}",

  // --- HUB / MODELO ---
  hub_title: "{productName} refurbished: prices and history",
  hub_subtitle:
    "Check the prices and history of the {productName} refurbished on Back Market and compare its configurations to buy at the right moment.",
  lowest_current: "Lowest current price",
  cheapest_now_hint: "Cheapest now",
  avg_current: "Current average price",
  avg_configs_hint: "Average across configurations",
  historical_min: "Historical minimum",
  cheapest_recorded_hint: "Cheapest recorded",
  configurations: "Configurations",
  updated_suffix: "Updated: {date}",
  best_price: "What is the best price?",
  view_price_history_of: "View price history of the {name} {storage} GB {color}",
  explore_more: "Explore more",
  view_bm_history: "View Back Market price history",
  view_other_iphones: "View other iPhone models",
  seo_section_title: "Prices and history of the {productName}",
  faq_title: "Frequently asked questions",

  // --- DASHBOARD ---
  manage_alerts_for: "Manage your active price alerts for {user}",
  no_active_alerts: "You have no active alerts",
  no_active_alerts_desc:
    "Find a product you like and create an alert so we can notify you when the price drops.",
  explore_products: "Explore Products",
  active: "Active",
  notify_drop_below: "Notify if drops below {price}",
  storage_suffix: "Storage: {values}",
  color_suffix: "Color: {values}",
  condition_suffix: "Condition: {values}",
  battery_suffix: "Battery: {values}",
  danger_zone: "Danger Zone",
  stop_notifications: "Stop Notifications",
  stop_notifications_desc: "Delete all your alerts without deleting your account.",
  delete_alerts: "Delete alerts",
  are_you_sure: "Are you sure?",
  will_delete_n_alerts: "This will delete your {count} active alerts.",
  yes_delete: "Yes, delete",
  delete_account: "Delete Account",
  delete_account_desc: "Permanently delete your account and all your data.",
  delete_account_confirm: "Delete account permanently?",
  delete_account_confirm_desc:
    "This will delete your user {user} and all your data. This cannot be undone.",
  unsubscribe_completed: "Unsubscribe completed",
  unsubscribed_all: "You've stopped following all products.",
  could_not_process: "Could not process the unsubscribe",
  alert_deleted: "Alert deleted",
  could_not_delete: "Could not delete",
  could_not_delete_account: "Could not delete the account",

  // --- AUTENTICACIÓN ---
  welcome_back: "Welcome back",
  welcome_back_desc: "Enter your credentials to access your dashboard",
  email: "Email",
  email_placeholder: "you@email.com",
  password: "Password",
  forgot_password: "Forgot your password?",
  connecting: "Connecting...",
  or_continue_with: "Or continue with",
  dont_have_account: "Don't have an account?",
  sign_up_free: "Sign up free",
  login_error: "Error logging in",
  google_connect_error: "Error connecting with Google",
  google_popup_error: "Error in Google pop-up",
  create_account: "Create your account",
  create_account_desc: "Join RefurbTrack to manage your alerts and save favorites",
  confirm_password: "Confirm Password",
  passwords_mismatch: "Passwords don't match",
  password_too_short: "Password must be at least 6 characters",
  creating_account: "Creating account...",
  account_creation_error: "Error creating account",
  already_have_account: "Already have an account?",
  sign_in: "Log in",
  recover_password: "Recover password",
  recover_password_desc:
    "Enter your email and we'll send you a link to reset your password",
  sending: "Sending...",
  send_recovery_link: "Send recovery link",
  back_to_login: "Back to login",
  email_sent: "✓ Email sent successfully",
  email_sent_desc:
    "We've sent a recovery link to {email}. Check your inbox (and spam folder) in the next few minutes.",
  reset_password: "Reset Password",
  enter_new_password: "Enter your new password",
  new_password: "New Password",
  password_updated: "Password updated successfully!",
  redirecting_to_login: "Redirecting to login...",
  go_to_login_now: "Go to login now",
  saving: "Saving...",
  change_password: "Change Password",

  // --- BAJAS (UNSUBSCRIBE) ---
  processing: "Processing...",
  alert_removed: "Alert Removed",
  unsubscribe_success_desc:
    "You've stopped following this product. You won't receive any more emails about it.",
  unsubscribe_error_desc:
    "The link has expired or is invalid. Go to your dashboard to manage your alerts.",
  unsubscribe_all_confirm: "Unsubscribe from everything?",
  unsubscribe_all_loading: "Processing unsubscribe...",
  miss_you: "We'll miss you",
  unsubscribe_all_desc:
    "You're about to delete all your alerts and your subscriber account. You'll stop receiving any emails from us.",
  unsubscribe_all_confirm_btn: "Yes, delete all my alerts",
  cancel_back_home: "Cancel and go back home",
  unsubscribe_all_success_desc:
    "You've been successfully unsubscribed. All your alerts have been removed from our system.",

  // --- COOKIES ---
  cookie_banner_text:
    "We use first and third-party cookies to analyse our traffic and improve your experience. You can accept all cookies, reject them or configure your preferences. Read our ",
  cookie_policy_link: "Cookie Policy",
  configure: "Configure",
  reject: "Reject",
  accept_all: "Accept all",
  cookie_config_title: "Cookie Settings",
  cookie_config_desc: "Select which types of cookies you allow to be installed on your browser.",
  technical_cookies: "Technical Cookies (Strictly necessary)",
  technical_cookies_desc: "Required for the website to work. Cannot be disabled.",
  analytics_cookies: "Analytics Cookies",
  analytics_cookies_desc:
    "Help us understand how you interact with the website (Google Analytics, Clarity).",
  marketing_cookies: "Marketing / Affiliate Cookies",
  marketing_cookies_desc:
    "Required for purchase tracking and affiliate links (Awin).",
  save_preferences: "Save preferences",

  // --- METADATA SEO CORTA ---
  meta_default_title:
    "RefurbTrack - Compare Refurbished iPhone Prices on Back Market",
  meta_default_description:
    "Compare historical prices of refurbished iPhones on Back Market. Find the best deals on refurbished tech.",
  meta_category_title: "Compare Refurbished {category} | RefurbTrack",
  meta_category_description:
    "Compare historical prices for refurbished {category} on Back Market. Find the best guaranteed deal.",
  meta_brand_title:
    "Refurbished {brand} - Price History | RefurbTrack",
  meta_brand_description:
    "Compare historical prices for refurbished {category}s {brand} on Back Market. Find the best guaranteed deal.",
  category_heading: "Refurbished {category}",
  meta_history_title:
    "Back Market price history and tracker | RefurbTrack",
  meta_history_description:
    "Check Back Market price history and track how refurbished phones evolve. Discover whether the current price is a good deal before you buy.",
  history_landing_title: "Back Market price history",
  view_price_history: "View price history",
  tracked_products: "Products we track",
  tracked_products_desc: "These are the models whose prices we're tracking on Back Market.",
  pending_price: "Price pending recording",
  configs_suffix: "{count} configurations",
  how_tracker_works: "How the price tracker works",
  real_history_example: "Real price history example",
  current_price_stat: "Current price",
  min_30_days: "Min 30 days",
  avg_30_days: "Avg 30 days",
  max_30_days: "Max 30 days",
  good_time_buy: "Is it a good time to buy?",
  history_by_model: "Price history by model",
  explore: "Explore RefurbTrack",
  smartphones_refurbished: "Refurbished smartphones",
  price_of_refurbished: "Price of the refurbished {name}",
  colors_count: "{count} colors",
  from_lower: "from {price}",
  hub_price_suffix: "{price} now",
  hub_min_suffix: " (min {price})",
  configurations_of: "Configurations of the refurbished {productName}",
  hub_meta_desc_with:
    "Prices and history of the refurbished {productName} on Back Market. Compare its {count} configurations — {price} now{minPart}.",
  hub_meta_desc_without:
    "Prices and history of the refurbished {productName} on Back Market. Compare its {count} configurations and price evolution.",
  hub_meta_min_part: ", min 30 days {price}",
  spec_meta_description:
    "Price history of the refurbished {productName} on Back Market{priceNow}{minPart}. Compare conditions and save with confidence.",
};

// Mapa inverso ES → EN, útil para generar slugs o etiquetas en inglés.
// Se limita a los datos de la base de datos (claves que son valores del backend)
// para no mezclar UI con slugs.
const ES_TO_EN: Record<string, string> = {};

// Rellenamos ES_TO_EN solo con los datos normalizados del backend
// (estados, batería y colores), nunca con claves de UI.
const DB_KEYS = new Set([
  "Fair", "Good", "Excellent", "Premium",
  "new", "standard",
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink",
  "Gold", "Silver", "Space Gray", "Midnight", "Midnight Green", "Pacific Blue",
  "Graphite", "Alpine Green", "Sierra Blue", "Starlight", "Deep Purple",
  "Space Black", "Black Titanium", "Blue Titanium", "Natural Titanium",
  "White Titanium", "Desert Titanium", "Teal", "Ultramarine",
]);

Object.entries(ES).forEach(([en, es]) => {
  if (DB_KEYS.has(en) && !(es in ES_TO_EN)) ES_TO_EN[es] = en;
});

export const dictionaries: Record<Language, Record<string, string>> = {
  es: ES,
  en: EN,
};

export function isEnglish(language: string | undefined | null): boolean {
  return !!language && language.toLowerCase().startsWith("en");
}

/** Interpola los placeholders `{clave}` de un texto traducido. */
function interpolate(
  text: string,
  vars?: Record<string, string | number | undefined | null>
): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name];
    return value === undefined || value === null ? match : String(value);
  });
}

/**
 * Traduce una clave según el idioma.
 * - Claves de datos (colores/estados/batería): `t('Blue', 'es')` → "Azul".
 * - Claves de UI: `t('price_history_title', 'en')` → "Price History".
 * - Placeholders: `t('about_product', 'es', { productName: 'iPhone 12' })`.
 * - Si la clave no existe, devuelve la clave original (comportamiento
 *   compatible con la versión anterior para ES).
 */
export function t(
  key: string | undefined | null | boolean,
  language: Language | string = "es",
  vars?: Record<string, string | number | undefined | null>
): string {
  if (key === null || key === undefined) return "";
  if (typeof key === "boolean") return key ? (isEnglish(language) ? "Yes" : "Sí") : (isEnglish(language) ? "No" : "No");

  const lang: Language = isEnglish(language) ? "en" : "es";
  const dict = dictionaries[lang];
  const value = dict[key] ?? key;
  return interpolate(value, vars);
}

/** Traduce un valor del español al inglés (para slugs o labels EN). */
export function toEnglish(value: string | undefined | null): string {
  if (!value) return "";
  return ES_TO_EN[value] ?? value;
}