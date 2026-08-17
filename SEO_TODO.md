# SEO TODO — Top 10 mejoras priorizadas

Checklist accionable con las 10 mejoras de mayor impacto para RefurbTrack,
ordenadas por prioridad (impacto/esfuerzo).

---

## 1. Diferenciar títulos / H1 / meta de cada variante

- [x] Añadir capacidad + color + precio al `<title>`, H1 y meta description de la página de variante (spec)

**Qué cambiar:** En `frontend/app/[lang]/[category]/[brand]/[product]/[spec]/page.tsx`
(`generateMetadata`) y en `frontend/components/product/ProductViewClient.tsx` (H1,
línea ~325). Hoy el título es `${data.name} Reacondicionado - Historial de Precios | RefurbTrack`
y el H1 es solo `{initialProduct.name}`, por lo que las ~18 variantes del mismo modelo
comparten el mismo título y H1.

**Por qué:** Es la causa raíz de los 0 clics en las keywords de dinero
(`iphone 11 reacondicionado 128 gb`, etc.). Google ve las variantes como duplicados,
no sabe cuál rankear y las entierra en posición 30-48. Diferenciar con capacidad/color/precio
convierte cada variante en una landing única para su long-tail.

---

## 2. Posicionar el hub de modelo como "money page"

- [x] Hacer que `/es/{category}/{brand}/{product}` (hub) sea la página canónica para "iphone X reacondicionado"
- [x] Enlazar desde `FamilyGrid` al hub (no a la variante por defecto)
- [x] Reservar las variantes para long-tail (`iphone X 128gb [color] reacondicionado`)

**Qué cambiar:** `frontend/components/family-grid.tsx` (el enlace de tarjeta),
`frontend/app/[lang]/[category]/[brand]/[product]/page.tsx` (ya tiene buen contenido:
FAQ + tabla + insights, solo hay que consolidarlo como objetivo de intención broad).

**Por qué:** Hoy las variantes (thin) le roban las impresiones al hub (rico) para
"iphone X reacondicionado". El hub tiene tabla de configuraciones, insights y FAQ,
mucho más relevante para la intención amplia. Redirigir la autoridad al hub y
diferenciar las variantes (punto 1) resuelve la canibalización sin tocar URLs.

---

## 3. Corregir el JSON-LD de Product

- [x] Imagen con URL absoluta (hoy usa ruta relativa `products/...avif`)
- [x] `brand.name` desde los datos reales (hoy hardcodeado a `"Apple"`)
- [x] Añadir `url`, `sku`/`mpn` (spec UUID) y `availability` por oferta

**Qué cambiar:** `frontend/app/[lang]/[category]/[brand]/[product]/[spec]/page.tsx`
(bloque `jsonLd`, líneas ~119-143). Usar `absoluteUrl(...)` para la imagen y el campo
`url`, y el `brand_slug`/nombre real de marca en vez de `"Apple"`.

**Por qué:** GSC ya muestra rich results de producto ("Fragmentos de productos":
745 impresiones), pero con datos incompletos (imagen relativa, marca falsa) Google
puede rechazarlos o mostrarlos mal. Corregirlos mejora la aparición y el CTR del
snippet de producto.

---

## 4. Meter el precio en title / meta (patrón comparador)

- [x] Incluir precio actual y mínimo 30d en title/meta de variantes y hubs

**Qué cambiar:** Mismo lugar que el punto 1 y en
`frontend/app/[lang]/[category]/[brand]/[product]/page.tsx` (`generateMetadata`).
Ejemplo: `iPhone 13 128GB Medianoche reacondicionado — X€ ahora | RefurbTrack`.

**Por qué:** Es el patrón de CTR de comparadores de precios (Idealo, Kimovil,
CamelCamelCamel). El precio es el diferenciador de RefurbTrack; mostrarlo en el
snippet aumenta el CTR sin recurrir a técnicas engañosas.

---

## 5. Eliminar el doble fetch + activar ISR/caché (NO APLICAR POR AHORA)

- [ ] Evitar que `generateMetadata` y `Page` llamen dos veces a `getProductBySlugs` / `getModelHub`
- [ ] Sustituir `export const dynamic = 'force-dynamic'` por `revalidate` en páginas dinámicas
- [ ] Re-habilitar cabeceras `Cache-Control` para Cloudflare en `next.config`

**Qué cambiar:** `frontend/app/[lang]/[category]/[brand]/[product]/[spec]/page.tsx`
y `[product]/page.tsx` (cachear el resultado del fetch o pasar los datos desde una
única llamada), todas las páginas con `force-dynamic`, y el bloque `headers()`
comentado en `frontend/next.config.js`.

**Por qué:** El doble fetch duplica la carga al backend en cada pageview. `force-dynamic`
impide caché/ISR, por lo que cada request atraviesa Cloudflare → Nginx → Next (SSR) →
Django → PostgreSQL, subiendo el TTFB para Googlebot y usuarios. Caché + una sola llamada
mejoran CWV, crawl budget y coste.

---

## 6. Arreglar el blog: metadata propia + enlaces rotos

- [x] Añadir `generateMetadata` (title/description/canonical) a las 6 páginas de post
- [x] Corregir enlaces `/company/blog/{slug}` → `/es/blog/{slug}` en el índice del blog

**Qué cambiar:** los 6 `page.tsx` de
`frontend/app/[lang]/(footer)/(company)/blog/*` y
`frontend/app/[lang]/(footer)/(company)/blog/page.tsx` (líneas ~122 y ~162).

**Por qué:** Los posts no exportan metadata, así que heredan el título genérico del
layout ("RefurbTrack - Compara Precios de iPhones…"), lo que explica el CTR bajo (2.78%)
en `diferencias-entre-marketplaces` pese a 108 impresiones. Y los enlaces `/company/blog/*`
apuntan a una ruta inexistente, rompiendo la navegación interna y el enlazado a contenido
que ya rankea.

---

## 7. Pre-umbrales inteligentes + CTA en "sin stock" (alerta) (NO APLICAR POR AHORA)

- [ ] Botones de un clic en el modal: "Bajo el mínimo 30d (Y€)" y "Bajo el mínimo histórico (Z€)"
- [ ] CTA "Avísame cuando vuelva a estar disponible" cuando no hay oferta

**Qué cambiar:** `frontend/components/alert-modal.tsx` (añadir botones que rellenen el
campo precio con `min_price_30d` / `lowest_ever_price` de la configuración activa) y
`frontend/components/product/ProductViewClient.tsx` (estado "Sin stock").

**Por qué:** El modal pide demasiadas decisiones y no sugiere umbrales; el usuario
abandona antes de confirmar. Sugerir umbrales basados en datos reduce la fricción a un
clic y aumenta la conversión del objetivo norte (alertas creadas). El CTA en "sin stock"
convierte una página muerta en una captura de email.

---

## 8. Eliminar la duplicidad categoría ↔ marca (NO APLICAR POR AHORA)

- [ ] Canonical de `/es/{category}/{brand}` → `/es/{category}` mientras solo exista Apple
- [ ] (alternativa) enriquecer la página de marca con contenido propio diferenciado

**Qué cambiar:** `frontend/app/[lang]/[category]/[brand]/page.tsx` (`generateMetadata`).

**Por qué:** `/es/smartphone` y `/es/smartphone/apple` listan exactamente los mismos
productos (solo existe Apple), generando near-duplicate content y diluyendo autoridad.
Mientras no haya una segunda marca, canonicalizar evita que Google elija una al azar.

---

## 9. Corregir `robots.ts` + limpiar enlaces internos con parámetros

- [X] Corregir patrones `/*/*/login`, `/*/*/dashboard`, `/*/*/unsubscribe` (exigen 3 segmentos; las rutas son `/es/login`)
- [X] Quitar `?condition=` / `?battery=` de los enlaces internos de capacidad/color

**Qué cambiar:** `frontend/app/robots.ts` (patrones de `disallow`) y
`frontend/components/product/ProductViewClient.tsx` (`getSpecUrl` / `navigateToSpec`,
que generan URLs con query params).

**Por qué:** Los `disallow` actuales no coinciden con ninguna ruta (no bloquean nada).
Y los enlaces internos apuntan a URLs con parámetros que el propio `robots.txt`
desaconseja, generando URLs "sucias" y desperdiciando crawl budget. La URL limpia debe
ser la canónica; la selección de condición/batería puede mantenerse como estado de cliente.

---

## 10. Implementar el funnel de analítica

- [X] Eventos GA4: `product_view`, `search`, `filter_used`, `price_comparison_click`, `alert_started`, `alert_created`, `outbound_click`, `signup`, `return_visit`
- [X] KPI norte: `alert_created`; secundarios: `outbound_click`/`product_view`, conversión del modal

**Qué cambiar:** `frontend/components/AnalyticsScripts.tsx` (o un helper central que
respete el consentimiento) + instrumentar `alert-modal.tsx`, `ProductViewClient.tsx`,
`header.tsx`, `home-page-client.tsx`.

**Por qué:** Sin eventos no se puede medir qué template convierte ni dónde abandona el
usuario en el recorrido Google → variante → alerta. Medir `alert_created` y el funnel
permite priorizar los siguientes cambios con datos, no con intuición.

---

## Resumen rápido

| # | Mejora | Tipo de cambio |
|---|---|---|
| 1 | Títulos/H1/meta únicos por variante | Frontend (metadata) |
| 2 | Hub como money page | Frontend (enlazado) |
| 3 | JSON-LD Product correcto | Frontend (schema) |
| 4 | Precio en title/meta | Frontend (metadata) |
| 5 | Doble fetch + ISR/caché | Frontend + Infra |
| 6 | Blog metadata + enlaces rotos | Frontend |
| 7 | Pre-umbrales + CTA sin stock | Frontend (UX/CRO) |
| 8 | Canonical categoría↔marca | Frontend (SEO) |
| 9 | robots.ts + enlaces internos | Frontend (SEO técnico) |
| 10 | Funnel de analítica | Frontend (medición) |