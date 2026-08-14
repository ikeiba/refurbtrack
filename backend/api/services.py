from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from django.core.signing import TimestampSigner
from .models import Alert, Offer

def check_alerts_for_product(product, cutoff_time=None):
    """
    Comprueba alertas comparando SOLO ofertas actualizadas DESPUÉS del cutoff_time.
    Esto evita comparar precios frescos contra precios de ayer (o agotados).
    """
    
    # 1. Consulta Base: Ofertas con precio
    offers_query = Offer.objects.filter(
        spec__product=product,
        current_price__isnull=False
    )

    # 2. FILTRO DE FRESCURA (CRUCIAL):
    # Solo miramos ofertas que se hayan tocado en ESTA ejecución del scraper.
    # Si una oferta no se actualizó hoy (ej: url rota o stock agotado), no compite.
    if cutoff_time:
        offers_query = offers_query.filter(last_updated__gte=cutoff_time)

    # Optimizamos query
    available_offers = offers_query.select_related('spec')

    if not available_offers.exists():
        # Si no hay ninguna oferta fresca hoy, no enviamos nada (seguridad)
        return

    # 3. Traemos alertas pendientes (IGUAL QUE ANTES)
    pending_alerts = Alert.objects.filter(
        product=product,
        notified=False 
    )

    # 4. EL CRUCE (IGUAL QUE ANTES)
    for alert in pending_alerts:
        winning_offer = None
        
        for offer in available_offers:
            # ... (TODA TU LÓGICA DE FILTROS SE QUEDA IGUAL) ...
            # A. País
            if alert.country != offer.country: continue
            # B. Precio
            if offer.current_price > alert.price_threshold: continue
            # C, D, E, F... Filtros JSON
            if alert.target_conditions and offer.condition not in alert.target_conditions: continue
            if alert.target_storages and offer.spec.storage not in alert.target_storages: continue
            if alert.target_colors and offer.spec.color not in alert.target_colors: continue
            if alert.battery_new is not None and alert.battery_new != offer.battery_new: continue

            # GANADOR
            if winning_offer is None or offer.current_price < winning_offer.current_price:
                winning_offer = offer
        
        if winning_offer:
            send_alert_email(alert, winning_offer)


def send_contact_email(name, email, subject, message):
    """
    Reenvía un mensaje del formulario de contacto al inbox de destino
    (settings.CONTACT_EMAIL), manteniendo el email del usuario como reply-to.
    """
    context = {
        'name': name,
        'email': email,
        'subject': subject,
        'message': message,
    }

    html_msg = render_to_string('emails/contact_notification.html', context)
    plain_msg = strip_tags(html_msg)

    message = EmailMultiAlternatives(
        subject=f'📩 Contacto: {subject}',
        body=plain_msg,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_EMAIL],
        reply_to=[email],
    )
    message.attach_alternative(html_msg, 'text/html')
    message.send(fail_silently=False)


def send_alert_email(alert, offer):
    # ... (Esta función es IDÉNTICA a la que te pasé antes: genera el HTML y envía) ...
    try:
        signer = TimestampSigner()
        
        # Generamos tokens 
        token_alert = signer.sign(alert.id)
        token_subscriber = signer.sign(alert.subscriber.id) 
        
        base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        backend_url = getattr(settings, 'BACKEND_URL', 'http://localhost:8000')

        # ---------------------------------------------------------
        # LÓGICA DE IMAGEN (Con tu limpieza de rutas)
        # ---------------------------------------------------------
        final_image_url = f"{base_url}/placeholder.jpg"
        
        # Buscamos primero en la spec, luego en el producto
        img_field = offer.spec.image or alert.product.image
        
        if img_field:
            img_path = str(img_field)
            if img_path.startswith("http"):
                final_image_url = img_path
            else:
                clean_path = img_path.lstrip('/')
                
                if not clean_path.startswith("products/"):
                    clean_path = f"products/{clean_path}"
                
                # Apuntamos al archivo puro para evitar bloqueos anti-spam en Gmail
                final_image_url = f"{base_url}/{clean_path}"

        # ---------------------------------------------------------
        # CONTEXTO DEL EMAIL
        # ---------------------------------------------------------
        context = {
            'product_name': alert.product.name,
            'storage': offer.spec.storage,
            'color': offer.spec.color,
            
            # FIX: Usamos get_condition_display para texto amigable
            'condition': offer.get_condition_display() if hasattr(offer, 'get_condition_display') else offer.condition,
            
            'current_price': offer.current_price,
            'old_price': offer.max_price_30d,
            'product_image': final_image_url,
            
            # FIX CRÍTICO: Reconstruimos la URL usando el UUID directamente hacia el backend
            'offer_url': f"{backend_url}/api/out/{offer.uuid}/" if hasattr(offer, 'uuid') else f"{base_url}/es",
            
            # LINKS FRONTEND
            'unsubscribe_url': f"{base_url}/es/unsubscribe?token={token_alert}",
            'unsubscribe_all_url': f"{base_url}/es/unsubscribe-all?token={token_subscriber}",
            'dashboard_url': f"{base_url}/es/dashboard",
            'home_url': f"{base_url}/es",
            'login_url': f"{base_url}/es/login",
            'has_criteria': True,
            'target_price': alert.price_threshold,
            'country': alert.country,
        }

        html_msg = render_to_string('emails/price_drop.html', context)
        plain_msg = strip_tags(html_msg)

        print(f"📧 Enviando alerta a {alert.subscriber.email} por {offer.current_price}€")

        send_mail(
            subject=f'📉 ¡Bajada de precio! {alert.product.name} a {offer.current_price}€',
            message=plain_msg,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[alert.subscriber.email],
            html_message=html_msg,
            fail_silently=True
        )

        # Actualizar estado (Tu lógica de Signals)
        if not alert.repeat:
            alert.notified = True # Marcamos como enviada para que no salga en la próxima búsqueda
        
        alert.last_notified = timezone.now()
        alert.save()
        
    except Exception as e:
        print(f"❌ Error enviando email a {alert.subscriber.email}: {e}")