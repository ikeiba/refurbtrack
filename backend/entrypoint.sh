#!/bin/sh

# Si algún comando falla, salir inmediatamente
set -e

# --- 1. ESPERA A LA BASE DE DATOS (Esto lo hacen TODOS) ---
echo "--> Esperando a la base de datos..."

python << END
import sys
import time
import psycopg2
import os

while True:
    try:
        psycopg2.connect(
            dbname=os.environ.get("POSTGRES_DB"),
            user=os.environ.get("POSTGRES_USER"),
            password=os.environ.get("POSTGRES_PASSWORD"),
            host=os.environ.get("POSTGRES_HOST"),
            port=os.environ.get("POSTGRES_PORT")
        )
        break
    except psycopg2.OperationalError:
        sys.stdout.write(".")
        sys.stdout.flush()
        time.sleep(1)
END
echo "--> Base de datos disponible."


# --- 2. TAREAS DE MANTENIMIENTO (SOLO CONTENEDOR WEB) ---
# Comprobamos si el primer argumento del comando es 'gunicorn'
if [ "$1" = "gunicorn" ]; then
    echo "--> Detectado contenedor WEB (Master). Iniciando mantenimiento..."

    # A. Migraciones
    echo "    Applying migrations..."
    python manage.py migrate --noinput

    # B. Estáticos
    echo "    Collecting static files..."
    python manage.py collectstatic --noinput

    # C. Carga de datos iniciales
    echo "    Loading initial data..."
    python manage.py importar_variantes || echo "⚠️ Advertencia: Error al importar variantes o ya existen."

    # -> NUEVO: Configurar el reloj de Celery
    echo "    Seeding Celery Beat schedule..."
    python manage.py seed_schedule || echo "⚠️ Advertencia: Error al crear el horario de Celery."

    # D. Crear Superusuario
    echo "    Checking superuser..."
    python << END
import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

User = get_user_model()
username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if username and password:
    if not User.objects.filter(username=username).exists():
        print(f"Creando superusuario {username}...")
        User.objects.create_superuser(username, email, password)
    else:
        print(f"El superusuario {username} ya existe.")
else:
    print("No se han definido credenciales de superusuario en .env")
END

else
    echo "--> Detectado contenedor WORKER/BEAT. Saltando mantenimiento."
fi

# --- 3. ARRANCAR EL COMANDO ---
echo "--> Arrancando comando: $@"
exec "$@"