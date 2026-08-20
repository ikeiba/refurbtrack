# backend/api/tasks.py

import subprocess
import time
import os
from celery import shared_task
from django.conf import settings
from api.models import Product, Market

@shared_task
def run_spiders_manager():
    """
    Orquestador de Spiders:
    Lanza spiders individuales por (producto, mercado) controlando la concurrencia.

    REGLA ESTRICTA DE RATE LIMITING:
    El firewall de Back Market es global por IP (no por dominio). Por tanto, los
    mercados (ES, UK) se iteran SIEMPRE de forma SECUENCIAL: se lanza un mercado,
    se espera a que terminen todos sus spiders y se aplica un cooldown antes de
    lanzar el siguiente. NUNCA se lanzan ES y UK en paralelo (ni con un `group` de
    Celery ni con subprocesos simultáneos), para no duplicar la tasa de peticiones.
    """
    
    # 1. Obtenemos IDs de productos (Ya estamos en Django, es directo)
    product_ids = list(Product.objects.values_list('id', flat=True))
    
    if not product_ids:
        print("📭 No hay productos para scrapear.")
        return "No products"

    # 2. Mercados activos (orden canónico: ES antes que UK)
    active_codes = getattr(settings, 'ACTIVE_MARKETS', ['ES'])
    markets = list(Market.objects.filter(code__in=active_codes).order_by('id'))
    if not markets:
        print(f"⚠️ No se encontraron mercados activos para {active_codes}. Saliendo.")
        return "No markets"

    print(f"📦 Celery: Iniciando scraping para {len(product_ids)} productos "
          f"en {len(markets)} mercados ({', '.join(m.code for m in markets)})...")

    # IMPORTANTE: Ruta donde vive el scrapy.cfg dentro del futuro Docker
    # Asumiremos que en Docker el proyecto estará en /app/scraper
    SCRAPER_DIR = os.path.join(settings.BASE_DIR.parent, 'scraper')

    MAX_CONCURRENT_PROCESSES = 2  # Concurrencia DENTRO de un mismo mercado
    COOLDOWN_BETWEEN_MARKETS = 30  # Segundos de descanso antes de cambiar de mercado

    # --- ITERACIÓN SECUENCIAL POR MERCADO (regla de rate limiting) ---
    for idx, market in enumerate(markets):
        print(f"🌍 Celery: Procesando mercado {market.code} "
              f"({market.currency}, {market.domain})...")

        processes = []

        for pid in product_ids:
            # Comando para lanzar UN spider (producto + mercado)
            cmd = [
                'scrapy', 'crawl', 'backmarket',
                '-a', f'product_id={pid}',
                '-a', f'market={market.code}',
            ]

            print(f"🚀 Celery: Lanzando spider producto {pid} @ {market.code}...")

            # Ejecutamos el subproceso
            # cwd=SCRAPER_DIR es vital para que encuentre scrapy.cfg
            p = subprocess.Popen(cmd, cwd=SCRAPER_DIR)
            processes.append(p)

            # Semáforo de concurrencia DENTRO del mercado actual
            if len(processes) >= MAX_CONCURRENT_PROCESSES:
                print("⏳ Celery: Slot lleno, esperando liberación...")
                processes[0].wait()
                processes.pop(0)

            # Pequeña pausa para no saturar arranque
            time.sleep(2)

        # Esperar a los rezagados finales del mercado actual
        for p in processes:
            p.wait()

        print(f"✅ Celery: Mercado {market.code} completado.")

        # Cooldown antes de pasar al siguiente mercado (salvo el último).
        # Garantiza que no queden peticiones residuales del mercado anterior
        # solapándose con el siguiente.
        if idx < len(markets) - 1:
            print(f"⏳ Celery: Cooldown de {COOLDOWN_BETWEEN_MARKETS}s antes del "
                  f"siguiente mercado (regla de rate limiting)...")
            time.sleep(COOLDOWN_BETWEEN_MARKETS)

    return f"✅ Scraping finalizado para {len(product_ids)} productos en {len(markets)} mercados"
