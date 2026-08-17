from collections import Counter

from django.core.management.base import BaseCommand
from django.db.models import Count, Q
from django.db.models.functions import TruncDay, TruncHour

from api.models import ClickEvent

BOT_SIGNALS = [
    'bot', 'crawl', 'spider', 'slurp', 'python', 'curl', 'wget', 'httpclient',
    'urllib', 'scrapy', 'headless', 'phantom', 'selenium', 'pingdom', 'uptime',
    'monitor', 'applemail', 'gmail', 'microsoft', 'outlook', 'safelinks',
    'defender', 'proofpoint', 'mimecast', 'barracuda', 'avast', 'mcafee',
    'symantec', 'google-image', 'facebookexternalhit', 'twitterbot', 'whatsapp',
    'telegrambot', 'slackbot', 'discordbot', 'linkedinbot', 'pinterest',
    'googlefavicon', 'favicon', 'preview', 'previewworker'
]


class Command(BaseCommand):
    help = 'Diagnostica el origen de los ClickEvent (bots, emails, humanos).'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=30, help='Nº de filas por desglose')

    def handle(self, *args, **options):
        limit = options['limit']
        total = ClickEvent.objects.count()
        self.stdout.write(f'\n=== TOTAL ClickEvent: {total} ===\n')

        # 1. Por User-Agent
        self.stdout.write('--- TOP USER-AGENT ---')
        rows = (
            ClickEvent.objects
            .values('user_agent')
            .annotate(n=Count('id'))
            .order_by('-n')[:limit]
        )
        for r in rows:
            ua = (r['user_agent'] or '(vacío)').replace('\n', ' ')[:100]
            self.stdout.write(f'{r["n"]:>7}  {ua}')

        # 2. Por Referer
        self.stdout.write('\n--- TOP REFERER ---')
        rows = (
            ClickEvent.objects
            .values('referer')
            .annotate(n=Count('id'))
            .order_by('-n')[:limit]
        )
        for r in rows:
            ref = (r['referer'] or '(vacío = Directo/Desconocido)')[:120]
            self.stdout.write(f'{r["n"]:>7}  {ref}')

        # 3. Por día
        self.stdout.write('\n--- CLICS POR DÍA ---')
        rows = (
            ClickEvent.objects
            .annotate(day=TruncDay('timestamp'))
            .values('day')
            .annotate(n=Count('id'))
            .order_by('-day')[:limit]
        )
        for r in rows:
            self.stdout.write(f'{r["day"].date()}  {r["n"]}')

        # 4. Por hora del día (patrón de escáner/cron)
        self.stdout.write('\n--- CLICS POR HORA DEL DÍA (0-23) ---')
        rows = (
            ClickEvent.objects
            .annotate(hour=TruncHour('timestamp'))
            .values('hour')
            .annotate(n=Count('id'))
            .order_by('-n')[:24]
        )
        for r in rows:
            self.stdout.write(f'{r["hour"].hour:>2}:00  {r["n"]}')

        # 5. Clasificación heurística de bots
        self.stdout.write('\n--- CLASIFICACIÓN HEURÍSTICA (UA) ---')
        bot_q = Q()
        for sig in BOT_SIGNALS:
            bot_q |= Q(user_agent__icontains=sig)
        bot_q |= Q(user_agent__isnull=True) | Q(user_agent='')

        bots = ClickEvent.objects.filter(bot_q).count()
        humans = total - bots
        self.stdout.write(f'Posibles bots / escáneres: {bots}  ({100 * bots / max(total, 1):.1f}%)')
        self.stdout.write(f'Posibles humanos:          {humans}  ({100 * humans / max(total, 1):.1f}%)')

        # 6. Distribución de tipos de UA más frecuentes (extrayendo "token" del UA)
        self.stdout.write('\n--- FAMILIAS DE CLIENTE (aproximado) ---')
        family = Counter()
        for ua in ClickEvent.objects.values_list('user_agent', flat=True):
            ua = (ua or 'vacío').lower()
            if 'googlebot' in ua or 'google-image' in ua:
                family['Google bot'] += 1
            elif 'bingbot' in ua:
                family['Bing bot'] += 1
            elif 'applemail' in ua or 'apple mail' in ua:
                family['Apple Mail (privacidad)'] += 1
            elif 'gmail' in ua:
                family['Gmail (escáner)'] += 1
            elif 'outlook' in ua or 'microsoft' in ua or 'safelinks' in ua or 'defender' in ua:
                family['Microsoft/Outlook (escáner)'] += 1
            elif 'python' in ua or 'curl' in ua or 'wget' in ua or 'scrapy' in ua or 'urllib' in ua:
                family['Script/CLI'] += 1
            elif 'bot' in ua or 'crawl' in ua or 'spider' in ua or 'slurp' in ua:
                family['Otro bot'] += 1
            elif 'whatsapp' in ua or 'telegram' in ua or 'slack' in ua or 'facebookexternalhit' in ua:
                family['Previsualización social'] += 1
            elif ua == 'vacío':
                family['Sin User-Agent'] += 1
            else:
                family['Navegador / app'] += 1
        for k, v in family.most_common():
            self.stdout.write(f'{v:>7}  {k}')

        self.stdout.write('\nListo.')
