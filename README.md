# proyecto_scraper

Estructura carpeta:

proyecto_scraper/
│
├── backend/                  # TU BACKEND (Django)
│   ├── manage.py
│   ├── backend/              # Configuración global (settings.py, urls.py)
│   ├── api/                  # Nueva App para tu API (serializers, views)
│   └── products/             # Tus modelos (Producto, PriceHistory)
│
├── frontend/                 # TU FRONTEND (React + Vite)
│   ├── package.json
│   ├── src/
│   │   ├── components/       # Gráficas, Tablas
│   │   ├── services/         # Llamadas a la API (axios/fetch)
│   │   └── App.jsx
│   └── ...
│
├── scraper/                  # TU SCRAPER (Scrapy)
│   ├── scrapy.cfg
│   └── ...
│
└── docker-compose.yml        # Levanta Backend, Frontend (dev) y BDD