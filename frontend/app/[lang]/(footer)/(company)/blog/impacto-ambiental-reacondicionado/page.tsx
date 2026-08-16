import Link from 'next/link'
import { Calendar, User, ArrowLeft, Share2, Leaf } from 'lucide-react'
import type { Metadata } from 'next'
import { absoluteUrl, blogPostPath } from '@/lib/urls'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const canonical = absoluteUrl(blogPostPath(lang, 'impacto-ambiental-reacondicionado'))
  const title = 'Impacto Ambiental de Comprar Reacondicionado: Cuánto Ahorras | RefurbTrack'
  const description =
    'Análisis del CO2 evitado, agua ahorrada y residuos prevenidos por cada dispositivo reacondicionado, con datos verificables frente a dispositivos nuevos.'

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description },
  }
}

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
            Sostenibilidad
          </span>
          <span className="text-xs text-muted-foreground">6 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          🌱 El Impacto Ambiental Real: Cuánto Ahorras Comprando Reacondicionado
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            18 de enero de 2026
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
          Es fácil decir que comprar reacondicionado es "más ecológico", pero ¿cuál es el impacto real? En este artículo, desglosamos los números concretos y verificables que muestran exactamente cuánto impacto tienes cuando compras un dispositivo reacondicionado versus uno nuevo.
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-lg">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Impacto por Dispositivo (vs. Nuevo)
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span>CO₂ Equivalente Evitado</span>
              <span className="font-bold text-lg">77 kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Agua Ahorrada</span>
              <span className="font-bold text-lg">240 L</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Residuos Electrónicos Prevenidos</span>
              <span className="font-bold text-lg">50 kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Energía No Consumida</span>
              <span className="font-bold text-lg">240 kWh</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Desglose: De Dónde Viene Este Impacto</h2>

        <h3 className="text-xl font-bold mt-6">1️⃣ Emisiones de Carbono (77 kg CO₂)</h3>
        <p>
          Aproximadamente el 80% de las emisiones de carbono de un dispositivo electrónico proviene de su manufactura, no de su uso. Cuando compras reacondicionado:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No hay extracción de minerales:</strong> Se evita la minería de cobre, oro, coltán y otros minerales</li>
          <li><strong>No hay manufactura:</strong> Se evitan los procesos de fabricación intensivos en energía</li>
          <li><strong>No hay transporte inicial:</strong> Se evitan las emisiones del envío desde la fábrica al distribuidor</li>
          <li><strong>Solo hay reacondicionamiento:</strong> Proceso mucho menos intensivo en energía (típicamente limpieza, probadura y reparación mínima)</li>
        </ul>

        <p>
          Para que lo entiendas en perspectiva: 77 kg de CO₂ es equivalente a:
        </p>
        <ul className="list-none pl-5 space-y-1 text-sm">
          <li>🚗 Conducir 230 km en coche</li>
          <li>✈️ Un vuelo corto (1-2 horas)</li>
          <li>🏠 Las emisiones diarias de una casa media durante 5 días</li>
        </ul>

        <h3 className="text-xl font-bold mt-6">2️⃣ Consumo de Agua (240 Litros)</h3>
        <p>
          La fabricación de dispositivos electrónicos es sorprendentemente agua-intensiva:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Refinamiento de minerales:</strong> Requiere enormes cantidades de agua</li>
          <li><strong>Procesos de fabricación:</strong> Refrigeración de equipos, limpieza de componentes, etc.</li>
          <li><strong>Gestión térmica:</strong> Las fábricas usan agua para mantener temperaturas óptimas</li>
        </ul>

        <p>
          240 litros equivale a: 🚿 60 duchas de 4 minutos o 💧 48 botellas de agua grandes
        </p>

        <h3 className="text-xl font-bold mt-6">3️⃣ Residuos Electrónicos (50 kg prevenidos)</h3>
        <p>
          Los residuos electrónicos (e-waste) son el flujo de residuos que crece más rápidamente en el mundo. Al comprar reacondicionado:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Se evita que un dispositivo termine en vertederos</li>
          <li>Se evita la exposición de trabajadores a sustancias tóxicas en plantas de reciclaje informales</li>
          <li>Se recuperan materiales valiosos (oro, plata, cobre) que podrían extraerse nuevamente</li>
        </ul>

        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>⚠️ Contexto importante:</strong> Se estima que solo el 20% del e-waste global se recicla correctamente. Mucho termina en países en desarrollo, contaminando aguas subterráneas con metales pesados.
          </p>
        </div>

        <h3 className="text-xl font-bold mt-6">4️⃣ Energía No Consumida (240 kWh)</h3>
        <p>
          Esto incluye la energía directa e indirecta necesaria para extraer materias primas, transportarlas, fabricar el dispositivo y distribuirlo.
        </p>

        <p>
          240 kWh es equivalente a: 💡 Usar una bombilla de 100W durante 100 días
        </p>

        <h2 className="text-2xl font-bold mt-8">Amplia la Perspectiva: Impacto Agregado</h2>

        <p>
          Si RefurbTrack facilita 10,000 compras reacondicionadas anuales en lugar de nuevas:
        </p>

        <div className="bg-muted/50 p-6 rounded-lg border grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-2">📊 Impacto Anual</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>CO₂ evitado</span>
                <span className="font-bold">770 tons</span>
              </li>
              <li className="flex justify-between">
                <span>Agua ahorrada</span>
                <span className="font-bold">2.4M litros</span>
              </li>
              <li className="flex justify-between">
                <span>E-waste prevenido</span>
                <span className="font-bold">500 tons</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300 mb-2">🌍 Equivalencias</h4>
            <ul className="space-y-2 text-sm">
              <li>= 2,300 km de vuelos evitados</li>
              <li>= 1 millón de duchas</li>
              <li>= 1 ciudad pequeña en residuos prevenidos</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">¿Y el Impacto del Reacondicionamiento Mismo?</h2>

        <p>
          Alguien podría preguntar: "¿Pero no contamina el proceso de reacondicionamiento?"
        </p>

        <p>
          Sí, pero es mínimo comparado con la manufactura. Típicamente incluye:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Limpieza manual (sin químicos fuertes, típicamente alcohol isopropílico)</li>
          <li>Probadura de componentes (electricidad, pero baja cantidad)</li>
          <li>Reemplazo de piezas dañadas (batería, pantalla, etc.) cuando es necesario</li>
          <li>Prueba final antes del envío</li>
        </ul>

        <p className="text-sm text-muted-foreground">
          El impacto total del reacondicionamiento es típicamente menos del 5% del impacto de la manufactura original.
        </p>

        <h2 className="text-2xl font-bold mt-8">Más Allá del Impacto Ambiental</h2>

        <p>
          Comprar reacondicionado también tiene beneficios sociales:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Empleos locales:</strong> El reacondicionamiento es un proceso local que crea empleo en tu país</li>
          <li><strong>Reducción de la brecha digital:</strong> Hace la tecnología más accesible a poblaciones de bajos ingresos</li>
          <li><strong>Economía circular:</strong> Valoriza productos sin crear consumo innecesario</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">¿Cómo Puedes Maximizar Tu Impacto?</h2>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200">1. Elige dispositivos más antiguos</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Un iPhone de 2 años comprado reacondicionado en lugar de nuevo tiene casi el mismo impacto que comprar un modelo nuevo reacondicionado, pero más ahorro económico.</p>
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200">2. Mantén el dispositivo más tiempo</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">La mejor opción ambiental es USAR lo que tienes. Pero si necesitas cambiar, reacondicionado es la siguiente mejor opción.</p>
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200">3. Recicla correctamente al final</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Cuando ya no puedas usar el dispositivo, llévalo a un centro de reciclaje electrónico, no a la basura.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Conclusión</h2>
        <p>
          Cada compra reacondicionada evita 77 kg de CO₂, 240 litros de agua y 50 kg de residuos electrónicos. Eso no es solo un número: es aire más limpio, recursos preservados y un planeta más sano.
        </p>

        <p>
          <strong>RefurbTrack</strong> existe precisamente para hacerte más fácil tomar la decisión ecológica sin sacrificar tu presupuesto. Porque lo sostenible no tiene que ser sacrificio. Puede ser un buen negocio para ti y para el planeta.
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
