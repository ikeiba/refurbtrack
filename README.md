# proyecto_scraper

Estructura carpeta:

proyecto_scraper/
├── frontend/               # React
├── scraper/                # Scrapy
└── backend/                # Django
│    ├── manage.py           # Ejecutor de comandos
│    ├── config/             # Configuración Global (settings, urls)
│    └── api/                # Tu App: Lógica y Modelos
│        ├── models.py       # Definición de Tablas
│        ├── views.py        # Lógica (CRUD)
│        ├── serializers.py  # Traductor a JSON (Crear manual)
│        └── urls.py         # Rutas de la API (Crear manual)
│
└── docker-compose.yml        # Levanta Backend, Frontend (dev) y BDD


Comandos para el backend:
    python manage.py runserver
    python manage.py makemigrations
    python manage.py migrate
    python manage.py importar_variantes
    python manage.py createsuperuser

Comandos para el scraper:
    scrapy crawl backmarket


Usuario:
    iker
Contraseña:
    Be...


npm run dev

Con esperas de 5, 3 y 1 segundos, ha llegado hasta las 104 peticiones