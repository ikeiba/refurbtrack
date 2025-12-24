# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Importamos la nueva vista
from .views import ProductViewSet, VariantViewSet

router = DefaultRouter()

# Rutas existentes
router.register(r'products', ProductViewSet)

# NUEVA RUTA:
# Esto crea: http://127.0.0.1:8000/api/catalog/
router.register(r'catalog', VariantViewSet, basename='catalog')

urlpatterns = [
    path('', include(router.urls)),
]