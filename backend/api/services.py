from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg, Min, Max, Count, Q, Prefetch
from django.core.signing import TimestampSigner
from .models import (
    Alert, Offer, Product, PriceHistory, Spec, Market,
    ProductMarketStats, SpecMarketStats,
)
from . import insights

# Símbolo de moneda por código ISO (para formatear emails y salidas).
CURRENCY_SYMBOL = {'EUR': '€', 'GBP': '£'}


def market_symbol(market):
    """Devuelve el símbolo de moneda de un Market (fallback €)."""
    if market is None:
        return '€'
    return CURRENCY_SYMBOL.get(market.currency, '€')


def market_offer_q(market, prefix=''):
    """
    Q object para filtrar ofertas por mercado, con fallback al campo legacy
    `country` durante la transición (ofertas aún sin `market` backfilleado).

    `prefix` permite aplicar el mismo filtro a través de una FK (ej. 'offer'
    para PriceHistory.offer).
    """
    if market is None:
        return Q()
    p = f'{prefix}__' if prefix else ''
    return (
        Q(**{f'{p}market': market})
        | (Q(**{f'{p}market__isnull': True}) & Q(**{f'{p}country': market.code}))
    )


def offer_market(offer):
    """Resuelve el Market de una oferta (fallback al country durante transición)."""
    if offer.market_id:
        return offer.market
    return Market.objects.filter(code=offer.country).first()


def _market_code(obj):
    """Código de mercado ('ES'/'UK') de una oferta o alerta (market o country)."""
    if obj.market_id:
        return obj.market.code
    return obj.country


def _find_market_stat(obj, market):
    """Busca la fila de stats del mercado entre las (posiblemente) prefetcheadas."""
    if market is None:
        return None
    for stat in obj.market_stats.all():
        if stat.market_id == market.id:
            return stat
    return None


def market_stat_value(obj, market, stat_attr, legacy_attr):
    """
    Lee un campo de caché desde la tabla de stats por mercado (fuente de
    verdad), con fallback al campo legacy del modelo base (transición/tests).
    """
    if market is None:
        return getattr(obj, legacy_attr)
    stat = _find_market_stat(obj, market)
    if stat is not None:
        return getattr(stat, stat_attr)
    return getattr(obj, legacy_attr)

def _numeric_storage(storage: str) -> int:
    """Ordena almacenamientos numéricamente (64, 128, 256, 512, 1000)."""
    try:
        return int(storage)
    except (TypeError, ValueError):
        return 10 ** 9  # Al final


def _spec_stats(spec, history_by_offer, market=None):
    """
    Calcula las estadísticas de una Spec a partir de sus ofertas (ya filtradas
    por mercado en el prefetch) y del agregado de historial (un único
    diccionario offer_id -> stats).
    """
    offers = list(spec.offers.all())
    offer_payloads = []
    spec_current_prices = []
    spec_min_prices = []
    spec_max_prices = []

    for offer in offers:
        agg = history_by_offer.get(offer.id, {})

        current = insights.num(offer.current_price)
        min30 = insights.num(offer.min_price_30d)
        max30 = insights.num(offer.max_price_30d)

        # El histórico real (30d) corrige/rellena los valores cacheados.
        hist_min = insights.num(agg.get("mn"))
        hist_max = insights.num(agg.get("mx"))
        hist_avg = insights.num(agg.get("avg"))
        if hist_min is not None and (min30 is None or hist_min < min30):
            min30 = hist_min
        if hist_max is not None and (max30 is None or hist_max > max30):
            max30 = hist_max

        avg30 = hist_avg
        if avg30 is None and min30 is not None and max30 is not None:
            avg30 = insights.avg_30d([min30, max30])

        if current is not None:
            spec_current_prices.append(current)
        if min30 is not None:
            spec_min_prices.append(min30)
        if max30 is not None:
            spec_max_prices.append(max30)

        offer_payloads.append({
            "condition": offer.condition,
            "battery_new": offer.battery_new,
            "current_price": current,
            "min_price_30d": min30,
            "avg_price_30d": avg30,
            "max_price_30d": max30,
            "last_updated": offer.last_updated.isoformat() if offer.last_updated else None,
            "url": f"/api/out/{offer.uuid}/",
        })

    spec_current = insights.current_price(spec_current_prices)
    cached_min = market_stat_value(spec, market, 'min_price_cached', 'min_price_cached')
    spec_min = min(spec_min_prices) if spec_min_prices else insights.num(cached_min)
    spec_max = max(spec_max_prices) if spec_max_prices else None
    spec_avg = insights.avg_30d([o["avg_price_30d"] for o in offer_payloads])

    # URL de la oferta más barata (para el botón "Ver en Back Market").
    best_offer_url = None
    if offer_payloads:
        with_price = [o for o in offer_payloads if o["current_price"] is not None]
        best_offer = min(with_price, key=lambda o: o["current_price"]) if with_price else offer_payloads[0]
        best_offer_url = best_offer["url"]

    return {
        "slug": spec.slug,
        "slug_en": spec.slug_en,
        "storage": spec.storage,
        "color": spec.color,
        "image": str(spec.image) if spec.image else None,
        "current_price": spec_current,
        "min_price_30d": spec_min,
        "avg_price_30d": spec_avg,
        "max_price_30d": spec_max,
        "last_updated": spec.last_updated.isoformat() if spec.last_updated else None,
        "best_offer_url": best_offer_url,
        "offers": offer_payloads,
    }


def build_model_hub(product: Product, market=None) -> dict:
    """
    Construye la agregación completa de un modelo (hub SEO) para un Market.

    Devuelve un diccionario con las configuraciones agrupadas por
    almacenamiento y un resumen de precios a nivel de modelo. Todo se resuelve
    con dos consultas (specs+offers prefetched y un único agregado de
    PriceHistory), evitando N+1.

    Si `market` es None (transición/tests), no se filtra por mercado y los
    caches se leen de los campos legacy.
    """
    prod_stat = None
    if market is not None:
        offers_qs = Offer.objects.filter(market_offer_q(market))
        specs = product.specs.prefetch_related(
            Prefetch('offers', queryset=offers_qs),
            Prefetch('market_stats', queryset=SpecMarketStats.objects.filter(market=market)),
        )
        prod_stat = ProductMarketStats.objects.filter(product=product, market=market).first()
    else:
        specs = product.specs.prefetch_related('offers')

    # 1. Un único agregado de historial (30d) para TODAS las ofertas del modelo.
    since = timezone.now() - timedelta(days=30)
    history_qs = PriceHistory.objects.filter(offer__spec__product=product, timestamp__gte=since)
    if market is not None:
        history_qs = history_qs.filter(market_offer_q(market, prefix='offer'))
    history_rows = (
        history_qs
        .values("offer_id")
        .annotate(avg=Avg("price"), mn=Min("price"), mx=Max("price"), cnt=Count("id"))
    )
    history_by_offer = {row["offer_id"]: row for row in history_rows}

    # 2. Stats por spec, agrupadas por almacenamiento.
    spec_payloads = [_spec_stats(s, history_by_offer, market) for s in specs]

    storage_groups = {}
    for payload in spec_payloads:
        storage_groups.setdefault(payload["storage"], []).append(payload)

    ordered_groups = [
        {"storage": storage, "specs": sorted(groups, key=lambda s: s["color"].lower())}
        for storage, groups in sorted(storage_groups.items(), key=lambda kv: _numeric_storage(kv[0]))
    ]

    # 3. Resumen a nivel de modelo.
    current_prices = [s["current_price"] for s in spec_payloads if s["current_price"] is not None]
    historical_min = (
        insights.num(prod_stat.lowest_ever_price) if prod_stat is not None
        else insights.num(product.lowest_ever_price)
    )
    last_updated = (
        prod_stat.last_updated if prod_stat is not None else product.last_updated
    )
    summary = {
        "lowest_current_price": insights.current_price(current_prices),
        "avg_current_price": insights.avg_30d(current_prices),
        "historical_min": historical_min,
        "config_count": len(spec_payloads),
        "last_updated": last_updated.isoformat() if last_updated else None,
    }

    # 4. Insights dinámicos (mejor precio / más cerca de su mínimo / mayor caída).
    cheapest = None
    closest_to_min = None
    biggest_drop = None

    for payload in spec_payloads:
        if payload["current_price"] is None:
            continue
        if cheapest is None or payload["current_price"] < cheapest["current_price"]:
            cheapest = payload

        gap_min = insights.percentage_vs_minimum(payload["current_price"], payload["min_price_30d"])
        if gap_min is not None and (closest_to_min is None or gap_min < closest_to_min["gap_min"]):
            closest_to_min = {"slug": payload["slug"], "gap_min": gap_min}

        drop = insights.percentage_vs_maximum(payload["current_price"], payload["max_price_30d"])
        if drop is not None and (biggest_drop is None or drop < biggest_drop["drop"]):
            biggest_drop = {"slug": payload["slug"], "drop": drop}

    insights_payload = {
        "cheapest_spec": cheapest["slug"] if cheapest else None,
        "closest_to_min_spec": closest_to_min["slug"] if closest_to_min else None,
        "closest_to_min_gap": closest_to_min["gap_min"] if closest_to_min else None,
        "biggest_drop_spec": biggest_drop["slug"] if biggest_drop else None,
        "biggest_drop_value": biggest_drop["drop"] if biggest_drop else None,
    }

    return {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "image": str(product.image) if product.image else None,
        "category_slug": product.category.slug,
        "brand_slug": product.brand.slug,
        "market_price": (
            insights.num(prod_stat.market_price) if prod_stat is not None
            else insights.num(product.market_price)
        ),
        "lowest_ever_price": (
            insights.num(prod_stat.lowest_ever_price) if prod_stat is not None
            else insights.num(product.lowest_ever_price)
        ),
        "storage_groups": ordered_groups,
        "summary": summary,
        "insights": insights_payload,
    }


def get_featured_history(market=None) -> dict:
    """
    Selecciona dinámicamente el modelo con más registros de historial para la
    demostración de la landing. Devuelve su hub + la serie de precios de su
    oferta más rica + las estadísticas calculadas, o valores vacíos si no
    existe ningún registro real.

    Si `market` es None (transición/tests), no se filtra por mercado.
    """
    if market is not None:
        count_filter = Q(specs__offers__market=market) | (
            Q(specs__offers__market__isnull=True) & Q(specs__offers__country=market.code)
        )
    else:
        count_filter = Q()

    featured = (
        Product.objects.annotate(
            history_count=Count("specs__offers__history", filter=count_filter)
        )
        .filter(history_count__gt=0)
        .order_by("-history_count")
        .first()
    )

    if not featured:
        return {"model": None, "history": [], "stats": None}

    hub = build_model_hub(featured, market)

    # Serie del histórico de la oferta con más puntos de la config más barata.
    offer = (
        Offer.objects.filter(spec__product=featured, current_price__isnull=False)
        .filter(market_offer_q(market))
        .annotate(history_count=Count("history"))
        .order_by("-history_count", "current_price")
        .first()
    )

    history = []
    stats = None

    if offer:
        history = list(offer.history.order_by("timestamp").values("timestamp", "price"))
        history = [
            {"timestamp": p["timestamp"].isoformat(), "price": insights.num(p["price"])}
            for p in history
        ]

        prices = [p["price"] for p in history if p["price"] is not None]
        current = insights.num(offer.current_price)
        min30 = insights.num(offer.min_price_30d)
        max30 = insights.num(offer.max_price_30d)
        avg30 = insights.avg_30d(prices)

        if min30 is None and prices:
            min30 = min(prices)
        if max30 is None and prices:
            max30 = max(prices)

        position = insights.price_position(current, min30, max30)

        stats = {
            "product_name": featured.name,
            "storage": offer.spec.storage,
            "color": offer.spec.color,
            "condition": offer.condition,
            "current": current,
            "min30d": min30,
            "avg30d": avg30,
            "max30d": max30,
            "last_updated": offer.last_updated.isoformat() if offer.last_updated else None,
            "percentage_vs_average": insights.percentage_vs_average(current, avg30),
            "price_position": position,
            "position_label": insights.position_label(position),
        }

    return {"model": hub, "history": history, "stats": stats}


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

    # Optimizamos query (incluimos market para comparar por mercado sin N+1)
    available_offers = offers_query.select_related('spec', 'market')

    if not available_offers.exists():
        # Si no hay ninguna oferta fresca hoy, no enviamos nada (seguridad)
        return

    # 3. Traemos alertas pendientes (incluimos market para comparar)
    pending_alerts = Alert.objects.filter(
        product=product,
        notified=False
    ).select_related('market')

    # 4. EL CRUCE (filtros por mercado + JSON)
    for alert in pending_alerts:
        winning_offer = None

        for offer in available_offers:
            # A. Mercado: la alerta y la oferta deben pertenecer al mismo mercado
            #    (market con fallback al country durante la transición).
            if _market_code(alert) != _market_code(offer):
                continue
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

        # Mercado de la oferta (para moneda y enlaces) con fallback al country.
        market = offer_market(offer)
        symbol = market_symbol(market)

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
            'offer_url': f"{backend_url}/api/out/{offer.uuid}/?src=email" if hasattr(offer, 'uuid') else f"{base_url}/es",
            
            # LINKS FRONTEND
            'unsubscribe_url': f"{base_url}/es/unsubscribe?token={token_alert}",
            'unsubscribe_all_url': f"{base_url}/es/unsubscribe-all?token={token_subscriber}",
            'dashboard_url': f"{base_url}/es/dashboard",
            'home_url': f"{base_url}/es",
            'login_url': f"{base_url}/es/login",
            'has_criteria': True,
            'target_price': alert.price_threshold,
            'country': alert.country,
            'currency_symbol': symbol,
        }

        html_msg = render_to_string('emails/price_drop.html', context)
        plain_msg = strip_tags(html_msg)

        print(f"📧 Enviando alerta a {alert.subscriber.email} por {offer.current_price}{symbol}")

        send_mail(
            subject=f'📉 ¡Bajada de precio! {alert.product.name} a {offer.current_price}{symbol}',
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


def recompute_market_stats(instance, market):
    """
    Recalcula los caches de precio de un Spec o Product para un Market concreto.

    Escribe EXCLUSIVAMENTE en SpecMarketStats / ProductMarketStats (fuente de
    verdad por mercado). No toca los campos legacy de Product/Spec.
    """
    if isinstance(instance, Spec):
        return _recompute_spec_market_stats(instance, market)
    if isinstance(instance, Product):
        return _recompute_product_market_stats(instance, market)
    raise TypeError(f"recompute_market_stats no soporta {type(instance).__name__}")


def _recompute_spec_market_stats(spec, market):
    offers = spec.offers.filter(market_offer_q(market))

    best_offer = offers.filter(current_price__isnull=False).order_by(
        'current_price', '-last_updated'
    ).first()
    current_min = best_offer.current_price if best_offer else None
    current_date = best_offer.last_updated if best_offer else None

    historical_min_obj = offers.filter(all_time_min_price__isnull=False).order_by(
        'all_time_min_price'
    ).first()

    stats, _ = SpecMarketStats.objects.get_or_create(spec=spec, market=market)
    changes = False

    if stats.min_price_cached != current_min:
        stats.min_price_cached = current_min
        stats.last_updated = current_date
        changes = True

    if stats.min_price_cached == current_min and current_date and stats.last_updated != current_date:
        stats.last_updated = current_date
        changes = True

    if historical_min_obj:
        if stats.lowest_ever_price is None or historical_min_obj.all_time_min_price < stats.lowest_ever_price:
            stats.lowest_ever_price = historical_min_obj.all_time_min_price
            stats.lowest_ever_date = historical_min_obj.all_time_min_date
            changes = True

    if changes:
        stats.save()

    return stats


def _recompute_product_market_stats(product, market):
    spec_stats = SpecMarketStats.objects.filter(spec__product=product, market=market)

    best_spec = spec_stats.filter(min_price_cached__isnull=False).order_by(
        'min_price_cached', '-last_updated'
    ).first()
    current_min = best_spec.min_price_cached if best_spec else None
    current_date = best_spec.last_updated if best_spec else None

    historical_min_spec = spec_stats.filter(lowest_ever_price__isnull=False).order_by(
        'lowest_ever_price'
    ).first()

    stats, _ = ProductMarketStats.objects.get_or_create(product=product, market=market)
    changes = False

    if stats.min_price_cached != current_min:
        stats.min_price_cached = current_min
        stats.last_updated = current_date
        changes = True

    if stats.min_price_cached == current_min and current_date and stats.last_updated != current_date:
        stats.last_updated = current_date
        changes = True

    if historical_min_spec:
        if stats.lowest_ever_price is None or historical_min_spec.lowest_ever_price < stats.lowest_ever_price:
            stats.lowest_ever_price = historical_min_spec.lowest_ever_price
            stats.lowest_ever_date = historical_min_spec.lowest_ever_date
            changes = True

    if changes:
        stats.save()

    return stats