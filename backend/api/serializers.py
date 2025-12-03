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