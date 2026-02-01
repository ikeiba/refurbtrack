from api.models import Variant, PriceHistory
from django.db import transaction
# scraper/scraper/pipelines.py

# ... tus imports ...
from api.models import Product, Spec, Offer, PriceHistory
from api.services import check_alerts_for_product # <--- IMPORTAR TU NUEVO SERVICIO

class PostgresPipeline:
    def process_item(self, item, spider):
        try:
            # 1. Guardar/Actualizar Producto
            product, created = Product.objects.get_or_create(
                name=item['product_name'],
                defaults={'type': 'Smartphone'} 
            )
            
            # ... (Toda tu lógica de Spec, Offer y PriceHistory sigue igual) ...
            
            # --- AL FINAL DEL MÉTODO, DENTRO DEL TRY ---
            
            # Una vez que hemos actualizado todas las ofertas de este producto,
            # lanzamos el comprobador de alertas.
            # Lo hacemos sync aquí, pero en producción idealmente sería una tarea background (Celery)
            check_alerts_for_product(product)

            return item

        except Exception as e:
            print(f"Error processing item: {e}")