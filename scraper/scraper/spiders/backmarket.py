import scrapy
from api.models import Variant
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
        'DOWNLOAD_DELAY': 5,  # Más conservador
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

    def start_requests(self):
        variants = Variant.objects.select_related('product').all()
        self.logger.warning(f"🚀 INICIANDO SCRAPER PARA {variants.count()} PRODUCTOS...")

        # 2. FILTRADO DINÁMICO:
        # Si pasamos el argumento 'product_id' al lanzar el spider, filtramos por él.
        # Scrapy asigna los argumentos -a como atributos de la clase (strings).
        if hasattr(self, 'product_id'):
            self.logger.info(f"🎯 Modo 'Shard': Scrapeando solo Product ID {self.product_id}")
            variants = variants.filter(product__id=self.product_id)

        conditions = [
            {'code': '9', 'label': 0, 'name': 'premium'},
            {'code': '10', 'label': 1, 'name': 'excelente'},
            {'code': '11', 'label': 2, 'name': 'muy bueno'},
            {'code': '12', 'label': 3, 'name': 'correcto'},
        ]
        
        # Más variedad de navegadores
        browsers = [
            'chrome110', 'chrome116', 'chrome120',
            'edge99', 'edge101',
            'safari15_5', 'safari16'
        ]

        for variant in variants:
            base_url = f"https://www.backmarket.es/es-es/p/-/{variant.uuid}"
            
            for cond in conditions:
                # URLs a visitar (Standard y Nueva Batería)
                urls_to_scrape = [(f"{base_url}?l={cond['code']}", False)]
                if cond['label'] in [1, 2, 3]:
                    urls_to_scrape.append((f"{base_url}?l={cond['code']}&offerType=7", True))

                for url, is_new_battery in urls_to_scrape:
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
                        url=url,
                        callback=self.parse,
                        errback=self.errback_handler,
                        headers=headers,
                        dont_filter=False,  # Permitir que Scrapy filtre duplicados
                        meta={
                            'impersonate': "safari15_5",
                            'variant_uuid': variant.uuid,
                            'product_name': variant.product.name,
                            'storage': variant.storage,
                            'color': variant.color,
                            'condition_label': cond['label'],
                            'condition_name': cond['name'],
                            'battery': is_new_battery,
                            'country': 'ES',
                            'max_retry_times': 5,  # Específico para este request
                            # Añadir info para debugging
                            'original_browser': chosen_browser,
                        }
                    )

    def parse(self, response):
        self.contador += 1
        
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

        variant_uuid = response.meta['variant_uuid']
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

            # Si encontramos precio válido, yield del item
            if final_price and final_price > 0:
                batt_label = "🔋 NUEVA" if response.meta['battery'] else "Std"
                
                # Estadísticas
                self.exitosos += 1
                success_rate = (self.exitosos / self.contador * 100) if self.contador > 0 else 0
                
                print(
                    f"[{self.contador}] 💰 {final_price}€ | "
                    f"{response.meta['product_name']} | "
                    f"{response.meta['condition_name']} | {batt_label} | "
                    f"{response.meta['storage']} | {response.meta['color']} | "
                    f"✅ {success_rate:.1f}%"
                )

                yield {
                    'uuid': variant_uuid,
                    'price': final_price,
                    'condition': response.meta['condition_label'],
                    'battery': response.meta['battery'],
                    'country': 'ES',
                    'product_name': response.meta['product_name'],
                    'storage': response.meta['storage'],
                    'color': response.meta['color']
                }
            else:
                # No se encontró precio
                self.logger.warning(
                    f"⚠️ No se encontró precio en {response.url[:80]} | "
                    f"{response.meta['product_name']} | {response.meta['condition_name']}"
                )
                self.errores += 1

        except Exception as e:
            self.logger.error(f"❌ Error parseando {response.url[:80]}: {e}")
            self.errores += 1

    def errback_handler(self, failure):
        """Maneja errores de requests que no llegaron al parse"""
        self.contador += 1
        self.errores += 1
        
        request = failure.request
        
        if failure.check(IgnoreRequest):
            self.logger.warning(
                f"🚫 Request ignorado después de muchos reintentos: "
                f"{request.url[:80]}"
            )
        else:
            self.logger.error(
                f"❌ Error en request: {failure.value} | "
                f"{request.url[:80]}"
            )

    def closed(self, reason):
        """Se ejecuta cuando el spider termina"""
        self.logger.warning("=" * 60)
        self.logger.warning(f"🏁 SPIDER FINALIZADO: {reason}")
        self.logger.warning(f"📊 Total procesados: {self.contador}")
        self.logger.warning(f"✅ Exitosos: {self.exitosos}")
        self.logger.warning(f"❌ Errores: {self.errores}")
        if self.contador > 0:
            success_rate = (self.exitosos / self.contador * 100)
            self.logger.warning(f"📈 Tasa de éxito: {success_rate:.2f}%")
        self.logger.warning("=" * 60)