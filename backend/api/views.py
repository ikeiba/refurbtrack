from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from django.db.models import Prefetch
from django.utils import timezone
from datetime import timedelta
# Añade F para comparar columnas
from django.db.models import F 

from .models import Alert, Product, Spec, Offer, PriceHistory
from .serializers import (
    AlertSerializer,
    ProductListSerializer, 
    ProductDetailSerializer, 
    PriceHistorySerializer,
    HistoricalLowOfferSerializer, 
    UserRegistrationSerializer
)

from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny


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
        queryset = PriceHistory.objects.filter(offer_id=offer_id).order_by('timestamp')

        if days:
            try:
                days_int = int(days)
                start_date = timezone.now() - timedelta(days=days_int)
                queryset = queryset.filter(timestamp__gte=start_date)
            except ValueError:
                pass # Si pasan basura en ?days, ignoramos el filtro

        return queryset
    

# CAMBIO IMPORTANTE: Usamos ListCreateAPIView en lugar de CreateAPIView
class AlertListCreateView(generics.ListCreateAPIView):
    serializer_class = AlertSerializer
    # Mantenemos AllowAny para que el POST funcione desde el modal (invitados)
    # PERO filtramos en get_queryset quién ve qué.
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Lógica de seguridad:
        - Si hay usuario logueado -> Devuelve SUS alertas.
        - Si es anónimo -> Devuelve lista vacía (pero no falla, devuelve []).
        """
        user = self.request.user
        if user.is_authenticated:
            return Alert.objects.filter(subscriber__email=user.email).order_by('-id')
        
        # Si es GET y no está logueado, devolvemos nada
        return Alert.objects.none()


# --- NUEVA CLASE PARA EL CARRUSEL (Estilo Class-Based) ---
class HistoricalLowOffersView(generics.ListAPIView):
    """
    Devuelve las ofertas que están en su precio mínimo de los últimos 30 días.
    """
    serializer_class = HistoricalLowOfferSerializer # <--- Necesitamos crear esto

    def get_queryset(self):
        # La lógica de filtrado compleja va aquí
        return Offer.objects.filter(
            current_price__lte=F('min_price_30d'),
            current_price__isnull=False
        ).select_related('spec', 'spec__product').order_by('deal_score', 'current_price')[:15]
    

#? TAMBIEN SE PODRIA HACER CON VIEWSET (FUNCTION BASED VIEW)
'''
@api_view(['GET'])
def get_historical_low_offers(request):
    # LÓGICA: Dame ofertas donde el precio actual sea <= al mínimo de 30 días
    # Usamos select_related para traer los datos del Producto y Spec de una sola vez (optimización SQL)
    offers = Offer.objects.filter(
        current_price__lte=F('min_price_30d'),
        current_price__isnull=False
    ).select_related('spec', 'spec__product').order_by('deal_score', 'current_price')[:15] # Top 15 mejores

    data = []
    for offer in offers:
        product = offer.spec.product
        
        # Lógica de imagen: Preferimos la de la Spec, si no, la del Producto
        image_url = None
        if offer.spec.image:
            image_url = request.build_absolute_uri(offer.spec.image.url)
        elif product.image:
            image_url = request.build_absolute_uri(product.image.url)

        data.append({
            'id': offer.id,
            'product_id': product.id, # Para el link
            'name': product.name,
            'storage': offer.spec.storage,
            'color': offer.spec.color,
            'condition': offer.get_condition_display(), # Convierte 'Fair' en 'Correcto' si usas choices
            'battery_new': offer.battery_new,
            'current_price': offer.current_price,
            'old_price': offer.max_price_30d, # Usamos el máximo del mes como referencia de "antes"
            'image': image_url,
        })

    return Response(data)

'''

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny] # Cualquiera puede registrarse sin estar logueado

class AlertDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = AlertSerializer
    # Solo usuarios logueados pueden borrar
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Seguridad: Filtramos para que un usuario solo pueda 
        acceder o borrar alertas vinculadas a su email.
        """
        return Alert.objects.filter(subscriber__email=self.request.user.email)