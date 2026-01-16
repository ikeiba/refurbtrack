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

# --- LIMPIEZA DE LOGS ---
LOG_LEVEL = 'WARNING'

BOT_NAME = "scraper"
SPIDER_MODULES = ["scraper.spiders"]
NEWSPIDER_MODULE = "scraper.spiders"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False  # Back Market no quiere scrapers, así que esto debe ser False

# ============================================================================
# CONFIGURACIÓN CRÍTICA PARA EVITAR 429
# ============================================================================

# 1. CONCURRENCIA: Solo 1 request a la vez
CONCURRENT_REQUESTS = 1
CONCURRENT_REQUESTS_PER_DOMAIN = 1

# 2. DELAYS: Más conservadores
DOWNLOAD_DELAY = 4  # 4 segundos entre requests (ajusta según tus tests)
RANDOMIZE_DOWNLOAD_DELAY = True  # Variará entre 2-6 segundos

# 3. TIMEOUTS generosos
DOWNLOAD_TIMEOUT = 60  # 60 segundos de timeout

# 4. REINTENTOS configurados
RETRY_ENABLED = True
RETRY_TIMES = 5
RETRY_HTTP_CODES = [429, 500, 502, 503, 504, 522, 524, 408, 403]

# 5. COOKIES habilitadas (importante para mantener sesión)
COOKIES_ENABLED = True

# ============================================================================
# MIDDLEWARES
# ============================================================================

DOWNLOADER_MIDDLEWARES = {
    # Desactivar el Retry por defecto de Scrapy
    'scrapy.downloadermiddlewares.retry.RetryMiddleware': None,
    
    # Activar nuestro Middleware de Pánico (prioridad alta)
    'scraper.middlewares.Panic429Middleware': 550,
    
    # Mantener compression
    'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810,
}

# ============================================================================
# PIPELINES
# ============================================================================

ITEM_PIPELINES = {
    # "scraper.pipelines.DjangoSavePipeline": 300,
}

# ============================================================================
# OTRAS CONFIGURACIONES
# ============================================================================

# No usar AutoThrottle (nosotros controlamos manualmente)
AUTOTHROTTLE_ENABLED = False

# Desactivar Telnet Console
TELNETCONSOLE_ENABLED = False

# Cache HTTP desactivado para evitar servir respuestas 429 cacheadas
HTTPCACHE_ENABLED = False

# Encoding
FEED_EXPORT_ENCODING = "utf-8"

# ============================================================================
# CONFIGURACIONES ADICIONALES PARA EVITAR DETECCIÓN
# ============================================================================

# User agent más realista
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

# Headers por defecto más realistas
DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
}

# Respetar prioridad de requests
SCHEDULER_PRIORITY_QUEUE = 'scrapy.pqueues.DownloaderAwarePriorityQueue'

# Logging más limpio
LOG_FORMAT = '%(levelname)s: %(message)s'
LOG_DATEFORMAT = '%Y-%m-%d %H:%M:%S'

# ============================================================================
# NOTAS IMPORTANTES:
# ============================================================================
# 
# 1. DOWNLOAD_DELAY de 4 segundos es conservador. Ajusta según tus tests.
#    - Si ves muchos 429: AUMENTA a 5-6 segundos
#    - Si funciona bien: Puedes bajar gradualmente a 3 segundos
#
# 2. Si sigues viendo 429 frecuentes, considera:
#    - Usar proxies rotativos (Bright Data, Oxylabs, etc.)
#    - Scrappear en horas de menos tráfico (madrugada)
#    - Dividir el scraping en sesiones más cortas
#
# 3. El middleware Panic429Middleware pausará automáticamente el spider
#    cuando detecte 3+ errores 429 consecutivos
#
# ============================================================================
