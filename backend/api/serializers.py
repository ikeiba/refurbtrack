from rest_framework import serializers
from .models import Alert, Product, Spec, Offer, PriceHistory, Subscriber
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator

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
            'max_price_30d_date'
        ]

# --- 3. NIVEL 2: LA SPEC (El Configurador) ---
class SpecSerializer(serializers.ModelSerializer):
    """
    La variante técnica (iPhone 13 128GB Azul).
    Incluye la lista de ofertas activas (Standard, New Battery, etc.)
    """
    offers = OfferSerializer(many=True, read_only=True)
    # TRUCO: Forzamos que la imagen sea texto plano para que no añada el dominio del backend
    image = serializers.CharField(read_only=True)
    class Meta:
        model = Spec
        fields = [
            'id', 
            'back_market_uuid',
            'storage', 
            'color',
            'image', # <--- AÑADIR ESTO
            'min_price_cached', 
            'offers' # Anidamos las ofertas disponibles
        ]

# --- 4. NIVEL 1: EL PRODUCTO (La Familia) ---

# A. Para la HOME (Vista Ligera)
class ProductListSerializer(serializers.ModelSerializer):
    """
    Equivale a tu antiguo 'ProductListSerializer' pero usando el caché.
    """
    image = serializers.CharField(read_only=True) # <--- AÑADIR ESTO
    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'image', 'min_price_cached', 'market_price']

# B. Para el DETALLE (Vista Pesada)
class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Carga TODO el árbol: Producto -> Specs -> Offers.
    Sustituye a tu antiguo 'ProductDetailSerializer'.
    """
    specs = SpecSerializer(many=True, read_only=True)
    image = serializers.CharField(read_only=True) # <--- AÑADIR ESTO

    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'image', 'specs']


# backend/api/serializers.py

class AlertSerializer(serializers.ModelSerializer):
    # Campos de escritura (Input)
    product_id = serializers.IntegerField(write_only=True)
    email = serializers.EmailField(write_only=True)
    
    # Campos de lectura (Output para el Dashboard)
    product_name = serializers.CharField(source='product.name', read_only=True)
    # AÑADIDO: Devolvemos el ID real del producto para poder hacer links
    product = serializers.PrimaryKeyRelatedField(read_only=True)

    # AÑADIDO: Recuperamos la imagen del producto relacionado
    product_image = serializers.CharField(source='product.image', read_only=True)

    class Meta:
        model = Alert
        fields = [
            'id',
            'email',            # Ahora sí funciona porque lo declaramos arriba
            'price_threshold', 
            'product_id',   # Entrada (Write)
            'product',      # Salida (Read) -> ID del producto
            'product_name', # Salida (Read) -> Nombre
            'product_image',# Salida (Read) -> Imagen 
            'target_colors', 
            'target_storages', 
            'target_conditions', 
            'battery_new',
            'country'
        ]

    def create(self, validated_data):
        # Extraemos el ID del producto y el email
        product_id = validated_data.pop('product_id')
        email = validated_data.pop('email') # <--- Ahora esto funcionará perfecto

        product = Product.objects.get(id=product_id)
        
        # Gestión del suscriptor
        subscriber, _ = Subscriber.objects.get_or_create(email=email)
        
        # Creamos la alerta
        alert = Alert.objects.create(
            subscriber=subscriber,
            product=product,
            **validated_data
        )
        return alert
    

class HistoricalLowOfferSerializer(serializers.ModelSerializer):
    # Campos aplanados para facilitar la vida al frontend
    product_id = serializers.IntegerField(source='spec.product.id')
    name = serializers.CharField(source='spec.product.name')
    storage = serializers.CharField(source='spec.storage')
    color = serializers.CharField(source='spec.color')
    condition = serializers.CharField(source='get_condition_display')
    
    # CAMBIO CLAVE: Usamos SerializerMethodField pero devolvemos STRING, no URL
    image = serializers.SerializerMethodField()
    
    old_price = serializers.DecimalField(source='all_time_max_price', max_digits=10, decimal_places=2)

    class Meta:
        model = Offer
        fields = [
            'id', 'product_id', 'name', 'storage', 'color', 'url',
            'condition', 'battery_new', 'current_price', 'old_price', 'image'
        ]

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
    
class UserRegistrationSerializer(serializers.ModelSerializer):
    # 1. Hacemos el email OBLIGATORIO y ÚNICO (Django por defecto no lo exige)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # 2. Quitamos 'username' de aquí. El frontend no lo envía.
        fields = ('email', 'password') 

    def create(self, validated_data):
        # 3. TRUCO: Usamos el email como username
        user = User.objects.create_user(
            username=validated_data['email'], 
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user