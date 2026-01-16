import os
import sys
import django
import subprocess
import time

# --- CORRECCIÓN DE RUTAS ---
# 1. Obtenemos la ruta donde está este archivo (launcher.py)
# Ejemplo: .../proyecto_scraper/scraper/
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Subimos un nivel para llegar a la raíz del proyecto
# Ejemplo: .../proyecto_scraper/
project_root = os.path.dirname(current_dir)

# 3. Añadimos la carpeta 'backend' al path de Python
# Ahora Python buscará en .../proyecto_scraper/backend/
sys.path.append(os.path.join(project_root, 'backend'))

# 4. Configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

try:
    django.setup()
except ModuleNotFoundError as e:
    print(f"❌ Error de importación: {e}")
    print(f"ℹ️  Python está buscando en: {sys.path}")
    sys.exit(1)
    
# ... resto del import de modelos y función run_spiders_concurrently ...
from api.models import Product, Variant # OJO: Asegúrate de importar el modelo correcto
# (Si usas Product o Variant depende de tu modelo, ajusta según necesites)

def run_spiders_concurrently():
    while True:
        # Obtenemos todos los IDs de productos que queremos scrapear
        product_ids = Product.objects.values_list('id', flat=True)
        
        processes = []
        MAX_CONCURRENT_PROCESSES = 12  # ¡CUIDADO AQUÍ! Lee la advertencia abajo.

        print(f"📦 Se encontraron {len(product_ids)} productos para procesar.")

        for pid in product_ids:
            # Comando: scrapy crawl backmarket -a product_id=123
            cmd = [
                'scrapy', 'crawl', 'backmarket',
                '-a', f'product_id={pid}'
            ]
            
            print(f"🚀 Lanzando spider para producto {pid}...")
            
            # Lanzamos el proceso de forma independiente (no bloqueante)
            p = subprocess.Popen(cmd)
            processes.append(p)

            # Control de concurrencia simple
            if len(processes) >= MAX_CONCURRENT_PROCESSES:
                print("⏳ Esperando a que se libere un slot de proceso...")
                # Esperamos a que termine al menos uno
                processes[0].wait()
                processes.pop(0)
            
            # Pequeña pausa para no saturar el inicio
            time.sleep(2)

        # Esperar a que terminen los restantes
        for p in processes:
            p.wait()

        print("✅ Todos los procesos han terminado.")

        time.sleep(45 * 60)  # Esperar 45 minutos antes de la siguiente ronda

if __name__ == '__main__':
    run_spiders_concurrently()