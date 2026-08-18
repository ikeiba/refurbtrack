'''
import os
import sys
import django
import subprocess
import time

# --- CONFIGURACIÓN DE RUTAS ---
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.append(os.path.join(project_root, 'backend'))

# Configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

try:
    django.setup()
except ModuleNotFoundError as e:
    print(f"❌ Error de importación: {e}")
    sys.exit(1)

# --- IMPORTACIÓN DE MODELOS NUEVOS ---
from api.models import Product, Market  # Product para los IDs, Market para los mercados

def run_spiders_concurrently():

    # Obtenemos todos los IDs de productos que queremos scrapear
    # Se asume que existen productos en la DB (creados con el script anterior)
    product_ids = Product.objects.values_list('id', flat=True)

    # Mercados activos (ES, UK). Se iteran de forma SECUENCIAL por la regla de
    # rate limiting (el firewall de Back Market es global por IP).
    markets = list(Market.objects.filter(code__in=['ES', 'UK']).order_by('id'))

    processes = []
    MAX_CONCURRENT_PROCESSES = 12  # Bajado un poco por seguridad al principio
    COOLDOWN_BETWEEN_MARKETS = 30

    print(f"📦 Se encontraron {len(product_ids)} productos para procesar.")

    for idx, market in enumerate(markets):
        print(f"🌍 Procesando mercado {market.code} ({market.currency})...")

        for pid in product_ids:
            # El comando pasa ahora el mercado además del producto
            cmd = [
                'scrapy', 'crawl', 'backmarket',
                '-a', f'product_id={pid}',
                '-a', f'market={market.code}',
            ]

            print(f"🚀 Lanzando spider para producto ID {pid} @ {market.code}...")

            p = subprocess.Popen(cmd)
            processes.append(p)

            # Control de concurrencia
            if len(processes) >= MAX_CONCURRENT_PROCESSES:
                print("⏳ Esperando a que se libere un slot...")
                processes[0].wait()
                processes.pop(0)

            time.sleep(2)  # Pausa entre lanzamientos

        # Esperar a que terminen los restantes de este mercado
        for p in processes:
            p.wait()
        processes = []

        if idx < len(markets) - 1:
            print(f"⏳ Cooldown de {COOLDOWN_BETWEEN_MARKETS}s antes del siguiente mercado...")
            time.sleep(COOLDOWN_BETWEEN_MARKETS)

    print("✅ Ronda completada. Durmiendo 45 minutos...")


if __name__ == '__main__':
    run_spiders_concurrently()
'''
