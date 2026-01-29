'use client'

import Link from 'next/link'
import { Calendar, User, ArrowLeft, Share2, TrendingUp } from 'lucide-react'

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
            Mercado
          </span>
          <span className="text-xs text-muted-foreground">9 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          📊 Tendencias del Mercado Refurbished 2026: Crecimiento y Oportunidades
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            26 de enero de 2026
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
          El mercado de dispositivos reacondicionados está creciendo a una velocidad sin precedentes. Aquí analizamos las tendencias principales, lo que significa para los compradores, y qué podemos esperar en los próximos meses.
        </p>

        <h2 className="text-2xl font-bold mt-8">📈 Números del Crecimiento</h2>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Datos de Mercado Global
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Tamaño del mercado refurbished 2023</span>
              <span className="font-bold">$36B USD</span>
            </li>
            <li className="flex justify-between">
              <span>Tasa de crecimiento anual proyectada</span>
              <span className="font-bold">13% CAGR</span>
            </li>
            <li className="flex justify-between">
              <span>Proyección 2027</span>
              <span className="font-bold">$61B USD</span>
            </li>
            <li className="flex justify-between">
              <span>% de adopción en Europa 2024</span>
              <span className="font-bold">22% de toda electrónica</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">1️⃣ Dispositivos Más Demandados</h2>
        <p>
          Según análisis de RefurbTrack y datos del mercado:
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 text-lg">🥇 N°1: iPhones</h4>
            <p className="text-sm text-muted-foreground mb-3">
              45% del tráfico de búsqueda. Modelos más populares:
            </p>
            <ul className="text-xs space-y-1">
              <li>• iPhone 14 Pro Max</li>
              <li>• iPhone 15 Pro</li>
              <li>• iPhone 13 (valor)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 text-lg">🥈 N°2: MacBooks</h4>
            <p className="text-sm text-muted-foreground mb-3">
              30% del tráfico. Crecimiento 28% YoY:
            </p>
            <ul className="text-xs space-y-1">
              <li>• M1/M2 Pro</li>
              <li>• M3 (nuevos)</li>
              <li>• Modelos Intel (valor)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-2 text-lg">🥉 N°3: iPads</h4>
            <p className="text-sm text-muted-foreground mb-3">
              15% del tráfico. Crecimiento educativo:
            </p>
            <ul className="text-xs space-y-1">
              <li>• iPad Pro (M1/M2)</li>
              <li>• iPad Air (valor)</li>
              <li>• iPad Standard (entry)</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">2️⃣ Innovaciones en Marketplaces</h2>
        <h3 className="text-xl font-bold mt-6">✅ Tendencias Positivas</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Garantías más largas:</strong> Algunos vendedores ofrecen ya 18-24 meses (antes 12 meses estándar)</li>
          <li><strong>Períodos de prueba extendidos:</strong> 60 días se vuelve más común</li>
          <li><strong>Batería certificada:</strong> Reportes de % exacto de capacidad (mejora radical en transparencia)</li>
          <li><strong>Programas de fidelización:</strong> Back Market lanza programa de recompensas</li>
          <li><strong>IA para matching:</strong> Sistemas de recomendación personalizados basados en historial</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">3️⃣ Desafíos Actuales del Mercado</h2>
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-3">
          <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200">⚠️ Fragmentación Persistente</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Precios varían 15-30% para el mismo producto entre marketplaces. Esta es exactamente la razón por la que existe RefurbTrack.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200">⚠️ Inconsistencia en Estándares</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              No hay estándar global. "Excelente" en Back Market puede ser ligeramente diferente a "Excellent" en eBay.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200">⚠️ Fraude en Baja Escala</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Aunque raro (1-2%), algunos vendedores venden productos "etiquetados como refurbished" que son simplemente devueltos sin verificación.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">4️⃣ Oportunidades para el Consumidor</h2>
        <h3 className="text-xl font-bold mt-6">🎯 Aprovecha Estas Tendencias</h3>
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Negocia garantías más largas:</strong> Si ves un producto, puedes contactar al vendedor y negociar 18 meses si es posible
          </li>
          <li>
            <strong>Participa en nuevos programas:</strong> Back Market y otros lanzan rewards programs regularmente
          </li>
          <li>
            <strong>Compra antes de lanzamientos:</strong> Los precios suben 5-10% antes de eventos Apple (anticipación de descenso post-lanzamiento)
          </li>
          <li>
            <strong>Usa comparadores:</strong> La fragmentación de precios es cada vez mayor. Herramientas como RefurbTrack son clave
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-8">Conclusión</h2>
        <p>
          El mercado de reacondicionados está en un punto de inflexión:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>✅ Crece 13% anual (vs 2-3% de dispositivos nuevos)</li>
          <li>✅ Estándares mejorando constantemente</li>
          <li>✅ Conciencia ambiental impulsa demanda</li>
          <li>✅ Precios cada vez más competitivos</li>
          <li>✅ Garantías y protecciones cada vez mejores</li>
        </ul>

        <p className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <strong>Consejo final:</strong> 2026 es un excelente año para comprar reacondicionado. Los precios están bajos, la competencia es alta, y la calidad y protecciones nunca han sido mejores. Usa herramientas como RefurbTrack para encontrar la mejor oferta y aprovecha esta tendencia al alza.
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


