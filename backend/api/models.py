from django.db import models
# api/models.py

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    url_origen = models.URLField()
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre