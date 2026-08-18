# backend/api/admin.py

from django.contrib import admin
# ¡AÑADIDO ClickEvent a las importaciones!
from .models import Subscriber, Product, Spec, Offer, PriceHistory, Alert, ClickEvent, Category, Brand, Market, ProductMarketStats, SpecMarketStats
from django.utils.html import format_html
from django.urls import reverse

# --- UTILIDAD PARA IMÁGENES ---
def image_preview_helper(image_field):
    if image_field:
        return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: contain;" />', image_field.url)
    return "-"

# --- SUSCRIPTORES ---
@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
    search_fields = ('email',)
    ordering = ('-created_at',)

# --- NUEVO: CATEGORÍAS (SEO Nivel 0) ---
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug_display')
    prepopulated_fields = {"slug": ("name",)} # Ayuda a crear slugs a mano
    
    def slug_display(self, obj):
        return format_html('<code>/{}</code>', obj.slug)
    slug_display.short_description = 'URL Path'

# --- NUEVO: MARCAS (SEO Nivel 0) ---
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug_display')
    prepopulated_fields = {"slug": ("name",)}

    def slug_display(self, obj):
        return format_html('<code>/{}</code>', obj.slug)
    slug_display.short_description = 'URL Path'

# --- MERCADOS (Internacionalización) ---
@admin.register(Market)
class MarketAdmin(admin.ModelAdmin):
    list_display = ('code', 'country_code', 'currency', 'domain', 'language', 'locale')
    list_editable = ('currency', 'domain', 'language', 'locale')
    search_fields = ('code', 'domain', 'locale')

# --- STATS POR MERCADO (verificación del backfill) ---
@admin.register(ProductMarketStats)
class ProductMarketStatsAdmin(admin.ModelAdmin):
    list_select_related = ('product', 'market')
    list_display = ('product', 'market', 'min_price_cached', 'lowest_ever_price', 'market_price', 'last_updated')
    list_filter = ('market',)
    search_fields = ('product__name',)

@admin.register(SpecMarketStats)
class SpecMarketStatsAdmin(admin.ModelAdmin):
    list_select_related = ('spec', 'spec__product', 'market')
    list_display = ('spec', 'market', 'min_price_cached', 'lowest_ever_price', 'last_updated')
    list_filter = ('market',)
    search_fields = ('spec__product__name', 'spec__slug', 'spec__slug_en')

# --- NIVEL 1: PRODUCTO (Actualizado para SEO) ---
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_select_related = ('category', 'brand') # Optimización SQL
    list_display = (
        'image_preview', 
        'name', 
        'brand',      # <--- AÑADIDO
        'category',   # <--- AÑADIDO
        'full_slug_path', # <--- AÑADIDO (Ver ruta SEO)
        'min_price_cached', 
        'market_price'      
    )
    search_fields = ('name', 'slug')
    list_filter = ('category', 'brand') # <--- ACTUALIZADO
    readonly_fields = ('last_updated', 'lowest_ever_price', 'lowest_ever_date')

    def image_preview(self, obj):
        return image_preview_helper(obj.image)
    image_preview.short_description = 'Img'

    def full_slug_path(self, obj):
        return format_html('<small style="color:gray;">/{}/{}/</small><strong>{}</strong>', 
                           obj.category.slug, obj.brand.slug, obj.slug)
    full_slug_path.short_description = 'Jerarquía SEO'

# --- NIVEL 2: SPEC (Actualizado para SEO) ---
@admin.register(Spec)
class SpecAdmin(admin.ModelAdmin):
    list_select_related = ('product', 'product__brand', 'product__category') 
    
    list_display = (
        'image_preview',
        'get_product_name', 
        'storage', 
        'color', 
        'spec_slug_display', # <--- AÑADIDO
        'slug_en',           # <--- AÑADIDO (slug EN)
        'min_price_cached',
    )
    search_fields = ('product__name', 'slug', 'slug_en', 'back_market_uuid')
    list_filter = ('product__brand', 'storage', 'color')
    
    def get_product_name(self, obj):
        return obj.product.name
    get_product_name.short_description = 'Producto'

    def spec_slug_display(self, obj):
        return format_html('<code style="color:#8e44ad;">{}</code>', obj.slug)
    spec_slug_display.short_description = 'Slug Final'

    def image_preview(self, obj):
        img = obj.image if obj.image else obj.product.image
        return image_preview_helper(img)
    image_preview.short_description = 'Img'

# --- NIVEL 3: OFFER (La Ficha Comercial) ---
@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_select_related = ('spec', 'spec__product')
    
    list_display = (
        'link_to_spec',         
        'get_storage',          
        'get_color',            
        'battery_status',       
        'get_colored_condition',
        'market',              # <--- AÑADIDO
        'current_price',
        'deal_score',
        'go_to_backmarket',     
        'test_tracking_link',   # ¡NUEVO! Botón para probar la redirección
        'last_updated'
    )
    
    list_filter = ('condition', 'battery_new', 'country', 'market', 'spec__product')
    search_fields = ('spec__product__name', 'spec__back_market_uuid', 'url', 'uuid') # Añadido 'uuid' al buscador
    
    # ¡NUEVO! Añadido 'uuid' a los campos de solo lectura
    readonly_fields = (
        'uuid',
        'min_price_30d', 'min_price_30d_date', 
        'max_price_30d', 'max_price_30d_date',
        'all_time_min_price', 'all_time_min_date',
        'all_time_max_price', 'all_time_max_date',
        'last_updated'
    )

    def get_storage(self, obj): return obj.spec.storage
    get_storage.short_description = 'GB'

    def get_color(self, obj): return obj.spec.color
    get_color.short_description = 'Color'

    def battery_status(self, obj):
        if obj.battery_new:
            return format_html('<span style="color:green; font-weight:bold;">🔋 Nueva</span>')
        return "Estándar"
    battery_status.short_description = 'Batería'
    battery_status.admin_order_field = 'battery_new'

    def go_to_backmarket(self, obj):
        if obj.url:
            return format_html('<a href="{}" target="_blank" style="background-color:#000; color:#fff; padding:3px 8px; border-radius:4px; text-decoration:none;">BM ↗</a>', obj.url)
        return "-"
    go_to_backmarket.short_description = 'Directo'

    # --- NUEVO: BOTÓN DE PRUEBA DE REDIRECCIÓN ---
    def test_tracking_link(self, obj):
        if hasattr(obj, 'uuid') and obj.uuid:
            # Apunta a la ruta de tu API. Ajusta si tienes otro prefijo.
            url = f"/api/out/{obj.uuid}/"
            return format_html('<a href="{}" target="_blank" style="color:#3498db; font-weight:bold;">Tracking ↗</a>', url)
        return "-"
    test_tracking_link.short_description = 'Track'

    def get_colored_condition(self, obj):
        colors = {
            'Premium': '#2ecc71',   
            'Excellent': '#3498db', 
            'Good': '#f39c12',      
            'Fair': '#e74c3c',      
        }
        color_code = colors.get(obj.condition, 'black')
        label = obj.get_condition_display()
        return format_html('<strong style="color: {};">{}</strong>', color_code, label)
    get_colored_condition.short_description = 'Estado'
    get_colored_condition.admin_order_field = 'condition'

    def link_to_spec(self, obj):
        link = reverse("admin:api_spec_change", args=[obj.spec.id])
        return format_html('<a href="{}">{}</a>', link, str(obj.spec.product.name))
    link_to_spec.short_description = 'Producto'


# --- NUEVO: TELEMETRÍA DE CLICS ---
@admin.register(ClickEvent)
class ClickEventAdmin(admin.ModelAdmin):
    list_select_related = ('offer', 'offer__spec', 'offer__spec__product')
    
    list_display = (
        'get_product_name',
        'get_offer_details',
        'timestamp',
        'referer_short',
        'ip_hash_short'
    )
    
    list_filter = ('timestamp', 'offer__spec__product')
    search_fields = ('ip_hash', 'referer', 'offer__spec__product__name')
    date_hierarchy = 'timestamp'
    
    # Bloqueamos la modificación manual por integridad de datos
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
        
    def get_product_name(self, obj):
        return obj.offer.spec.product.name
    get_product_name.short_description = 'Producto'
    get_product_name.admin_order_field = 'offer__spec__product__name'

    def get_offer_details(self, obj):
        return f"{obj.offer.spec.color} | {obj.offer.spec.storage}GB | {obj.offer.get_condition_display()} | {obj.offer.battery_new}"
    get_offer_details.short_description = 'Detalle'

    def referer_short(self, obj):
        if not obj.referer:
            return format_html('<span style="color:gray;">Directo / Desconocido</span>')
        return obj.referer[:40] + "..." if len(obj.referer) > 40 else obj.referer
    referer_short.short_description = 'Origen'

    def ip_hash_short(self, obj):
        if obj.ip_hash:
            # Mostramos solo los primeros 10 caracteres del hash para identificar usuarios únicos sin ocupar toda la tabla
            return f"{obj.ip_hash[:10]}..."
        return "-"
    ip_hash_short.short_description = 'IP Hash'


# --- HISTÓRICO DE PRECIOS ---
@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_select_related = ('offer', 'offer__spec', 'offer__spec__product')
    list_display = ('get_offer_str', 'price', 'timestamp')
    date_hierarchy = 'timestamp' 
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
        'market',            # <--- AÑADIDO
        'price_threshold', 
        'show_targets', 
        'notified', 
        'last_notified', 
        'repeat'         
    )
    list_filter = ('notified', 'repeat', 'country', 'market', 'product')
    search_fields = ('subscriber__email', 'product__name')

    def show_targets(self, obj):
        targets = []
        if obj.target_colors: targets.append(f"🎨 {len(obj.target_colors)}")
        if obj.target_storages: targets.append(f"💾 {len(obj.target_storages)}")
        if obj.target_conditions: targets.append(f"✨ {len(obj.target_conditions)}")
        if not targets: return "Cualquiera"
        return " | ".join(targets)
    show_targets.short_description = 'Filtros'