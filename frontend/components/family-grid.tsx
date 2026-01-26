import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProductSummary } from "@/lib/types" // Tu tipo real

interface FamilyGridProps {
  products: ProductSummary[]
}

export function FamilyGrid({ products }: FamilyGridProps) {
  return (
    <section className="container mx-auto px-4 py-12" id="products">
      <h2 className="text-3xl font-bold tracking-tight mb-8 text-center sm:text-left">
        Elige tu modelo
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          /* CAMBIO IMPORTANTE: 
             En lugar de un div con onClick, usamos un Link de Next.js.
             Esto lleva al usuario a /product/123
          */
          <Link 
            href={`/product/${product.id}`} 
            key={product.id} 
            className="group block"
          >
            <Card className="h-full overflow-hidden px-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary/10">
              <div className="aspect-square relative bg-secondary/80 p-8 flex items-center justify-center rounded-xl">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
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
                      <p className="text-sm font-medium text-foreground">
                        {product.min_price_cached 
                          ? `Desde ${product.min_price_cached}€` 
                          : "Sin Stock"}
                      </p>

                      {/* Precio Original (Tachado) */}
                      <p className="text-xs text-muted-foreground line-through">
                        vs ~ 1000€ new
                      </p>
                      
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}