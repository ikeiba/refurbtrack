from rest_framework import viewsets, generics
from rest_framework.response import Response
from django.db.models import Prefetch
from django.utils import timezone
from datetime import timedelta

from .models import Product, Spec, Offer, PriceHistory
from .serializers import (
    ProductListSerializer, 
    ProductDetailSerializer, 
    PriceHistorySerializer
)

# --- 1. VIEWSET PRINCIPAL (Catálogo) ---
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Maneja el listado de productos (Home) y el detalle (Configurador).
    """
    # Queryset base (se sobrescribe abajo para optimizar)
    queryset = Product.objects.all()

    def get_serializer_class(self):
        """
        ¡Polimorfismo! 
        Usamos un serializer ligero para listar y uno pesado para el detalle.
        """
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        """
        Optimización de Consultas (Solving N+1 Problem).
        """
        queryset = Product.objects.all()

        if self.action == 'retrieve':
            # Si estamos viendo el detalle, necesitamos traer TODO el árbol de golpe.
            # Usamos 'prefetch_related' para hacer joins eficientes en SQL:
            # Trae las Specs Y TAMBIÉN sus Offers hijas en una sola operación optimizada.
            queryset = queryset.prefetch_related(
                'specs',
                'specs__offers'
            )
        
        return queryset

# --- 2. VISTA DE HISTÓRICO (Gráfica) ---
class OfferHistoryView(generics.ListAPIView):
    """
    Endpoint específico para la gráfica de precios.
    URL esperada: /api/offers/{id}/history/?days=30
    """
    serializer_class = PriceHistorySerializer

    def get_queryset(self):
        # 1. Capturamos el ID de la oferta desde la URL
        offer_id = self.kwargs['pk']
        
        # 2. Capturamos el parámetro ?days=30 (opcional)
        days = self.request.query_params.get('days', None)

        # 3. Filtramos
        queryset = PriceHistory.objects.filter(offer_id=offer_id)

        if days:
            try:
                days_int = int(days)
                start_date = timezone.now() - timedelta(days=days_int)
                queryset = queryset.filter(timestamp__gte=start_date)
            except ValueError:
                pass # Si pasan basura en ?days, ignoramos el filtro

        return queryset