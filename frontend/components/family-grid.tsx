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
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary/10">
              <div className="aspect-square relative bg-secondary/30 p-8 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-6xl">📱</span>
                )}
                
                {/* Badge de precio flotante */}
                <Badge className="absolute bottom-3 right-3 text-base px-3 py-1 shadow-sm">
                  {product.min_price_cached 
                    ? `Desde ${product.min_price_cached}€` 
                    : "Sin Stock"}
                </Badge>
              </div>
              
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Apple Smartphone
                    </p>
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