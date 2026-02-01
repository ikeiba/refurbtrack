from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from django.db.models import Prefetch
from django.utils import timezone
from datetime import timedelta
# Añade F para comparar columnas
from django.db.models import F 

# Para el unsuscribe seguro
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from rest_framework.views import APIView
from rest_framework import status


from .models import Alert, Product, Spec, Offer, PriceHistory, Subscriber
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
            reset_link = f"http://localhost:3000/auth/reset-password/{uid}/{token}"
            
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