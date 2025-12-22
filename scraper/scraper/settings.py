# Scrapy settings for scraper project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

import os
import sys
import django

# --- CONFIGURACIÓN DEL PUENTE CON DJANGO ---

# 1. Calculamos la ruta a la carpeta raíz del proyecto
# Estamos en: .../mi_proyecto_web/scraper/scraper/settings.py
# Retrocedemos 3 veces para llegar a: .../mi_proyecto_web/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 2. Añadimos la carpeta 'backend' al path de Python para poder importar 'api'
sys.path.append(os.path.join(BASE_DIR, 'backend'))

# 3. Indicamos cuál es el archivo de configuración de Django
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

# --- ¡LA LÍNEA MÁGICA ES ESTA! ---
# Permite usar el ORM de Django dentro del reactor asíncrono de Scrapy
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

# 4. Arrancamos Django (esto carga los modelos en memoria)
django.setup()

# --- FIN DEL PUENTE ---

# ... Debajo sigue la configuración normal de Scrapy ...

# --- LIMPIEZA DE LOGS ---
# CRITICAL: Solo errores fatales
# ERROR: Errores que rompen algo
# WARNING: Advertencias (Aquí saldrán tus avisos de "Panic Middleware")
# INFO: Información general (Ocultamos esto)
# DEBUG: Todo el detalle técnico (Ocultamos esto: redirects, retries, etc.)
# LOG_LEVEL = 'WARNING'

BOT_NAME = "scraper"

SPIDER_MODULES = ["scraper.spiders"]
NEWSPIDER_MODULE = "scraper.spiders"

ADDONS = {}


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = "scraper (+http://www.yourdomain.com)"

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# Concurrency and throttling settings
#CONCURRENT_REQUESTS = 16
CONCURRENT_REQUESTS_PER_DOMAIN = 1
DOWNLOAD_DELAY = 1

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
#DEFAULT_REQUEST_HEADERS = {
#    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
#    "Accept-Language": "en",
#}

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    "scraper.middlewares.ScraperSpiderMiddleware": 543,
#}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#DOWNLOADER_MIDDLEWARES = {
#    "scraper.middlewares.ScraperDownloaderMiddleware": 543,
#}

DOWNLOADER_MIDDLEWARES = {
   # Desactivamos el Retry por defecto de Scrapy para usar el nuestro
   'scrapy.downloadermiddlewares.retry.RetryMiddleware': None,
   
   # Activamos nuestro Middleware de Pánico (con prioridad alta)
   'scraper.middlewares.Panic429Middleware': 550,
   
   # Mantén los de impersonate
   'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810,
}

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
    "scraper.pipelines.DjangoSavePipeline": 300,
}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Set settings whose default value is deprecated to a future-proof value
FEED_EXPORT_ENCODING = "utf-8"
