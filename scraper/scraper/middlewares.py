from scrapy import signals
from itemadapter import ItemAdapter
from scrapy.downloadermiddlewares.retry import RetryMiddleware
from scrapy.utils.response import response_status_message
from scrapy.exceptions import IgnoreRequest
from twisted.internet import reactor, task
import random
import time


class ScraperSpiderMiddleware:
    @classmethod
    def from_crawler(cls, crawler):
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        return None

    def process_spider_output(self, response, result, spider):
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        pass

    async def process_start(self, start):
        async for item_or_request in start:
            yield item_or_request

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)


class ScraperDownloaderMiddleware:
    @classmethod
    def from_crawler(cls, crawler):
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        return None

    def process_response(self, request, response, spider):
        return response

    def process_exception(self, request, exception, spider):
        pass

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)


class Panic429Middleware(RetryMiddleware):
    def __init__(self, settings):
        super().__init__(settings)
        self.backoff_time = 60
        self.max_backoff = 300
        self.last_429_time = 0
        self.consecutive_429 = 0
        self.spider_paused = False
    
    @classmethod
    def from_crawler(cls, crawler):
        middleware = cls(crawler.settings)
        middleware.crawler = crawler
        return middleware
    
    def process_response(self, request, response, spider):
        if response.status == 429:
            current_time = time.time()
            
            # Detectar patrón de 429 consecutivos
            if current_time - self.last_429_time < 10:
                self.consecutive_429 += 1
            else:
                self.consecutive_429 = 1
            
            self.last_429_time = current_time
            
            spider.logger.warning(
                f"🚨 429 #{self.consecutive_429} EN {request.url[:100]}..."
            )
            
            # Si hay muchos 429 seguidos, pausar el spider
            if self.consecutive_429 >= 3 and not self.spider_paused:
                wait_time = min(
                    self.backoff_time * (1.5 ** (self.consecutive_429 - 3)), 
                    self.max_backoff
                )
                spider.logger.error(
                    f"⛔ DEMASIADOS 429 CONSECUTIVOS. Pausando spider {wait_time:.0f}s"
                )
                
                # Pausar el spider usando Twisted (NO time.sleep)
                self._pause_spider(spider, wait_time)
                
                # Reiniciar contador después de muchos 429
                if self.consecutive_429 >= 5:
                    self.consecutive_429 = 0
            
            reason = response_status_message(response.status)
            retry_times = request.meta.get('retry_times', 0)
            
            # Limitar reintentos por request individual
            max_retries = request.meta.get('max_retry_times', self.max_retry_times)
            if retry_times >= max_retries:
                spider.logger.error(
                    f"❌ Abandonando {request.url[:80]}... tras {retry_times} reintentos"
                )
                raise IgnoreRequest(f"Demasiados 429 en {request.url}")
            
            # Generar request de reintento
            retry_request = self._retry(request, reason, spider)
            
            if retry_request:
                # Limpiar cookies y sesión
                retry_request.meta['cookiejar'] = f"{time.time()}_{random.randint(1000, 9999)}"
                retry_request.meta['dont_merge_cookies'] = True
                retry_request.meta['dont_cache'] = True
                
                # Limpiar headers de cookies
                for cookie_header in ['Cookie', 'Set-Cookie']:
                    retry_request.headers.pop(cookie_header, None)
                
                # Headers para nueva conexión
                retry_request.headers['Connection'] = 'close'
                retry_request.headers['Cache-Control'] = 'no-cache'
                
                # Rotar navegador
                browsers = [
                    'chrome110', 'chrome116', 'chrome120', 'chrome123',
                    'edge99', 'edge101', 
                    'safari15_5', 'safari16'
                ]
                current_browser = request.meta.get('impersonate', '')
                available = [b for b in browsers if b != current_browser]
                new_browser = random.choice(available if available else browsers)
                retry_request.meta['impersonate'] = new_browser
                
                # Variar Accept-Language
                retry_request.headers['Accept-Language'] = random.choice([
                    'es-ES,es;q=0.9',
                    'es-ES,es;q=0.9,en;q=0.8',
                    'es-ES,es;q=0.9,en;q=0.8,fr;q=0.7',
                ])
                
                # Agregar delay adicional a este request específico
                retry_request.meta['download_slot'] = f"slot_{random.randint(1, 100)}"
                
                spider.logger.info(
                    f"🔄 Reintento #{retry_times + 1} con {new_browser} "
                    f"(429 consecutivos: {self.consecutive_429})"
                )
                
                return retry_request
            
            # Si no se puede reintentar, marcar como ignorado
            raise IgnoreRequest(f"No se pudo reintentar {request.url}")
        
        # Reset del contador si la respuesta es exitosa
        if response.status == 200 and self.consecutive_429 > 0:
            spider.logger.info(f"✅ Respuesta OK. Reseteando contador 429")
            self.consecutive_429 = 0
        
        return response
    
    def _pause_spider(self, spider, wait_time):
        """Pausa el spider usando Twisted reactor (asíncrono)"""
        if self.spider_paused:
            return
        
        self.spider_paused = True
        
        # Cerrar conexiones existentes
        self._close_all_connections(spider)
        
        # Pausar el spider
        self.crawler.engine.pause()
        spider.logger.warning(f"⏸️  Spider pausado por {wait_time:.0f}s")
        
        # Programar la reanudación usando Twisted
        def resume_spider():
            spider.logger.warning(f"▶️  Reanudando spider...")
            self.spider_paused = False
            self.crawler.engine.unpause()
        
        # Usar callLater de Twisted (NO time.sleep)
        reactor.callLater(wait_time, resume_spider)
    
    def _close_all_connections(self, spider):
        """Cierra todas las conexiones HTTP del pool"""
        try:
            downloader = self.crawler.engine.downloader
            
            # Cerrar todos los handlers
            if hasattr(downloader, 'handlers'):
                handlers = getattr(downloader.handlers, '_handlers', {})
                
                for scheme, handler in handlers.items():
                    if handler and hasattr(handler, '_pool'):
                        try:
                            handler._pool.closeCachedConnections()
                            spider.logger.debug(f"🔌 Pool {scheme} cerrado")
                        except Exception as e:
                            spider.logger.debug(f"Error cerrando pool {scheme}: {e}")
            
            # Limpiar slots activos
            if hasattr(downloader, 'slots'):
                for slot_key, slot in list(downloader.slots.items()):
                    if hasattr(slot, 'active'):
                        slot.active.clear()
                    # Opcional: eliminar el slot completamente
                    # del downloader.slots[slot_key]
                    
            spider.logger.info("🧹 Conexiones limpiadas")
            
        except Exception as e:
            spider.logger.error(f"Error limpiando conexiones: {e}")