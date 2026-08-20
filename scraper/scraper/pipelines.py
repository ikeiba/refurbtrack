# scraper/scraper/pipelines.py
#
# ⚠️ OBSOLETO — SIN USO.
#
# Este pipeline quedó obsoleto: el spider `backmarket.py` escribe directamente en
# la base de datos (crea `PriceHistory` contra el `Offer` correcto), por lo que
# `ITEM_PIPELINES` está vacío en `settings.py` y este código nunca se ejecuta.
#
# Además referencia el modelo inexistente `Variant` (hoy `Spec`), por lo que no
# debe reutilizarse sin una reescritura completa. Se mantiene solo como
# referencia histórica.
