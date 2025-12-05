import scrapy
from api.models import Variant
import json
import random

class BackMarketSpider(scrapy.Spider):
    name = "backmarket"
    
    custom_settings = {
        'TWISTED_REACTOR': 'twisted.internet.asyncioreactor.AsyncioSelectorReactor',
        'DOWNLOAD_HANDLERS': {
            'http': 'scrapy_impersonate.ImpersonateDownloadHandler',
            'https': 'scrapy_impersonate.ImpersonateDownloadHandler',
        },
        'ROBOTSTXT_OBEY': False,
        'COOKIES_ENABLED': True,
        
        # VELOCIDAD CONSTANTE (Sin AutoThrottle, nosotros mandamos)
        'CONCURRENT_REQUESTS': 1,      # VITAL: Solo 1 a la vez
        'DOWNLOAD_DELAY': 5,           # Espera normal entre peticiones sanas
        'RANDOMIZE_DOWNLOAD_DELAY': True,

        # Nuestro middleware se encargará de los reintentos y esperas largas
        'RETRY_ENABLED': True, 
        'RETRY_TIMES': 5,
    }

    def start_requests(self):
        variants = Variant.objects.select_related('product').all()
        # Usamos logger.warning para verlo en consola limpia
        self.logger.warning(f"🚀 INICIANDO SCRAPER INTELIGENTE PARA {variants.count()} PRODUCTOS...")

        conditions = [
            {'code': '10', 'label': 1, 'name': 'Correcto'},
            {'code': '11', 'label': 2, 'name': 'Muy bueno'},
            {'code': '12', 'label': 3, 'name': 'Excelente'},
        ]
        
        # Lista de navegadores para rotar si fallamos
        browsers = ['chrome110', 'edge99', 'safari15_5']

        for variant in variants:
            base_url = f"https://www.backmarket.es/es-es/p/-/{variant.uuid}"
            
            for cond in conditions:
                # Elegimos navegador aleatorio CADA VEZ
                chosen_browser = random.choice(browsers)

                # URLs a visitar (Standard y Nueva Batería)
                urls_to_scrape = [(f"{base_url}?l={cond['code']}", False)]
                if cond['label'] in [2, 3]:
                    urls_to_scrape.append((f"{base_url}?l={cond['code']}&offerType=7", True))

                headers = {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'es-ES,es;q=0.9',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15',
                    'Upgrade-Insecure-Requests': '1',
                }

                for url, is_new_battery in urls_to_scrape:
                    yield scrapy.Request(
                        url=url,
                        callback=self.parse,
                        headers=headers,
                        # IMPORTANTE: No le ponemos 'dont_filter=True' para que si falla y reintenta,
                        # Scrapy sepa gestionarlo.
                        meta={
                            'impersonate': 'safari15_5',  # Por defecto, pero se puede cambiar
                            'variant_uuid': variant.uuid,
                            'product_name': variant.product.name,
                            'storage': variant.storage,
                            'color': variant.color,
                            'condition_label': cond['label'],
                            'condition_name': cond['name'],
                            'battery': is_new_battery,
                            'country': 'ES',
                        }
                    )

    def parse(self, response):
        # Si llegamos aquí, NO estamos bloqueados (si fuera 429, lo habría cogido el RetryMiddleware)
        
        # Check extra por si nos mandan al challenge con código 200
        if "testchallengepage" in response.url:
            self.logger.warning(f"⛔ CHALLENGE DETECTADO ({response.meta['browser_used']}). Reintentando...")
            # Aquí podríamos forzar un reintento manual, pero dejemos que AutoThrottle ajuste
            return

        variant_uuid = response.meta['variant_uuid']
        final_price = None

        try:
            # 1. JSON-LD
            ld_json_str = response.xpath('//script[@type="application/ld+json"]/text()').get()
            if ld_json_str:
                try:
                    data = json.loads(ld_json_str)
                    if isinstance(data, list):
                        for item in data:
                            if item.get('@type') == 'Product':
                                offers = item.get('offers', {})
                                if isinstance(offers, list):
                                    final_price = float(offers[0].get('price'))
                                else:
                                    final_price = float(offers.get('price'))
                                break
                    elif data.get('@type') == 'Product':
                        offers = data.get('offers', {})
                        if isinstance(offers, list):
                             final_price = float(offers[0].get('price'))
                        else:
                             final_price = float(offers.get('price'))
                except Exception:
                    pass

            # 2. CSS
            if final_price is None:
                price_text = response.css('[data-test="productpage-product-price"]::text').get()
                if not price_text:
                    price_text = response.css('[data-test="product-price"]::text').get()
                
                if price_text:
                    clean_price = price_text.replace("€", "").replace(".", "").replace(",", ".").replace("\xa0", "").strip()
                    final_price = float(clean_price)

            if final_price:
                batt_label = "🔋 NUEVA" if response.meta['battery'] else "Std"
                # Usamos logger.warning para verlo en consola
                print(f"💰 {final_price}€ | {response.meta['product_name']} | {response.meta['condition_name']} | {batt_label}")
                
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

        except Exception as e:
            self.logger.error(f"❌ Error: {e}")