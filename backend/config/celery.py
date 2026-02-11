import os
from celery import Celery

# Establecer el módulo de settings de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('refurbtrack')

# Usar settings de Django con namespace CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks en todas las apps instaladas
app.autodiscover_tasks()