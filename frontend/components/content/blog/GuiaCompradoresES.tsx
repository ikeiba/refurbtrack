// components/content/blog/GuiaCompradoresES.tsx
// Artículo de blog en español (texto original): Guía para compradores.
import Link from "next/link"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { getIntlLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function GuiaCompradoresES({ locale }: { locale: string }) {
  const language = getLanguage(locale)

  return (
    <div className="space-y-8">
      <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        {t("back_to_blog", language)}
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">
            Educación
          </span>
          <span className="text-xs text-muted-foreground">8 min</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          📖 Guía Completa para Compradores de Dispositivos Reacondicionados
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date("2026-01-15").toLocaleDateString(getIntlLocale(locale), { year: "numeric", month: "long", day: "numeric" })}
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
          Comprar un dispositivo reacondicionado puede ser una decisión inteligente y ecológica. Pero también puede ser una fuente de ansiedad si no sabes exactamente qué estás comprando. Esta guía te ayudará a tomar decisiones informadas.
        </p>

        <h2 className="text-2xl font-bold mt-8">¿Qué significa "reacondicionado"?</h2>
        <p>
          "Reacondicionado" (o "refurbished" en inglés) se refiere a un dispositivo que ha sido devuelto, reparado y/o completamente restaurado a condiciones de funcionamiento de fábrica. No es sinónimo de roto, dañado o de baja calidad.
        </p>

        <p>
          Aquí hay algunos escenarios comunes:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Devoluciones de clientes:</strong> Alguien lo compró, cambió de opinión en el período de devolución, y lo devolvió apenas usado</li>
          <li><strong>Defectos de fábrica:</strong> Se detectó un problema, fue reparado correctamente y probado</li>
          <li><strong>Reemplazo de garantía:</strong> El fabricante lo reacondicionó como parte de un servicio de garantía</li>
          <li><strong>Cambio de móvil:</strong> Después de un tiempo usado por un cliente, el dispositivo es vendido a una empresa de reacondicionamiento y donde es reacondicionado para su reventa</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">Estados de Reacondicionamiento</h2>
        <p>
          Diferentes marketplaces usan distintas clasificaciones, pero aquí están las más comunes:
        </p>

        <div className="bg-muted/50 p-6 rounded-lg border space-y-4">
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300">🟢 EXCELENTE / Like New</h4>
            <p className="text-sm text-muted-foreground mt-1">Prácticamente indistinguible de nuevo. Puede tener pequeñas marcas de uso mínimas. Batería con 85-100% de capacidad.</p>
            <p className="text-xs text-muted-foreground mt-2"><strong>Mejor para:</strong> Perfeccionistas, regalos</p>
          </div>

          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300">🟡 MUY BUENO / Excellent</h4>
            <p className="text-sm text-muted-foreground mt-1">Señales mínimas de uso. Funciona perfectamente. Batería con 80-85% de capacidad.</p>
            <p className="text-xs text-muted-foreground mt-2"><strong>Mejor para:</strong> La mayoría de usuarios. Mejor relación precio-calidad</p>
          </div>

          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300">🟠 CORRECTO / Fair / Aceptable</h4>
            <p className="text-sm text-muted-foreground mt-1"> Marcas visibles de uso. Funciona perfectamente, pero el aspecto no es pristino. Batería con alrededor del 80% de capacidad.</p>
            <p className="text-xs text-muted-foreground mt-2"><strong>Mejor para:</strong> Máximo ahorro, usuarios con uso intensivo</p>
          </div>


          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 rounded mt-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Consejo:</strong> Para más información sobre clasificaciones, consulta el marketplace donde planeas comprar. Por ejemplo: <a href="https://www.backmarket.es/es-es/quality" className="underline hover:text-blue-800 dark:hover:text-blue-200">Back Market - Clasificaciones de Calidad</a>
          </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Indicadores de Calidad a Verificar</h2>
        <p>
          Cuando estés considerando un dispositivo reacondicionado, estos son los factores más importantes:
        </p>

        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Salud de la batería:</strong> Este es el factor más crítico. Una batería degradada afecta significativamente la usabilidad. Busca porcentajes de capacidad (idealmente 80%+)
          </li>
          <li>
            <strong>Garantía:</strong> Mínimo 12 meses. Algunos vendedores ofrecen hasta 24 meses. Una garantía larga es señal de confianza en el producto
          </li>
          <li>
            <strong>Período de prueba:</strong> 14-30 días sin preguntas. Te permite devolver si no estás satisfecho
          </li>
          <li>
            <strong>Prueba del funcionamiento:</strong> Verifica que el vendedor haya testado todas las funciones (pantalla, cámara, micrófono, altavoz, botones)
          </li>
          <li>
            <strong>Accesorios incluidos:</strong> ¿Viene con caja original? ¿Cable de carga? Esto afecta el valor general
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-8">Preguntas que Debes Hacer</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>¿El dispositivo tiene algún daño físico no mencionado?</li>
          <li>¿Ha sido abierto? ¿Se han reemplazado piezas?</li>
          <li>¿Viene con la batería original o ha sido reemplazada?</li>
          <li>¿Es compatible con mi operadora / región?</li>
          <li>¿Cuál es la política exacta de devolución?</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8">Riesgos a Evitar</h2>
        <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 rounded">
          <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">❌ Evita estos vendedores:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-red-700 dark:text-red-300">
            <li>Sin garantía o con garantía muy corta (menos de 6 meses)</li>
            <li>Sin período de prueba o muy restrictivo</li>
            <li>Sin información clara sobre el estado de la batería</li>
            <li>Reseñas muy pobres o patrones de quejas similares</li>
            <li>Precios anormalmente bajos (demasiado bueno para ser verdad)</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8">Conclusión</h2>
        <p>
          Comprar reacondicionado puede ahorrarte cientos de euros y es una elección sostenible. Con esta guía, deberías estar preparado para tomar decisiones inteligentes y evitar sorpresas desagradables.
        </p>

        <p>
          <strong>RefurbTrack</strong> está diseñado exactamente para esto: ayudarte a comparar precios de diferentes vendedores y encontrar las mejores ofertas en dispositivos reacondicionados verificados.
        </p>
      </article>

      <div className="pt-8 border-t space-y-4">
        <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-emerald-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_blog", language)}
        </Link>
      </div>
    </div>
  )
}