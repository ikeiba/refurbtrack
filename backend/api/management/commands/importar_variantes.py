from django.core.management.base import BaseCommand, CommandError
from api.models import Product, Spec, Offer, Category, Brand, Market, ProductMarketStats
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Carga inicial de productos, specs y genera la matriz de ofertas vacías con imágenes'

    # 1. MAPEO DE CONDICIONES (Igual que en el scraper)
    # Fair=12, Good=11, Excellent=10. Premium suele ser 10 también en la URL básica.
    CONDITION_CODES = {
        Offer.Condition.FAIR: '12',
        Offer.Condition.GOOD: '11',
        Offer.Condition.EXCELLENT: '10',
        Offer.Condition.PREMIUM: '9' 
    }

    # DICCIONARIO DE PRECIOS OFICIALES DE SALIDA (Aprox. en España para el modelo base)
    OFFICIAL_MSRP = {
        "iPhone 11": 589.00,       # Precio final antes de descatalogarse
        "iPhone 11 Pro": 809.00,
        "iPhone 12": 809.00,
        "iPhone 12 Pro": 1039.00,
        "iPhone 13": 739.00,
        "iPhone 13 Pro": 1159.00,
        "iPhone 14": 739.00,
        "iPhone 14 Pro": 1319.00,
        "iPhone 15": 959.00,
        "iPhone 15 Pro": 1219.00,
        "iPhone 16": 859.00,
        "iPhone 16 Pro": 1219.00,
        # Añade más según necesites
    }

    # DICCIONARIO DE PRECIOS OFICIALES DE SALIDA PARA UK (GBP).
    # Valores aproximados pendientes de verificar antes de activar el mercado UK.
    OFFICIAL_MSRP_UK = {
        "iPhone 11": 489.00,
        "iPhone 11 Pro": 639.00,
        "iPhone 12": 649.00,
        "iPhone 12 Pro": 879.00,
        "iPhone 13": 599.00,
        "iPhone 13 Pro": 949.00,
        "iPhone 14": 599.00,
        "iPhone 14 Pro": 1099.00,
        "iPhone 15": 699.00,
        "iPhone 15 Pro": 999.00,
        "iPhone 16": 699.00,
        "iPhone 16 Pro": 999.00,
        # Añade más según necesites
    }

    COLOR_TO_ES = {
    "Black": "Negro",
    "White": "Blanco",
    "Red": "Rojo",
    "Blue": "Azul",
    "Green": "Verde",
    "Yellow": "Amarillo",
    "Purple": "Púrpura",
    "Pink": "Rosa",
    "Gold": "Oro",
    "Silver": "Plata",
    "Space Gray": "Gris Espacial",
    "Midnight": "Medianoche",
    "Midnight Green": "Verde Medianoche",
    "Pacific Blue": "Azul Pacífico",
    "Graphite": "Grafito",
    "Alpine Green": "Verde Alpino",
    "Sierra Blue": "Azul Alpino",
    "Starlight": "Blanco Estrella",
    "Deep Purple": "Morado Oscuro",
    "Space Black": "Negro Espacial",
    "Black Titanium": "Titanio Negro",
    "Blue Titanium": "Titanio Azul",
    "Natural Titanium": "Titanio Natural",
    "White Titanium": "Titanio Blanco",
    "Desert Titanium": "Titanio Desierto",
    "Teal": "Verde Azulado",
    "Ultramarine": "Azul Ultramar"
    }

    def add_arguments(self, parser):
        parser.add_argument(
            '--market', type=str, default='ES',
            help="Código del mercado a importar (default 'ES'). Define dominio, locale y moneda de las URLs."
        )

    def handle(self, *args, **kwargs):
        market_code = kwargs.get('market', 'ES').upper()
        markets = Market.seed()
        self.market = markets.get(market_code)
        if self.market is None:
            raise CommandError(f"Market '{market_code}' no es canónico. Usa 'ES' o 'UK'.")

        self.stdout.write(
            f"Iniciando importación para mercado {self.market.code} "
            f"({self.market.currency}, {self.market.domain}/{self.market.locale})..."
        )
        
        # --- BLOQUE DE DATOS ---
        
        self.insert_product(name="iPhone 11", type="Smartphone", image_path="products/iphone-11-black.avif")
        id = self.get_product_by_name(name="iPhone 11")[0]
        self.insert_spec(product_id=id, uuid="0106bb6f-3975-4794-b9a0-7d920669484c", storage="64",  color="Black")
        self.insert_spec(product_id=id, uuid="701179ec-a741-4ab7-bdf8-5a08bb59dd90", storage="64",  color="Red")
        self.insert_spec(product_id=id, uuid="7ef0a33a-f74f-49e9-aa3d-6611d4d43ead", storage="64",  color="Yellow")
        self.insert_spec(product_id=id, uuid="bc539c8b-2353-4bb8-af5a-d1cdf70b8c63", storage="64",  color="Green")
        self.insert_spec(product_id=id, uuid="c6ea3e23-0e46-442e-a391-c08555d28f37", storage="64",  color="Purple")
        self.insert_spec(product_id=id, uuid="78c89984-2b2f-4a01-abed-5a9ea8205ea0", storage="64",  color="White")
        self.insert_spec(product_id=id, uuid="dfab99ae-8ec6-443e-bc25-34c882d1e0cd", storage="128", color="Black")
        self.insert_spec(product_id=id, uuid="fbf55c31-0707-495d-82f6-3f77c40b9eec", storage="128", color="Red")
        self.insert_spec(product_id=id, uuid="4b705367-37ed-42e7-b642-ff30c2a1cb71", storage="128", color="Yellow")
        self.insert_spec(product_id=id, uuid="aeab67aa-5c4e-4025-8fef-3c34dc2ff2de", storage="128", color="Green")
        self.insert_spec(product_id=id, uuid="b44e8378-424f-44a5-9e99-cb5b897895cd", storage="128", color="Purple")
        self.insert_spec(product_id=id, uuid="41e0c250-a4ef-4e06-bd42-f8b7f9701c20", storage="128", color="White")
        self.insert_spec(product_id=id, uuid="e04ea1fb-2779-4ac8-bed5-571eb9c13102", storage="256", color="Black")
        self.insert_spec(product_id=id, uuid="71b7d300-1094-492d-8895-ffd09d0d8126", storage="256", color="Red")
        self.insert_spec(product_id=id, uuid="574ca178-8518-4d8c-8ba2-c95aac037b6a", storage="256", color="Yellow")
        self.insert_spec(product_id=id, uuid="616da0c1-7404-43a9-a8af-7ea24366fd29", storage="256", color="Green")
        self.insert_spec(product_id=id, uuid="9b8f4e2c-76b6-4087-80b5-16f698fb491c", storage="256", color="Purple")
        self.insert_spec(product_id=id, uuid="1dbbb866-d798-4cb9-b72e-ac0cee641d0b", storage="256", color="White")

        self.insert_product(name="iPhone 11 Pro", type="Smartphone", image_path="products/iphone-11-pro-midnight-green.avif")
        id = self.get_product_by_name(name="iPhone 11 Pro")[0]
        self.insert_spec(product_id=id, uuid="8a9d4ab9-46f9-406b-8a10-c18a719cda81", storage="64",  color="Space Gray")
        self.insert_spec(product_id=id, uuid="b35cbbcd-fce1-4dc2-92da-00296472aaf4", storage="64",  color="Midnight Green")
        self.insert_spec(product_id=id, uuid="4142377d-80f1-4670-8f4e-fab0b6fdffd4", storage="64",  color="Gold")
        self.insert_spec(product_id=id, uuid="fd9cd306-42bd-4422-a221-11a5d277c5d7", storage="64",  color="Silver")
        self.insert_spec(product_id=id, uuid="934ce03d-d77d-4ec3-9316-ba84614ad715", storage="256", color="Space Gray")
        self.insert_spec(product_id=id, uuid="a998bc4e-a6ae-49ad-bfe0-298b68630d06", storage="256", color="Midnight Green")
        self.insert_spec(product_id=id, uuid="b79d17eb-b1b8-49c4-8307-3a053176ab23", storage="256", color="Gold")
        self.insert_spec(product_id=id, uuid="87d1d523-ada8-4c34-98fb-e265be455f9f", storage="256", color="Silver")
        self.insert_spec(product_id=id, uuid="5d1d323c-8fff-41c6-af82-50c23ab0e22e", storage="512", color="Space Gray")
        self.insert_spec(product_id=id, uuid="1819db12-cfca-4ec6-bc62-b8abd1c1dcef", storage="512", color="Midnight Green")
        self.insert_spec(product_id=id, uuid="89274113-77c6-4edf-ac0f-85b448657099", storage="512", color="Gold")
        self.insert_spec(product_id=id, uuid="88499b97-60bc-49c7-8bf1-b51462b17070", storage="512", color="Silver")

        self.insert_product(name="iPhone 12",    type="Smartphone", image_path="products/iphone-12-black.avif")
        id = self.get_product_by_name(name="iPhone 12")[0]
        self.insert_spec(product_id=id, uuid="ec0b1d0d-251d-456e-bcd6-978be85e25d6", storage="64",  color="Black")
        self.insert_spec(product_id=id, uuid="af874b95-0a58-4efa-b0f4-cd020fed146b", storage="64",  color="Red")
        self.insert_spec(product_id=id, uuid="0d7bc01c-3a57-4f7e-944d-966992390e97", storage="64",  color="Blue")
        self.insert_spec(product_id=id, uuid="e86cdb2d-f126-4548-b5c1-967c4a7446a0", storage="64",  color="Green")
        self.insert_spec(product_id=id, uuid="8a7c1cc3-2288-425b-aca1-ef05100414a0", storage="64",  color="Purple")
        self.insert_spec(product_id=id, uuid="5bb9357f-92ed-4b5a-ae83-76a9c983f11a", storage="64",  color="White")
        self.insert_spec(product_id=id, uuid="f494a8a4-ef58-4a1c-9495-a64d21fed02f", storage="128", color="Black")
        self.insert_spec(product_id=id, uuid="d82a1609-1cb8-4620-a9eb-d7564fb665b2", storage="128", color="Red")
        self.insert_spec(product_id=id, uuid="f67c8c8c-8065-47cf-bf8c-d29994cd9869", storage="128", color="Blue")
        self.insert_spec(product_id=id, uuid="8e6e5d35-299d-4a09-82e3-6251e6ec4322", storage="128", color="Green")
        self.insert_spec(product_id=id, uuid="83c3488e-d01c-4329-9f2e-949f7560631f", storage="128", color="Purple")
        self.insert_spec(product_id=id, uuid="fc516a2d-d3bc-4ed6-99d8-a4f51e550d4d", storage="128", color="White")
        self.insert_spec(product_id=id, uuid="86ce7095-db99-4d6f-a800-a48a7fa5db2f", storage="256", color="Black")
        self.insert_spec(product_id=id, uuid="0a21cffb-8ef6-4a40-b65f-d067ae29c988", storage="256", color="Red")
        self.insert_spec(product_id=id, uuid="3610d940-bd34-4092-b219-232aeaea6a67", storage="256", color="Blue")
        self.insert_spec(product_id=id, uuid="25319e69-c676-4564-b97b-ad565f68d64e", storage="256", color="Green")
        self.insert_spec(product_id=id, uuid="bdef7717-ff58-431a-a8e2-3afcc93409e6", storage="256", color="Purple")
        self.insert_spec(product_id=id, uuid="f01d43e2-4f17-4fde-8415-96884e206679", storage="256", color="White")

        self.insert_product(name="iPhone 12 Pro", type="Smartphone", image_path="products/iphone-12-pro-gold.avif")
        id = self.get_product_by_name(name="iPhone 12 Pro")[0]
        self.insert_spec(product_id=id, uuid="6cc9b52b-c002-4963-9655-cb567edd13a3", storage="128", color="Pacific Blue")
        self.insert_spec(product_id=id, uuid="cd7a1df1-fe4a-4a2f-889c-38d05be64126", storage="128", color="Graphite")
        self.insert_spec(product_id=id, uuid="6819199d-d531-4fc0-a1ee-6e63d1088b2f", storage="128", color="Gold")
        self.insert_spec(product_id=id, uuid="3cbf20e9-63de-4bc0-80c5-a3b5bcd5794c", storage="128", color="Silver")
        self.insert_spec(product_id=id, uuid="65b9f551-e429-483d-89ec-b66a453138be", storage="256", color="Pacific Blue")
        self.insert_spec(product_id=id, uuid="4b95c04e-ff61-49ce-8e61-08a3906c33a2", storage="256", color="Graphite")
        self.insert_spec(product_id=id, uuid="98562c21-3477-49b1-aece-b2e81e0dd700", storage="256", color="Gold")
        self.insert_spec(product_id=id, uuid="fd2b3ffc-196f-48ff-a246-c7c368daf497", storage="256", color="Silver")
        self.insert_spec(product_id=id, uuid="7692f1a2-fd7d-4710-aec8-f07154d94eb9", storage="512", color="Pacific Blue")
        self.insert_spec(product_id=id, uuid="145124cf-d3c1-4f37-884f-38b322ff8abd", storage="512", color="Graphite")
        self.insert_spec(product_id=id, uuid="56bc27b8-3299-4836-9c77-15694bbd55c1", storage="512", color="Gold")
        self.insert_spec(product_id=id, uuid="5bbdb839-fe7e-481e-b747-538a588b4636", storage="512", color="Silver")
        
        self.insert_product(name="iPhone 13",    type="Smartphone", image_path="products/iphone-13-green.avif")
        id = self.get_product_by_name(name="iPhone 13")[0]
        self.insert_spec(product_id=id, uuid="ef5660d2-6883-4b81-b47d-86e5720687ef", storage="128", color="Midnight")
        self.insert_spec(product_id=id, uuid="e621dc7f-2574-42f4-8e7d-220dcc6cc851", storage="128", color="Red")
        self.insert_spec(product_id=id, uuid="e4d4b68e-9dec-438d-be52-d348924bfe62", storage="128", color="Blue")
        self.insert_spec(product_id=id, uuid="0d36dce6-d7ce-4356-9763-c4677879cb02", storage="128", color="Green")
        self.insert_spec(product_id=id, uuid="ec975bb8-df95-43a5-b04d-de63378f4a12", storage="128", color="Starlight")
        self.insert_spec(product_id=id, uuid="d1989098-648d-490e-a719-7c4b6ab8b1ae", storage="128", color="Pink")
        self.insert_spec(product_id=id, uuid="c38d3dfb-6962-4d55-858b-7e1f15a0e665", storage="256", color="Midnight")
        self.insert_spec(product_id=id, uuid="5532ef43-c5f1-41bf-8b9e-d3e659ab1424", storage="256", color="Red")
        self.insert_spec(product_id=id, uuid="f72a3516-f868-4dda-bab3-0a44284ba101", storage="256", color="Blue")
        self.insert_spec(product_id=id, uuid="6b725a0e-3c5c-4ac4-bcbb-6081176ffdee", storage="256", color="Green")
        self.insert_spec(product_id=id, uuid="58c0e06e-f4b5-4553-a0a2-1f2a5d1da186", storage="256", color="Starlight")
        self.insert_spec(product_id=id, uuid="47564ee1-e2df-45fe-aa2e-2ce197775187", storage="256", color="Pink")
        self.insert_spec(product_id=id, uuid="57714cb2-bb00-4a67-b7ef-e45b1f799b90", storage="512", color="Midnight")
        self.insert_spec(product_id=id, uuid="0856adb6-cf00-4967-b75c-f7c55723027b", storage="512", color="Red")
        self.insert_spec(product_id=id, uuid="d505f4c1-eaac-42be-9ef8-cc4d1a2862ee", storage="512", color="Blue")
        self.insert_spec(product_id=id, uuid="e5c304aa-2580-49b1-9ead-7bc85d537395", storage="512", color="Green")
        self.insert_spec(product_id=id, uuid="81ab240b-44af-4bb1-a59a-1321ffdd74ba", storage="512", color="Starlight")
        self.insert_spec(product_id=id, uuid="45d1d91f-70d4-4ffc-bb26-6a28b558d4f6", storage="512", color="Pink")

        self.insert_product(name="iPhone 13 Pro", type="Smartphone", image_path="products/iphone-13-pro-graphite.avif")
        id = self.get_product_by_name(name="iPhone 13 Pro")[0]
        self.insert_spec(product_id=id, uuid="35d85a1e-6fa2-4331-ad51-a6e4c2a61a9e", storage="128", color="Alpine Green")
        self.insert_spec(product_id=id, uuid="f597a490-5e4c-450c-88a8-14be4d46f9c1", storage="128", color="Sierra Blue")
        self.insert_spec(product_id=id, uuid="943afa80-1922-43de-a7d9-8c1b4294a727", storage="128", color="Graphite")
        self.insert_spec(product_id=id, uuid="66b5fd89-47d1-40e9-b219-16e464d8c6e1", storage="128", color="Gold")
        self.insert_spec(product_id=id, uuid="9d30a67d-26d0-4324-833e-60e73682f4cd", storage="128", color="Silver")
        self.insert_spec(product_id=id, uuid="e40851bd-09c3-44b9-9dde-b25df88d91fc", storage="256", color="Alpine Green")
        self.insert_spec(product_id=id, uuid="6741de0a-127a-4f21-8103-0cd77abb8574", storage="256", color="Sierra Blue")
        self.insert_spec(product_id=id, uuid="23011c7e-5396-4453-a726-d689e095aa5c", storage="256", color="Graphite")
        self.insert_spec(product_id=id, uuid="62ba5390-d2aa-4a8e-ae9c-23e0443fe229", storage="256", color="Gold")
        self.insert_spec(product_id=id, uuid="9a6ca30b-05f7-4a92-8165-c701c6913f5d", storage="256", color="Silver")
        self.insert_spec(product_id=id, uuid="36fe3f9e-1731-4354-aaf1-c7440b7e396f", storage="512", color="Sierra Blue")
        self.insert_spec(product_id=id, uuid="c29f3de9-6589-4df7-9d12-fe7bf6746759", storage="512", color="Alpine Green")
        self.insert_spec(product_id=id, uuid="8c24e75f-8ee4-4c25-8e36-bb1a666747b8", storage="512", color="Graphite")
        self.insert_spec(product_id=id, uuid="c8e053a6-8fc3-4daa-b208-362e838b74a7", storage="512", color="Gold")
        self.insert_spec(product_id=id, uuid="e04b1489-f2ad-4eb9-816c-dd76bc24f6a8", storage="512", color="Silver")
        self.insert_spec(product_id=id, uuid="e53e328e-6f8e-40ea-a463-a1bb11c43088", storage="1000", color="Sierra Blue")
        self.insert_spec(product_id=id, uuid="1080f60b-6d16-4280-83a1-2f920327043f", storage="1000", color="Alpine Green")
        self.insert_spec(product_id=id, uuid="cfd58ffc-b2b6-4079-a216-f075cd26918f", storage="1000", color="Graphite")
        self.insert_spec(product_id=id, uuid="d5167769-a85a-415d-a5eb-0fa019416271", storage="1000", color="Gold")
        self.insert_spec(product_id=id, uuid="54a9246d-4935-429f-91cb-ac31531c9960", storage="1000", color="Silver")

        self.insert_product(name="iPhone 14",    type="Smartphone", image_path="products/iphone-14-starlight.avif")
        id = self.get_product_by_name(name="iPhone 14")[0]
        self.insert_spec(product_id=id, uuid="400b5725-cbcb-4b97-a7b8-0a2c1d4098ef", storage="128", color="Midnight")
        self.insert_spec(product_id=id, uuid="d61d0800-a563-4e5c-a1e6-652f44de4d4f", storage="128", color="Red")
        self.insert_spec(product_id=id, uuid="93301d87-c54c-4239-897b-f2bd6cd0c505", storage="128", color="Yellow")
        self.insert_spec(product_id=id, uuid="fe94a99b-4733-4794-97de-e813f75b1160", storage="128", color="Blue")
        self.insert_spec(product_id=id, uuid="99165e75-52a8-4442-8f7b-a64778ee6dff", storage="128", color="Purple")
        self.insert_spec(product_id=id, uuid="f205b03f-abd3-43c4-93cd-1002cfd40ddc", storage="128", color="Starlight")
        self.insert_spec(product_id=id, uuid="1a165eda-605f-46c8-afe4-0fc3801e7d75", storage="256", color="Midnight")
        self.insert_spec(product_id=id, uuid="2253ea4c-3001-4f33-82f2-a23168d389e7", storage="256", color="Red")
        self.insert_spec(product_id=id, uuid="13339cb3-efec-4af2-8e0f-8b3b93b4a876", storage="256", color="Yellow")
        self.insert_spec(product_id=id, uuid="41f97adf-dace-41c1-a864-ba1cf269fb57", storage="256", color="Blue")
        self.insert_spec(product_id=id, uuid="d883bf3f-5d7a-4c33-9426-30db1ef9a723", storage="256", color="Purple")
        self.insert_spec(product_id=id, uuid="43215f4d-1701-4052-8ec4-97cc402884ce", storage="256", color="Starlight")
        self.insert_spec(product_id=id, uuid="bd84912a-8d03-4ba6-858f-705528686f71", storage="512", color="Midnight")
        self.insert_spec(product_id=id, uuid="f2a873de-eea1-4c79-8bb6-b81361ff5862", storage="512", color="Red")
        self.insert_spec(product_id=id, uuid="d162f751-ad2e-4941-892c-3def051e4ee4", storage="512", color="Yellow")
        self.insert_spec(product_id=id, uuid="e6c7e211-116c-4896-a63f-e62e33361fb9", storage="512", color="Blue")
        self.insert_spec(product_id=id, uuid="0dccb531-f1ee-4570-98e9-07ac2f2cdb8b", storage="512", color="Purple")
        self.insert_spec(product_id=id, uuid="3298e9bc-9f8f-46b3-8e55-33c05c1f9cff", storage="512", color="Starlight")

        self.insert_product(name="iPhone 14 Pro", type="Smartphone", image_path="products/iphone-14-pro-deep-purple.avif")
        id = self.get_product_by_name(name="iPhone 14 Pro")[0]
        self.insert_spec(product_id=id, uuid="aff0b232-be15-4e88-b486-6648394ee7c1", storage="128", color="Space Black")
        self.insert_spec(product_id=id, uuid="fa0b419c-f920-4e16-837f-d17e44d94475", storage="128", color="Deep Purple")
        self.insert_spec(product_id=id, uuid="d43d4d9f-c195-4e07-a17a-55f169fa5d43", storage="128", color="Gold")
        self.insert_spec(product_id=id, uuid="0b0d67a6-528f-4216-ae75-534782735c1f", storage="128", color="Silver")
        self.insert_spec(product_id=id, uuid="2fbf8833-2197-43f3-b6b8-f9238e32f26f", storage="256", color="Space Black")
        self.insert_spec(product_id=id, uuid="cf863187-d88d-4473-a8c7-fd85b8f4fae2", storage="256", color="Deep Purple")
        self.insert_spec(product_id=id, uuid="2a88c048-5653-49e7-8832-c33122029931", storage="256", color="Gold")
        self.insert_spec(product_id=id, uuid="3fddd5ae-fdcf-4eff-87bc-5e8e33757d0c", storage="256", color="Silver")
        self.insert_spec(product_id=id, uuid="a94ea247-a9df-44d3-962e-4c4010640fab", storage="512", color="Space Black")
        self.insert_spec(product_id=id, uuid="414f2c52-5159-4cc5-8c80-fe94f1f0dd52", storage="512", color="Deep Purple")
        self.insert_spec(product_id=id, uuid="30d8b7ed-da1a-482b-849f-50ef2cc3e6d2", storage="512", color="Gold")
        self.insert_spec(product_id=id, uuid="84208cde-8df5-42d3-9695-a28d0d3ad203", storage="512", color="Silver")
        self.insert_spec(product_id=id, uuid="7fc56758-c465-4c8c-b28c-efe912755a37", storage="1000", color="Space Black")
        self.insert_spec(product_id=id, uuid="10c62c1d-a868-4fdb-8737-7af10bbe238d", storage="1000", color="Deep Purple")
        self.insert_spec(product_id=id, uuid="caf90fc4-92bc-4bf4-a964-a50f1456dd18", storage="1000", color="Gold")
        self.insert_spec(product_id=id, uuid="516f1ace-8b02-4cc3-a3a6-15f59dc78e0e", storage="1000", color="Silver")

        self.insert_product(name="iPhone 15", type="Smartphone", image_path="products/iphone-15-pink.avif")
        id = self.get_product_by_name(name="iPhone 15")[0]
        self.insert_spec(product_id=id, uuid="8debb43b-94ef-4ec4-8589-9520e9eaa983", storage="128", color="Black")
        self.insert_spec(product_id=id, uuid="f2f876e3-b34b-43df-b28b-34f116b556cc", storage="128", color="Yellow")
        self.insert_spec(product_id=id, uuid="a8517119-6ed0-4c6f-8799-22f95658bc19", storage="128", color="Blue")
        self.insert_spec(product_id=id, uuid="5d26a585-f68b-42ea-901d-446485986ed6", storage="128", color="Green")
        self.insert_spec(product_id=id, uuid="b8d85dd9-b4d2-49c5-8727-834860a70d1f", storage="128", color="Pink")
        self.insert_spec(product_id=id, uuid="666afa89-6a49-4101-b7c7-d6414d531095", storage="256", color="Black")
        self.insert_spec(product_id=id, uuid="d29b5878-1c10-4120-a7ef-10f9f16791b7", storage="256", color="Yellow")
        self.insert_spec(product_id=id, uuid="af438cc5-8bf3-478a-ab25-14c2851023c4", storage="256", color="Blue")
        self.insert_spec(product_id=id, uuid="059d41f3-80d0-4809-9869-f72a7318bfd1", storage="256", color="Green")
        self.insert_spec(product_id=id, uuid="24cf08e8-6000-4f43-8ba2-795f8aacbb8f", storage="256", color="Pink")
        self.insert_spec(product_id=id, uuid="43ea1607-c880-46cf-8faa-fae4210330c2", storage="512", color="Black")
        self.insert_spec(product_id=id, uuid="5b49a93d-cd17-4a11-9895-e08539243927", storage="512", color="Yellow")
        self.insert_spec(product_id=id, uuid="72f34bb2-feb0-4f64-82c0-d3340d15a676", storage="512", color="Blue")
        self.insert_spec(product_id=id, uuid="db13648c-d35f-49d7-85b2-2e1eb00cdaf2", storage="512", color="Green")
        self.insert_spec(product_id=id, uuid="5436526c-2180-4b13-a225-1b6c48970729", storage="512", color="Pink")

        self.insert_product(name="iPhone 15 Pro", type="Smartphone", image_path="products/iphone-15-pro-natural-titanium.avif")
        id = self.get_product_by_name(name="iPhone 15 Pro")[0]
        self.insert_spec(product_id=id, uuid="d0fc796e-24da-4ad9-a365-139706087545", storage="128", color="Black Titanium")
        self.insert_spec(product_id=id, uuid="68d59aaf-8b23-4006-aab0-cef9627f535d", storage="128", color="Blue Titanium")
        self.insert_spec(product_id=id, uuid="071cf952-6493-43e7-a89b-14dd3eee922f", storage="128", color="Natural Titanium")
        self.insert_spec(product_id=id, uuid="2b309ac0-b5ac-4596-b754-2a122cf9ea07", storage="128", color="White Titanium")
        self.insert_spec(product_id=id, uuid="8dee5bc8-aabb-4c8b-8739-2b7db28ea365", storage="256", color="Black Titanium")
        self.insert_spec(product_id=id, uuid="ba2f5148-af10-4095-9ec8-78cb5f27e73a", storage="256", color="Blue Titanium")
        self.insert_spec(product_id=id, uuid="d49278ee-73c0-4066-8d0e-efd9fa0c54cc", storage="256", color="Natural Titanium")
        self.insert_spec(product_id=id, uuid="a0c1a947-f250-444d-b39c-8511a5bb6f81", storage="256", color="White Titanium")
        self.insert_spec(product_id=id, uuid="db7396fb-7403-415c-8190-87fa1ac14043", storage="512", color="Black Titanium")
        self.insert_spec(product_id=id, uuid="a3688c7d-447d-4c7a-b230-b5d2b0a130d5", storage="512", color="Blue Titanium")
        self.insert_spec(product_id=id, uuid="abac5232-a29a-45a0-acb7-ab915d88a804", storage="512", color="Natural Titanium")
        self.insert_spec(product_id=id, uuid="8ad45579-374a-4003-99cf-2b13687d019c", storage="512", color="White Titanium")
        self.insert_spec(product_id=id, uuid="a2a4ca1b-2731-4b3f-9c29-2c0e6ac4084a", storage="1000", color="Black Titanium")
        self.insert_spec(product_id=id, uuid="0efd00f8-2aec-4bab-834e-6e031d58321a", storage="1000", color="Blue Titanium")
        self.insert_spec(product_id=id, uuid="0578ee4f-c5e0-4ac5-9359-9a7244971a67", storage="1000", color="Natural Titanium")
        self.insert_spec(product_id=id, uuid="fbd677c3-251b-4739-b9ae-d0857453472d", storage="1000", color="White Titanium")

        self.insert_product(name="iPhone 16", type="Smartphone", image_path="products/iphone-16-black.avif")
        id = self.get_product_by_name(name="iPhone 16")[0]
        self.insert_spec(product_id=id, uuid="ffa54805-4d46-4fa5-9e55-589604fff2ae", storage="128", color="Black")
        self.insert_spec(product_id=id, uuid="7f5bdd13-8f4b-49ee-a94a-8b578deb328d", storage="128", color="Teal")
        self.insert_spec(product_id=id, uuid="ad6dc074-aa15-4f0a-bc2f-a4211fee9aec", storage="128", color="Ultramarine")
        self.insert_spec(product_id=id, uuid="4f4d578f-db15-44ac-b355-dc802c683750", storage="128", color="Pink")
        self.insert_spec(product_id=id, uuid="ec59a99a-dd17-468a-b5aa-fbbddd1c87b5", storage="128", color="White")
        self.insert_spec(product_id=id, uuid="e55d41fb-2b9b-4a57-83a9-5c557cb04fbc", storage="256", color="Black")
        self.insert_spec(product_id=id, uuid="1dc58f73-0074-40b6-be47-2312bb4b8a85", storage="256", color="Teal")
        self.insert_spec(product_id=id, uuid="ddb9ed29-5ce4-4e36-a920-a122578ad617", storage="256", color="Ultramarine")
        self.insert_spec(product_id=id, uuid="0ef61aea-3229-410a-9fa3-f0f992bf7b5f", storage="256", color="Pink")
        self.insert_spec(product_id=id, uuid="aeca3f0b-6654-441d-9efc-1214b08e8c3a", storage="256", color="White")
        self.insert_spec(product_id=id, uuid="-", storage="512", color="Black")
        self.insert_spec(product_id=id, uuid="5c25e285-47cf-483e-9e05-f36f5d9e4eef", storage="512", color="Teal")
        self.insert_spec(product_id=id, uuid="e646435a-0dbc-4def-8150-bcae4471dcb3", storage="512", color="Ultramarine")
        self.insert_spec(product_id=id, uuid="2e721825-ad6c-41a5-bc2b-47c8a2b139d0", storage="512", color="Pink")
        self.insert_spec(product_id=id, uuid="d73b7a48-d424-40f4-86ce-8e7975e90fa5", storage="512", color="White")

        self.insert_product(name="iPhone 16 Pro", type="Smartphone", image_path="products/iphone-16-pro-desert-titanium.avif")
        id = self.get_product_by_name(name="iPhone 16 Pro")[0]
        self.insert_spec(product_id=id, uuid="b78d3007-9148-4569-b0bd-f7ddcfb19a1a", storage="128", color="Black Titanium")
        self.insert_spec(product_id=id, uuid="2a3aadbd-dea6-404b-903a-32e941b3a9d6", storage="128", color="Desert Titanium")
        self.insert_spec(product_id=id, uuid="1754b880-9fb5-4429-bf14-875b5fc1013b", storage="128", color="Natural Titanium")
        self.insert_spec(product_id=id, uuid="942d401f-d010-4392-89dc-7faaffce19d5", storage="128", color="White Titanium")
        self.insert_spec(product_id=id, uuid="c223b8ba-39cf-40e4-b6d5-1e1182dfd3ef", storage="256", color="Black Titanium")
        self.insert_spec(product_id=id, uuid="3f59ddca-1e3e-4c89-807f-87a1da634ef0", storage="256", color="Desert Titanium")
        self.insert_spec(product_id=id, uuid="16169559-2171-4b78-afc3-68bccb852247", storage="256", color="Natural Titanium")
        self.insert_spec(product_id=id, uuid="ec58cfe8-8a6e-488e-9d5d-3c64333c795a", storage="256", color="White Titanium")
        self.insert_spec(product_id=id, uuid="a2409e68-e910-4885-bc0a-4c98efed0d80", storage="512", color="Black Titanium")
        self.insert_spec(product_id=id, uuid="3638ca0c-675a-4790-8884-4bc7dcac075b", storage="512", color="Desert Titanium")
        self.insert_spec(product_id=id, uuid="dc49e1a4-5cf6-4821-861b-1084db76d3ae", storage="512", color="Natural Titanium")
        self.insert_spec(product_id=id, uuid="3a6725f5-b69a-4f33-aaf3-eb8fdea0a83e", storage="512", color="White Titanium")
        self.insert_spec(product_id=id, uuid="f96b5011-f502-4321-9970-6e4be928205e", storage="1000", color="Black Titanium")
        self.insert_spec(product_id=id, uuid="bfe72827-c80e-465a-8c27-6579af0c5dd7", storage="1000", color="Desert Titanium")
        self.insert_spec(product_id=id, uuid="1cbea442-dcaf-419f-b25d-1f90e5910d6f", storage="1000", color="Natural Titanium")
        self.insert_spec(product_id=id, uuid="e25ece40-59d5-4d51-9c46-44941f179c00", storage="1000", color="White Titanium")
        
        # --- FIN DEL BLOQUE ---

        self.stdout.write(self.style.SUCCESS(
            f'¡Importación y generación de matriz completada para mercado {self.market.code}!'
        ))

    # --- FUNCIONES ADAPTADORAS ---
    
    def insert_product(self, name, image_path, type="Smartphone", brand_name="Apple"):
        # 1. Crear o recuperar Categoría y Marca
        category_slug = slugify(type)
        category, _ = Category.objects.get_or_create(
            name=type, 
            defaults={'slug': category_slug}
        )

        brand_slug = slugify(brand_name)
        brand, _ = Brand.objects.get_or_create(
            name=brand_name, 
            defaults={'slug': brand_slug}
        )

        # 2. Generar el slug del producto (ej: "iphone-11")
        product_slug = slugify(name)

        # MSRP del mercado ES (campo legacy de Product, se mantiene por back-compat)
        official_price = self.OFFICIAL_MSRP.get(name, None)

        # 3. Insertar producto con los nuevos campos obligatorios
        product, created = Product.objects.get_or_create(
            name=name, 
            defaults={
                'category': category,
                'brand': brand,
                'slug': product_slug,
                'image': image_path, 
                'market_price': official_price
            }
        )

        if not created and product.market_price != official_price:
            product.market_price = official_price
            product.save(update_fields=['market_price'])

        # 4. MSRP por mercado en ProductMarketStats (fuente de verdad por mercado)
        self.sync_market_msrp(product, name)
            
        self.stdout.write(f"Producto procesado: {name}")

    def sync_market_msrp(self, product, name):
        """Upsert del market_price por mercado en ProductMarketStats (ES y UK)."""
        msrp_by_code = {'ES': self.OFFICIAL_MSRP, 'UK': self.OFFICIAL_MSRP_UK}
        for code, msrp_dict in msrp_by_code.items():
            market = Market.objects.filter(code=code).first()
            if market is None:
                continue
            price = msrp_dict.get(name)
            if price is None:
                continue
            stats, _ = ProductMarketStats.objects.get_or_create(
                product=product,
                market=market,
                defaults={'market_price': price},
            )
            if stats.market_price != price:
                stats.market_price = price
                stats.save(update_fields=['market_price'])

    def get_product_by_name(self, name):
        try:
            p = Product.objects.get(name=name)
            return [p.id] 
        except Product.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"Error: No existe el producto {name}"))
            return [None]

    def insert_spec(self, product_id, uuid, storage, color):
        if product_id is None: return

        try:
            product = Product.objects.get(id=product_id)
            
            product_slug_str = slugify(product.name)
            color_slug = slugify(color)
            image_path = f"products/{product_slug_str}-{color_slug}.avif"
            
            # --- Generar el slug del Spec (ES) ---
            # Ejemplo: "reacondicionado-64gb-black"
            color_es = self.COLOR_TO_ES.get(color, color.lower())
            spec_slug = slugify(f"reacondicionado-{storage}gb-{color_es}")

            # --- Generar el slug EN (el color ya está en inglés en BD) ---
            # Ejemplo: "refurbished-64gb-black"
            spec_slug_en = slugify(f"refurbished-{storage}gb-{color}") or f"refurbished-{slugify(str(storage))}-unknown-{uuid}"
            
            spec, created = Spec.objects.get_or_create(
                back_market_uuid=uuid, 
                defaults={
                    'product': product,
                    'storage': storage,
                    'color': color,
                    'slug': spec_slug,       # <--- Slug ES
                    'slug_en': spec_slug_en, # <--- Slug EN
                    'image': image_path  
                }
            )

            # Si la spec YA existía (created=False), actualizamos la imagen por si acaso cambió
            if not created and spec.image != image_path:
                spec.image = image_path
                spec.save()

            # Si la spec YA existía (created=False), completamos slug_en si faltaba
            if not created and spec.slug_en != spec_slug_en:
                spec.slug_en = spec_slug_en
                spec.save(update_fields=['slug_en'])
            
            # Si la spec YA existía (created=False), actualizamos el color por si acaso cambió
            if not created and spec.color != color:
                spec.color = color
                spec.save()

            # --- 3. Generar la Matriz de Ofertas (Offers) ---
            
            conditions = [
                Offer.Condition.FAIR,
                Offer.Condition.GOOD,
                Offer.Condition.EXCELLENT,
                Offer.Condition.PREMIUM
            ]

            for condition in conditions:
                # Regla de negocio: Premium no tiene batería nueva
                if condition == Offer.Condition.PREMIUM:
                    battery_options = [False]
                else:
                    battery_options = [False, True]

                for battery_new in battery_options:

                    # --- A. CONSTRUCCIÓN DE URL (dominio y locale del mercado) ---
                    base_url = f"https://www.{self.market.domain}/{self.market.locale}/p/-/{uuid}"
                    cond_code = self.CONDITION_CODES.get(condition, '12') # Default 12 (Fair) por seguridad
                    
                    final_url = f"{base_url}?l={cond_code}"
                    
                    if battery_new:
                        final_url += "&offerType=7"
                    
                    # --- B. CREAR/ACTUALIZAR OFERTA ---
                    offer, created = Offer.objects.get_or_create(
                        spec=spec,
                        condition=condition,
                        battery_new=battery_new,
                        country=self.market.code,
                        defaults={
                            'current_price': None,
                            'deal_score': 50,
                            'url': final_url,   # <--- GUARDAMOS LA URL AQUÍ
                            'market': self.market,
                        }
                    )
                    
                    # IMPORTANTE: Si la oferta ya existía (created=False) pero no tenía URL
                    # o mercado (porque acabamos de añadir los campos), se los actualizamos ahora.
                    if not created and (offer.url != final_url or offer.market_id != self.market.id):
                        offer.url = final_url
                        offer.market = self.market
                        offer.save(update_fields=['url', 'market'])



        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error procesando {uuid}: {e}"))