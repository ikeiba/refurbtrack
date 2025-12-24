# backend/api/views.py

from rest_framework import viewsets
from django.db.models import Prefetch

# Asegúrate de importar tus modelos y el nuevo serializer
from .models import Product, Variant, PriceHistory
from .serializers import ProductListSerializer, ProductDetailSerializer, ProductCardSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

# NUEVO: ViewSet para el Catálogo
class VariantViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint principal para el frontend. 
    Devuelve variantes con precios, optimizado para evitar N+1 queries.
    """
    serializer_class = ProductCardSerializer
    
    def get_queryset(self):
        # Query optimizada:
        # 1. select_related('product'): Trae el "Padre" en la misma query SQL.
        # 2. prefetch_related(...): Trae los precios en una segunda query separada pero eficiente,
        #    ordenados por fecha para que our serializer siempre coja el último primero.
        return Variant.objects.select_related('product').prefetch_related(
            Prefetch('prices', queryset=PriceHistory.objects.order_by('-timestamp'))
        )