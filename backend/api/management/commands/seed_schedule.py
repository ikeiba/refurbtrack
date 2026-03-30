from django.core.management.base import BaseCommand
from django_celery_beat.models import PeriodicTask, CrontabSchedule

class Command(BaseCommand):
    help = 'Crea la configuración inicial del reloj de Celery Beat (Crontab)'

    def handle(self, *args, **kwargs):
        # 1. Creamos el horario (00:00, 06:00, 12:00, 18:00 en Madrid)
        schedule, _ = CrontabSchedule.objects.get_or_create(
            minute='0',
            hour='0,6,12,18',
            day_of_week='*',
            day_of_month='*',
            month_of_year='*',
            timezone='Europe/Madrid',
        )

        # 2. Asignamos el horario a la tarea del scraper
        task, created = PeriodicTask.objects.get_or_create(
            name='Run Spiders Manager',
            defaults={
                'task': 'api.tasks.run_spiders_manager',
                'crontab': schedule,
                'enabled': True,
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS('✅ Tarea periódica creada con éxito (Crontab 0,6,12,18)'))
        else:
            self.stdout.write('ℹ️  La tarea periódica ya existe. Omitiendo creación.')