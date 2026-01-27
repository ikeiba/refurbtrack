# proyecto_scraper

### ESTRUCTURA CARPETAS

proyecto_scraper/
├── frontend/                # React
├── scraper/                 # Scrapy
└── backend/                 # Django
│    ├── manage.py           # Ejecutor de comandos
│    ├── config/             # Configuración Global (settings, urls)
│    └── api/                # Tu App: Lógica y Modelos
│        ├── models.py       # Definición de Tablas
│        ├── views.py        # Lógica (CRUD)
│        ├── serializers.py  # Traductor a JSON (Crear manual)
│        └── urls.py         # Rutas de la API (Crear manual)
│
└── docker-compose.yml       # Levanta Backend, Frontend (dev) y BDD


## COMANDOS:

### Comandos para el backend:
    python manage.py runserver
    python manage.py makemigrations
    python manage.py migrate
    python manage.py importar_variantes
    python manage.py createsuperuser
    usuario: iker // contraseña: 1234

### Comandos para el scraper:
    scrapy crawl backmarket
    python launcher.py

### Comandos para el frontend:
    npm run dev

En total, hay 1093 combinaciones unicas para price history (producto, variante, estado, bateria)


### Conventional Commits
feat: nueva funcionalidad --> feat(api): add price alert endpoint
fix: bug --> fix(scraper): handle empty price field
refactor: cambio interno sin alterar comportamiento --> refactor(db): simplify price history schema
perf: mejora de rendimiento
test: tests
docs: documentación
style: formato (espacios, lint…)
chore: tareas auxiliares (configs, deps) --> chore: update requirements
