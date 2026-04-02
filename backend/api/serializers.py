from rest_framework import serializers
from .models import Alert, Product, Spec, Offer, PriceHistory, Subscriber
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.core.mail import send_mail # <--- 1. IMPORTAR ESTO
from django.conf import settings # Para acceder al remitente por defecto
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.signing import TimestampSigner

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

    def get_url(self, obj):
        """
        Retorna la URL de redirección interna usando el UUID.
        """
        # Esto devolverá: /api/out/550e8400-e29b-41d4-a716-446655440000/
        return f"/api/out/{obj.uuid}/"

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
        
        # ---------------------------------------------------------
        # 3. ¡NUEVO! ENVÍO DE EMAIL HTML
        # ---------------------------------------------------------
        try:
            # A. Preparamos los datos para "rellenar" el HTML
            # Nota: product_url debería ser la URL de TU web (localhost:3000/product/...), 
            # pero como estamos en local, a veces Gmail no deja hacer clic en localhost.
            # Pondremos una variable genérica.

            signer = TimestampSigner()
            # TOKEN 1: Para borrar ESTA alerta específica
            token_alert = signer.sign(alert.id)
            # TOKEN 2: Para borrar al SUSCRIPTOR (y todas sus alertas)
            token_subscriber = signer.sign(subscriber.id)
            
            # Base URL del frontend
            base_url = "http://localhost:3000" # En producción usar env var

            # --- CORRECCIÓN DE LA IMAGEN ---
            # 1. Primero comprobamos si existe imagen (porque es opcional en el modelo)
            # 2. Convertimos el objeto ImageField a string para sacar la ruta
            final_image_url = ""
            if product.image:
                img_path = str(product.image)  # Esto nos da "products/foto.jpg"
                
                # Ahora sí podemos usar startswith porque img_path es texto
                if img_path.startswith("http"):
                    final_image_url = img_path
                else:
                    # Construimos la URL completa para que Gmail pueda descargarla (si fuera pública)
                    # o para que el link funcione.
                    final_image_url = f"{base_url}/{img_path}"
            else:
                # Imagen por defecto si el producto no tiene foto
                final_image_url = f"{base_url}/placeholder.jpg"

            context = {
                'product_name': product.name,
                'product_type': product.type if hasattr(product, 'type') else '',
                'target_price': alert.price_threshold,
                'product_image': final_image_url, # <--- Usamos la variable segura
                
                # DETALLES DE LA ALERTA
                'target_storages': ', '.join(alert.target_storages) if alert.target_storages else 'Cualquiera',
                'target_colors': ', '.join(alert.target_colors) if alert.target_colors else 'Cualquiera',
                'target_conditions': ', '.join(alert.target_conditions) if alert.target_conditions else 'Cualquiera',
                'battery_new': alert.battery_new,
                'country': alert.country,
                'has_criteria': bool(alert.target_storages or alert.target_colors or alert.target_conditions or alert.battery_new),
                
                # LINKS DE ACCIÓN
                'product_url': f"{base_url}/product/{product.id}",
                'home_url': base_url,
                'dashboard_url': f"{base_url}/dashboard",
                'login_url': f"{base_url}/auth/login",
                # LINK 1: Borrar solo esta (Botón rojo cuerpo del correo)
                'unsubscribe_url': f"{base_url}/alerts/unsubscribe?token={token_alert}",
                
                # LINK 2: Borrar TODO (Footer) - Apunta a una página NUEVA
                'unsubscribe_all_url': f"{base_url}/alerts/unsubscribe-all?token={token_subscriber}"
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
    
    def get_url(self, obj):
        """
        Apunta a nuestro nuevo endpoint de tracking.
        """
        return f"/api/out/{obj.uuid}/"
    
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