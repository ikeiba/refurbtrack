from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from django.db.models import Prefetch
from django.utils import timezone
from datetime import timedelta
# Añade F para comparar columnas
from django.db.models import F 

import hashlib
from urllib.parse import urlencode
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.http import require_GET

# Para el unsuscribe seguro
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from rest_framework.views import APIView
from rest_framework import status

from rest_framework.decorators import api_view, permission_classes


from .models import Alert, Product, Spec, Offer, PriceHistory, Subscriber, Offer, ClickEvent
from .serializers import (
    AlertSerializer,
    ProductListSerializer, 
    ProductDetailSerializer, 
    PriceHistorySerializer,
    HistoricalLowOfferSerializer, 
    UserRegistrationSerializer
)

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model

from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from django.http import JsonResponse
from django.db import connection

from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken # Ajusta esto si no usas SimpleJWT
import os


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
    Devuelve las ofertas 'TOP' (Deal Score >= 90) detectadas en las últimas 24 horas.
    """
    serializer_class = HistoricalLowOfferSerializer

    def get_queryset(self):
        # 1. Calculamos el momento de corte (hace 24 horas)
        time_threshold = timezone.now() - timedelta(hours=24)

        return Offer.objects.filter(
            # CONDICIÓN 1: Calidad del chollo (0-100)
            deal_score__gte=90, 
            
            # CONDICIÓN 2: Frescura (actualizado hoy)
            last_updated__gte=time_threshold,
            
            # Seguridad extra: que tenga precio
            current_price__isnull=False 
        ).select_related(
            'spec', 'spec__product'
        ).order_by('?'
            #'-deal_score' # Primero los de mayor puntuación (100, 99...)
            #'current_price' # En caso de empate, el más barato primero
        )[:15] # Limitamos a 15 para el carrusel
    

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
    

class AlertUnsubscribeView(APIView):
    permission_classes = [] # Pública, porque la seguridad está en el token

    def post(self, request):
        token = request.data.get('token')
        signer = TimestampSigner()

        try:
            # 1. Intentamos descifrar el token (Validez: 30 días para borrar)
            # Esto devuelve el ID de la alerta si la firma es correcta
            alert_id = signer.unsign(token, max_age=60 * 60 * 24 * 30) 
            
            # 2. Borramos la alerta
            alert = Alert.objects.get(id=alert_id)
            alert.delete()
            
            return Response({"status": "deleted"}, status=status.HTTP_200_OK)

        except (BadSignature, SignatureExpired):
            return Response({"error": "Link inválido o caducado"}, status=status.HTTP_400_BAD_REQUEST)
        except Alert.DoesNotExist:
            # Si ya estaba borrada, decimos que ok para no confundir
            return Response({"status": "deleted"}, status=status.HTTP_200_OK)
        

# backend/api/views.py

class SubscriberUnsubscribeView(APIView):
    """
    Borra al suscriptor completo y todas sus alertas en cascada.
    Requiere confirmación en frontend, pero aquí ejecutamos la acción.
    """
    permission_classes = []

    def post(self, request):
        token = request.data.get('token')
        signer = TimestampSigner()

        try:
            # 1. Validamos el token (usamos un "namespace" diferente para no mezclar tokens)
            # El token debe contener el ID del SUSCRIPTOR, no de la alerta.
            subscriber_id = signer.unsign(token, max_age=60 * 60 * 24 * 60) # 60 días de validez
            
            # 2. Borramos al suscriptor
            # Al tener on_delete=models.CASCADE en el modelo Alert, esto borra TODAS sus alertas.
            subscriber = Subscriber.objects.get(id=subscriber_id)
            subscriber.delete()
            
            return Response({"status": "deleted"}, status=status.HTTP_200_OK)

        except (BadSignature, SignatureExpired):
            return Response({"error": "Link inválido o caducado"}, status=status.HTTP_400_BAD_REQUEST)
        except Subscriber.DoesNotExist:
            # Si ya no existe, damos el OK igual (idempotencia)
            return Response({"status": "deleted"}, status=status.HTTP_200_OK)


# 1. VISTA PARA DARSE DE BAJA DE ALERTAS (Mantiene la cuenta de usuario)
class UnsubscribeUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        email = request.user.email
        try:
            # Buscamos al suscriptor por el email del usuario logueado
            subscriber = Subscriber.objects.get(email=email)
            subscriber.delete() # Esto borra todas las alertas en cascada
            return Response({"message": "Alertas eliminadas"}, status=status.HTTP_200_OK)
        except Subscriber.DoesNotExist:
            return Response({"message": "No tenías suscripciones activas"}, status=status.HTTP_200_OK)

# 2. VISTA PARA ELIMINAR CUENTA (Borra Usuario + Suscriptor + Alertas)
class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        email = user.email
        
        # A. Borramos datos de suscripción si existen
        Subscriber.objects.filter(email=email).delete()
        
        # B. Borramos el usuario de login
        user.delete()
        
        return Response({"message": "Cuenta eliminada permanentemente"}, status=status.HTTP_200_OK)
    
User = get_user_model()

# 1. SOLICITAR EL LINK (Lo que llama tu página actual)
class PasswordResetRequestView(APIView):
    permission_classes = [] # Pública

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            
            # Generamos los componentes del link seguro
            # uid: ID del usuario encriptado en base64
            # token: Token temporal que caduca y usa la contraseña vieja como "salt"
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # URL del Frontend (Ajusta localhost:3000 si es necesario)
            base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')

            # Añadimos el /es/ para que Next.js no devuelva un 404
            reset_link = f"{base_url}/es/reset-password/{uid}/{token}"
            
            # Renderizamos el email
            context = {
                'user': user,
                'reset_link': reset_link
            }
            html_msg = render_to_string('emails/password_reset.html', context)
            plain_msg = strip_tags(html_msg)
            
            send_mail(
                subject='🔐 Recuperar contraseña - RefurbTrack',
                message=plain_msg,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_msg,
                fail_silently=False
            )
            
            return Response({"message": "Email enviado"}, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            # POR SEGURIDAD: En producción, deberías devolver 200 OK aunque no exista
            # para no revelar qué emails están registrados. Pero en desarrollo devolvemos 404 para ayudarte.
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

# 2. CONFIRMAR EL CAMBIO (Cuando el usuario envía la nueva pass)
class PasswordResetConfirmView(APIView):
    permission_classes = []

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')

        try:
            # Decodificamos el ID
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            # Verificamos si el token es válido
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"message": "Contraseña cambiada exitosamente"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "El enlace ha caducado o es inválido"}, status=status.HTTP_400_BAD_REQUEST)
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Enlace inválido"}, status=status.HTTP_400_BAD_REQUEST)
        

def health_check(request):
    """
    Endpoint de healthcheck para Docker.
    Verifica que Django está corriendo y puede conectar a la DB.
    """
    try:
        # Intenta hacer una query simple a la DB
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        return JsonResponse({
            'status': 'healthy',
            'database': 'connected'
        }, status=200)
    
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'error': str(e)
        }, status=503)  # 503 = Service Unavailable
    
def hash_ip(ip_address):
    """Hashea la IP para RGPD. Usar salt en producción es ideal."""
    if not ip_address:
        return ""
    return hashlib.sha256(ip_address.encode('utf-8')).hexdigest()

def build_awin_url(destination_url):
    """Construye el enlace de afiliado."""
    # Tu Publisher ID de Awin
    AWIN_PUBLISHER_ID = "2838864" 
    
    # IMPORTANTE: Sustituye esto por el ID del programa de Back Market
    # Lo verás en el panel de Awin cuando te acepten.
    AWIN_ADVERTISER_ID = "TU_ID_DE_BACKMARKET_AQUI" 

    base_url = "https://www.awin1.com/cread.php"
    params = {
        'awinmid': AWIN_ADVERTISER_ID,
        'awinaffid': AWIN_PUBLISHER_ID,
        'ued': destination_url
    }
    return f"{base_url}?{urlencode(params)}"

@require_GET
def redirect_to_store(request, offer_uuid):
    # 1. Buscamos la oferta usando el UUID seguro, no el ID autoincremental
    offer = get_object_or_404(Offer, uuid=offer_uuid)
    
    # 2. Si la oferta no tiene URL por algún motivo, redirigimos a una fallback
    if not offer.url:
        return redirect("https://www.backmarket.es")

    # 3. Guardamos la telemetría síncronamente (rápido en PostgreSQL)
    try:
        ClickEvent.objects.create(
            offer=offer,
            referer=request.META.get('HTTP_REFERER', '')[:500],
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
            ip_hash=hash_ip(request.META.get('REMOTE_ADDR', ''))
        )
    except Exception as e:
        # Si falla la BD por algo raro, imprimimos pero NO cortamos la redirección
        print(f"Error registrando clic: {e}")
    
    # ---------------------------------------------------------
    # 2. INTERRUPTOR DE MONETIZACIÓN (Bypass temporal)
    # ---------------------------------------------------------
    # Cambia esto a True el día que Back Market te apruebe en Awin
    AWIN_APPROVED = False 
    
    if AWIN_APPROVED:
        # Modo Monetización: Redirige a través de Awin
        final_url = build_awin_url(offer.url)
    else:
        # Modo Espera: Enlace directo y limpio a Back Market
        final_url = offer.url 
        
    response = redirect(final_url)
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

class ProductResolveBySlugView(APIView):
    """
    Cerebro del SEO: Resuelve la jerarquía de slugs y devuelve el detalle.
    URL: /api/resolve-slugs/?cat=...&brand=...&prod=...&spec=...
    """
    permission_classes = [] # Pública para SEO

    def get(self, request):
        # 1. Capturamos los slugs de la URL
        category_slug = request.query_params.get('cat')
        brand_slug = request.query_params.get('brand')
        product_slug = request.query_params.get('prod')
        spec_slug = request.query_params.get('spec')

        # 2. La consulta maestra (O(log n) gracias a los índices B-Tree)
        # Usamos select_related para evitar el problema de N+1 consultas.
        # Filtramos por los 4 niveles para asegurar que la jerarquía es válida.
        spec = get_object_or_404(
            Spec.objects.select_related(
                'product', 
                'product__brand', 
                'product__category'
            ).prefetch_related('offers'),
            slug=spec_slug,
            product__slug=product_slug,
            product__brand__slug=brand_slug,
            product__category__slug=category_slug
        )

        # 3. Serializamos (usamos el pesado porque es la vista de detalle)
        # IMPORTANTE: Pasamos el 'product' al serializer porque el detalle
        # espera la estructura desde el nivel de producto hacia abajo.
        serializer = ProductDetailSerializer(spec.product)
        
        # 4. Inyectamos datos extra útiles para el frontend
        data = serializer.data
        data['current_spec_id'] = spec.id # Para que Next.js sepa qué Spec marcar como activa
        
        return Response(data)
    

@api_view(['GET'])
def sitemap_data(request):
    # Traemos solo los slugs necesarios para construir las URLs
    # Usamos values() para que la consulta a la DB sea ultra ligera (solo strings)
    specs = Spec.objects.select_related('product', 'product__category', 'product__brand').values(
        'product__category__slug',
        'product__brand__slug',
        'product__slug',
        'slug',
        'last_updated'
    )
    return Response(list(specs))


@api_view(['GET'])
@permission_classes([AllowAny])
def top_specs_for_build(request):
    """
    Endpoint ultraligero para el SSG de Next.js.
    Devuelve solo los slugs de las 50 especificaciones más relevantes.
    """
    specs = Spec.objects.select_related(
        'product', 'product__category', 'product__brand'
    ).order_by('-last_updated')[:50].values(
        'product__category__slug',
        'product__brand__slug',
        'product__slug',
        'slug'
    )
    
    return Response(list(specs))



class GoogleLoginView(APIView):
    permission_classes = [] # El endpoint debe ser público para que puedan loguearse

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "Token no proveído"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. El portero comprueba el token con Google Cloud
            CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "TU_CLIENT_ID_AQUÍ")
            
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                CLIENT_ID
            )

            # 2. El token es válido. Sacamos los datos seguros de Google.
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')

            # 3. ¿El usuario existe? Si no, lo creamos.
            # Como tu app necesita que los usuarios sean suscriptores para las alertas,
            # te recomiendo importar y crear tu modelo Subscriber aquí también si hiciera falta.
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )

            # Si el usuario no tenía contraseña (porque se acaba de crear), 
            # Django le pone una inutilizable por defecto (set_unusable_password).
            # Esto es perfecto para que no puedan entrar por el login tradicional si no la cambian.
            if created:
                user.set_unusable_password()
                user.save()

            if created:
                    user.set_unusable_password()
                    user.save()

            # ---- ESTO ES A LO QUE ME REFERÍA ----
            # 3.5. Sincronizamos creando también su perfil de Suscriptor para tu negocio
            # Asegúrate de importar el modelo: from tu_app.models import Subscriber
            Subscriber.objects.get_or_create(email=email)

            # 4. Generamos los tokens de sesión de TU aplicación (SimpleJWT)
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'email': user.email,
                    'name': user.first_name,
                    'is_new': created
                }
            })

        except ValueError:
            # El token estaba falsificado o caducado
            return Response({"error": "Token de Google inválido"}, status=status.HTTP_401_UNAUTHORIZED)