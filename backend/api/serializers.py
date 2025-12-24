from rest_framework import serializers
from .models import Product, Variant, PriceHistory
from django.utils import timezone
from datetime import timedelta

# 1. Serializer para el PRECIO (Lo usaremos dentro de las variantes)
class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['price', 'timestamp', 'condition', 'battery', 'country']

# 2. Serializer para la VARIANTE (Incluye los precios)
class VariantSerializer(serializers.ModelSerializer):
    # Usamos un SerializerMethodField para filtrar los precios dinámicamente
    price_history = serializers.SerializerMethodField()

    class Meta:
        model = Variant
        fields = ['id', 'uuid', 'storage', 'color', 'price_history']

    def get_price_history(self, obj):
        # Recuperamos los parámetros de la URL (ej: ?days=30)
        request = self.context.get('request')
        days = request.query_params.get('days')
        
        # Filtramos los precios de esta variante
        prices = obj.prices.all() # 'prices' es el related_name que pusimos en models.py

        if days:
            start_date = timezone.now() - timedelta(days=int(days))
            prices = prices.filter(timestamp__gte=start_date)
        
        # Ordenamos y limitamos (opcional, para no saturar)
        return PriceHistorySerializer(prices, many=True).data

# 3. Serializer DETALLADO (Para cuando entras a UN producto)
class ProductDetailSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'variants']

# 4. Serializer LISTADO (Ligero, para la página principal)
class ProductListSerializer(serializers.ModelSerializer):
    # Aquí NO incluimos las variantes completas, o quizás solo un resumen
    # Para simplificar, de momento no mostramos variantes en el listado general
    variant_count = serializers.IntegerField(source='variants.count', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'type', 'variant_count']


# NUEVO: Serializer para las Tarjetas del Catálogo
class ProductCardSerializer(serializers.ModelSerializer):
    """
    Serializer optimizado para el grid de productos.
    Aplana la jerarquía: Variant -> Product -> PriceHistory
    """
    # 1. Aplanamos datos del Padre (Product)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_type = serializers.CharField(source='product.type', read_only=True)
    
    # 2. Campos calculados para el historial de precios (Hijos)
    current_price = serializers.SerializerMethodField()
    condition = serializers.SerializerMethodField()
    last_updated = serializers.SerializerMethodField()
    
    # 3. Datos propios de la Variante
    # (Ya incluidos en 'fields' abajo: storage, color, uuid)

    class Meta:
        model = Variant
        fields = [
            'id', 'uuid', 
            'product_name', 'product_type', 
            'storage', 'color', 
            'current_price', 'condition', 'last_updated'
        ]

    def get_current_price(self, obj):
        # El prefetch_related en la vista ya habrá traído los precios.
        # Usamos 'all()' en lugar de 'filter()' para aprovechar la caché de prefetch.
        prices = list(obj.prices.all())
        if prices:
            # Asumimos que están ordenados por fecha descendente (ver models.py o views.py)
            return prices[0].price
        return None

    def get_condition(self, obj):
        prices = list(obj.prices.all())
        if prices:
            return prices[0].get_condition_display()
        return None

    def get_last_updated(self, obj):
        prices = list(obj.prices.all())
        if prices:
            return prices[0].timestamp
        return None