from decimal import Decimal
from time import time
from datetime import datetime, timedelta
import scrapy
from api.models import Spec, Offer, PriceHistory # Importamos los nuevos modelos
import json
import random
from scrapy.exceptions import IgnoreRequest

class BackMarketSpider(scrapy.Spider):
    name = "backmarket"

    def __init__(self, *args, **kwargs):
        super(BackMarketSpider, self).__init__(*args, **kwargs)
        self.contador = 0
        self.errores = 0
        self.exitosos = 0
        self.start_time = None

    # Mapeo: Texto de la DB -> Código URL de BackMarket
    CONDITION_MAP = {
        'Premium': '9',
        'Excellent': '10',
        'Good': '11',
        'Fair': '12',
    }

    custom_settings = {
        'TWISTED_REACTOR': 'twisted.internet.asyncioreactor.AsyncioSelectorReactor',
        'DOWNLOAD_HANDLERS': {
            'http': 'scrapy_impersonate.ImpersonateDownloadHandler',
            'https': 'scrapy_impersonate.ImpersonateDownloadHandler',
        },
        'ROBOTSTXT_OBEY': False,
        'COOKIES_ENABLED': True,
        
        # VELOCIDAD CONSTANTE
        'CONCURRENT_REQUESTS': 1,
        'DOWNLOAD_DELAY': 7.5,  # Más conservador
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        
        # Configuración de reintentos
        'RETRY_ENABLED': True, 
        'RETRY_TIMES': 5,
        'RETRY_HTTP_CODES': [429, 500, 502, 503, 504, 522, 524, 408, 403],
        
        # Timeouts más generosos
        'DOWNLOAD_TIMEOUT': 60,
        
        # Desactivar el log de duplicados (ya que el middleware puede reintentar)
        'DUPEFILTER_DEBUG': False,
    }

    async def start(self):
        # Registrar tiempo de inicio
        self.start_time = time()
        self.logger.warning(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        # 1. Obtener las Specs (antiguas Variants)
        # Usamos select_related para traer el producto y evitar consultas extra
        specs = Spec.objects.select_related('product')

        # 2. FILTRADO DINÁMICO:
        # Si pasamos el argumento 'product_id' al lanzar el spider, filtramos por él.
        # Scrapy asigna los argumentos -a como atributos de la clase (strings).
        if hasattr(self, 'product_id'):
            self.logger.info(f"🎯 Modo 'Shard': ID {self.product_id}")
            specs = specs.filter(product__id=self.product_id)

        # 3. Filtrar UUIDs inválidos
        specs = specs.exclude(back_market_uuid="-").exclude(back_market_uuid="")

        # Pre-cargar las ofertas para no hacer 1 consulta por cada loop
        # Esto es optimización Django pura
        specs = specs.prefetch_related('offers')
        
        self.logger.warning(f"🚀 INICIANDO SCRAPER PARA {specs.count()} PRODUCTOS...")
        
        # Más variedad de navegadores
        browsers = [
            'chrome110', 'chrome116', 'chrome120',
            'edge99', 'edge101',
            'safari15_5', 'safari16'
        ]

        for spec in specs:
            base_url = f"https://www.backmarket.es/es-es/p/-/{spec.back_market_uuid}"
            
            # Iteramos sobre las OFERTAS VACÍAS que ya creamos en la DB
            for offer in spec.offers.all():
                # URLs a visitar (Standard y Nueva Batería)

                # A. Obtenemos el código de condición (ej: 'Fair' -> '12')
                cond_code = self.CONDITION_MAP.get(offer.condition)
                if not cond_code:
                    continue # Si hay algún estado raro, lo saltamos


                # B. Construimos la URL exacta para esa oferta
                # URL Base + Condición
                final_url = f"{base_url}?l={cond_code}"
                
                # Si es batería nueva, añadimos el parámetro
                if offer.battery_new:
                    final_url += "&offerType=7"

                
                # Elegir navegador aleatorio para cada request
                chosen_browser = random.choice(browsers)
                    
                # Headers más realistas
                headers = {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'es-ES,es;q=0.9',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15',
                    'Upgrade-Insecure-Requests': '1',
                }

                yield scrapy.Request(
                    url=final_url,
                    callback=self.parse,
                    errback=self.errback_handler,
                    headers=headers,
                    dont_filter=False,  # Permitir que Scrapy filtre duplicados
                    meta={
                        'impersonate': "safari15_5",
                        'offer_id': offer.id,      # <--- LA CLAVE DEL NUEVO SISTEMA
                        'spec_str': str(spec),     # Solo para logs
                        'max_retry_times': 5,
                        'original_browser': chosen_browser,
                    }
                )

    def parse(self, response):
        self.contador += 1
        offer_id = response.meta.get('offer_id')

        # 1. RECUPERAR DATOS DE LA DB (Vital para el nuevo esquema)
        # Traemos el Offer y sus padres (Spec y Product) para tener datos para los logs
        try:
            offer = Offer.objects.select_related('spec', 'spec__product').get(id=offer_id)
        except Offer.DoesNotExist:
            self.logger.error(f"❌ Oferta ID {offer_id} no encontrada en DB (posiblemente borrada durante el scrape).")
            self.errores += 1
            return None
        
        # Verificar si nos redirigieron a un challenge
        if "testchallengepage" in response.url or "challenge" in response.url.lower():
            self.logger.warning(f"⛔ CHALLENGE DETECTADO en {response.url[:80]}")
            self.errores += 1
            # Retornar None para que el middleware lo maneje
            return None

        # Verificar si la página está vacía o es sospechosa
        if len(response.text) < 500:
            self.logger.warning(f"⚠️ Respuesta sospechosamente corta ({len(response.text)} bytes)")
            self.errores += 1
            return None
        
        # C. VALIDACIÓN 'l=': Verificar que no nos han redirigido a otra condición
        # Mapeo inverso: DB Condition -> BackMarket Code
        # (Asegúrate de que esto coincide con lo que definimos en start_requests)
        condition_code_map = {
            'Fair': '12',
            'Good': '11',
            'Excellent': '10',
            'Premium': '9'
        }
        expected_l = condition_code_map.get(offer.condition)
        
        if 'l=' in response.url and expected_l:
            try:
                actual_l = response.url.split('l=')[1].split('&')[0]
                if actual_l != expected_l:
                    self.logger.warning(
                        f"⚠️ Redirección de condición detectada. "
                        f"Esperado l={expected_l} ({offer.condition}), obtenido l={actual_l} | "
                        f"{offer.spec.product.name}"
                    )
                    self.errores += 1
                    return None
            except IndexError:
                pass # Si la URL es rara, lo dejamos pasar

        final_price = None

        try:
            # 1. Intentar JSON-LD
            ld_json_str = response.xpath('//script[@type="application/ld+json"]/text()').get()
            if ld_json_str:
                try:
                    data = json.loads(ld_json_str)
                    if isinstance(data, list):
                        for item in data:
                            if item.get('@type') == 'Product':
                                offers = item.get('offers', {})
                                if isinstance(offers, list) and offers:
                                    final_price = float(offers[0].get('price', 0))
                                elif isinstance(offers, dict):
                                    final_price = float(offers.get('price', 0))
                                break
                    elif data.get('@type') == 'Product':
                        offers = data.get('offers', {})
                        if isinstance(offers, list) and offers:
                            final_price = float(offers[0].get('price', 0))
                        elif isinstance(offers, dict):
                            final_price = float(offers.get('price', 0))
                except (json.JSONDecodeError, ValueError, TypeError, KeyError) as e:
                    self.logger.debug(f"Error parseando JSON-LD: {e}")

            # 2. Fallback a CSS selectors
            if final_price is None or final_price == 0:
                price_text = response.css('[data-test="productpage-product-price"]::text').get()
                if not price_text:
                    price_text = response.css('[data-test="product-price"]::text').get()
                
                if price_text:
                    try:
                        clean_price = (price_text
                            .replace("€", "")
                            .replace(".", "")
                            .replace(",", ".")
                            .replace("\xa0", "")
                            .replace(" ", "")
                            .strip())
                        final_price = float(clean_price)
                    except ValueError as e:
                        self.logger.error(f"Error parseando precio '{price_text}': {e}")

            # --- RESULTADO Y GUARDADO ---
            # Variables para log (extraídas del objeto offer)
            batt_label = "🔋 NUEVA" if offer.battery_new else "Std"
            cond_name = offer.get_condition_display() # Ej: "Correcto" en vez de "Fair"
            
            # Calcular tasa de éxito
            success_rate = (self.exitosos / self.contador * 100) if self.contador > 0 else 0
            
            # Si encontramos precio válido, yield del item
            if final_price and final_price > 0:
                
                # Estadísticas
                self.exitosos += 1
                success_rate = (self.exitosos / self.contador * 100)
                
                # LOG DE ÉXITO (Formato idéntico al tuyo)
                print(
                    f"[{self.contador}] 💰 {final_price}€ | "
                    f"{offer.spec.product.name} | "
                    f"{cond_name} | {batt_label} | "
                    f"{offer.spec.storage} | {offer.spec.color} | "
                    f"✅ {success_rate:.1f}%"
                )

                # GUARDADO EN DB (¡Aquí ocurre la magia!)
                # Esto inserta el precio y dispara signals.py para actualizar Offer, Spec y Product
                PriceHistory.objects.create(
                    offer=offer,
                    price=Decimal(str(final_price))
                )

            else:
                # LOG DE FALLO (Sin precio)
                self.logger.warning(
                    f"⚠️ No se encontró precio en {response.url[:95]} | "
                    f"[{self.contador}] -- € | "
                    f"{offer.spec.product.name} | "
                    f"{cond_name} | {batt_label} | "
                    f"{offer.spec.storage} | {offer.spec.color} | "
                    f"❌ {success_rate:.1f}%"
                )
                self.errores += 1

        except Exception as e:
            self.logger.error(f"❌ Error parseando {response.url[:95]}: {e}")
            self.errores += 1

    def errback_handler(self, failure):
        """Maneja errores de requests que no llegaron al parse"""
        self.contador += 1
        self.errores += 1
        
        request = failure.request
        
        if failure.check(IgnoreRequest):
            self.logger.warning(
                f"🚫 Request ignorado después de muchos reintentos: "
                f"{request.url[:95]}"
            )
        else:
            self.logger.error(
                f"❌ Error en request: {failure.value} | "
                f"{request.url[:95]}"
            )

    def closed(self, reason):
        """Se ejecuta cuando el spider termina"""
        # Calcular tiempo total
        if self.start_time:
            total_time = time() - self.start_time
            hours, remainder = divmod(total_time, 3600)
            minutes, seconds = divmod(remainder, 60)
            time_str = f"{int(hours)}h {int(minutes)}m {int(seconds)}s"
        else:
            time_str = "N/A"
        
        self.logger.warning("=" * 60)
        self.logger.warning(f"🏁 SPIDER FINALIZADO: {reason}")
        self.logger.warning(f"⏰ Fin: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        self.logger.warning(f"⏱️  Tiempo total: {time_str}")
        self.logger.warning(f"📊 Total procesados: {self.contador}")
        self.logger.warning(f"✅ Exitosos: {self.exitosos}")
        self.logger.warning(f"❌ Errores: {self.errores}")
        if self.contador > 0:
            success_rate = (self.exitosos / self.contador * 100)
            self.logger.warning(f"📈 Tasa de éxito: {success_rate:.2f}%")
            avg_time_per_request = total_time / self.contador if self.start_time else 0
            self.logger.warning(f"⚡ Tiempo promedio por request: {avg_time_per_request:.2f}s")
        self.logger.warning("=" * 60)