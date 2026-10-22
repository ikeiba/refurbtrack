[English](README.md) | [Español](README.es.md)
# RefurbTrack

RefurbTrack is a **multi-market** web application that tracks price drops and price history for refurbished technology (smartphones, tablets, etc.), primarily integrated with Back Market. It currently supports Spain (`ES`, EUR) and the United Kingdom (`UK`, GBP).

It uses a decoupled microservices architecture powered by Docker, with a custom scraper that periodically ingests price data through Celery Beat.

## Features

- **Price history** by product, variant, condition, and battery level (more than 1,000 unique combinations).
- **Price alerts** by email (creation, individual unsubscribe, and unsubscribe from all alerts), with secure verification after each scrape.
- **Back Market scraper** with market rotation (`ES`/`UK`), considerate rate limiting, and alert verification.
- **SEO**: semantic routes by `category/brand/product/variant`, model hubs, a dynamic sitemap, and 301 redirects from legacy routes.
- **Internationalization / multi-market support**: `es-es` and `en-gb` locales, each mapped to its market (`ES` with EUR, `UK` with GBP), with no currency crossover between markets.
- **Authentication**: JWT (register/login/refresh), Google login, and password recovery.
- **Nginx reverse proxy** with rate limiting, TLS (Cloudflare), and health checks.

## Technology stack

| **Layer**       | **Technology**                                                     |
| --------------- | ------------------------------------------------------------------ |
| Frontend        | Next.js 16 (App Router), React 19, TailwindCSS 4, TypeScript, pnpm |
| Backend         | Django 4.2, Django REST Framework, Python                          |
| Scraper         | Scrapy + scrapy-impersonate + curl_cffi                            |
| Database / Cache| PostgreSQL, Redis                                                  |
| Tasks           | Celery + Celery Beat (database scheduler)                          |
| Infrastructure  | Docker & Docker Compose, Nginx, Gunicorn                           |

## Directory structure

```
proyecto_scraper/
├── backend/                 # Django
│   ├── manage.py            # Command-line utility
│   ├── entrypoint.sh        # Waits for the database, runs migrations, loads initial data, creates a superuser
│   ├── requirements.txt
│   ├── config/              # Global configuration (settings, URLs, Celery, WSGI/ASGI)
│   └── api/                 # Application: models, views, serializers, services
│       ├── models.py        # Table definitions
│       ├── views.py         # HTTP request/response handling (no business logic)
│       ├── serializers.py   # Validation and JSON transformation
│       ├── services.py      # Business logic (Service Layer pattern)
│       ├── tasks.py         # Celery tasks
│       ├── signals.py, insights.py, bot_detection.py
│       └── urls.py          # API routes
├── scraper/                 # Scrapy
│   ├── launcher.py          # Scraper launcher (sequential by market, parallel by product)
│   └── scraper/
│       ├── spiders/backmarket.py
│       ├── pipelines.py
│       ├── items.py
│       ├── middlewares.py
│       └── settings.py
├── frontend/                # Next.js (App Router, TypeScript)
│   ├── app/                 # Locale-based routes: [locale]/[category]/[brand]/[product]/[spec]
│   ├── components/          # Server/Client Components
│   ├── services/            # api.ts (isomorphic routing), auth.ts
│   └── lib/                 # i18n, types, SEO, formatting, translations...
├── nginx/conf.d/            # Reverse proxy, rate limiting, TLS
├── local_ssl/               # Self-signed certificates for local development
├── docker-compose.yml       # Production
├── docker-compose.override.yml  # Local development (hot reload)
└── Dockerfile               # Backend Python image
```

## Docker services

| **Service**     | **Container**     | **Purpose**                                      |
| --------------- | ----------------- | ------------------------------------------------ |
| `db`            | `postgres_db`     | PostgreSQL 15                                    |
| `redis`         | `redis_cache`     | Celery broker                                    |
| `web`            | `django_backend`   | Django API (Gunicorn in production, runserver in development) |
| `celery_worker` | `celery_worker`   | Runs tasks (scraper)                             |
| `celery_beat`   | `celery_beat`     | Scheduler that triggers scrapes                  |
| `flower`        | `celery_flower`   | Celery monitoring at `/monitor-flower`           |
| `frontend`      | `nextjs_frontend` | Next.js (hot reload with pnpm in development)    |
| `nginx`         | `nginx_proxy`     | The only port exposed to the internet (80/443)   |

## Getting started

### Requirements

- Docker and Docker Compose
- A `.env` file in the project root containing the project environment variables (see the section below)

### Local development

```
docker compose up -d
```

The development override mounts the source code as volumes (hot reload), injects self-signed SSL certificates, and runs `pnpm install` + `next dev --webpack` inside the frontend container.

### Production

```
docker compose -f docker-compose.yml up -d --build
```

### Accessing the application

- Frontend: `http://localhost:3000`
- API: `http://localhost:8000/api/` (through Nginx: `https://refurbtrack.com/api/`)
- Django admin: `/07022019-manage/`
- Flower monitor: `/monitor-flower`

## Commands

### Backend

```
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py importar_variantes   # Load initial data (products/variants)
python manage.py seed_schedule        # Configure the Celery Beat schedule
python manage.py createsuperuser
```

> `entrypoint.sh` already runs migrations, collects static files, loads initial data, seeds the schedule, and automatically creates the superuser using values from `.env`.

### Scraper

```
scrapy crawl backmarket -a product_id=1 -a market=ES   # One product in one market
python launcher.py                                     # Launches all products for each market (ES and UK)
```

### Frontend

```
npm run dev        # or: npx pnpm@9.15.4 install && npm run dev
npm run build
npm run lint
```

## Key environment variables

| **Variable**                                                | **Purpose**                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS` | Django configuration                                            |
| `POSTGRES_*`                                                | PostgreSQL credentials and host                                 |
| `REDIS_URL`                                                 | Redis URL for Celery                                             |
| `INTERNAL_API_URL`                                          | Backend URL for SSR (inside Docker: `http://web:8000`)           |
| `NEXT_PUBLIC_API_URL`                                       | Backend URL for the browser (relative: `/api`)                  |
| `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`          | Google login                                                    |
| `DJANGO_CORS_ALLOWED_ORIGINS`                               | Allowed CORS origins                                            |
| `RESEND_API_KEY`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`  | Email delivery (alerts, contact form)                            |

> **Important networking detail:** the frontend runs in `nextjs_frontend` and the backend in `django_backend`. Server-side requests (SSR) **MUST** use `INTERNAL_API_URL` (`http://web:8000`), while client-side requests use `NEXT_PUBLIC_API_URL`. Routing is handled isomorphically in `frontend/services/api.ts`.

> **WSL & pnpm:** the frontend relies on an `.npmrc` file with `node-linker=hoisted` to prevent symlink errors between WSL and the container's Linux filesystem. Do not change this behavior.

## API overview

- `GET /api/products/` — list products (DRF router)
- `GET /api/products/resolve/?slug=...` — resolve a product by slug (SEO)
- `GET /api/products/model-hub/` — model-level SEO aggregation
- `GET /api/offers/<id>/history/?days=30` — price history for charts
- `GET /api/offers/featured/` — featured offers for the price-history landing page
- `GET /api/offers/historical-lows/` — all-time low prices
- `GET /api/products/sitemap-data/`, `GET /api/products/top-specs/` — SEO/build data
- `GET/POST /api/alerts/`, `GET/DELETE /api/alerts/<id>/` — price alerts
- `POST /api/alerts/unsubscribe/`, `/unsubscribe-all/` — unsubscribe from alerts
- `POST /api/auth/register/`, `/login/`, `/refresh/` — JWT authentication
- `POST /api/auth/google/`, `/forgot-password/`, `/reset-password/` — Google login and account recovery
- `GET/POST /api/contact/` — contact form
- `GET /api/health/` — health check
- `GET /api/out/<uuid>/` — redirect to the store (outbound)

## Internationalization and multi-market support

The project supports multiple markets and languages. Two key concepts **must not be confused**:

- **Market** (`marketCode`): the commercial region used by the backend and scraper (`ES`, `UK`). It determines the currency (£/€) and price history.
- **Locale**: the Next.js route prefix for language and regional formatting (`es-es`, `en-gb`). The mapping is defined in `frontend/lib/i18n.ts`.

Critical rules:

- **Short UI text** (buttons, menus, labels): use the dictionary in `frontend/lib/translations.ts` via `t()`. Never hardcode strings in components.
- **Long-form content** (legal content, blog posts, SEO paragraphs): do **NOT** put it in `translations.ts`. Use *Component-Splitting* or *Data-Splitting* patterns (e.g. `<PrivacyES />` vs. `<PrivacyEN />`, or data arrays in `lib/`).
- **Dynamic routes** under `app/[locale]/` must translate slugs using `lib/format.ts` or `lib/blog.ts`.
- **Currency isolation**: never fall back to legacy Spain-only fields (e.g. `lowest_ever_price` in EUR) when serving data for the UK. Currency crossover between markets is prohibited.
- **Localized emails**: Django email templates must be market-aware (e.g. `alert_email_en.html`), and base URLs must include the correct `market.locale` prefix (e.g. `/en-gb/`).

## Coding standards

The architecture standards and domain glossary are documented in [CONTEXT.md](https://github.com/ikeiba/refurbtrack/blob/main/CONTEXT.md). Summary:

- **Backend:** keep business logic in `services.py` (not in views/serializers), put aggregate queries in models/managers, and apply SRP to functions.
- **Frontend:** prioritize Server Components; use `"use client"` only for interactive leaves; always make isomorphic calls through `services/api.ts`; use strict typing (no `any`).
- **Glossary:** always use *refurbished* (not used/second-hand/pre-owned), *scraper* (not crawler/spider), and clearly distinguish *market* (`ES`/`UK`, currency and price history) from *locale* (`es-es`/`en-gb`, language and routes).

### Conventional Commits

```
feat: new feature              --> feat(api): add price alert endpoint
fix: bug                       --> fix(scraper): handle empty price field
refactor: internal change      --> refactor(db): simplify price history schema
perf: performance improvement
test: tests
docs: documentation
style: formatting (spaces, lint, etc.)
chore: maintenance tasks       --> chore: update requirements
```
