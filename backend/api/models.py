from django.db import models
import uuid
from django.db.models import UniqueConstraint
# api/models.py

class Subscriber(models.Model):
    """
    Usuarios suscritos a alertas (solo email).
    """
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

# 1. NUEVA ENTIDAD: Categoría (Ej: Móviles, Smartphones)
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True) # modeltranslation creará slug_es, slug_en

    def __str__(self):
        return self.name

# 2. NUEVA ENTIDAD: Marca (Ej: Apple, Samsung)
class Brand(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)

    def __str__(self):
        return self.name

# Mercados canónicos del proyecto (para sembrar con Market.seed()).
MARKET_SEED = [
    dict(code='ES', country_code='es', currency='EUR', domain='backmarket.es', language='es', locale='es-es'),
    dict(code='UK', country_code='uk', currency='GBP', domain='backmarket.co.uk', language='en', locale='en-gb'),
]

# --- MERCADO COMERCIAL (País + Moneda + Dominio + Idioma) ---
class Market(models.Model):
    """
    Un mercado de venta. Define país, moneda, dominio y locale del scraper.
    Ej: ES (EUR, backmarket.es, es-es) o UK (GBP, backmarket.co.uk, en-gb).
    """
    code = models.CharField(max_length=2, unique=True)       # 'ES' | 'UK'
    country_code = models.CharField(max_length=2)             # 'es' | 'uk'
    currency = models.CharField(max_length=3, default='EUR')  # 'EUR' | 'GBP'
    domain = models.CharField(max_length=100)                 # 'backmarket.es' | 'backmarket.co.uk'
    language = models.CharField(max_length=2, default='es')   # 'es' | 'en'
    locale = models.CharField(max_length=10)                  # 'es-es' | 'en-gb'

    @classmethod
    def seed(cls):
        """Crea los mercados canónicos (ES/UK) si no existen. Devuelve {code: Market}."""
        markets = {}
        for data in MARKET_SEED:
            market, _ = cls.objects.get_or_create(code=data['code'], defaults=data)
            markets[data['code']] = market
        return markets

    def __str__(self):
        return f"{self.code} ({self.currency})"

# --- NIVEL 1: LA FAMILIA DE PRODUCTOS (Para la Home) ---
class Product(models.Model):
    """
    Solo define la 'Familia' (Ej: iPhone 13, Smartphone, 280€).
    """
    class ProductType(models.TextChoices):
        SMARTPHONE = 'Smartphone', 'Smartphone'
        TABLET = 'Tablet', 'Tablet'
        LAPTOP = 'Laptop', 'Laptop'
        SMARTWATCH = 'Smartwatch', 'Smartwatch'
        CONSOLE = 'Console', 'Console'
        OTHER = 'Other', 'Other'

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name='products')
    # El slug principal del producto (Ej: iphone-13-pro)
    slug = models.SlugField(db_index=True) # modeltranslation creará slug_es, slug_en...

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=ProductType.choices, default=ProductType.OTHER)
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    # CACHÉ NIVEL 1: El precio más bajo absoluto de toda la familia.
    min_price_cached = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Sirve para pintar la tarjeta de la Home: "iPhone 13 - Desde 300€"
    # NUEVO: ¿Cuándo se detectó este precio mínimo?
    last_updated = models.DateTimeField(null=True, blank=True)

    # 2. RÉCORD HISTÓRICO (El precio más bajo jamás visto)
    lowest_ever_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    lowest_ever_date = models.DateTimeField(null=True, blank=True)

    # NUEVO CAMPO: Precio de mercado oficial (del modelo base) para mostrar tachado
    market_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        # Un producto es único por marca y slug. Ej: No puede haber dos "iphone-13-pro" de "Apple"
        constraints = [
            UniqueConstraint(fields=['brand', 'slug'], name='unique_brand_product_slug')
        ]

    def __str__(self):
        return self.name

# --- CACHÉ DE PRECIOS DEL PRODUCTO POR MERCADO ---
class ProductMarketStats(models.Model):
    """
    Fuente de verdad de los caches de precio de un Product para un Market concreto.
    Sustituye a los campos legacy de Product (congelados tras el backfill).
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='market_stats')
    market = models.ForeignKey(Market, on_delete=models.PROTECT, related_name='+')

    min_price_cached = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    lowest_ever_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    lowest_ever_date = models.DateTimeField(null=True, blank=True)
    market_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            UniqueConstraint(fields=['product', 'market'], name='unique_product_market_stats')
        ]

    def __str__(self):
        return f"{self.product.name} @ {self.market.code}"

# --- NIVEL 2: LA ESPECIFICACIÓN TÉCNICA (Para el Configurador) ---
class Spec(models.Model):
    """
    Aquí es donde el usuario elige características en la página de detalle (Ej: 'iPhone 13, 128, Azul, 12345aeiou, 300€').
    """
    # NUEVO: Slug de la especificación (Ej: reacondicionado-256gb-oro)
    slug = models.SlugField(db_index=True) # modeltranslation creará slug_es, slug_en...

    # Variante EN del slug (Ej: refurbished-256gb-gold). El `slug` actual queda como variante ES.
    slug_en = models.SlugField(db_index=True, null=True, blank=True)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specs')
    
    # ID único de Back Market (o tu fuente) para identificar esta config exacta
    back_market_uuid = models.CharField(max_length=100, unique=True)
    
    storage = models.CharField(max_length=50)
    color = models.CharField(max_length=50)

    # --- NUEVO CAMPO ---
    # Permitimos que sea null, porque si no tiene foto específica, usaremos la del padre (Product)
    image = models.ImageField(upload_to='specs/', null=True, blank=True)

    # CACHÉ NIVEL 2: El precio más bajo para ESTA combinación concreta.
    min_price_cached = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Sirve para pintar los botones del configurador: "[ Azul (Desde 320€) ]"
    last_updated = models.DateTimeField(null=True, blank=True)

    # 2. RÉCORD HISTÓRICO
    lowest_ever_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    lowest_ever_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        # Evitamos duplicados: No puede haber dos 'iPhone 13 128GB Azul'
        unique_together = ('product', 'storage', 'color')
        indexes = [
            models.Index(fields=['back_market_uuid']), # Buscamos mucho por UUID al scrapear
        ]
        constraints = [
            UniqueConstraint(fields=['product', 'slug'], name='unique_product_spec_slug')
        ]

    def __str__(self):
        return f"{self.product.name} ({self.storage} - {self.color})"

# --- CACHÉ DE PRECIOS DE LA SPEC POR MERCADO ---
class SpecMarketStats(models.Model):
    """
    Fuente de verdad de los caches de precio de una Spec para un Market concreto.
    Sustituye a los campos legacy de Spec (congelados tras el backfill).
    """
    spec = models.ForeignKey(Spec, on_delete=models.CASCADE, related_name='market_stats')
    market = models.ForeignKey(Market, on_delete=models.PROTECT, related_name='+')

    min_price_cached = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    lowest_ever_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    lowest_ever_date = models.DateTimeField(null=True, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            UniqueConstraint(fields=['spec', 'market'], name='unique_spec_market_stats')
        ]

    def __str__(self):
        return f"{self.spec} @ {self.market.code}"

# --- NIVEL 3: LA OFERTA COMERCIAL (El Mercado Real) ---
class Offer(models.Model):
    """
    Una opción de compra real. (Ej: 'iPhone 13 128GB Azul - Muy Bueno - Batería Nueva - ES - current_price, last_updated, min_price_30d, max_price_30d, deal_score').
    """
    class Condition(models.TextChoices):
        FAIR = 'Fair', 'Fair'
        GOOD = 'Good', 'Good'
        EXCELLENT = 'Excellent', 'Excellent'
        PREMIUM = 'Premium', 'Premium'

    spec = models.ForeignKey(Spec, on_delete=models.CASCADE, related_name='offers')
    
    condition = models.CharField(max_length=20, choices=Condition.choices)
    battery_new = models.BooleanField(default=False) # False=Standard, True=New
    country = models.CharField(max_length=5, default='ES') # Campo heredado, se reemplaza por market
    market = models.ForeignKey(Market, null=True, blank=True, on_delete=models.PROTECT, related_name='offers')
    url = models.URLField(max_length=2000, null=True, blank=True)

    # CACHÉ NIVEL 3: Datos listos para pintar en la lista de ofertas sin calcular nada
    current_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)
    
    # Métricas para etiquetas de marketing ("Chollo", "Precio Alto")
    min_price_30d = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # NUEVO: Fecha del mínimo mensual
    min_price_30d_date = models.DateTimeField(null=True, blank=True)
    max_price_30d = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # NUEVO: Fecha del máximo mensual
    max_price_30d_date = models.DateTimeField(null=True, blank=True)
    deal_score = models.IntegerField(default=50) # 0-100

    # RÉCORDS HISTÓRICOS (Absolutos) - ¡NUEVO!
    all_time_min_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    all_time_min_date = models.DateTimeField(null=True, blank=True)
    
    all_time_max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    all_time_max_date = models.DateTimeField(null=True, blank=True)

    # --- AÑADIMOS ESTO PARA LA MONETIZACIÓN ---
    # Usamos default=uuid.uuid4 para que Django lo asigne solo al crear nuevas ofertas.
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    # ------------------------------------------

    class Meta:
        # Solo una oferta activa por cada combinación de Estado+Batería+País para esa Spec
        unique_together = ('spec', 'condition', 'battery_new', 'country')
        indexes = [
            models.Index(fields=['current_price']), # Para ordenar por precio rápido
            models.Index(fields=['deal_score']),    # Para filtrar "Chollos"
            models.Index(fields=['last_updated']),  # Filtramos por fecha para saber si está "fresca"
        ]

    def __str__(self):
        return f"Oferta: {self.spec} ({self.condition}) - {self.current_price}€"

# --- HISTÓRICO DE PRECIOS (Log Puro) ---
class PriceHistory(models.Model):
    """
    Historial inmutable. Solo se usa para dibujar la gráfica, no para listas (Ej: 'offer, price, timestamp').
    """
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='history')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['offer', '-timestamp']), # Para gráficas de precio de una oferta
        ]


# --- ALERTAS FLEXIBLES (Corregido) ---
class Alert(models.Model):
    """
    Sistema de alertas flexible.
    Se vincula al PRODUCTO (Familia), no a la Spec.
    Los campos JSON permiten selección múltiple o vacía (Cualquiera).
    """
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE, related_name='alerts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    
    # País obligatorio (String simple porque dijiste que era obligatorio uno)
    country = models.CharField(max_length=5, default='ES') # Campo heredado, se reemplaza por market
    market = models.ForeignKey(Market, null=True, blank=True, on_delete=models.PROTECT, related_name='alerts')
    
    # Precio Umbral (Obligatorio)
    price_threshold = models.DecimalField(max_digits=10, decimal_places=2)

    # --- CAMPOS FLEXIBLES (JSON para selección múltiple) ---
    # Si la lista está vacía [] significa "ME DA IGUAL (Cualquiera)"
    # Si tiene datos ["Red", "Blue"] significa "UNO DE ESTOS"
    
    target_conditions = models.JSONField(default=list, blank=True) 
    # Ej: ["Good", "Excellent"]
    
    target_storages = models.JSONField(default=list, blank=True) 
    # Ej: ["128", "256"]
    
    target_colors = models.JSONField(default=list, blank=True)   
    # Ej: ["Midnight", "Blue"]

    battery_new = models.BooleanField(null=True, blank=True) 
    # True=Nueva, False=Estandar, Null=Me da igual

    # Estado de la notificación
    notified = models.BooleanField(default=False)
    repeat = models.BooleanField(default=False)
    last_notified = models.DateTimeField(null=True, blank=True)

    class Meta:
        # AÑADIR ESTO:
        indexes = [
            models.Index(fields=['notified']), # Buscamos notified=False constantemente
            models.Index(fields=['product']),  # Buscamos alertas por producto
        ]

    def __str__(self):
        return f"Alerta {self.product.name} < {self.price_threshold}€ ({self.subscriber.email})"
    
# --- NUEVO MODELO DE TELEMETRÍA ---
class ClickEvent(models.Model):
    """Registra cada vez que un usuario hace clic en "Comprar en BackMarket"."""
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name='clicks')
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    
    referer = models.CharField(max_length=500, blank=True, null=True)
    user_agent = models.CharField(max_length=500, blank=True, null=True)
    
    # RGPD: No guardamos IPs, guardamos un hash
    ip_hash = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        ordering = ['-timestamp']