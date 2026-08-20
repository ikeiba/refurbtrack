# RefurbTrack - Project Context & AI Guidelines

## 1. Project Overview
RefurbTrack is a multi-market web application that tracks price drops and historical pricing for refurbished technology (smartphones, tablets, etc.) integrating with Back Market. Currently supporting Spain (ES, EUR) and the United Kingdom (UK, GBP).

## 2. Architecture & Tech Stack
This project follows a decoupled architecture using microservices via Docker.

*   **Frontend:** Next.js (App Router), React, TailwindCSS, TypeScript.
*   **Backend:** Django, Django REST Framework (DRF), Python.
*   **Database & Caching:** PostgreSQL, Redis.
*   **Asynchronous Tasks:** Celery + Celery Beat.
*   **Infrastructure:** Docker & Docker Compose (`docker-compose.yml` for prod, `docker-compose.override.yml` for local).
*   **Package Manager:** pnpm.

## 3. Development Environment Quirks (CRITICAL)
*   **Network routing:** The frontend container is named `nextjs_frontend` and the backend is `django_backend`. Server-side fetches in Next.js MUST use the internal Docker network URL (`INTERNAL_API_URL=http://django_backend:8000`). Client-side requests use `NEXT_PUBLIC_API_URL`.
*   **WSL & pnpm:** The frontend relies on a `.npmrc` file with `node-linker=hoisted` to prevent symlink errors between WSL and the Docker container's Linux filesystem. Never modify this behavior or attempt to use standard pnpm symlinks in local development.

## 4. Coding Standards & Architectural Patterns

### Backend (Django) Rules
1.  **Service Layer Pattern:** Do NOT put business logic inside Views or Serializers. 
    *   Views are only for HTTP request/response handling.
    *   Serializers are only for data validation and transformation.
    *   Complex operations (e.g., sending emails, calculating price drops) MUST be extracted into isolated functions within `services.py` modules.
2.  **Fat Models / Repositories:** Database queries and data aggregations (e.g., calculating `min_price_cached` or `lowest_ever_price`) should be encapsulated in the Model itself or via Custom Managers/QuerySets.
3.  **Single Responsibility Principle (SRP):** Keep functions small and focused on a single task. Create helper functions for formatting, URL building, etc.

### Frontend (Next.js) Rules
1. Server Components vs. Client Components:
   * Maximize the use of Server Components (default) for data fetching, SEO optimization, and backend communication.
   * Use Client Components (via `"use client"`) ONLY at the leaves of the component tree when interactivity (`useState`, `useEffect`, event listeners) is strictly required.
2.  **Isomorphic API Calls:** Always use the centralized `services/api.ts` utility to ensure requests are routed correctly depending on whether the code is executing on the server (Node.js/Docker) or the client (Browser).
3.  **Strict Typing:** Use TypeScript interfaces/types for all API responses (e.g., `ProductSummary`, `AlertData`). Avoid `any`.

### Internationalization (i18n) & Multi-Market Rules (CRITICAL)
1. **Frontend UI vs Long Content:**
   - **UI Text:** Short, structural texts (buttons, menus, short labels) MUST use the dictionary at `frontend/lib/translations.ts` via the `t()` function. Never hardcode strings in components.
   - **Long Content:** Legal pages, blog posts, and long SEO paragraphs MUST NOT be added to `translations.ts`. Use the "Component-Splitting" or "Data-Splitting" pattern (e.g., `<PrivacyES />` vs `<PrivacyEN />`, or isolated data arrays in `lib/`).
2. **Dynamic Routing:** All page routes live under `app/[locale]/`. Use `lib/format.ts` or `lib/blog.ts` to translate URL slugs when switching languages.
3. **Backend Currency Isolation:** Never fallback to legacy ES-only fields (e.g., `lowest_ever_price` in EUR) when serving data for a non-ES market (e.g., UK in GBP). Cross-currency leakage is strictly prohibited.
4. **Email Localization:** Django email templates must be market-aware (e.g., `alert_email_en.html`). Base URLs inside emails must include the correct `market.locale` prefix (e.g., `/en-gb/`).

## 5. Current Focus / Roadmap
*   Refactoring existing serializers (like `AlertSerializer`) to use the Service Layer.
*   Improving URL routing and SEO structures.
*   Ensuring stable integration between Next.js Server Components and the Django internal Docker network.

## 6. AI Agent Instructions
When generating code, proposing refactors, or debugging for this repository:
1.  Assume a production-ready mindset.
2.  Follow the rules in Section 4 strictly.
3.  Do not introduce new dependencies unless strictly necessary.
4.  If modifying the backend, always consider how it affects the REST API contract with Next.js.

## 7. Domain Glossary (Mandatory)
- **Refurbished:** Always use this term when referring to products. Never use synonyms like "used", "second-hand", "pre-owned".
- **Scraper:** This is the canonical term for the module or service responsible for price data ingestion. Do not use terms like "crawler" or "spider".
- **Market vs Locale:** 
  - **Market** (`marketCode`): The commercial region used by the backend database and Scrapy (e.g., `ES`, `UK`). Determines currency (£ vs €) and price history.
  - **Locale**: The routing prefix used by Next.js for language and regional formatting (e.g., `es-es`, `en-gb`).