import Link from 'next/link'
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react'
import type { Metadata } from 'next'
import { absoluteUrl, blogPostPath } from '@/lib/urls'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const canonical = absoluteUrl(blogPostPath(lang, 'falsos-mitos-reacondicionados'))
  const title = '7 Mitos Sobre Dispositivos Reacondicionados Desmentidos | RefurbTrack'
  const description =
    '¿Duran menos? ¿Tienen baterías degradadas? Desmentimos los mitos más comunes sobre reacondicionados con datos reales.'

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
            Educación
          </span>
          <span className="text-xs text-muted-foreground">5 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          ❌ 7 Mitos Sobre Dispositivos Reacondicionados (Desmentidos con Datos)
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            24 de enero de 2026
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
          Hay mucha desinformación sobre dispositivos reacondicionados. Separamos los hechos de la ficción con datos concretos.
        </p>

        <h2 className="text-2xl font-bold mt-8">Mito #1: "Los Reacondicionados son Básicamente Robados"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSO</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            La realidad: Aproximadamente el 70% de los dispositivos reacondicionados son...
          </p>
          <ul className="space-y-1 text-sm list-disc pl-5">
            <li>Devoluciones de tienda (cambio de opinión dentro del período de retorno)</li>
            <li>Stock excedente sin vender</li>
            <li>Unidades de demostración en tiendas</li>
            <li>Reemplazos bajo garantía del fabricante</li>
            <li>Devoluciones de seguros</li>
            <li> Ventas de particulares que ya no los quieren</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">Mito #2: "La Batería Está Muerta en 6 Meses"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSO</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            La batería es el componente más importante. Marketplaces certificados reportan estado exacto:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Dispositivo "Excelente" (85-100% batería):</strong> Durará 4-5 años con uso normal
            </li>
            <li>
              <strong>Dispositivo "Muy Bueno" (80-85%):</strong> Durará 3-4 años
            </li>
            <li>
              <strong>Dispositivo "Correcto" (~80%):</strong> Durará 2-3 años
            </li>
          </ul>
          <p className="text-xs italic mt-2 text-red-600 dark:text-red-400">Nota: Una batería al 75% aún tiene AÑOS de vida. Incluso un nuevo dispositivo pierde 5% en el primer año.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Mito #3: "Sin Garantía, Eres Por Tu Cuenta"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSO</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            Los marketplaces certificados SIEMPRE ofrecen garantía:
          </p>
          <ul className="space-y-1 text-sm list-disc pl-5">
            <li>Back Market: 12 meses estándar (hasta 24 meses con algunos vendedores)</li>
            <li>Amazon Renewed: 12 meses + Protección del Comprador de Amazon</li>
            <li>eBay: 12 meses + eBay Money Back Guarantee (hasta 180 días para retorno)</li>
          </ul>
          <p className="text-sm mt-3 font-semibold italic">Aún mejor: 30-60 días de período de prueba sin preguntas en la mayoría.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Mito #4: "Es lo Mismo que Comprar Usado en Marketplace"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSO - Diferencia MASIVA</h4>
          <div className="space-y-3 text-sm mt-3">
            <div>
              <h5 className="font-semibold mb-1">🟢 Reacondicionado (Certificado)</h5>
              <ul className="pl-5 list-disc space-y-1">
                <li>Testado completamente por técnicos</li>
                <li>Limpiado profesionalmente</li>
                <li>Batería certificada y reportada</li>
                <li>Todos los componentes verificados</li>
                <li>Garantía obligatoria 12+ meses</li>
                <li>Período de prueba 30+ días</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-1">🔴 Usado (Particular)</h5>
              <ul className="pl-5 list-disc space-y-1">
                <li>Sin garantía típicamente</li>
                <li>Sin testeo profesional</li>
                <li>Riesgos de problemas ocultos</li>
                <li>Sin protección del vendedor</li>
                <li>Pueden tener malware o restricciones</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Mito #5: "Los Reacondicionados Nunca Cumplen Especificaciones"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSO</h4>
          <p className="text-sm text-red-700 dark:text-red-300">
            Los marketplaces certificados hacen pruebas funcionales exhaustivas. Datos de Back Market muestran que el 98% de dispositivos cumple 100% de especificaciones. El 2% restante se rechaza antes de venta.
          </p>
          <p className="text-xs italic mt-2">Por comparativa: El 95% de dispositivos nuevos llega en perfecto estado. No es tan diferente.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Mito #6: "Puedes Contraer Un Virus o Malware"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSO (Con Cuidados)</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            Todos los dispositivos reacondicionados certificados se limpian y "flashean" (restauran software) a versión limpia:
          </p>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>iPhone: Se restituye a iOS limpio de fábrica</li>
            <li>Android: Se flashea ROM limpio del fabricante</li>
            <li>Se verifican todos los componentes de hardware</li>
          </ul>
          <p className="text-sm mt-2">El riesgo es el MISMO que un dispositivo nuevo recién sacado de la caja. De hecho, algunos dispositivos reacondicionados son más seguros si se limpian mejor.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Mito #7: "Ahorras Poco, No Vale La Pena"</h2>
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">❌ FALSO - Los Números Hablan</h4>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded border border-emerald-200 dark:border-emerald-800 mt-3">
            <p className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Ejemplo Real: iPhone 15 Pro Max</p>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span>Precio NUEVO</span>
                <span className="font-bold">€1,199</span>
              </li>
              <li className="flex justify-between">
                <span>Reacondicionado (Excelente)</span>
                <span className="font-bold">€899</span>
              </li>
              <li className="flex justify-between text-emerald-700 dark:text-emerald-300 font-bold">
                <span>AHORRO</span>
                <span>€300 (25%)</span>
              </li>
            </ul>
          </div>
          <p className="text-sm mt-3">Y eso es conservador. Modelos de hace 2 años pueden ahorrar 40-50%.</p>
        </div>

        <h2 className="text-2xl font-bold mt-8">Conclusión: La Verdad</h2>
        <p>
          Los dispositivos reacondicionados certificados son:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>✅ <strong>Seguros y confiables</strong> (testados, garantizados, con período de prueba)</li>
          <li>✅ <strong>Significativamente más baratos</strong> (20-50% descuento común)</li>
          <li>✅ <strong>Mejor para el planeta</strong> (77 kg CO₂ menos por dispositivo)</li>
          <li>✅ <strong>No es un riesgo</strong> (garantía y devolución fácil)</li>
        </ul>

        <p className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          La única razón para NO comprar reacondicionado es si tienes dinero ilimitado. El resto de nosotros deberíamos estar usando plataformas como RefurbTrack para encontrar las mejores ofertas.
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


