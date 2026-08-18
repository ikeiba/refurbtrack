# Plan de Acción Técnico — Internacionalización de RefurbTrack (ES → ES + UK)

## Decisiones confirmadas

1. **Un único modelo `Market`** (code, country_code, currency, domain, language, locale).
2. **Caches de precio por mercado** (nuevas tablas de stats por `Product×Market` y `Spec×Market`).
3. **Slugs por idioma**, implementación **manual** (columnas explícitas, sin dependencia de `django-modeltranslation`). Motivo: los slugs de `Spec` contienen palabras transaccionales y colores en español (`reacondicionado-64gb-gris-espacial`). Los de `Product`/`Category`/`Brand` (`smartphone`, `apple`, `iphone-13`) son internacionales y **no** necesitan variante por ahora.

## Hallazgos clave del análisis (a tener en cuenta)

- `Offer` y `Alert` ya tienen `country` (`CharField` `max_length=5`, default `ES`). El `unique_together` de `Offer` es `(spec, condition, battery_new, country)`.
- Solo existe la migración `0001_initial.py`; `modeltranslation` NO está instalado (los comentarios `slug_es/slug_en` en `models.py` son solo intenciones).
- El precio se guarda como `Decimal` **sin columna de moneda**. La moneda está hardcodeada a `€` en: `backmarket.py` (parseo), `services.py` (emails), `serializers.py` (`__str__`), y en el frontend (`format.ts`, `seo-utils.ts`, JSON-LD `priceCurrency: "EUR"`).
- Los caches de `Product`/`Spec` (`min_price_cached`, `lowest_ever_price`, `market_price`) se recalculan en cascada por señales en `signals.py` asumiendo una sola moneda. Esto es el principal riesgo de cross-currency.
- El spider construye la URL base hardcodeada `https://www.backmarket.es/es-es/p/-/{uuid}` y `importar_variantes.py` crea las ofertas con `country='ES'` y esa misma URL.
- Frontend usa carpeta `[lang]` con valor `es` (no `es-es`). Hay hardcodeo de `/es` en: `app/page.tsx`, `sitemap.ts`, `robots.ts`, `next.config.ts` (redirects), `services.py` (emails), `translations.ts` (solo diccionario ES).

---

## Fase 1 — Capa de Datos (Django Models)

### 1.1 `backend/api/models.py`

**Nuevo modelo `Market`** (entidad nueva, campos obligatorios permitidos):

```
Market:
  code          = CharField(max_length=2, unique=True)   # 'ES' | 'UK'
  country_code  = CharField(max_length=2)                 # 'es' | 'uk'  (o 'ES'/'GB' si se prefiere ISO alpha-2)
  currency      = CharField(max_length=3, default='EUR')  # 'EUR' | 'GBP'
  domain        = CharField(max_length=100)               # 'backmarket.es' | 'backmarket.co.uk'
  language      = CharField(max_length=2, default='es')   # 'es' | 'en'
  locale        = CharField(max_length=10)                # 'es-es' | 'en-gb'
```

**Nuevos campos sobre modelos existentes (todos `null=True, blank=True` por regla de migración segura):**

- `Offer.market = ForeignKey(Market, null=True, blank=True, on_delete=PROTECT, related_name='offers')`. El `country` actual se mantiene como campo heredado durante la transición.
- `Alert.market = ForeignKey(Market, null=True, blank=True, on_delete=PROTECT, related_name='alerts')`.
- `Spec.slug_en = SlugField(db_index=True, null=True, blank=True)` — variante EN del slug (ej. `refurbished-64gb-space-gray`). El `slug` existente queda como variante **ES** (back-compat con las URLs `/es/...` actuales).

**Nuevas tablas de stats por mercado (entidades nuevas):**

```
ProductMarketStats:
  product = FK(Product, related_name='market_stats')
  market  = FK(Market, related_name='+')
  min_price_cached, lowest_ever_price, lowest_ever_date, market_price, last_updated
  (UniqueConstraint product+market)

SpecMarketStats:
  spec   = FK(Spec, related_name='market_stats')
  market = FK(Market, related_name='+')
  min_price_cached, lowest_ever_price, lowest_ever_date, last_updated
  (UniqueConstraint spec+market)
```

**Lógica:** los campos de caché actuales de `Product`/`Spec` (`min_price_cached`, `lowest_ever_price`, `lowest_ever_date`, `market_price`, `last_updated`) quedan como columnas **legacy congeladas** (una única copia hacia `ProductMarketStats`/`SpecMarketStats` del mercado ES durante la migración de datos; sin sincronización posterior). En adelante, la fuente de verdad es la tabla de stats por mercado; las señales de `signals.py` se reescriben para recalcular **solo** el mercado de la oferta afectada y escribir únicamente en dichas tablas.

**Unicidad de `Offer`:** la migración segura mantiene temporalmente `unique_together = (spec, condition, battery_new, country)`. La restricción por `market` se introduce **después** de la migración de datos (misma secuencia, sin borrar datos), apuntando a `(spec, condition, battery_new, market)`.

### 1.2 Migraciones (nuevos archivos en `backend/api/migrations/`)

Secuencia explícita, sin que ninguna sea destructiva:

1. `0002_market.py` — crea `Market`.
2. `0003_market_fks_and_slug_en.py` — añade `Offer.market`, `Alert.market`, `Spec.slug_en` (todos `null=True`), y crea `ProductMarketStats`/`SpecMarketStats`.
3. `0004_seed_markets.py` (**Data Migration**) — inserta `Market(ES, EUR, backmarket.es, es, es-es)` y `Market(UK, GBP, backmarket.co.uk, en, en-gb)`.
4. `0005_backfill_market_data.py` (**Data Migration**) — asigna `Offer.market` y `Alert.market` desde `country` (todos los existentes → `ES`); genera `Spec.slug_en` a partir de `storage` + `color` (mapa EN: `reacondicionado`→`refurbished`, color inglés tal cual, vía `slugify`); rellena `ProductMarketStats`/`SpecMarketStats` para el mercado ES copiando los caches legacy existentes.

   **Regla fail-safe del `slug_en`:** la generación del slug EN DEBE ser tolerante a fallos. Si un color no está en el diccionario EN, se hace fallback al valor original (`slugify(color)` sobre el color crudo) o a un slug seguro (ej. `unknown-{n}`), pero **nunca** se lanza una excepción que detenga la migración. Cada fila se procesa de forma independiente: un color desconocido se registra en el log y se continúa con la siguiente fila. La migración solo puede abortar por errores de infraestructura (BD caída), nunca por datos de color inesperados.
5. `0006_make_market_required.py` (posterior, tras verificar en staging) — `Offer.market` y `Alert.market` → `null=False`; añade `UniqueConstraint(spec, condition, battery_new, market)` y retira la de `country`.

**Nota de seguridad de datos:** el paso de "hacer obligatorio" (5) se ejecuta en un despliegue posterior e independiente, solo después de validar que el backfill cubrió el 100% de las filas (query de verificación: `Offer.objects.filter(market__isnull=True).count() == 0`).

### 1.3 `backend/api/management/commands/importar_variantes.py`

- Generar **también** `slug_en` en `insert_spec` (paralelo al `slug` ES). Añadir `COLOR_TO_EN` o reutilizar el `color` inglés crudo para el slug.
- Aceptar un parámetro `--market` (default `ES`) y construir la URL base con `market.domain` + `market.locale` en vez de hardcodear `backmarket.es/es-es`.
- Mantener `OFFICIAL_MSRP` como MSRP del mercado ES y añadir un `OFFICIAL_MSRP_UK` (o mover MSRP a `ProductMarketStats.market_price` por mercado).

### 1.4 `backend/api/admin.py`

- Registrar `Market`, `ProductMarketStats`, `SpecMarketStats` para verificación manual del backfill.

---

## Fase 2 — Capa de Extracción (Scrapy & Celery)

### 2.1 `scraper/scraper/spiders/backmarket.py`

- Añadir parámetro de entrada `market` (vía `-a market=UK`, ya que Scrapy lo inyecta como atributo string). Default `ES`.
- Resolver `market = Market.objects.get(code=...)` y:
  - `base_url = f"https://www.{market.domain}/{market.locale}/p/-/{spec.back_market_uuid}"`.
  - Filtrar `spec.offers` por `market` (o por `country` durante la transición).
  - En `parse`, seleccionar el `Offer` correcto **y su mercado**, y guardar el precio en el `Offer` de ese mercado.
- Extracción de moneda dinámica:
  - Definir `CURRENCY_SYMBOL = {'EUR': '€', 'GBP': '£'}` y un limpiador que elimine el símbolo de `market.currency` (en vez de `.replace("€", "")`). Mantener el fallback de normalización de millares/decimales (`,`, `.`) que ya existe.
- Guardar `PriceHistory` contra el `Offer` correcto (el precio queda implícitamente en la moneda del mercado; **no** se almacena moneda en el histórico).

### 2.2 `scraper/scraper/settings.py`

- `Accept-Language` por defecto: parametrizar o pasar desde el spider (ej. `en-GB,en;q=0.9` para UK). Mínimo cambio: mantener el actual para ES y hacer override en el spider vía `headers` (ya lo hace).

### 2.3 `backend/api/tasks.py` (orquestador Celery)

- `run_spiders_manager`: recorrer productos **y mercados activos**, lanzando `scrapy crawl backmarket -a product_id={pid} -a market={code}`.
- Evitar duplicar lanzamiento de la misma URL base entre mercados (un spider por `(product, market)`).

### 2.4 `scraper/launcher.py` (actualmente comentado)

- Si se reactiva, replicar el pase de `-a market=...` del orquestador Celery.

### 2.5 `scraper/scraper/pipelines.py` (legacy, sin uso — `ITEM_PIPELINES` vacío)

- Documentar como obsoleto o eliminar. El spider ya escribe directo en BD; el pipeline referencia `Variant` (modelo inexistente). No es bloqueante.

---

## Fase 3 — Capa de Servicios y API (Django REST)

### 3.1 `backend/api/views.py`

- Helper `resolve_market(request)` que lee `?market=ES|UK` (o `?locale=es-es|en-gb`) y devuelve el `Market`; fallback `ES`. Añadirlo a:
  - `ProductViewSet.get_queryset` — prefetch de `specs` y `specs__offers` **filtradas por mercado**.
  - `ProductResolveBySlugView` — aceptar `lang`/`market`; resolver `Spec` por `slug` (ES) o `slug_en` (EN).
  - `ModelHubView`, `FeaturedHistoryView`, `HistoricalLowOffersView`, `sitemap_data`, `top_specs_for_build` — filtrar por mercado.
- `redirect_to_store` — usar `offer.market.domain` para el fallback (`https://www.{domain}`) en vez de hardcodear `backmarket.es`.

### 3.2 `backend/api/serializers.py`

- Exponer `currency` (del `Market`) y `market` en `OfferSerializer`, `SpecSerializer`, `ProductDetailSerializer`, `HistoricalLowOfferSerializer`.
- Los campos de precio (caches) de `ProductListSerializer`/`ProductDetailSerializer` se leen **directamente** desde `ProductMarketStats`/`SpecMarketStats` del mercado solicitado (métodos `SerializerMethodField` que reciben el `market` por contexto). No se lee de los campos legacy de `Product`/`Spec`.
- `AlertSerializer` — devolver y aceptar `market`; `get_target_affiliate_url` filtra por mercado.

### 3.3 `backend/api/services.py`

- `build_model_hub(product, market)` — filtrar `specs.offers` por mercado; leer caches de `SpecMarketStats`; el agregado de `PriceHistory` ya se hace sobre `offer__spec__product` (añadir filtro `offer__market`).
- `get_featured_history(market)` — filtrar por mercado.
- `check_alerts_for_product` / `send_alert_email` — comparar `alert.market`/`alert.country` con `offer.market`/`offer.country` y formatear la moneda del mercado en los emails (símbolo correcto).
- **Nuevo** `recompute_market_stats(product_or_spec, market)` — extraer la lógica de agregación de caches de `signals.py` y hacerla market-aware. Se invoca tras cada `PriceHistory` creado.

### 3.4 `backend/api/signals.py`

- Reescribir `update_spec_min_price` y `update_product_min_price` para:
  - Recalcular **solo** las stats del mercado de la oferta modificada (escribir en `SpecMarketStats`/`ProductMarketStats`).

- **Sin dual writes (regla de seguridad):** NO mantener sincronizados los campos legacy `min_price_cached` / `lowest_ever_price` / `last_updated` de `Product` y `Spec`. Las señales escriben **exclusivamente** en `SpecMarketStats`/`ProductMarketStats`, evitando escrituras redundantes y cuellos de botella. La API lee directamente de las tablas de stats por mercado desde el primer momento. Los campos legacy de los modelos base quedan como columnas históricas congeladas (no actualizadas), hasta su eliminación en una fase posterior.

### 3.5 `backend/config/settings.py` (opcional)

- Añadir `ACTIVE_MARKETS = ['ES', 'UK']` para iterar en Celery/seed.

---

## Fase 4 — Capa de Presentación (Next.js)

### 4.1 Routing `[locale]`

- Renombrar carpeta `frontend/app/[lang]/` → `frontend/app/[locale]/` (y todas las rutas hijas). Valores: `es-es`, `en-gb`.
- `frontend/app/[locale]/layout.tsx`:
  - `generateStaticParams()` → `[{ locale: 'es-es' }, { locale: 'en-gb' }]`.
  - Derivar `language` (primera parte del ISO) para `<html lang>`, y `region/currency` para el resto.
- `frontend/app/page.tsx` — redirigir a `/es-es` (default) con detección `Accept-Language` opcional.

### 4.2 Nuevo `frontend/lib/i18n.ts`

- Config central:
  ```
  locales = ['es-es', 'en-gb']
  localeMeta = {
    'es-es': { language:'es', region:'ES', currency:'EUR', domain:'backmarket.es' },
    'en-gb': { language:'en', region:'UK', currency:'GBP', domain:'backmarket.co.uk' }
  }
  ```
- Helpers: `parseLocale(locale)`, `getMarket(locale)`, `getLanguage(locale)`.

### 4.3 Diccionarios y formateo

- `frontend/lib/translations.ts` — reestructurar en diccionarios por idioma (`ES` y `EN`) y hacer `t(key, language)`. Añadir traducciones EN de colores/estados/batería (y la inversa ES↔EN necesaria para slugs).
- `frontend/lib/format.ts` — reemplazar `formatEur` por `formatCurrency(value, currency, language)`; añadir `formatDate(iso, language)`.
- `frontend/lib/seo-utils.ts` — eliminar `€` hardcodeado; recibir `currency`/`language` y generar copys por idioma.

### 4.4 API isomórfica `frontend/services/api.ts`

- Añadir parámetro `market` (o `locale`) a las llamadas que dependen del mercado:
  `getProducts`, `getProductBySlugs`, `getModelHub`, `getFeaturedHistory`, `getHistoricalLowOffers`. Enviar como query param (`?market=ES|UK`) y pasar `language` para que el backend resuelva `slug` vs `slug_en`.

### 4.5 SEO: sitemap, robots y redirects

- `frontend/app/sitemap.ts` — emitir URLs por cada locale (`/es-es/...` y `/en-gb/...`), consumiendo `sitemap-data` filtrado por mercado.
- `frontend/app/robots.ts` — actualizar patrones `disallow` para los dos locales (`/*/login` etc. ya cubre, pero confirmar `es-es`/`en-gb`).
- `frontend/next.config.ts` — actualizar los redirects `/product/*` a `/es-es/...`; **añadir redirects 301 de las rutas legacy** `/es/* → /es-es/*` y `/en/* → /en-gb/*` para conservar autoridad SEO.

### 4.6 Componentes que reciben `lang`

Actualizar para recibir/pasarlo como `locale` (y derivar `language` internamente): `header-wrapper.tsx`, `header.tsx`, `home-page-client.tsx`, `product/ProductViewClient.tsx`, `hub/model-hub-view.tsx`, `hub/hub-config-table.tsx`, `landing/price-history-landing.tsx`, `family-grid.tsx`, `breadcrumbs.tsx`, y las páginas `[locale]/.../page.tsx`. La mayoría solo cambia el prefijo `/${lang}` → `/${locale}` y las llamadas a `t()`.

### 4.7 JSON-LD y metadata

- `frontend/app/[locale]/[category]/[brand]/[product]/[spec]/page.tsx` y `[product]/page.tsx` — `priceCurrency` dinámico (de `localeMeta[locale].currency`), `lang` en `<html>`, canonical con el locale correcto.

---

## Riesgos y dependencias entre fases

- **Cross-currency**: el mayor riesgo. Se mitiga moviendo caches a tablas por mercado (Fase 1) antes de ingestar GBP (Fase 2).
- **Autoridad SEO de URLs `/es/...`**: mantener redirects 301 legacy (Fase 4.5) y slugs ES idénticos para el mercado es-es.
- **`country` vs `market`**: coexistencia temporal; no eliminar `country` hasta que alertas/ofertas/reportes lean 100% desde `market`.
- **Orden estricto**: F1 (datos) → F2 (extracción) → F3 (API) → F4 (frontend). F3 y F4 pueden solaparse en integración, pero F1/F2 son secuenciales.

---

## Criterios de aceptación (resumen)

1. `Market(ES)` y `Market(UK)` sembrados; `Offer.market`/`Alert.market` 100% backfilleados.
2. Spider scrapea `backmarket.co.uk` con moneda GBP y lo almacena en ofertas UK sin mezclarse con EUR.
3. Los endpoints devuelven datos filtrados por `?market=` y `currency` correcta.
4. Frontend sirve `/es-es/` y `/en-gb/` con traducciones, moneda y JSON-LD correctos, y redirects 301 desde las rutas legacy.
