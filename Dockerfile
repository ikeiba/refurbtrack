# Usamos Python 3.11 sobre Debian Slim (Compatible con ARM64/AMD64)
FROM python:3.11-slim-bookworm

# Evitamos que Python escriba .pyc y forzamos logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalamos dependencias del sistema necesarias para compilar (gcc, libpq para postgres)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    python3-dev \
    git \
    libjpeg-dev \
    zlib1g-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# 1. INSTALAMOS DEPENDENCIAS (Copiamos primero requirements para aprovechar caché de Docker)
# Copiamos requirements del backend y scraper
COPY backend/requirements.txt /app/backend/requirements.txt

# Instalamos todo
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/backend/requirements.txt 

# 2. COPIAMOS EL CÓDIGO
COPY backend /app/backend
COPY scraper /app/scraper

# 3. PREPARAMOS EL ENTORNO
WORKDIR /app/backend

# CAMBIO 1: Copiamos el entrypoint A LA RAIZ (/app/), no a backend
COPY backend/entrypoint.sh /app/entrypoint.sh

# 4. Corregimos el formato Windows (CRLF -> LF) y damos permisos
# El comando 'sed' elimina los caracteres de retorno de carro invisibles
RUN sed -i 's/\r$//g' /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Recolectamos estáticos (Fingimos claves para que no falle al buildear)
RUN SECRET_KEY=dummy DATABASE_URL=sqlite:///db.sqlite3 python manage.py collectstatic --noinput

# Exponemos el puerto de Django
EXPOSE 8000

# Definimos el Entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Script de entrada (Se sobreescribe en docker-compose, pero este es el default)
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]