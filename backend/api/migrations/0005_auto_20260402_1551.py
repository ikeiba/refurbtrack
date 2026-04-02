from django.db import migrations
import uuid

def generate_uuids(apps, schema_editor):
    # Obtenemos el modelo histórico de la tabla Offer
    Offer = apps.get_model('api', 'Offer') 
    
    # Recorremos todas las ofertas y les asignamos un UUID único real
    for offer in Offer.objects.all():
        offer.uuid = uuid.uuid4()
        offer.save(update_fields=['uuid'])

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_clickevent_offer_uuid_and_more'),
    ]

    operations = [
        # Ejecutamos nuestra función personalizada
        migrations.RunPython(generate_uuids, reverse_code=migrations.RunPython.noop),
    ]