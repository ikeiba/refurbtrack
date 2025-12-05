from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import PriceHistory, Alert

@receiver(post_save, sender=PriceHistory)
def check_alerts(sender, instance, created, **kwargs):
    """
    Se ejecuta AUTOMÁTICAMENTE cada vez que se crea un PriceHistory.
    instance = el objeto PriceHistory que se acaba de guardar.
    """
    if not created:
        return # Solo nos interesa si es un precio NUEVO, no si editamos uno viejo.

    # 1. Recuperamos datos clave del nuevo precio
    variant = instance.variant
    product = variant.product
    new_price = instance.price
    
    print(f"--- NUEVO PRECIO DETECTADO: {product.name} a {new_price}€ ---")

    # 2. Buscamos alertas POTENCIALES (mismo producto y el precio cumple)
    # Buscamos alertas donde el usuario pide un precio MAYOR o IGUAL al que hemos encontrado
    # (Ej: Alerta < 500€. Precio encontrado = 450€. ¡Coincide!)
    possible_alerts = Alert.objects.filter(
        product=product, 
        price_threshold__gte=new_price,
        notified=False # Para no spamear si ya le avisamos
    )

    # 3. Refinamos (Filtros específicos: Color, Almacenamiento, Estado)
    for alert in possible_alerts:
        match = True
        
        # Si la alerta especifica color, y la variante NO es de ese color... descartar
        if alert.color and alert.color.lower() != variant.color.lower():
            match = False
        
        # Si la alerta especifica almacenamiento...
        if alert.storage and alert.storage != variant.storage:
            match = False
            
        # Si la alerta especifica condición (Ej: Excellent) y el precio es de Fair...
        if alert.condition and alert.condition != instance.condition:
            match = False

        # 4. Si pasa todos los filtros, ¡ENVIAR EMAIL!
        if match:
            print(f"✅ ¡ALERTA ENCONTRADA! Enviando correo a {alert.subscriber.email}")
            
            subject = f"¡Bajada de precio! {product.name} está a {new_price}€"
            message = f"""
            Hola,
            El producto {product.name} ({variant.storage} - {variant.color}) 
            acaba de bajar a {new_price}€.
            
            Tu alerta estaba puesta en {alert.price_threshold}€.
            ¡Corre antes de que vuele!
            """
            
            send_mail(
                subject,
                message,
                'bot@tuweb.com',
                [alert.subscriber.email],
                fail_silently=False,
            )
            
            # Marcamos como notificada si no es repetitiva
            if not alert.repeat:
                alert.notified = True
                alert.save()