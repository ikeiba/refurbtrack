# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

# El router crea automáticamente las URLs de la API
router = DefaultRouter()

# Registramos la ruta 'products'. 
# Esto habilitará: http://.../api/products/
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]