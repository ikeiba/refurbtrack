# api/admin.py
from django.contrib import admin
from .models import Subscriber, Product, Spec, Offer, PriceHistory, Alert
from django.utils.html import format_html
from django.urls import reverse

# --- NIVEL 1: PRODUCTO ---
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'min_price_cached')
    search_fields = ('name',)
    list_filter = ('type',)

# --- NIVEL 2: SPEC (Antigua Variante) ---
@admin.register(Spec)
class SpecAdmin(admin.ModelAdmin):
    list_display = ('get_product_name', 'back_market_uuid', 'storage', 'color', 'min_price_cached')
    search_fields = ('product__name', 'back_market_uuid')
    list_filter = ('product__type', 'storage', 'color')
    
    def get_product_name(self, obj):
        return obj.product.name
    get_product_name.short_description = 'Producto'
    get_product_name.admin_order_field = 'product__name'

# --- NIVEL 3: OFFER (Aquí está ahora la "magia" visual) ---
@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    # Optimizamos consultas trayendo datos del padre (Spec) y del abuelo (Product)
    list_select_related = ('spec', 'spec__product')
    
    list_display = (
        'link_to_spec',         # Link al Spec/Producto
        'get_storage',          # Del padre Spec
        'get_color',            # Del padre Spec
        'battery_status',       # Icono visual
        'get_colored_condition',# Colores adaptados
        'current_price',
        'country',
        'deal_score',
        'last_updated'
    )
    
    list_filter = ('condition', 'battery_new', 'country', 'spec__product')
    search_fields = ('spec__product__name', 'spec__back_market_uuid')

    # --- 1. DATOS HEREDADOS DEL SPEC ---
    def get_storage(self, obj): return obj.spec.storage
    get_storage.short_description = 'Alm.'

    def get_color(self, obj): return obj.spec.color
    get_color.short_description = 'Color'

    # --- 2. BATERÍA VISUAL ---
    def battery_status(self, obj):
        if obj.battery_new:
            return format_html('<span style="color:green">🔋 Nueva</span>')
        return "Estándar"
    battery_status.short_description = 'Batería'
    battery_status.admin_order_field = 'battery_new'

    # --- 3. COLORES DE CONDICIÓN (Adaptado a TextChoices) ---
    def get_colored_condition(self, obj):
        # Mapeo actualizado: String -> Color CSS
        colors = {
            'Premium': '#2ecc71',   # Verde
            'Excellent': '#3498db', # Azul
            'Good': '#f39c12',      # Naranja
            'Fair': '#e74c3c',      # Rojo
        }
        color_code = colors.get(obj.condition, 'black')
        label = obj.get_condition_display()
        
        return format_html(
            '<strong style="color: {};">{}</strong>',
            color_code,
            label
        )
    get_colored_condition.short_description = 'Estado'
    get_colored_condition.admin_order_field = 'condition'

    # --- 4. LINK DINÁMICO ---
    def link_to_spec(self, obj):
        # Link para editar el Spec padre directamente
        link = reverse("admin:api_spec_change", args=[obj.spec.id])
        return format_html('<a href="{}">{}</a>', link, str(obj.spec))
    link_to_spec.short_description = 'Spec (Variante)'

# --- HISTÓRICO DE PRECIOS ---
@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_select_related = ('offer', 'offer__spec', 'offer__spec__product')
    list_display = ('get_offer_str', 'price', 'timestamp')
    date_hierarchy = 'timestamp'
    
    def get_offer_str(self, obj):
        return str(obj.offer)
    get_offer_str.short_description = 'Oferta'

# --- ALERTAS (Con formato JSON) ---
@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('subscriber', 'product', 'price_threshold', 'show_targets', 'notified')
    list_filter = ('notified', 'product')

    def show_targets(self, obj):
        # Muestra un resumen legible de los filtros JSON
        targets = []
        if obj.target_colors: targets.append(f"Color: {obj.target_colors}")
        if obj.target_storages: targets.append(f"GB: {obj.target_storages}")
        if obj.target_conditions: targets.append(f"Estado: {obj.target_conditions}")
        if not targets: return "Cualquiera (Sin filtros)"
        return ", ".join(targets)
    show_targets.short_description = 'Filtros Flexibles'

admin.site.register(Subscriber)