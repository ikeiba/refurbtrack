from decimal import Decimal

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta

from .models import (
    Category, Brand, Product, Spec, Offer, PriceHistory,
    Market, SpecMarketStats, ProductMarketStats,
)
from . import insights
from .services import build_model_hub, get_featured_history, recompute_market_stats


class InsightsPureFunctionsTests(TestCase):
    def test_num_none_and_invalid(self):
        self.assertIsNone(insights.num(None))
        self.assertIsNone(insights.num("abc"))
        self.assertIsNone(insights.num(float("nan")))
        self.assertEqual(insights.num("425.00"), 425.0)

    def test_current_price_returns_lowest_positive(self):
        self.assertEqual(insights.current_price([None, 500, 425, "399.99"]), 399.99)

    def test_current_price_returns_none_without_data(self):
        self.assertIsNone(insights.current_price([None, None]))
        self.assertIsNone(insights.current_price([]))

    def test_avg_30d(self):
        self.assertEqual(insights.avg_30d([100, 200, 300]), 200.0)
        self.assertIsNone(insights.avg_30d([None, 0]))

    def test_percentage_vs_average(self):
        self.assertEqual(insights.percentage_vs_average(110, 100), 10.0)
        self.assertEqual(insights.percentage_vs_average(90, 100), -10.0)
        self.assertIsNone(insights.percentage_vs_average(None, 100))
        self.assertIsNone(insights.percentage_vs_average(100, 0))

    def test_percentage_vs_minimum_and_maximum(self):
        self.assertEqual(insights.percentage_vs_minimum(105, 100), 5.0)
        self.assertEqual(insights.percentage_vs_maximum(95, 100), -5.0)
        self.assertIsNone(insights.percentage_vs_maximum(None, 100))

    def test_price_position(self):
        self.assertEqual(insights.price_position(100, 0, 100), 100.0)
        self.assertEqual(insights.price_position(50, 0, 100), 50.0)
        self.assertIsNone(insights.price_position(50, 50, 50))
        self.assertIsNone(insights.price_position(None, 0, 100))

    def test_position_label(self):
        self.assertEqual(insights.position_label(5), "cerca del mínimo reciente")
        self.assertEqual(insights.position_label(90), "cerca del máximo reciente")
        self.assertIsNone(insights.position_label(None))


class ModelHubServiceTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Smartphone", slug="smartphone")
        self.brand = Brand.objects.create(name="Apple", slug="apple")
        self.product = Product.objects.create(
            category=self.category,
            brand=self.brand,
            name="iPhone 15",
            slug="iphone-15",
            market_price=959.00,
        )
        self.spec_128 = Spec.objects.create(
            product=self.product, slug="reacondicionado-128gb-negro",
            back_market_uuid="uuid-128", storage="128", color="Black",
        )
        self.spec_256 = Spec.objects.create(
            product=self.product, slug="reacondicionado-256gb-negro",
            back_market_uuid="uuid-256", storage="256", color="Black",
        )

    def test_hub_aggregation_without_prices(self):
        hub = build_model_hub(self.product)
        self.assertEqual(hub["summary"]["config_count"], 2)
        self.assertIsNone(hub["summary"]["lowest_current_price"])
        self.assertIsNone(hub["summary"]["avg_current_price"])
        storages = [g["storage"] for g in hub["storage_groups"]]
        self.assertEqual(storages, ["128", "256"])

    def test_hub_aggregation_with_history(self):
        offer = Offer.objects.create(
            spec=self.spec_128, condition="Good", battery_new=False,
            country="ES", current_price=Decimal("425.00"),
            min_price_30d=Decimal("419.00"), max_price_30d=Decimal("452.00"),
            last_updated=timezone.now(),
        )
        now = timezone.now()
        for price in (Decimal("419.00"), Decimal("452.00"), Decimal("425.00")):
            PriceHistory.objects.create(offer=offer, price=price, timestamp=now - timedelta(days=1))

        hub = build_model_hub(self.product)
        self.assertEqual(hub["summary"]["lowest_current_price"], 425.0)
        self.assertIsNotNone(hub["summary"]["avg_current_price"])
        # El resumen agrupa por storage; el grupo 128 tiene una spec con precio.
        group = next(g for g in hub["storage_groups"] if g["storage"] == "128")
        spec = group["specs"][0]
        self.assertEqual(spec["current_price"], 425.0)
        self.assertEqual(spec["min_price_30d"], 419.0)
        self.assertEqual(spec["max_price_30d"], 452.0)
        # La media viene del histórico real (419 + 452 + 425) / 3
        self.assertEqual(spec["avg_price_30d"], round((419 + 452 + 425) / 3, 2))

    def test_featured_history_returns_none_without_data(self):
        result = get_featured_history()
        self.assertIsNone(result["model"])
        self.assertEqual(result["history"], [])


class ModelHubEndpointTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Smartphone", slug="smartphone")
        self.brand = Brand.objects.create(name="Apple", slug="apple")
        self.product = Product.objects.create(
            category=self.category, brand=self.brand,
            name="iPhone 15", slug="iphone-15",
        )
        Spec.objects.create(
            product=self.product, slug="reacondicionado-128gb-negro",
            back_market_uuid="uuid-128", storage="128", color="Black",
        )

    def test_model_hub_endpoint_ok(self):
        url = reverse("model-hub")
        response = self.client.get(url, {"cat": "smartphone", "brand": "apple", "prod": "iphone-15"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "iPhone 15")

    def test_model_hub_endpoint_404_unknown_model(self):
        url = reverse("model-hub")
        response = self.client.get(url, {"cat": "smartphone", "brand": "apple", "prod": "iphone-99"})
        self.assertEqual(response.status_code, 404)

    def test_resolve_endpoint_404_unknown_spec(self):
        url = reverse("product-resolve")
        response = self.client.get(
            url, {"cat": "smartphone", "brand": "apple", "prod": "iphone-15", "spec": "inexistente"}
        )
        self.assertEqual(response.status_code, 404)


class MarketAwareServicesTests(TestCase):
    def setUp(self):
        self.markets = Market.seed()
        self.es = self.markets['ES']
        self.uk = self.markets['UK']

        self.category = Category.objects.create(name="Smartphone", slug="smartphone")
        self.brand = Brand.objects.create(name="Apple", slug="apple")
        self.product = Product.objects.create(
            category=self.category, brand=self.brand,
            name="iPhone 15", slug="iphone-15", market_price=Decimal("959.00"),
        )
        self.spec = Spec.objects.create(
            product=self.product, slug="reacondicionado-128gb-negro",
            slug_en="refurbished-128gb-black",
            back_market_uuid="uuid-128", storage="128", color="Black",
        )
        self.offer_es = Offer.objects.create(
            spec=self.spec, condition="Good", battery_new=False,
            country="ES", market=self.es,
        )
        self.offer_uk = Offer.objects.create(
            spec=self.spec, condition="Good", battery_new=False,
            country="UK", market=self.uk,
        )

    def test_signals_recompute_only_market_stats(self):
        PriceHistory.objects.create(offer=self.offer_es, price=Decimal("300.00"))
        PriceHistory.objects.create(offer=self.offer_uk, price=Decimal("500.00"))

        es_stat = SpecMarketStats.objects.get(spec=self.spec, market=self.es)
        uk_stat = SpecMarketStats.objects.get(spec=self.spec, market=self.uk)
        self.assertEqual(es_stat.min_price_cached, Decimal("300.00"))
        self.assertEqual(uk_stat.min_price_cached, Decimal("500.00"))

        # Los campos legacy de Spec quedan congelados (sin dual-write).
        self.assertIsNone(Spec.objects.get(id=self.spec.id).min_price_cached)

        es_prod = ProductMarketStats.objects.get(product=self.product, market=self.es)
        uk_prod = ProductMarketStats.objects.get(product=self.product, market=self.uk)
        self.assertEqual(es_prod.min_price_cached, Decimal("300.00"))
        self.assertEqual(uk_prod.min_price_cached, Decimal("500.00"))

    def test_recompute_market_stats_is_market_scoped(self):
        self.offer_es.current_price = Decimal("300.00")
        self.offer_es.save()
        self.offer_uk.current_price = Decimal("500.00")
        self.offer_uk.save()

        recompute_market_stats(self.spec, self.es)
        recompute_market_stats(self.spec, self.uk)

        es_stat = SpecMarketStats.objects.get(spec=self.spec, market=self.es)
        uk_stat = SpecMarketStats.objects.get(spec=self.spec, market=self.uk)
        self.assertEqual(es_stat.min_price_cached, Decimal("300.00"))
        self.assertEqual(uk_stat.min_price_cached, Decimal("500.00"))

    def test_build_model_hub_filters_offers_by_market(self):
        self.offer_es.current_price = Decimal("300.00")
        self.offer_es.save()
        self.offer_uk.current_price = Decimal("500.00")
        self.offer_uk.save()

        hub_es = build_model_hub(self.product, self.es)
        hub_uk = build_model_hub(self.product, self.uk)

        self.assertEqual(hub_es["summary"]["lowest_current_price"], 300.0)
        self.assertEqual(hub_uk["summary"]["lowest_current_price"], 500.0)

    def test_model_hub_endpoint_resolves_market_and_currency(self):
        url = reverse("model-hub")
        response = self.client.get(
            url, {"cat": "smartphone", "brand": "apple", "prod": "iphone-15", "market": "UK"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "iPhone 15")

    def test_product_list_exposes_market_and_currency(self):
        url = reverse("product-list")
        response = self.client.get(url, {"market": "UK"})
        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertIsInstance(results, list)
        if results:
            self.assertEqual(results[0]["market"], "UK")
            self.assertEqual(results[0]["currency"], "GBP")

    def test_resolve_endpoint_uses_slug_en_for_uk(self):
        self.offer_es.current_price = Decimal("300.00")
        self.offer_es.save()

        url = reverse("product-resolve")
        response = self.client.get(
            url, {
                "cat": "smartphone", "brand": "apple", "prod": "iphone-15",
                "spec": "refurbished-128gb-black", "market": "UK",
            }
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["currency"], "GBP")
        self.assertEqual(data["current_spec_id"], self.spec.id)
