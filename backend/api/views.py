from django.shortcuts import render

# Create your views here.
# api/views.py
from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()      # ¿Qué datos busco?
    serializer_class = ProductoSerializer  # ¿Cómo los traduzco?