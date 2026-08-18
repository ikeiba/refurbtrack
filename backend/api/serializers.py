from rest_framework import serializers
from .models import Alert, Product, Spec, Offer, PriceHistory, Subscriber, Market
from .services import market_offer_q, offer_market, market_symbol, market_stat_value
from django.contrib.auth.models import User
from django.core.mail import send_mail # <--- 1. IMPORTAR ESTO
from django.conf import settings # Para acceder al remitente por defecto
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.signing import TimestampSigner
from django.contrib.auth.password_validation import (
    validate_password as django_validate_password,
    MinimumLengthValidator,
)
from django.db import IntegrityError


def _format_decimal(value):
    """Formatea un Decimal a string con 2 decimales (como DecimalField de DRF)."""
    if value is None:
        return None
    try:
        return f"{float(value):.2f}"
    except (TypeError, ValueError):
        return None

# --- 1. HISTÓRICO (Para la Gráfica) ---
class PriceHistorySerializer(serializers.ModelSerializer):
    """
    Serializa solo los puntos del gráfico (Fecha y Precio).
    Recuperamos esta funcionalidad del antiguo serializer.
    """
    class Meta:
        model = PriceHistory
        fields = ['timestamp', 'price']

# --- 2. NIVEL 3: LA OFERTA (La Ficha Comercial) ---
class OfferSerializer(serializers.ModelSerializer):
    """
    Representa una opción de compra (ej: 'Estado Bueno - 340€').
    Sustituye a la lógica mezclada que tenías en Variant anteriormente.
    """

    # Declaramos el campo como MethodField para calcularlo nosotros
    url = serializers.SerializerMethodField()
    market = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            'id', 
            'condition',
            'url', 
            'battery_new', 
            'current_price',
            'last_updated', 
            'country', 
            'deal_score', 
            'min_price_30d',
            'min_price_30d_date',
            'max_price_30d',
            'max_price_30d_date',
            'market',
            'currency'
        ]

    def get_url(self, obj):
        """
        Retorna la URL de redirección interna usando el UUID.
        """
        # Esto devolverá: /api/out/550e8400-e29b-41d4-a716-446655440000/
        return f"/api/out/{obj.uuid}/"

    def _market(self, obj):
        return self.context.get('market') or offer_market(obj)

    def get_market(self, obj):
        m = self._market(obj)
        return m.code if m else (obj.country or None)

    def get_currency(self, obj):
        m = self._market(obj)
        return m.currency if m else 'EUR'

# --- 3. NIVEL 2: LA SPEC (El Configurador) ---
class SpecSerializer(serializers.ModelSerializer):
    """
    La variante técnica (iPhone 13 128GB Azul).
    Incluye la lista de ofertas activas (Standard, New Battery, etc.)
    """
    offers = OfferSerializer(many=True, read_only=True)
    # TRUCO: Forzamos que la imagen sea texto plano para que no añada el dominio del backend
    image = serializers.CharField(read_only=True)
    # Caché de precio leído desde SpecMarketStats del mercado solicitado.
    min_price_cached = serializers.SerializerMethodField()
    market = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    class Meta:
        model = Spec
        fields = [
            'id', 
            'back_market_uuid',
            'storage', 
            'color',
            'image', # <--- AÑADIR ESTO
            'min_price_cached', 
            'offers', # Anidamos las ofertas disponibles
            'slug',
            'slug_en',
            'market',
            'currency'
        ]

    def get_min_price_cached(self, obj):
        value = market_stat_value(obj, self.context.get('market'), 'min_price_cached', 'min_price_cached')
        return _format_decimal(value)

    def get_market(self, obj):
        m = self.context.get('market')
        return m.code if m else None

    def get_currency(self, obj):
        m = self.context.get('market')
        return m.currency if m else 'EUR'

# --- 4. NIVEL 1: EL PRODUCTO (La Familia) ---

# A. Para la HOME (Vista Ligera)
# backend/api/serializers.py

class ProductListSerializer(serializers.ModelSerializer):
    """
    Equivale a tu antiguo 'ProductListSerializer' pero usando el caché.
    """
    image = serializers.CharField(read_only=True)
    
    # NUEVOS CAMPOS SEO
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True)
    # Calculamos cuál es el slug de la spec más barata para usarlo de enlace por defecto
    default_spec_slug = serializers.SerializerMethodField()
    # Colores y almacenamientos disponibles (para las tarjetas de la landing)
    available_colors = serializers.SerializerMethodField()
    available_storages = serializers.SerializerMethodField()
    spec_count = serializers.SerializerMethodField()
    # Cachés de precio leídos desde ProductMarketStats del mercado solicitado.
    min_price_cached = serializers.SerializerMethodField()
    market_price = serializers.SerializerMethodField()
    market = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'type', 'image', 'min_price_cached', 'market_price', 'slug',
            'category_slug', 'brand_slug', 'default_spec_slug',
            'available_colors', 'available_storages', 'spec_count', # <-- Añadidos
            'market', 'currency'
        ]

    def get_min_price_cached(self, obj):
        value = market_stat_value(obj, self.context.get('market'), 'min_price_cached', 'min_price_cached')
        return _format_decimal(value)

    def get_market_price(self, obj):
        value = market_stat_value(obj, self.context.get('market'), 'market_price', 'market_price')
        return _format_decimal(value)

    def get_market(self, obj):
        m = self.context.get('market')
        return m.code if m else None

    def get_currency(self, obj):
        m = self.context.get('market')
        return m.currency if m else 'EUR'

    def get_default_spec_slug(self, obj):
        # Iteramos en Python para aprovechar el prefetch_related('specs') y evitar N+1.
        market = self.context.get('market')
        specs = list(obj.specs.all())
        product_min = market_stat_value(obj, market, 'min_price_cached', 'min_price_cached')
        match = next(
            (s for s in specs if market_stat_value(s, market, 'min_price_cached', 'min_price_cached') == product_min),
            None
        )
        spec = match or (specs[0] if specs else None)
        if spec is None:
            return None
        if market is not None and market.language == 'en' and spec.slug_en:
            return spec.slug_en
        return spec.slug

    def get_available_colors(self, obj):
        return sorted({s.color for s in obj.specs.all() if s.color})

    def get_available_storages(self, obj):
        def key(storage):
            try:
                return (0, int(storage))
            except (TypeError, ValueError):
                return (1, storage)
        return sorted({s.storage for s in obj.specs.all() if s.storage}, key=key)

    def get_spec_count(self, obj):
        return len(obj.specs.all())

# B. Para el DETALLE (Vista Pesada)
# backend/api/serializers.pyH

class ProductDetailSerializer(serializers.ModelSerializer):
    specs = SpecSerializer(many=True, read_only=True)
    image = serializers.CharField(read_only=True)
    
    # NUEVOS: Slugs de jerarquía superior
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    market = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Product
        # Añade los nuevos campos a la lista
        fields = ['id', 'name', 'type', 'image', 'specs', 'category_slug', 'brand_slug', 'brand_name', 'slug', 'market', 'currency']

    def get_market(self, obj):
        m = self.context.get('market')
        return m.code if m else None

    def get_currency(self, obj):
        m = self.context.get('market')
        return m.currency if m else 'EUR'


# backend/api/serializers.py

class AlertSerializer(serializers.ModelSerializer):
    # Campos de escritura (Input)
    product_id = serializers.IntegerField(write_only=True)
    email = serializers.EmailField(write_only=True)
    
    # Campos de lectura (Output para el Dashboard)
    #product_name = serializers.CharField(source='product.name', read_only=True)
    # AÑADIDO: Devolvemos el ID real del producto para poder hacer links
    #product = serializers.PrimaryKeyRelatedField(read_only=True)

    # AÑADIDO: Recuperamos la imagen del producto relacionado
    #product_image = serializers.CharField(source='product.image', read_only=True)

    # ---> NUEVOS CAMPOS SEO <---
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)
    
    category_slug = serializers.CharField(source='product.category.slug', read_only=True)
    brand_slug = serializers.CharField(source='product.brand.slug', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    
    # Campo inteligente para la URL
    target_path = serializers.SerializerMethodField()
    target_affiliate_url = serializers.SerializerMethodField()

    # Mercado (output: código 'ES'/'UK'; input: market_code write-only)
    market = serializers.SerializerMethodField()
    market_code = serializers.CharField(write_only=True, required=False, allow_blank=True)
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Alert
        fields = [
            'id', 'product_id', 'email', 'price_threshold', 'product_name', 
            'product_image', 'category_slug', 'brand_slug', 'product_slug', 'target_path', 
            'target_affiliate_url', 'target_conditions', 'target_storages', 
            'target_colors', 'battery_new', 'market', 'market_code', 'currency'
        ]

    def _market(self, obj):
        return obj.market or Market.objects.filter(code=obj.country).first()

    def get_market(self, obj):
        m = self._market(obj)
        return m.code if m else obj.country

    def get_currency(self, obj):
        m = self._market(obj)
        return m.currency if m else 'EUR'
    
    def get_target_path(self, obj):
        market = self._market(obj)
        lang = market.language if market else 'es'

        is_specific = (
            len(obj.target_storages or []) == 1 and 
            len(obj.target_colors or []) == 1
        )

        specs = list(obj.product.specs.all())

        if is_specific:
            matching = [
                s for s in specs
                if s.storage == obj.target_storages[0]
                and s.color == obj.target_colors[0]
            ]
            spec = matching[0] if matching else None
        else:
            spec = min(specs, key=lambda s: s.min_price_cached or float('inf')) if specs else None

        if spec:
            spec_slug = spec.slug_en if (lang == 'en' and spec.slug_en) else spec.slug
            path = f"/{obj.product.category.slug}/{obj.product.brand.slug}/{obj.product.slug}/{spec_slug}"
            params = []
            if len(obj.target_conditions or []) == 1:
                params.append(f"condition={obj.target_conditions[0]}")
            if obj.battery_new is not None:
                params.append(f"battery={'new' if obj.battery_new else 'standard'}")
            query = f"?{'&'.join(params)}" if params else ""
            return path + query
        return None

    def get_target_affiliate_url(self, obj):
        market = self._market(obj)
        qs = Offer.objects.filter(spec__product=obj.product)
        if market is not None:
            qs = qs.filter(market_offer_q(market))

        if obj.target_storages:
            qs = qs.filter(spec__storage__in=obj.target_storages)
        if obj.target_colors:
            qs = qs.filter(spec__color__in=obj.target_colors)
        if obj.target_conditions:
            qs = qs.filter(condition__in=obj.target_conditions)
        if obj.battery_new is not None:
            qs = qs.filter(battery_new=obj.battery_new)

        best_offer = qs.order_by('current_price').first()

        if best_offer:
            return f"/api/out/{best_offer.uuid}/"
        if market is not None:
            return f"https://www.{market.domain}"
        return "https://www.backmarket.es"

    def create(self, validated_data):
        # Extraemos el ID del producto y el email
        product_id = validated_data.pop('product_id')
        email = validated_data.pop('email') # <--- Ahora esto funcionará perfecto
        market_code = validated_data.pop('market_code', None)

        product = Product.objects.get(id=product_id)
        
        # Gestión del suscriptor
        subscriber, _ = Subscriber.objects.get_or_create(email=email)

        # Resolución del mercado (fallback ES)
        market = None
        if market_code:
            market = Market.objects.filter(code__iexact=market_code).first()
        if market is None:
            market = Market.objects.filter(code='ES').first() or Market.seed().get('ES')
        
        # Creamos la alerta (market como fuente de verdad; country legacy sincronizado)
        alert = Alert.objects.create(
            subscriber=subscriber,
            product=product,
            market=market,
            country=market.code if market else 'ES',
            **validated_data
        )
        
        # ---------------------------------------------------------
        # 3. ¡NUEVO! ENVÍO DE EMAIL HTML (CORREGIDO PARA PRODUCCIÓN)
        # ---------------------------------------------------------
        try:
            # A. Configuración de URLs dinámicas
            # Usamos settings para que en local sea localhost y en prod refurbtrack.com
            from django.conf import settings
            base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            backend_url = getattr(settings, 'BACKEND_URL', 'http://localhost:8000')

            signer = TimestampSigner()
            token_alert = signer.sign(alert.id)
            token_subscriber = signer.sign(subscriber.id)

            # B. --- CORRECCIÓN DE LA IMAGEN (Versión Next.js Public) ---
            final_image_url = f"{base_url}/placeholder.jpg" # base_url es FRONTEND_URL
            
            if product.image:
                img_path = str(product.image)
                if img_path.startswith("http"):
                    final_image_url = img_path
                else:
                    # Quitamos barras iniciales por si acaso (ej. "/products/foto.jpg" -> "products/foto.jpg")
                    clean_path = img_path.lstrip('/')
                    
                    # Si en tu BD guardaste solo "iphone-13.jpg" en vez de "products/iphone-13.jpg",
                    # lo concatenamos. Si ya incluye "products/", lo dejamos igual.
                    if not clean_path.startswith("products/"):
                        clean_path = f"products/{clean_path}"
                    
                    # CORREGIDO: Le quitamos el "products/" extra porque clean_path ya lo lleva.
                    # Quedará algo como: http://localhost:3000/_next/image?url=/products/iphone-11.avif&w=256&q=75
                    final_image_url = f"{base_url}/_next/image?url=/{clean_path}&w=256&q=75"

            # C. --- CORRECCIÓN DE LA URL DEL PRODUCTO (Usando tu lógica SEO) ---
            # Llamamos a tu función para obtener la ruta exacta: /smartphones/apple/iphone-13...
            target_path = self.get_target_path(alert)
            if target_path:
                product_url = f"{base_url}/es{target_path}"
            else:
                # Fallback por si acaso falla algo en el target_path
                product_url = f"{base_url}/es/{product.category.slug}/{product.brand.slug}/{product.slug}"

            context = {
                'product_name': product.name,
                'product_type': product.type if hasattr(product, 'type') else '',
                'target_price': alert.price_threshold,
                'product_image': final_image_url,
                
                # DETALLES DE LA ALERTA
                'target_storages': ', '.join(alert.target_storages) if alert.target_storages else 'Cualquiera',
                'target_colors': ', '.join(alert.target_colors) if alert.target_colors else 'Cualquiera',
                'target_conditions': ', '.join(alert.target_conditions) if alert.target_conditions else 'Cualquiera',
                'battery_new': alert.battery_new,
                'country': alert.country,
                'currency_symbol': market_symbol(market),
                'has_criteria': bool(alert.target_storages or alert.target_colors or alert.target_conditions or alert.battery_new),
                
                # LINKS DE ACCIÓN (Añadido el prefijo /es/ para evitar 404 en Next.js)
                'product_url': product_url,
                'home_url': f"{base_url}/es",
                'dashboard_url': f"{base_url}/es/dashboard",
                'login_url': f"{base_url}/es/login",
                
                # LINKS DE BORRADO
                'unsubscribe_url': f"{base_url}/es/unsubscribe?token={token_alert}",
                'unsubscribe_all_url': f"{base_url}/es/unsubscribe-all?token={token_subscriber}"
            }

            # B. Renderizamos el HTML
            html_message = render_to_string('emails/alert_confirmation.html', context)
            
            # C. Creamos la versión de texto plano (quitando etiquetas HTML)
            plain_message = strip_tags(html_message)
            
            # D. Enviamos el correo (Fíjate en los parámetros nuevos)
            send_mail(
                subject=f'🔔 Alerta activada: {product.name}',
                message=plain_message, # Versión texto plano (obligatoria)
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message, # Versión HTML (la bonita)
                fail_silently=True
            )
            
            print(f"📧 Email HTML enviado a {email}")

        except Exception as e:
            print(f"❌ Error enviando email: {e}")

        return alert
    

class HistoricalLowOfferSerializer(serializers.ModelSerializer):
    # Campos aplanados para facilitar la vida al frontend
    product_id = serializers.IntegerField(source='spec.product.id')
    name = serializers.CharField(source='spec.product.name')
    storage = serializers.CharField(source='spec.storage')
    color = serializers.CharField(source='spec.color')
    condition = serializers.CharField(source='get_condition_display')

    # Sobrescribimos el campo url aquí también
    url = serializers.SerializerMethodField()
    
    # CAMBIO CLAVE: Usamos SerializerMethodField pero devolvemos STRING, no URL
    image = serializers.SerializerMethodField()
    
    old_price = serializers.DecimalField(source='all_time_max_price', max_digits=10, decimal_places=2)

    # ---> ¡NUEVO PARA EL SEO! <---
    category_slug = serializers.CharField(source='spec.product.category.slug', read_only=True)
    brand_slug = serializers.CharField(source='spec.product.brand.slug', read_only=True)
    product_slug = serializers.CharField(source='spec.product.slug', read_only=True)
    spec_slug = serializers.CharField(source='spec.slug', read_only=True)
    spec_slug_en = serializers.CharField(source='spec.slug_en', read_only=True)

    market = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            'id', 'product_id', 'name', 'storage', 'color', 'url',
            'condition', 'battery_new', 'current_price', 'old_price', 'image',
            # Añadimos los campos a la lista:
            'category_slug', 'brand_slug', 'product_slug', 'spec_slug', 'spec_slug_en',
            'market', 'currency'
        ]

    def get_market(self, obj):
        m = self.context.get('market') or offer_market(obj)
        return m.code if m else (obj.country or None)

    def get_currency(self, obj):
        m = self.context.get('market') or offer_market(obj)
        return m.currency if m else 'EUR'

    def get_image(self, obj):
        """
        Devuelve la ruta relativa de la imagen como string (ej: "products/iphone.avif").
        El frontend (Next.js) se encargará de buscar esto en su carpeta /public.
        """
        # 1. Priorizamos la imagen específica de la Spec (ej: iPhone rojo)
        # 2. Si no tiene, usamos la genérica del Producto (ej: iPhone genérico)
        img_field = obj.spec.image or obj.spec.product.image
        
        if img_field:
            # Al hacer str(img_field), Django nos da lo que hay en la BD: "products/iphone-12.avif"
            # SIN añadir http://localhost:8000 ni nada delante.
            return str(img_field)
            
        return None
    
    def get_url(self, obj):
        """
        Apunta a nuestro nuevo endpoint de tracking.
        """
        return f"/api/out/{obj.uuid}/"
    
class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password')

    def validate_password(self, value):
        django_validate_password(
            value,
            password_validators=[MinimumLengthValidator(min_length=6)]
        )
        return value

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['email'],
                email=validated_data['email'],
                password=validated_data['password']
            )
        except IntegrityError:
            raise serializers.ValidationError(
                {'email': 'Este email ya está registrado.'}
            )

        Subscriber.objects.get_or_create(email=user.email)

        return user


class ContactMessageSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, max_length=255)
    email = serializers.EmailField(required=True)
    subject = serializers.CharField(required=True, max_length=255)
    message = serializers.CharField(required=True)