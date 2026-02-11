# backend/api/tasks.py

import subprocess
import time
import os
from celery import shared_task
from django.conf import settings
from api.models import Product

@shared_task
def run_spiders_manager():
    """
    Orquestador de Spiders:
    Lanza spiders individuales por producto controlando la concurrencia.
    """
    
    # 1. Obtenemos IDs (Ya estamos en Django, es directo)
    product_ids = list(Product.objects.values_list('id', flat=True))
    
    if not product_ids:
        print("📭 No hay productos para scrapear.")
        return "No products"

    print(f"📦 Celery: Iniciando scraping para {len(product_ids)} productos...")

    processes = []
    MAX_CONCURRENT_PROCESSES = 2  # Tu límite de seguridad
    
    # IMPORTANTE: Ruta donde vive el scrapy.cfg dentro del futuro Docker
    # Asumiremos que en Docker el proyecto estará en /app/scraper
    SCRAPER_DIR = os.path.join(settings.BASE_DIR.parent, 'scraper')

    for pid in product_ids:
        # Comando para lanzar UN spider
        cmd = [
            'scrapy', 'crawl', 'backmarket',
            '-a', f'product_id={pid}'
        ]
        
        print(f"🚀 Celery: Lanzando spider producto {pid}...")
        
        # Ejecutamos el subproceso
        # cwd=SCRAPER_DIR es vital para que encuentre scrapy.cfg
        p = subprocess.Popen(cmd, cwd=SCRAPER_DIR)
        processes.append(p)

        # Tu lógica de semáforo (Control de concurrencia)
        if len(processes) >= MAX_CONCURRENT_PROCESSES:
            print("⏳ Celery: Slot lleno, esperando liberación...")
            # Esperamos a que termine el primero de la cola
            processes[0].wait()
            processes.pop(0)
        
        # Pequeña pausa para no saturar arranque
        time.sleep(2)

    # Esperar a los rezagados finales
    for p in processes:
        p.wait()

    return f"✅ Scraping finalizado para {len(product_ids)} productos"