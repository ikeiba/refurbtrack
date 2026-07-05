from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (DeleteAccountView, HistoricalLowOffersView, PasswordResetRequestView, 
                    ProductViewSet, 
                    OfferHistoryView, 
                    AlertListCreateView, SubscriberUnsubscribeView, UnsubscribeUserView, 
                    UserRegistrationView, 
                    AlertDetailView,
                    AlertUnsubscribeView, PasswordResetConfirmView, health_check, redirect_to_store, 
                    ProductResolveBySlugView, sitemap_data, top_specs_for_build, GoogleLoginView)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


# El Router crea automáticamente las rutas estándar para el ViewSet:
# GET /api/products/       (Lista)
# GET /api/products/{id}/  (Detalle)
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [

    # 1. EL RESOLVER (Prioridad máxima para el SEO)
    path('products/resolve/', ProductResolveBySlugView.as_view(), name='product-resolve'),

    path('products/sitemap-data/', sitemap_data, name='sitemap_data'),

    # NUESTRO NUEVO ENDPOINT PARA EL BUILD
    path('products/top-specs/', top_specs_for_build, name='top_specs_build'),

    # Rutas automáticas del router
    path('', include(router.urls)),

    # Ruta manual para el historial (Gráfica)
    # Ejemplo: /api/offers/5/history/?days=30
    path('offers/<int:pk>/history/', OfferHistoryView.as_view(), name='offer-history'),
    # NUEVA RUTA
    path('alerts/', AlertListCreateView.as_view(), name='alert-list-create'),
    # NUEVA RUTA: Ruta para una alerta específica (DELETE / GET)
    # <int:pk> captura el ID (ej: el 3 de tu error)
    path('alerts/<int:pk>/', AlertDetailView.as_view(), name='alert-detail'),

    path('offers/historical-lows/', HistoricalLowOffersView.as_view(), name='historical-lows'),

    # --- RUTAS DE AUTENTICACIÓN ---
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Da el token
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Renueva el token

    # Acción: Borrar una alerta específica
    path('alerts/unsubscribe/', AlertUnsubscribeView.as_view(), name='alert-unsubscribe'),
    # Acción: Borrar TODAS las alertas (baja del suscriptor)
    path('alerts/unsubscribe-all/', SubscriberUnsubscribeView.as_view(), name='subscriber-unsubscribe'),

    # --- RUTAS PRIVADAS (Requieren Login/Session) ---
    # Acción: Limpiar alertas de la cuenta actual
    path('user/unsubscribe-all/', UnsubscribeUserView.as_view(), name='user-unsubscribe-all'),
    # Acción: Borrar cuenta completa
    path('user/delete/', DeleteAccountView.as_view(), name='user-delete'),
    
    # backend/api/urls.py

    path('auth/forgot-password/', PasswordResetRequestView.as_view()),
    path('auth/reset-password/', PasswordResetConfirmView.as_view()),

    # Healthcheck para Docker
    path('health/', health_check, name='health-check'),  # 👈 AÑADE ESTO

    # Añade esta línea a tu urlpatterns existente:
    path('out/<uuid:offer_uuid>/', redirect_to_store, name='redirect_to_store'),
    
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
]