from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import (
    Market, Product, Spec, Offer, Alert, ProductMarketStats, SpecMarketStats,
)


class Command(BaseCommand):
    """
    Backfill seguro para la Fase 1 de internacionalización.

    Hace, en orden y de forma idempotente (se puede re-ejecutar sin duplicar):
      1. Siembra los mercados ES y UK.
      2. Asigna Offer.market / Alert.market desde el campo heredado `country`
         (solo a filas con market NULL; fallback al mercado ES).
      3. Genera Spec.slug_en a partir de storage + color (el color ya está en
         inglés en BD), con fallback tolerante a fallos por fila.
      4. Rellena ProductMarketStats / SpecMarketStats del mercado ES copiando
         los caches legacy de Product / Spec (una única copia, sin machacar
         filas ya existentes).

    No aborta nunca por datos de color inesperados; solo por errores de
    infraestructura (BD caída).
    """

    help = 'Siembra mercados y backfillea market/slug_en/stats (idempotente).'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando backfill de mercados...')

        markets = self.seed_markets()
        es_market = markets['ES']

        n_offers = self.backfill_offers(es_market)
        n_alerts = self.backfill_alerts(es_market)
        n_slugs = self.generate_slug_en()
        n_prod_stats, n_spec_stats = self.fill_stats(es_market)

        self.stdout.write(self.style.SUCCESS(
            f'Backfill completado -> {len(markets)} mercados | '
            f'{n_offers} ofertas | {n_alerts} alertas | {n_slugs} slugs EN | '
            f'{n_prod_stats} product-stats | {n_spec_stats} spec-stats.'
        ))

    # --- 1. Seed de mercados ---
    def seed_markets(self):
        markets = Market.seed()
        for code, market in markets.items():
            self.stdout.write(f"  Market {code}: {market.currency} @ {market.domain}")
        return markets

    # --- 2a. Backfill Offer.market ---
    def backfill_offers(self, es_market):
        by_code = {m.code: m for m in Market.objects.all()}
        n = 0
        countries = (
            Offer.objects.filter(market__isnull=True)
            .values_list('country', flat=True)
            .distinct()
        )
        for country in countries:
            market = by_code.get(country, es_market)
            updated = Offer.objects.filter(market__isnull=True, country=country).update(market=market)
            if updated:
                self.stdout.write(f"  Offers country={country} -> market={market.code} ({updated} filas)")
            n += updated
        return n

    # --- 2b. Backfill Alert.market ---
    def backfill_alerts(self, es_market):
        by_code = {m.code: m for m in Market.objects.all()}
        n = 0
        countries = (
            Alert.objects.filter(market__isnull=True)
            .values_list('country', flat=True)
            .distinct()
        )
        for country in countries:
            market = by_code.get(country, es_market)
            updated = Alert.objects.filter(market__isnull=True, country=country).update(market=market)
            if updated:
                self.stdout.write(f"  Alerts country={country} -> market={market.code} ({updated} filas)")
            n += updated
        return n

    # --- 3. Generación fail-safe de Spec.slug_en ---
    def generate_slug_en(self):
        n = 0
        unknown = 0
        pending = Spec.objects.filter(slug_en__isnull=True)
        for spec in pending.iterator():
            try:
                slug_en = self._build_slug_en(spec)
                if slug_en is None:
                    unknown += 1
                    slug_en = f"refurbished-{slugify(str(spec.storage))}-unknown-{spec.id}"
                Spec.objects.filter(pk=spec.pk).update(slug_en=slug_en)
                n += 1
            except Exception as e:
                # Tolerante a fallos por fila: logueamos y seguimos con la siguiente.
                self.stdout.write(self.style.WARNING(
                    f"  slug_en omitido para Spec {spec.id} ({spec.color!r}): {e}"
                ))
        if unknown:
            self.stdout.write(self.style.WARNING(
                f"  {unknown} specs sin color válido -> slug fallback 'unknown-<id>' aplicado."
            ))
        return n

    def _build_slug_en(self, spec):
        """Devuelve el slug EN o None si no hay color válido (nunca lanza)."""
        color_en = (spec.color or '').strip()
        if not color_en:
            return None
        slug_en = slugify(f"refurbished-{spec.storage}gb-{color_en}")
        return slug_en or None

    # --- 4. Relleno de stats por mercado (copia única desde caches legacy) ---
    def fill_stats(self, es_market):
        n_prod = 0
        for product in Product.objects.all().iterator():
            _, created = ProductMarketStats.objects.get_or_create(
                product=product,
                market=es_market,
                defaults={
                    'min_price_cached': product.min_price_cached,
                    'lowest_ever_price': product.lowest_ever_price,
                    'lowest_ever_date': product.lowest_ever_date,
                    'market_price': product.market_price,
                    'last_updated': product.last_updated,
                },
            )
            if created:
                n_prod += 1

        n_spec = 0
        for spec in Spec.objects.all().iterator():
            _, created = SpecMarketStats.objects.get_or_create(
                spec=spec,
                market=es_market,
                defaults={
                    'min_price_cached': spec.min_price_cached,
                    'lowest_ever_price': spec.lowest_ever_price,
                    'lowest_ever_date': spec.lowest_ever_date,
                    'last_updated': spec.last_updated,
                },
            )
            if created:
                n_spec += 1

        return n_prod, n_spec
