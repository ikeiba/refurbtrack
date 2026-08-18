import { Mail, MessageSquare, Clock, AlertCircle } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Contacto</h1>
        <p className="text-muted-foreground text-lg">
          ¿Tienes dudas sobre cómo funciona el comparador, quieres reportar un error en los datos o sugerir una mejora? Estamos aquí para escucharte.
        </p>
      </div>

      {/* Nota Importante sobre Pedidos */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Importante sobre pedidos y productos</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>RefurbTrack NO vende productos directamente.</strong> Si tienes un problema con un pedido, devolución, garantía, envío retrasado o producto defectuoso, debes contactar directamente con el vendedor donde realizaste la compra (ej. Back Market, Amazon, etc.) a través de su servicio de atención al cliente.
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
              ℹ️ Solo contacta con nosotros para dudas sobre la plataforma, errores en precios/datos mostrados, o sugerencias de mejora.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-8">
        {/* Información de Contacto */}
        
        <div className="space-y-6">
          {/*
          <div>
            <h3 className="font-bold text-xl mb-4">Canales de Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold">Email General</h4>
                  <p className="text-muted-foreground text-sm">Para consultas generales y sugerencias</p>
                  <a href="mailto:hola@refurbtrack.com" className="text-emerald-600 hover:underline">
                    hola@refurbtrack.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold">Reportar Error de Datos</h4>
                  <p className="text-muted-foreground text-sm">Si encuentras un precio incorrecto o información desactualizada</p>
                  <a href="mailto:datos@refurbtrack.com" className="text-emerald-600 hover:underline">
                    datos@refurbtrack.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold">Tiempo de Respuesta</h4>
                  <p className="text-muted-foreground text-sm">
                    Normalmente respondemos en <strong>24-48 horas laborables</strong>. Los fines de semana y festivos pueden tardar más.
                  </p>
                </div>
              </div>
            </div>
          </div>
          */}

          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">💡 Preguntas Frecuentes</h4>
            <div className="text-sm text-emerald-700 dark:text-emerald-300 space-y-3">
              <div>
                <p className="font-semibold">¿Por qué el precio en la web del vendedor es diferente?</p>
                <p className="text-xs">Los precios se actualizan cada cierto tiempo, aunque siempre al menos una vez al día. Revisa la fecha de última actualización en la página del producto.</p>
              </div>
              <div>
                <p className="font-semibold">¿Cómo reporto un enlace roto?</p>
                <p className="text-xs">Envíanos un email con la URL del producto afectado y lo corregiremos.</p>
              </div>
              <div>
                <p className="font-semibold">¿Puedo sugerir una tienda para añadir?</p>
                <p className="text-xs">¡Sí! Cuéntanos qué tienda te gustaría ver y evaluaremos su integración.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Contacto */}
        <div>
          <h3 className="font-bold text-xl mb-4">Envíanos un Mensaje</h3>
          <ContactForm />

          {/*}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Prefieres email directo?{" "}
              <a href="mailto:hola@refurbtrack.com" className="text-emerald-600 hover:underline font-medium">
                hola@refurbtrack.com
              </a>
            </p>
          </div> */}
        </div>
      </div>

      {/* Sección adicional de ayuda */}
      <div className="mt-12 pt-8 border-t">
        <h3 className="font-bold text-xl mb-4 text-center">Otras Formas de Obtener Ayuda</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg border">
            <div className="text-3xl mb-2">📚</div>
            <h4 className="font-bold mb-1">Guía de Uso</h4>
            <p className="text-sm text-muted-foreground">
              Consulta nuestra documentación sobre {" "}
              <a href={`/${locale}/how-it-works`} className="text-emerald-600 hover:underline">
                cómo funciona
              </a>
              {" "} el comparador
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg border">
            <div className="text-3xl mb-2">🌱</div>
            <h4 className="font-bold mb-1">Sobre Nosotros</h4>
            <p className="text-sm text-muted-foreground">
              <a href={`/${locale}/about`} className="text-emerald-600 hover:underline">
                Conoce más sobre RefurbTrack
              </a>
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg border">
            <div className="text-3xl mb-2">⚖️</div>
            <h4 className="font-bold mb-1">Legal</h4>
            <p className="text-sm text-muted-foreground">
              <a href={`/${locale}/terms`} className="text-emerald-600 hover:underline">
                Términos de Servicio
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}