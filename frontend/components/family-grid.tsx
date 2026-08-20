//? GRILL DE PRODUCTOS (EN LA PÁGINA PRINCIPAL)
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProductSummary } from "@/lib/types" // Tu tipo real
import { hubPath } from "@/lib/urls"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react" // Icono de información
import { parseLocale, getCurrency, getLanguage } from "@/lib/i18n"
import { formatCurrency } from "@/lib/format"
import { t } from "@/lib/translations"

interface FamilyGridProps {
  products: ProductSummary[]
  locale?: string
}

export function FamilyGrid({ products, locale }: FamilyGridProps) {
  const resolvedLocale = parseLocale(locale)
  const currency = getCurrency(resolvedLocale)
  const language = getLanguage(resolvedLocale)

  return (
    <section className="container mx-auto px-4 py-12" id="products">
      <h2 className="text-3xl font-bold tracking-tight mb-8 text-center sm:text-left">
        {t("choose_your_model", language)}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          // Construimos la URL semántica hacia el hub del modelo.
          const defaultHref = product.category_slug && product.brand_slug
            ? hubPath(resolvedLocale, product.category_slug, product.brand_slug, product.slug)
            : "#";

          return (
            <Link 
              href={defaultHref} 
              key={product.id} 
              className="group block"
            >
            <Card className="h-full overflow-hidden px-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary/10">
              <div className="aspect-square relative bg-secondary/80 p-8 flex items-center justify-center rounded-xl">
                {product.image ? (
                  <img
                    src={product.image.startsWith('/') ? product.image : `/${product.image}`}
                    alt={product.name}
                    className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-6xl">📱</span>
                )}
              </div>
              
              <CardContent className="px-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* CONENEDOR FLEX: Pone los elementos uno al lado del otro */}
                    {/* items-baseline: Alinea el texto por la base (queda mejor cuando hay tamaños de letra distintos) */}
                    {/* gap-2: Separa el precio actual del precio original */}
                    <div className="flex items-baseline gap-2 mt-1">
                      
                      {/* Precio Actual */}
                      <p className="text-sm font-bold text-emerald-600">
                        {product.min_price_cached 
                          ? `${t("from", language)} ${formatCurrency(product.min_price_cached, currency, language)}` 
                          : t("out_of_stock", language)}
                      </p>

                      {/* Mostrar precio tachado SOLO si existe y es mayor que el actual */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground line-through ml-1 cursor-help decoration-muted-foreground/60 decoration-1">
                              {t("vs_new", language, { price: formatCurrency(product.market_price, currency, language) })}
                              {/* Opcional: Icono info muy sutil */}
                              {/* <Info className="w-3 h-3 opacity-50" /> */}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-[250px] text-xs">
                            <p>
                              {t("reference_source", language)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          );
        })}
      </div>
    </section>
  )
}