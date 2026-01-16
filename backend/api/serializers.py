from rest_framework import serializers
from .models import Product, Spec, Offer, PriceHistory

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
    # Texto legible para el frontend (ej: "Fair" -> "Correcto")
    condition_label = serializers.CharField(source='get_condition_display', read_only=True)

    class Meta:
        model = Offer
        fields = [
            'id', 
            'condition', 
            'condition_label', 
            'battery_new', 
            'current_price', 
            'country', 
            'deal_score', 
            'min_price_30d',
            'last_updated'
        ]

# --- 3. NIVEL 2: LA SPEC (El Configurador) ---
class SpecSerializer(serializers.ModelSerializer):
    """
    La variante técnica (iPhone 13 128GB Azul).
    Incluye la lista de ofertas activas (Standard, New Battery, etc.)
    """
    offers = OfferSerializer(many=True, read_only=True)

    class Meta:
        model = Spec
        fields = [
            'id', 
            'back_market_uuid',
            'storage', 
            'color', 
            'min_price_cached', 
            'offers' # Anidamos las ofertas disponibles
        ]

# --- 4. NIVEL 1: EL PRODUCTO (La Familia) ---

# A. Para la HOME (Vista Ligera)
class ProductListSerializer(serializers.ModelSerializer):
    """
    Equivale a tu antiguo 'ProductListSerializer' pero usando el caché.
    """
    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'image', 'min_price_cached']

# B. Para el DETALLE (Vista Pesada)
class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Carga TODO el árbol: Producto -> Specs -> Offers.
    Sustituye a tu antiguo 'ProductDetailSerializer'.
    """
    specs = SpecSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'image', 'specs']