import { Search, BarChart3, ShoppingBag, Truck, Zap, TrendingDown, Lock, AlertCircle } from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "1. Rastreo Continuo",
      desc: "Nuestro algoritmo escanea miles de fichas de producto cada hora en busca de cambios de precio y stock en los principales reacondicionadores verificados (Back Market, Amazon Renewed, eBay Refurbished, etc.)."
    },
    {
      icon: BarChart3,
      title: "2. Análisis Inteligente",
      desc: "Comparamos el precio actual con el historial de los últimos 30, 60 y 90 días, y con el PVP oficial de lanzamiento para determinar si es una buena oferta real o un truco de marketing."
    },
    {
      icon: TrendingDown,
      title: "3. Alertas Personalizadas",
      desc: "Configura alertas para los productos que te interesan. Te notificaremos cuando el precio caiga por debajo de tu umbral objetivo o cuando haya cambios significativos."
    },
    {
      icon: ShoppingBag,
      title: "4. Compra Segura",
      desc: "Al hacer clic en 'Ver Oferta', te redirigimos directamente a la plataforma oficial del vendedor para que finalices la compra con todas sus garantías y protección del comprador."
    },
    {
      icon: Truck,
      title: "5. Envío y Garantía",
      desc: "El vendedor gestiona el envío y te ofrece garantía legal (mínimo 12 meses). Disfrutas de la protección total del marketplace mientras que nosotros seguimos rastreando el mercado."
    },
    {
      icon: Zap,
      title: "6. Ahorro Documentado",
      desc: "Visualiza cuánto ahorraste en cada compra y qué impacto ambiental generaste (CO2 evitado, residuos electrónicos prevenidos, agua ahorrada)."
    }
  ]

  const faqs = [
    {
      q: "¿Por qué el precio en RefurbTrack es diferente al de la tienda?",
      a: "Los precios cambian constantemente. Si ves una diferencia pequeña, probablemente se debe a que RefurbTrack actualiza cada 1-2 horas, mientras que puede haber cambios en tiempo real. Siempre verifica el precio final en la página del vendedor antes de comprar."
    },
    {
      q: "¿RefurbTrack vende productos directamente?",
      a: "No. Somos un comparador independiente, no una tienda. No gestionamos inventario, pagos, envíos ni servicio al cliente. Actuamos como intermediario que te conecta con vendedores verificados."
    },
    {
      q: "¿Cómo ganan dinero con esto?",
      a: "A través de comisiones de afiliación. Cuando compras a través de nuestros enlaces y se completa la compra, el vendedor nos paga una pequeña comisión (0,5% - 5% típicamente) sin coste adicional para ti. No hay anuncios intrusivos ni venta de datos."
    },
    {
      q: "¿Son seguros los productos reacondicionados?",
      a: "Completamente. Trabajamos solo con marketplaces certificados que garantizan mínimo 12 meses de garantía y períodos de prueba (30-60 días). Los dispositivos son testados y certificados por técnicos cualificados."
    },
    {
      q: "¿Qué pasa si tengo un problema con mi compra?",
      a: "Contacta directamente con el vendedor (Back Market, Amazon, etc.). RefurbTrack no gestiona devoluciones ni garantías, pero los vendedores tienen políticas de protección del comprador muy robustas."
    },
    {
      q: "¿Cuánto tiempo tardan en actualizar los precios?",
      a: "Actualizamos principalmente cada 1-2 horas, aunque algunos datos pueden tardar más. Si necesitas el precio exacto en tiempo real, accede directamente al sitio del vendedor."
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cómo Funciona RefurbTrack</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Un proceso simple de 6 pasos para encontrar las mejores ofertas en tecnología reacondicionada, verificada y con garantía.
        </p>
      </div>
      
      {/* Pasos */}
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-sm">
              {idx + 1}
            </div>
            <div className="space-y-2 flex-1 pt-1">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <step.icon className="w-5 h-5 text-emerald-600" />
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Visualización del flujo */}
      <div className="bg-muted/50 p-8 rounded-2xl border my-8">
        <h3 className="font-bold text-lg mb-6 text-center">El Flujo Completo</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold mb-2">🔍</div>
            <p className="font-medium">Busca un producto</p>
          </div>
          <div className="hidden md:block text-muted-foreground">→</div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold mb-2">📊</div>
            <p className="font-medium">Compara precios</p>
          </div>
          <div className="hidden md:block text-muted-foreground">→</div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold mb-2">🛒</div>
            <p className="font-medium">Compra segura</p>
          </div>
          <div className="hidden md:block text-muted-foreground">→</div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold mb-2">📦</div>
            <p className="font-medium">Recibe + Garantía</p>
          </div>
        </div>
      </div>

      {/* Características principales */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Características Principales</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Historial de Precios</h4>
                <p className="text-sm text-muted-foreground">Gráficos de 30, 60 y 90 días para detectar tendencias y evitar comprar en picos de precio.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Alertas de Precio</h4>
                <p className="text-sm text-muted-foreground">Recibe notificaciones cuando el precio cae por debajo de tu objetivo (próximamente).</p>
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <Lock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Compras Verificadas</h4>
                <p className="text-sm text-muted-foreground">Solo conectamos con marketplaces certificados con garantía mínima de 12 meses.</p>
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <AlertCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-2">Impacto Ambiental</h4>
                <p className="text-sm text-muted-foreground">Visualiza el CO2, agua y residuos que evitas con cada compra reacondicionada.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-card">
              <h4 className="font-bold mb-2 text-emerald-700 dark:text-emerald-300">{faq.q}</h4>
              <p className="text-muted-foreground text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center space-y-4 py-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
        <h2 className="text-2xl font-bold">¿Listo para Empezar?</h2>
        <p className="text-muted-foreground">Explora miles de productos reacondicionados verificados y comienza a ahorrar hoy mismo.</p>
        <a href="/" className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors">
          Ir a Buscar
        </a>
      </div>
    </div>
  )
}