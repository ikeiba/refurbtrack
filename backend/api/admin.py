from django.contrib import admin
# Register your models here.

from .models import Subscriber, Product, Variant, PriceHistory, Alert

admin.site.register(Subscriber)
admin.site.register(Product) 
admin.site.register(Variant)
admin.site.register(PriceHistory)
admin.site.register(Alert)
