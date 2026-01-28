# backend/api/admin.py

from django.contrib import admin
from .models import Subscriber, Product, Spec, Offer, PriceHistory, Alert
from django.utils.html import format_html
from django.urls import reverse

# --- UTILIDAD PARA IMÁGENES ---
# Función helper para no repetir código en Product y Spec
def image_preview_helper(image_field):
    if image_field:
        return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: contain;" />', image_field.url)
    return "-"

# --- SUSCRIPTORES (Antes no tenía configuración) ---
@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
    search_fields = ('email',)
    ordering = ('-created_at',)

# --- NIVEL 1: PRODUCTO ---
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'image_preview', 
        'name', 
        'type', 
        'min_price_cached', 
        'lowest_ever_price', # Nuevo: Récord histórico
        'last_updated',       # Nuevo: Cuándo se actualizó
        'market_price'      # Nuevo: Precio de mercado aproximado
    )
    search_fields = ('name',)
    list_filter = ('type',)
    readonly_fields = ('last_updated', 'lowest_ever_price', 'lowest_ever_date')

    def image_preview(self, obj):
        return image_preview_helper(obj.image)
    image_preview.short_description = 'Img'

# --- NIVEL 2: SPEC (Variante Técnica) ---
@admin.register(Spec)
class SpecAdmin(admin.ModelAdmin):
    list_select_related = ('product',) # Optimización DB
    
    list_display = (
        'image_preview',
        'get_product_name', 
        'storage', 
        'color', 
        'back_market_uuid', 
        'min_price_cached',
        'lowest_ever_price' # Nuevo: Récord de esta variante
    )
    search_fields = ('product__name', 'back_market_uuid')
    list_filter = ('product__type', 'storage', 'color')
    
    def get_product_name(self, obj):
        return obj.product.name
    get_product_name.short_description = 'Producto'
    get_product_name.admin_order_field = 'product__name'

    def image_preview(self, obj):
        # Si la spec no tiene foto, intenta mostrar la del producto padre
        img = obj.image if obj.image else obj.product.image
        return image_preview_helper(img)
    image_preview.short_description = 'Img'

# --- NIVEL 3: OFFER (La Ficha Comercial) ---
@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    # Traemos datos del padre (Spec) y del abuelo (Product) para que no vaya lento
    list_select_related = ('spec', 'spec__product')
    
    list_display = (
        'link_to_spec',         # Link al Spec
        'get_storage',          # Del padre Spec
        'get_color',            # Del padre Spec
        'battery_status',       # Icono visual
        'get_colored_condition',# Colores adaptados
        'current_price',
        'min_price_30d',        # Nuevo: Mínimo mensual
        'all_time_min_price',   # Nuevo: Mínimo histórico absoluto
        'all_time_max_price',   # Nuevo: Máximo histórico absoluto
        'deal_score',
        'go_to_backmarket',     # Nuevo: Botón para ir a la web real
        'last_updated'
    )
    
    list_filter = ('condition', 'battery_new', 'country', 'spec__product')
    search_fields = ('spec__product__name', 'spec__back_market_uuid', 'url')
    
    # Campos que no se deben tocar manualmente en el admin, solo ver
    readonly_fields = (
        'min_price_30d', 'min_price_30d_date', 
        'max_price_30d', 'max_price_30d_date',
        'all_time_min_price', 'all_time_min_date',
        'all_time_max_price', 'all_time_max_date',
        'last_updated'
    )

    # --- DATOS HEREDADOS ---
    def get_storage(self, obj): return obj.spec.storage
    get_storage.short_description = 'GB'

    def get_color(self, obj): return obj.spec.color
    get_color.short_description = 'Color'

    # --- BATERÍA VISUAL ---
    def battery_status(self, obj):
        if obj.battery_new:
            return format_html('<span style="color:green; font-weight:bold;">🔋 Nueva</span>')
        return "Estándar"
    battery_status.short_description = 'Batería'
    battery_status.admin_order_field = 'battery_new'

    # --- LINK EXTERNO ---
    def go_to_backmarket(self, obj):
        if obj.url:
            return format_html('<a href="{}" target="_blank" style="background-color:#000; color:#fff; padding:3px 8px; border-radius:4px; text-decoration:none;">Ver ↗</a>', obj.url)
        return "-"
    go_to_backmarket.short_description = 'Link'

    # --- COLORES DE CONDICIÓN ---
    def get_colored_condition(self, obj):
        colors = {
            'Premium': '#2ecc71',   # Verde
            'Excellent': '#3498db', # Azul
            'Good': '#f39c12',      # Naranja
            'Fair': '#e74c3c',      # Rojo
        }
        color_code = colors.get(obj.condition, 'black')
        # Usamos get_display para que si en BD es 'Fair', muestre 'Fair' (o su traducción si la tuvieras)
        label = obj.get_condition_display()
        return format_html('<strong style="color: {};">{}</strong>', color_code, label)
    get_colored_condition.short_description = 'Estado'
    get_colored_condition.admin_order_field = 'condition'

    # --- LINK INTERNO ---
    def link_to_spec(self, obj):
        link = reverse("admin:api_spec_change", args=[obj.spec.id])
        return format_html('<a href="{}">{}</a>', link, str(obj.spec.product.name))
    link_to_spec.short_description = 'Producto'

# --- HISTÓRICO DE PRECIOS ---
@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_select_related = ('offer', 'offer__spec', 'offer__spec__product')
    list_display = ('get_offer_str', 'price', 'timestamp')
    date_hierarchy = 'timestamp' # Añade navegación por fechas arriba
    list_filter = ('timestamp',) 
    
    def get_offer_str(self, obj):
        return f"{obj.offer.spec.product.name} ({obj.offer.get_condition_display()})"
    get_offer_str.short_description = 'Oferta'

# --- ALERTAS ---
@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = (
        'subscriber', 
        'product', 
        'price_threshold', 
        'show_targets', 
        'notified', 
        'last_notified', # Nuevo: Cuándo se avisó
        'repeat'         # Nuevo: Si es repetitiva
    )
    list_filter = ('notified', 'repeat', 'product')
    search_fields = ('subscriber__email', 'product__name')

    def show_targets(self, obj):
        targets = []
        if obj.target_colors: targets.append(f"🎨 {len(obj.target_colors)}")
        if obj.target_storages: targets.append(f"💾 {len(obj.target_storages)}")
        if obj.target_conditions: targets.append(f"✨ {len(obj.target_conditions)}")
        if not targets: return "Cualquiera"
        return " | ".join(targets)
    show_targets.short_description = 'Filtros'