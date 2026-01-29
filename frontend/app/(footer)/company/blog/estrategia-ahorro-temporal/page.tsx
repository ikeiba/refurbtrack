'use client'

import Link from 'next/link'
import { Calendar, User, ArrowLeft, Share2, TrendingDown } from 'lucide-react'

export default function BlogPost() {
  return (
    <div className="space-y-8">
      <Link href="/company/blog" className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Volver al blog
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
            Consejos
          </span>
          <span className="text-xs text-muted-foreground">7 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          💰 5 Estrategias para Maximizar tu Ahorro: Timing y Patrones de Precio
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            22 de enero de 2026
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
          Los precios de dispositivos reacondicionados no son aleatorios. Hay patrones predecibles que pueden ayudarte a ahorrar aún más. Aquí te enseñamos 5 estrategias basadas en análisis real de datos de RefurbTrack.
        </p>

        <h2 className="text-2xl font-bold mt-8">1️⃣ Espera al Lanzamiento de la Siguiente Generación</h2>
        <p>
          Cuando Apple lanza un nuevo iPhone, los modelos anteriores descienden en precio dramáticamente. Patrón típico:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Semana 0 (lanzamiento):</strong> El modelo anterior mantiene precio</li>
          <li><strong>Semana 2-4:</strong> Descenso gradual de 5-10%</li>
          <li><strong>Mes 2:</strong> Descenso de 15-25% (máxima presión)</li>
          <li><strong>Mes 3-6:</strong> Estabilización en nuevo piso bajo</li>
        </ul>
        <p className="mt-4">
          <strong>Estrategia:</strong> Si no necesitas el modelo más nuevo, espera 1-2 meses después del lanzamiento oficial para máximos ahorros.
        </p>

        <h2 className="text-2xl font-bold mt-8">2️⃣ Aprovecha Los Eventos de Shopping</h2>
        <div className="bg-muted/50 p-6 rounded-lg border">
          <h4 className="font-bold mb-3">📅 Eventos de Máxima Actividad</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <strong>Black Friday / Cyber Monday (Noviembre)</strong><br />
              Descuentos: 20-40% adicionales sobre precios base<br />
              Riesgo: Popularidad puede agotar stock
            </li>
            <li>
              <strong>Prime Day (Julio)</strong><br />
              Descuentos: 15-30% en Amazon Renewed<br />
              Riesgo: Solo si tienes Prime
            </li>
            <li>
              <strong>Black Friday de Mediados de Año</strong><br />
              Descuentos: 10-20%<br />
              Oportunidad: Menos conocido, menos competencia
            </li>
            <li>
              <strong>Rebajas de Enero (Post-Navidad)</strong><br />
              Descuentos: 15-25% (inventory clearance)<br />
              Oportunidad: Excelente relación calidad-precio
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">3️⃣ Compra Modelos Discontinuados o de Hace 2 Años</h2>
        <p>
          El iPhone 13 sigue siendo un excelente dispositivo en 2026, pero cuesta menos porque está "viejo" de serie.
        </p>
        <p>
          Ahorros típicos:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Modelo actual: 15-25% descuento vs nuevo</li>
          <li>Modelo de hace 1 año: 30-45% descuento</li>
          <li>Modelo de hace 2+ años: 45-65% descuento</li>
        </ul>
        <p className="mt-4 text-sm bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
          <strong>⚠️ Nota:</strong> Asegúrate que el modelo sigue siendo soportado por actualizaciones del fabricante. iOS 18 aún soporta iPhone XS (2018), pero iOS 17 fue el último para iPhone 6S.
        </p>

        <h2 className="text-2xl font-bold mt-8">4️⃣ Monitorea Tendencias Semanales</h2>
        <p>
          Los precios fluctúan. Análisis de RefurbTrack muestra:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Lunes-Miércoles:</strong> Precios típicamente más bajos (menos demanda laboral)</li>
          <li><strong>Jueves-Viernes:</strong> Precios suben (compras de fin de semana)</li>
          <li><strong>Fin de Semana:</strong> Precios elevados (máxima demanda)</li>
          <li><strong>Noches (22:00-06:00):</strong> Ocasionalmente más bajos en tiendas que actualizan nocturnamente</li>
        </ul>
        <p className="mt-4">
          <strong>Estrategia:</strong> Configura alertas de precio para el modelo que quieres. RefurbTrack te notificará cuando baje.
        </p>

        <h2 className="text-2xl font-bold mt-8">5️⃣ Compara Entre Marketplaces Constantemente</h2>
        <p>
          El MISMO dispositivo puede variar de precio significativamente:
        </p>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3">📊 Ejemplo Real (iPhone 14 Pro, Excelente estado)</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Vendedor A</span>
              <span className="font-bold">€899</span>
            </li>
            <li className="flex justify-between">
              <span>Vendedor B</span>
              <span className="font-bold">€949</span>
            </li>
            <li className="flex justify-between">
              <span>Subasta - Vendedor C</span>
              <span className="font-bold">€799 (después de pujas)</span>
            </li>
            <li className="flex justify-between text-emerald-700 dark:text-emerald-300 font-bold">
              <span>Diferencia potencial</span>
              <span>€150 (16% de ahorro)</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">Estrategia Combinada: El Plan Perfecto</h2>
        <p>
          Si quieres maximizar ahorro, combina todas:
        </p>
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Semana 1:</strong> Identifica el modelo que quieres (puede ser 1-2 años más antiguo)
          </li>
          <li>
            <strong>Semana 2:</strong> Configura alertas de precio en RefurbTrack para todos los marketplaces
          </li>
          <li>
            <strong>Semana 3-5:</strong> Espera el próximo evento (Black Friday, lanzamiento, etc.)
          </li>
          <li>
            <strong>Evento:</strong> Compara precios en tiempo real entre Back Market, Amazon y eBay
          </li>
          <li>
            <strong>Compra:</strong> En el marketplace más barato, verificando garantía y vendedor
          </li>
        </ol>

        <p className="mt-4 text-sm italic">
          Resultado típico: 40-50% descuento vs dispositivo nuevo en lugar de 15-25% descuento.
        </p>

        <h2 className="text-2xl font-bold mt-8">⚠️ Errores a Evitar</h2>

        <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 rounded">
          <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
            <li>❌ <strong>Obsesionarse con micro-descuentos:</strong> Esperar 3 meses por €20 de ahorro no vale la pena</li>
            <li>❌ <strong>Ignorar vendedores:</strong> El mejor precio no vale nada si el vendedor tiene reseñas pobres</li>
            <li>❌ <strong>Comprar fuera de garantía:</strong> Siempre verifica período de garantía (mínimo 12 meses)</li>
            <li>❌ <strong>Olvidar costes de envío:</strong> Un "€50 más barato" puede tener €30 de envío</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">Conclusión</h2>
        <p>
          No es magia, es paciencia + información. Los precios de reacondicionados siguen patrones predecibles si sabes dónde buscar.
        </p>

        <p>
          <strong>RefurbTrack</strong> existe para quitarte el trabajo tedioso: monitoreamos todos los marketplaces, identificamos tendencias, y te alertamos cuando el precio cae. Tu trabajo es simplemente esperar el momento correcto.
        </p>
      </article>

      <div className="pt-8 border-t space-y-4">
        <Link href="/company/blog" className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Volver al blog
        </Link>
      </div>
    </div>
  )
}


