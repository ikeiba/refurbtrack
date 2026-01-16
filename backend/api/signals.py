from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings # Para el remitente del email
from datetime import timedelta
from .models import PriceHistory, Offer, Spec, Product, Alert

# --- NIVEL 1: De Histórico a Oferta ---
@receiver(post_save, sender=PriceHistory)
def update_offer_from_history(sender, instance, created, **kwargs):
    if created:
        offer = instance.offer
        new_price = instance.price
        new_date = instance.timestamp
        
        # 1. Actualizar Precio Actual
        offer.current_price = new_price
        offer.last_updated = new_date # <--- Importante para saber frescura
        
        # 2. LOGICA DE RÉCORDS HISTÓRICOS (Absolutos)
        if offer.all_time_min_price is None or new_price < offer.all_time_min_price:
            offer.all_time_min_price = new_price
            offer.all_time_min_date = new_date
            
        if offer.all_time_max_price is None or new_price > offer.all_time_max_price:
            offer.all_time_max_price = new_price
            offer.all_time_max_date = new_date

        # 3. Calcular Métricas de 30 días (CON FECHAS)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_history = offer.history.filter(timestamp__gte=thirty_days_ago)
        
        if recent_history.exists():
            # Truco: Ordenamos por precio para sacar el objeto entero (precio + fecha)
            
            # --- Mínimo 30d ---
            # Orden ascendente -> El primero es el más barato
            min_obj = recent_history.order_by('price', '-timestamp').first()
            if min_obj:
                offer.min_price_30d = min_obj.price
                offer.min_price_30d_date = min_obj.timestamp
            
            # --- Máximo 30d ---
            # Orden descendente -> El primero es el más caro
            max_obj = recent_history.order_by('-price', '-timestamp').first()
            if max_obj:
                offer.max_price_30d = max_obj.price
                offer.max_price_30d_date = max_obj.timestamp
            
            # --- Deal Score ---
            if offer.max_price_30d and offer.min_price_30d and offer.max_price_30d > offer.min_price_30d:
                price_range = offer.max_price_30d - offer.min_price_30d
                position = new_price - offer.min_price_30d
                score = 100 - int((position / price_range) * 100)
                offer.deal_score = max(0, min(100, score))
            else:
                offer.deal_score = 50

        offer.save()

# --- NIVEL 2: De Oferta a Spec ---
@receiver(post_save, sender=Offer)
def update_spec_min_price(sender, instance, **kwargs):
    spec = instance.spec
    
    # Buscamos la oferta activa más barata AHORA MISMO
    # Ordenamos por precio. Si hay empate, cogemos la más reciente (last_updated desc)
    best_offer = spec.offers.filter(current_price__isnull=False).order_by('current_price', '-last_updated').first()
    
    current_min = best_offer.current_price if best_offer else None
    current_date = best_offer.last_updated if best_offer else None
    
    # Récord Histórico de la Variante (buscamos entre las hijas)
    historical_min_obj = spec.offers.filter(all_time_min_price__isnull=False).order_by('all_time_min_price').first()
    
    changes = False

    # Actualizamos caché actual (Precio y Fecha)
    if spec.min_price_cached != current_min:
        spec.min_price_cached = current_min
        spec.last_updated = current_date # <--- Guardamos cuándo se vio este precio
        changes = True
    
    # Si el precio es el mismo, pero la fecha es más nueva, actualizamos la fecha
    if spec.min_price_cached == current_min and current_date and spec.last_updated != current_date:
        spec.last_updated = current_date
        changes = True

    # Actualizamos récord histórico
    if historical_min_obj:
        if spec.lowest_ever_price is None or historical_min_obj.all_time_min_price < spec.lowest_ever_price:
            spec.lowest_ever_price = historical_min_obj.all_time_min_price
            spec.lowest_ever_date = historical_min_obj.all_time_min_date
            changes = True
            
    if changes:
        spec.save()

# --- NIVEL 3: De Spec a Product ---
@receiver(post_save, sender=Spec)
def update_product_min_price(sender, instance, **kwargs):
    product = instance.product
    
    # Buscamos la spec más barata
    best_spec = product.specs.filter(min_price_cached__isnull=False).order_by('min_price_cached', '-last_updated').first()
    
    current_min = best_spec.min_price_cached if best_spec else None
    current_date = best_spec.last_updated if best_spec else None
    
    # Histórico
    historical_min_spec = product.specs.filter(lowest_ever_price__isnull=False).order_by('lowest_ever_price').first()
    
    changes = False

    # Actualizamos caché actual
    if product.min_price_cached != current_min:
        product.min_price_cached = current_min
        product.last_updated = current_date
        changes = True

    # Actualizamos fecha si es más reciente
    if product.min_price_cached == current_min and current_date and product.last_updated != current_date:
        product.last_updated = current_date
        changes = True
        
    if historical_min_spec:
        if product.lowest_ever_price is None or historical_min_spec.lowest_ever_price < product.lowest_ever_price:
            product.lowest_ever_price = historical_min_spec.lowest_ever_price
            product.lowest_ever_date = historical_min_spec.lowest_ever_date
            changes = True

    if changes:
        product.save()

# --- NIVEL 4: SISTEMA DE ALERTAS ---
@receiver(post_save, sender=PriceHistory)
def check_alerts(sender, instance, created, **kwargs):
    """
    Motor de coincidencias para alertas con filtros flexibles (JSON).
    """
    # 1. FILTRO DE ENTRADA: Solo precios nuevos
    if not created:
        return 

    # 2. RECUPERACIÓN DE DATOS (Navegando la nueva jerarquía)
    offer = instance.offer       # La Oferta (Precio, Estado, Batería)
    spec = offer.spec            # La Spec (Color, Almacenamiento)
    product = spec.product       # El Producto (Nombre, Familia)
    new_price = instance.price

    # 3. FILTRADO SQL (Rápido): Buscamos candidatos posibles
    # Filtramos por: Producto exacto + País exacto + Precio cumple + No notificado
    candidates = Alert.objects.filter(
        product=product,
        country=offer.country,        # ¡Importante! No avisar de ofertas en Francia a usuarios de España
        price_threshold__gte=new_price,
        notified=False
    )

    # 4. FILTRADO PYTHON (Detallado): Revisamos los JSONFields
    for alert in candidates:
        match = True
        
        # --- A. Comprobación de COLOR ---
        # Si la lista NO está vacía, el color DEBE estar dentro.
        # Si la lista está vacía [], significa "Cualquier color" (match sigue siendo True).
        if alert.target_colors and spec.color not in alert.target_colors:
            match = False

        # --- B. Comprobación de ALMACENAMIENTO ---
        if alert.target_storages and spec.storage not in alert.target_storages:
            match = False
            
        # --- C. Comprobación de ESTADO (Condition) ---
        if alert.target_conditions and offer.condition not in alert.target_conditions:
            match = False

        # --- D. Comprobación de BATERÍA ---
        # battery_new puede ser True, False o None (Me da igual)
        if alert.battery_new is not None:
            if alert.battery_new != offer.battery_new:
                match = False

        # 5. EJECUCIÓN: Si sobrevivió a todos los 'if', es un match
        if match:
            print(f"✅ ALERTA: Enviando email a {alert.subscriber.email}")
            
            subject = f"¡BAJADA DE PRECIO! {product.name} por {new_price}€"
            message = f"""
            ¡Buenas noticias!
            
            El producto que buscas ha bajado de precio.
            
            Producto: {product.name}
            Variante: {spec.storage} - {spec.color}
            Estado: {offer.get_condition_display()}
            Batería: {"Nueva" if offer.battery_new else "Estándar"}
            
            PRECIO ACTUAL: {new_price}€
            (Tu límite era: {alert.price_threshold}€)
            
            Corre a comprarlo antes de que cambie.
            """
            
            try:
                send_mail(
                    subject,
                    message,
                    settings.EMAIL_HOST_USER, # Remitente configurado en settings.py
                    [alert.subscriber.email],
                    fail_silently=False,
                )
                
                # Actualizar estado de la alerta
                if not alert.repeat:
                    alert.notified = True
                
                alert.last_notified = instance.timestamp
                alert.save()
                
            except Exception as e:
                print(f"❌ Error enviando email: {e}")