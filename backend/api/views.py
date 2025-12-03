from django.shortcuts import render

# Create your views here.
# api/views.py

from rest_framework import viewsets
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    
    # Esta función decide qué Serializer usar
    def get_serializer_class(self):
        # Si piden un producto concreto (retrieve), damos todos los detalles
        if self.action == 'retrieve':
            return ProductDetailSerializer
        # Si piden la lista general, damos la versión ligera
        return ProductListSerializer
    