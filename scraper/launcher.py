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
from api.models import Product  # Solo necesitamos Product para obtener los IDs

def run_spiders_concurrently():
    while True:
        # Obtenemos todos los IDs de productos que queremos scrapear
        # Se asume que existen productos en la DB (creados con el script anterior)
        product_ids = Product.objects.values_list('id', flat=True)
        
        processes = []
        MAX_CONCURRENT_PROCESSES = 12  # Bajado un poco por seguridad al principio

        print(f"📦 Se encontraron {len(product_ids)} productos para procesar.")

        for pid in product_ids:
            # El comando sigue siendo igual, pasamos el ID del producto
            cmd = [
                'scrapy', 'crawl', 'backmarket',
                '-a', f'product_id={pid}'
            ]
            
            print(f"🚀 Lanzando spider para producto ID {pid}...")
            
            p = subprocess.Popen(cmd)
            processes.append(p)

            # Control de concurrencia
            if len(processes) >= MAX_CONCURRENT_PROCESSES:
                print("⏳ Esperando a que se libere un slot...")
                processes[0].wait()
                processes.pop(0)
            
            time.sleep(2) # Pausa entre lanzamientos

        # Esperar a que terminen los restantes
        for p in processes:
            p.wait()

        print("✅ Ronda completada. Durmiendo 45 minutos...")
        time.sleep(45 * 60)

if __name__ == '__main__':
    run_spiders_concurrently()