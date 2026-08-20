# RefurbTrack

RefurbTrack es una aplicación web **multi-mercado** que rastrea bajadas de precio e histórico de precios de tecnología reacondicionada (smartphones, tablets, etc.), integrada principalmente con Back Market. Soporta actualmente España (`ES`, EUR) y Reino Unido (`UK`, GBP).

Arquitectura desacoplada basada en microservicios vía Docker, con un scraper propio que ingiere datos de precios de forma periódica vía Celery Beat.

## Características

- **Historial de precios** por producto, variante, estado y batería (más de 1.000 combinaciones únicas).
- **Alertas de precio** por email (creación, baja individual y baja total), con verificación segura tras cada scrape.
- **Scraper de Back Market** con rotación de mercados (`ES`/`UK`), rate limiting respetuoso y verificación de alertas.
- **SEO**: rutas semánticas por `categoría/marca/producto/variante`, hubs de modelo, sitemap dinámico y redirects 301 de rutas legacy.
- **Internacionalización / multi-mercado**: locales `es-es` y `en-gb`, cada uno con su mercado (`ES` con EUR, `UK` con GBP), sin cruce de monedas entre mercados.
- **Autenticación**: JWT (register/login/refresh), login con Google y recuperación de contraseña.
- **Proxy inverso Nginx** con rate limiting, TLS (Cloudflare) y healthchecks.

## Stack tecnológico

| Capa          | Tecnología |
|---------------|------------|
| Frontend      | Next.js 16 (App Router), React 19, TailwindCSS 4, TypeScript, pnpm |
| Backend       | Django 4.2, Django REST Framework, Python |
| Scraper       | Scrapy + scrapy-impersonate + curl_cffi |
| BBDD / Caché  | PostgreSQL, Redis |
| Tareas        | Celery + Celery Beat (scheduler en DB) |
| Infraestructura | Docker & Docker Compose, Nginx, Gunicorn |

## Estructura de carpetas

```
proyecto_scraper/
├── backend/                 # Django
│   ├── manage.py            # Ejecutor de comandos
│   ├── entrypoint.sh        # Espera a la BBDD, migraciones, datos iniciales, superusuario
│   ├── requirements.txt
│   ├── config/              # Configuración global (settings, urls, celery, wsgi/asgi)
│   └── api/                 # La app: modelos, vistas, serializers, services
│       ├── models.py        # Definición de tablas
│       ├── views.py         # HTTP request/response (sin lógica de negocio)
│       ├── serializers.py   # Validación y transformación a JSON
│       ├── services.py      # Lógica de negocio (patrón Service Layer)
│       ├── tasks.py         # Tareas Celery
│       ├── signals.py, insights.py, bot_detection.py
│       └── urls.py          # Rutas de la API
├── scraper/                 # Scrapy
│   ├── launcher.py          # Lanzador de spiders (secuencial por mercado, paralelo por producto)
│   └── scraper/
│       ├── spiders/backmarket.py
│       ├── pipelines.py
│       ├── items.py
│       ├── middlewares.py
│       └── settings.py
├── frontend/                # Next.js (App Router, TS)
│   ├── app/                 # Rutas por locale: [locale]/[category]/[brand]/[product]/[spec]
│   ├── components/          # Componentes Server/Client
│   ├── services/            # api.ts (routing isomórfico), auth.ts
│   └── lib/                 # i18n, types, seo, format, translations...
├── nginx/conf.d/            # Proxy inverso, rate limiting, TLS
├── local_ssl/               # Certificados falsos para desarrollo local
├── docker-compose.yml       # Producción
├── docker-compose.override.yml  # Desarrollo local (hot reload)
└── Dockerfile               # Imagen Python del backend
```

## Servicios Docker

| Servicio         | Contenedor        | Función |
|------------------|-------------------|---------|
| `db`             | `postgres_db`     | PostgreSQL 15 |
| `redis`          | `redis_cache`     | Broker de Celery |
| `web`            | `django_backend`  | API Django (gunicorn en prod, runserver en dev) |
| `celery_worker`  | `celery_worker`   | Ejecuta las tareas (scraper) |
| `celery_beat`    | `celery_beat`     | Reloj que programa los scrapes |
| `flower`         | `celery_flower`   | Monitor de Celery en `/monitor-flower` |
| `frontend`       | `nextjs_frontend` | Next.js (dev: hot reload con pnpm) |
| `nginx`          | `nginx_proxy`     | Único puerto expuesto a internet (80/443) |

## Puesta en marcha

### Requisitos
- Docker y Docker Compose
- `.env` en la raíz con las variables del proyecto (ver sección más abajo)

### Desarrollo local
```bash
docker compose up -d
```
El override de desarrollo monta el código como volúmenes (hot reload), inyecta certificados SSL falsos y usa `pnpm install` + `next dev --webpack` dentro del contenedor de frontend.

### Producción
```bash
docker compose -f docker-compose.yml up -d --build
```

### Entrada al sistema
- Frontend: `http://localhost:3000`
- API: `http://localhost:8000/api/` (vía Nginx: `https://refurbtrack.com/api/`)
- Admin Django: `/07022019-manage/`
- Monitor Flower: `/monitor-flower`

## Comandos

### Backend
```bash
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py importar_variantes   # Carga datos iniciales (productos/variantes)
python manage.py seed_schedule        # Configura el schedule de Celery Beat
python manage.py createsuperuser
```
> El `entrypoint.sh` ya aplica migraciones, estáticos, datos iniciales, seed del schedule y crea el superusuario automáticamente a partir del `.env`.

### Scraper
```bash
scrapy crawl backmarket -a product_id=1 -a market=ES   # Un producto en un mercado
python launcher.py                                     # Lanza todos los productos por mercado (ES y UK)
```

### Frontend
```bash
npm run dev        # o: npx pnpm@9.15.4 install && npm run dev
npm run build
npm run lint
```

## Variables de entorno clave

| Variable | Uso |
|----------|-----|
| `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS` | Configuración Django |
| `POSTGRES_*` | Credenciales y host de PostgreSQL |
| `REDIS_URL` | URL de Redis para Celery |
| `INTERNAL_API_URL` | URL del backend para SSR (dentro de Docker: `http://web:8000`) |
| `NEXT_PUBLIC_API_URL` | URL del backend para el navegador (relativa: `/api`) |
| `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Login con Google |
| `DJANGO_CORS_ALLOWED_ORIGINS` | Orígenes permitidos por CORS |
| `RESEND_API_KEY`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | Envío de emails (alertas, contacto) |

> **Quirk de red (importante):** el frontend vive en `nextjs_frontend` y el backend en `django_backend`. Las peticiones server-side (SSR) DEBEN usar `INTERNAL_API_URL` (`http://web:8000`), mientras que las client-side usan `NEXT_PUBLIC_API_URL`. El routing se resuelve de forma isomórfica en `frontend/services/api.ts`.

> **WSL & pnpm:** el frontend depende de un `.npmrc` con `node-linker=hoisted` para evitar errores de symlink entre WSL y el filesystem Linux del contenedor. No modifiques este comportamiento.

## API (resumen)

- `GET /api/products/` — listado de productos (DRF router)
- `GET /api/products/resolve/?slug=...` — resolver producto por slug (SEO)
- `GET /api/products/model-hub/` — agregación SEO por modelo
- `GET /api/offers/<id>/history/?days=30` — histórico de precios para gráfica
- `GET /api/offers/featured/` — destacados para la landing de historial
- `GET /api/offers/historical-lows/` — mínimos históricos
- `GET /api/products/sitemap-data/`, `GET /api/products/top-specs/` — SEO/build
- `GET/POST /api/alerts/`, `GET/DELETE /api/alerts/<id>/` — alertas de precio
- `POST /api/alerts/unsubscribe/`, `/unsubscribe-all/` — baja de alertas
- `POST /api/auth/register/`, `/login/`, `/refresh/` — autenticación JWT
- `POST /api/auth/google/`, `/forgot-password/`, `/reset-password/` — Google y recuperación
- `GET/POST /api/contact/` — formulario de contacto
- `GET /api/health/` — healthcheck
- `GET /api/out/<uuid>/` — redirect a la tienda (outbound)

## Internacionalización y multi-mercado

El proyecto es multi-mercado y multi-idioma. Dos conceptos clave que **no deben confundirse**:

- **Market** (`marketCode`): región comercial del backend y del scraper (`ES`, `UK`). Determina la moneda (£/€) y el histórico de precios.
- **Locale**: prefijo de ruta de Next.js para idioma y formato regional (`es-es`, `en-gb`). El mapeo vive en `frontend/lib/i18n.ts`.

Reglas críticas:

- **UI corta** (botones, menús, etiquetas): usar el diccionario de `frontend/lib/translations.ts` vía `t()`. Nunca hardcodear strings en componentes.
- **Contenido largo** (legal, blog, párrafos SEO): NO va en `translations.ts`. Usar patrones de *Component-Splitting* o *Data-Splitting* (p. ej. `<PrivacyES />` vs `<PrivacyEN />` o arrays de datos en `lib/`).
- **Rutas dinámicas** bajo `app/[locale]/`, traduciendo slugs vía `lib/format.ts` o `lib/blog.ts`.
- **Aislamiento de moneda**: nunca hacer fallback a campos legacy solo-ES (p. ej. `lowest_ever_price` en EUR) al servir datos para UK. Prohibido el cruce de monedas entre mercados.
- **Emails localizados**: las plantillas de email de Django deben ser market-aware (p. ej. `alert_email_en.html`) y las URLs base deben incluir el prefijo `market.locale` correcto (p. ej. `/en-gb/`).

## Estándares de código

Los estándares de arquitectura y el glosario de dominio están en [CONTEXT.md](./CONTEXT.md). Resumen:

- **Backend:** lógica de negocio en `services.py` (no en views/serializers), consultas agregadas en los modelos/managers, SRP en funciones.
- **Frontend:** priorizar Server Components; `"use client"` solo en las hojas interactivas; llamadas isomórficas siempre a través de `services/api.ts`; tipado estricto (sin `any`).
- **Glosario:** usar siempre *refurbished* (no used/second-hand/pre-owned), *scraper* (no crawler/spider) y distinguir claramente entre *market* (`ES`/`UK`, moneda e histórico) y *locale* (`es-es`/`en-gb`, idioma y rutas).

### Conventional Commits

```
feat: nueva funcionalidad      --> feat(api): add price alert endpoint
fix: bug                       --> fix(scraper): handle empty price field
refactor: cambio interno       --> refactor(db): simplify price history schema
perf: mejora de rendimiento
test: tests
docs: documentación
style: formato (espacios, lint…)
chore: tareas auxiliares       --> chore: update requirements
```