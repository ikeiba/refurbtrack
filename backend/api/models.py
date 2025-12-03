from django.db import models
# api/models.py

class Subscriber(models.Model):
    """
    Antigua tabla 'User'. Solo guarda emails para enviar alertas.
    No requiere contraseña ni login.
    """
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class Product(models.Model):
    # Opciones para el tipo de producto
    class ProductType(models.TextChoices):
        SMARTPHONE = 'Smartphone', 'Smartphone'
        TABLET = 'Tablet', 'Tablet'
        LAPTOP = 'Laptop', 'Laptop'
        SMARTWATCH = 'Smartwatch', 'Smartwatch'
        CONSOLE = 'Console', 'Consola'
        OTHER = 'Other', 'Otro'

    name = models.CharField(max_length=255)
    # Usamos choices aquí. Si el scraper encuentra algo nuevo, lo mapeas a 'OTHER' o actualizas la lista.
    type = models.CharField(
        max_length=50, 
        choices=ProductType.choices, 
        default=ProductType.OTHER
    ) 

    def __str__(self):
        return self.name

class Variant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    uuid = models.CharField(max_length=100, unique=True)
    # Dejamos storage/color como texto libre porque hay infinitas variaciones 
    # (ej: "256GB", "1TB", "Cosmic Gray", "Starlight")
    storage = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} ({self.storage} - {self.color})"

class PriceHistory(models.Model):
    class Condition(models.IntegerChoices):
        FAIR = 1, 'Fair (Correcto)'
        GOOD = 2, 'Good (Buen estado)'
        EXCELLENT = 3, 'Excellent (Excelente)'

    class Country(models.TextChoices):
        SPAIN = 'ES', 'España'
        FRANCE = 'FR', 'Francia'
        GERMANY = 'DE', 'Alemania'
        ITALY = 'IT', 'Italia'
        UK = 'UK', 'Reino Unido'
        USA = 'US', 'Estados Unidos'
        # Añade más según necesites

    variant = models.ForeignKey(Variant, on_delete=models.CASCADE, related_name='prices')
    battery = models.BooleanField(default=False) # False=Standard, True=New Battery
    
    condition = models.IntegerField(choices=Condition.choices, null=True, blank=True)
    country = models.CharField(max_length=5, choices=Country.choices)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['-timestamp']

class Alert(models.Model):
    # Relación con el Suscriptor (Email), no con el User de Django
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE, related_name='alerts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    
    # Filtros flexibles (Tal como pediste)
    # Usamos las mismas opciones (Choices) que definimos arriba para consistencia
    country = models.CharField(max_length=5, choices=PriceHistory.Country.choices, blank=True, null=True)
    condition = models.IntegerField(choices=PriceHistory.Condition.choices, null=True, blank=True)
    
    color = models.CharField(max_length=50, blank=True, null=True)
    storage = models.CharField(max_length=50, blank=True, null=True)
    battery = models.BooleanField(null=True, blank=True) 
    
    price_threshold = models.DecimalField(max_digits=10, decimal_places=2)
    
    notified = models.BooleanField(default=False)
    repeat = models.BooleanField(default=False) # ¿Quieres que avise cada vez que baje o solo una vez?
    last_notified = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Alerta {self.subscriber.email}: {self.product.name} < {self.price_threshold}"