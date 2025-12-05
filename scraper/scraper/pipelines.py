from api.models import Variant, PriceHistory
from django.db import transaction

class DjangoSavePipeline:
    def process_item(self, item, spider):
        try:
            # OPTIMIZACIÓN: No buscamos por nombre de producto (que puede fallar).
            # Buscamos directamente la variante por su UUID, que es único.
            variant = Variant.objects.get(uuid=item['uuid'])

            # Guardamos el PRECIO directamente vinculado a esa variante
            PriceHistory.objects.create(
                variant=variant,
                price=item['price'],
                condition=item['condition'],
                battery=item['battery'],
                country=item['country']
            )
            
            # (El print ya lo haces en el spider, aquí no hace falta ensuciar)
            
        except Variant.DoesNotExist:
            print(f"❌ Error: La variante {item['uuid']} no existe en la DB local.")
        except Exception as e:
            print(f"❌ Error guardando historial: {e}")

        return item