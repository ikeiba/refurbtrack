"""Detección de tráfico no humano para la telemetría de clics.

Evita que bots, crawlers y scripts contaminen los ClickEvent. La URL
/api/out/<uuid>/ es un GET público que cualquier agente puede pedir; aquí
decidimos si un request merece contarse como clic real.
"""
from urllib.parse import urlparse

# Dominios que consideramos "nuestro sitio": un clic con referer desde aquí
# es un clic web real. Se permiten subdominios.
OWN_HOSTS = {
    "refurbtrack.com",
    "localhost",
    "127.0.0.1",
}

# Señales inequívocas de bot/crawler/script en el User-Agent.
BOT_SIGNALS = (
    "bot", "crawl", "spider", "slurp", "scrape", "crawler",
    "python", "python-requests", "urllib", "requests", "aiohttp", "httpx",
    "curl", "wget", "libwww", "httpclient", "java/",
    "headless", "phantomjs", "selenium", "puppeteer", "playwright",
    "googlebot", "bingbot", "msnbot", "duckduckbot", "baiduspider",
    "yandex", "sogou", "exabot", "facebot", "facebookexternalhit",
    "facebookcatalog", "meta-externalagent", "meta-webindexer",
    "twitterbot", "whatsapp", "telegrambot", "slackbot", "discordbot",
    "linkedinbot", "pinterest", "applebot", "ia_archiver", "ahrefs",
    "semrush", "serpstat", "majestic", "mj12bot", "dotbot", "petalbot",
    "gptbot", "claudebot", "anthropic", "chatgpt", "ccbot", "bytespider",
    "imagesiftbot", "google-inspection", "googlefavicon", "jscrawler",
    "preview", "uptime", "pingdom", "monitis", "monitor", "checker",
    "validator", "feedfetcher", "feedburner", "postman", "insomnia",
)


def is_bot_user_agent(user_agent):
    """Devuelve True si el User-Agent es claramente no humano."""
    if not user_agent:
        return True
    ua = user_agent.lower()
    return any(sig in ua for sig in BOT_SIGNALS)


def referer_host(referer):
    """Extrae el host de un Referer, o '' si no es válido."""
    try:
        return (urlparse(referer).hostname or "").lower()
    except ValueError:
        return ""


def is_own_referer(referer):
    host = referer_host(referer)
    if not host:
        return False
    if host in OWN_HOSTS:
        return True
    return host.endswith(".refurbtrack.com")


def should_track_click(request):
    """Decide si un request a /api/out/<uuid>/ cuenta como clic real.

    Reglas:
      1. User-Agent de bot/script  -> NO.
      2. `?src=email` presente      -> SÍ (clic desde email).
      3. Referer de nuestro dominio -> SÍ (clic desde la web).
      4. Sin referer y sin src      -> NO (golpe directo de bot/script).
    """
    user_agent = request.META.get("HTTP_USER_AGENT", "") or ""
    referer = request.META.get("HTTP_REFERER", "") or ""
    src = request.GET.get("src", "")

    if is_bot_user_agent(user_agent):
        return False
    if src == "email":
        return True
    if is_own_referer(referer):
        return True
    return False
