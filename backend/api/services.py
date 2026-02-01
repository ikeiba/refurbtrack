from django.core.mail import send_mail
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


def send_alert_email(alert, offer):
    # ... (Esta función es IDÉNTICA a la que te pasé antes: genera el HTML y envía) ...
    try:
        signer = TimestampSigner()
        # Generamos tokens para borrar alerta (alert ID) y borrar todo (subscriber ID)
        token_alert = signer.sign(alert.id)
        token_subscriber = signer.sign(alert.subscriber.id) # <--- OJO: Necesitamos esto para el footer
        
        base_url = "http://localhost:3000"

        # Imagen
        img_url = ""
        if offer.spec.image:
            img_url = str(offer.spec.image)
        elif alert.product.image:
            img_url = str(alert.product.image)
            
        if img_url and not img_url.startswith("http"):
            img_url = f"{base_url}/{img_url}"

        context = {
            'product_name': alert.product.name,
            'storage': offer.spec.storage,
            'color': offer.spec.color,
            'condition': offer.condition,
            'current_price': offer.current_price,
            'old_price': offer.max_price_30d,
            'product_image': img_url,
            'offer_url': offer.url if offer.url else f"{base_url}/product/{alert.product.id}",
            
            # LINKS (Con tu arquitectura nueva)
            'unsubscribe_url': f"{base_url}/alerts/unsubscribe?token={token_alert}",
            'unsubscribe_all_url': f"{base_url}/alerts/unsubscribe-all?token={token_subscriber}",
            'dashboard_url': f"{base_url}/dashboard",
            'home_url': f"{base_url}",
            'login_url': f"{base_url}/auth/login",
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