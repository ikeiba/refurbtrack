import Link from 'next/link'
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react'

export default function BlogPost() {
  return (
    <div className="space-y-8">
      <Link href="/es/blog" className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Volver al blog
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
            Comparativa
          </span>
          <span className="text-xs text-muted-foreground">10 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          🛍️ Back Market vs Amazon Renewed vs eBay: Comparativa Completa
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            20 de enero de 2026
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            Equipo RefurbTrack
          </span>
        </div>
      </div>

      <article className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-base leading-relaxed">
        <p className="text-lg text-muted-foreground">
          El mercado de dispositivos reacondicionados está fragmentado entre varios grandes actores. Aquí comparamos los tres principales marketplaces en profundidad: qué los diferencia, dónde encontrar mejores precios y cuál elegir según tus necesidades.
        </p>

        <h2 className="text-2xl font-bold mt-8">Back Market: El Especialista Puro</h2>
        <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">📌 Características</h4>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Marketplace dedicado 100% a reacondicionados</li>
            <li>Vendedores profesionales verificados (no P2P)</li>
            <li>Garantía estándar: 12 meses</li>
            <li>Retorno: 30 días sin preguntas</li>
            <li>Comunidad: Reseñas verificadas de compradores reales</li>
            <li>Presencia: Europa, USA y Japón</li>
          </ul>
        </div>

        <h3 className="text-xl font-bold mt-6">Ventajas</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Especialización:</strong> Equipo dedicado a calidad en reacondicionados</li>
          <li><strong>Transparencia:</strong> Fotos claras de daños, estado de batería exacto</li>
          <li><strong>Reseñas verificadas:</strong> Solo compradores reales pueden calificar</li>
          <li><strong>Precios competitivos:</strong> Muchos vendedores crean presión a la baja</li>
          <li><strong>Garantía generosa:</strong> 12 meses es estándar, muchas veces llegando hasta los 24</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Desventajas</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Menos oferta total:</strong> Especialmente en modelos más antiguos</li>
          <li><strong>Envíos más lentos:</strong> Típicamente 5-7 días</li>
          <li><strong>Mercado secundario:</strong> Algunos vendedores tienen más reseñas altas que otros</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Mejor para</h3>
        <p className="italic">Compradores que valoran especialización, transparencia y no quieren sorpresas. Ideal si es tu primera compra reacondicionada.</p>

        <h2 className="text-2xl font-bold mt-8">Amazon Renewed: La Alternativa Confiable</h2>
        <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-3">📌 Características</h4>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Categoría dentro del ecosistema Amazon</li>
            <li>Vendedores certificados + Amazon como garantor</li>
            <li>Garantía: 90 días a 12 meses (depende del vendedor)</li>
            <li>Retorno: Protección total de Amazon (típicamente 30 días)</li>
            <li>Envío: Muchas opciones incluyen envío Prime</li>
            <li>Política de devoluciones: Muy favorable al comprador</li>
          </ul>
        </div>

        <h3 className="text-xl font-bold mt-6">Ventajas</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Confianza de Amazon:</strong> Respaldo de una corporación masiva</li>
          <li><strong>Prime Shipping:</strong> Envíos rápidos si tienes suscripción</li>
          <li><strong>Protección del comprador:</strong> Amazon intercede si hay problemas</li>
          <li><strong>Devoluciones fáciles:</strong> En caso de problema, Amazon lo resuelve</li>
          <li><strong>Oferta variada:</strong> Muchos vendedores y modelos</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Desventajas</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Menos especialización:</strong> No es un marketplace de reacondicionados dedicado</li>
          <li><strong>Garantías variables:</strong> Depende mucho del vendedor (90 días a 12 meses)</li>
          <li><strong>Información menos detallada:</strong> A veces no se especifica el estado exacto de batería</li>
          <li><strong>Precio variable:</strong> Menos transparencia en el modelo de precios</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Mejor para</h3>
        <p className="italic">Usuarios de Amazon Prime que valoran velocidad de envío y protección robusta. Si ya tienes Amazon Prime, suele ser más rápido.</p>

        <h2 className="text-2xl font-bold mt-8">eBay Refurbished: El Mercado de Masas</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-3">📌 Características</h4>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Marketplace híbrido P2P + sellers profesionales</li>
            <li>Múltiples opciones de garantía y vendedores</li>
            <li>Retorno: Variable (según vendedor)</li>
            <li>Oferta: Masiva, incluso modelos raros</li>
            <li>Protección: eBay Money Back Guarantee (hasta 180 días)</li>
          </ul>
        </div>

        <h3 className="text-xl font-bold mt-6">Ventajas</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Mayor oferta:</strong> Incluso modelos descontinuados raros</li>
          <li><strong>Variedad de precios:</strong> Desde deals extremos hasta premium</li>
          <li><strong>Subastas:</strong> Puedes conseguir precios muy bajos si tienes paciencia</li>
          <li><strong>Protección fuerte:</strong> eBay Money Back Guarantee es rigurosa</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Desventajas</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Variabilidad:</strong> Calidad muy inconsistente entre vendedores</li>
          <li><strong>Menos especialización:</strong> No es marketplace de reacondicionados</li>
          <li><strong>Riesgo mayor:</strong> Hay más vendedores de baja calidad que en Back Market</li>
          <li><strong>Información inconsistente:</strong> Las descripciones varían mucho</li>
          <li><strong>Proceso más complejo:</strong> Más pasos y menos estandarización</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">Mejor para</h3>
        <p className="italic">Compradores expertos que saben detectar fraudes. Buscadores de deals extremos. Personas buscando modelos descontinuados raros.</p>

        <h2 className="text-2xl font-bold mt-8">Comparativa Lado a Lado</h2>
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-3 font-bold">Factor</th>
                <th className="text-left p-3 font-bold">Back Market</th>
                <th className="text-left p-3 font-bold">Amazon Renewed</th>
                <th className="text-left p-3 font-bold">eBay</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Especialización</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐</td>
                <td className="p-3">⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Garantía</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Velocidad Envío</td>
                <td className="p-3">⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Variedad</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Mejor Precio</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Protección Comprador</td>
                <td className="p-3">⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐⭐</td>
                <td className="p-3">⭐⭐⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8">¿Cuál Debería Elegir?</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <h4 className="font-bold text-lg">🟢 Elige Back Market si...</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Es tu primera compra reacondicionada (máxima tranquilidad)</li>
              <li>Valoras especialización y transparencia</li>
              <li>Quieres reseñas verificadas de otros compradores</li>
              <li>Prefieres garantía de 12 meses estándar</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-bold text-lg">🔵 Elige Amazon Renewed si...</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Eres suscriptor de Amazon Prime (envío rápido)</li>
              <li>Valoras velocidad sobre especialización</li>
              <li>Prefieres la protección del comprador de Amazon</li>
              <li>Quieres devoluciones sin complicaciones</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4 py-2">
            <h4 className="font-bold text-lg">🔴 Elige eBay si...</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Eres un comprador experimentado</li>
              <li>Buscas precios más agresivos (incluso subastas)</li>
              <li>Necesitas un modelo específico raro o descontinuado</li>
              <li>Tienes tiempo para investigar vendedores</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Nuestra Recomendación</h2>
        <p>
          <strong>RefurbTrack</strong> hace exactamente esto: compara precios en todos los marketplaces principales para que veas en un vistazo dónde está la mejor oferta. Porque en muchos casos, el mismo modelo está disponible a precios distintos en Back Market, Amazon y eBay. Nosotros hacemos el trabajo de verificar dónde está más barato y en qué estados.
        </p>
      </article>

      <div className="pt-8 border-t space-y-4">
        <Link href="/es/blog" className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Volver al blog
        </Link>
      </div>
    </div>
  )
}
