from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OfferHistoryView

# El Router crea automáticamente las rutas estándar para el ViewSet:
# GET /api/products/       (Lista)
# GET /api/products/{id}/  (Detalle)
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    # Rutas automáticas del router
    path('', include(router.urls)),

    # Ruta manual para el historial (Gráfica)
    # Ejemplo: /api/offers/5/history/?days=30
    path('offers/<int:pk>/history/', OfferHistoryView.as_view(), name='offer-history'),
]