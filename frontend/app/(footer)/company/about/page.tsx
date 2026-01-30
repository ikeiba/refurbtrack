import { Leaf, Search, ShieldCheck, Target, Zap, Globe, BarChart3 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Tecnología con Propósito
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          RefurbTrack nace con una misión clara: acelerar la transición hacia una economía circular aportando transparencia radical al mercado de la tecnología reacondicionada.
        </p>
      </section>

      {/* Valores Principales */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold mb-8">Nuestros Valores</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <Search className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Inteligencia de Mercado</h3>
              <p className="text-muted-foreground">No somos una tienda, somos un analista. Monitorizamos precios diariamente para detectar las verdaderas oportunidades y evitar falsos descuentos.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <Target className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Impacto Medible</h3>
              <p className="text-muted-foreground">Cada dispositivo tiene una huella. Te ayudamos a calcular no solo tu ahorro económico, sino los kilos de CO2 y residuos electrónicos que evitas.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Calidad Certificada</h3>
              <p className="text-muted-foreground">Solo indexamos productos de marketplaces líderes (como Back Market) que ofrecen garantías mínimas de 12 meses y periodos de prueba.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/*}
      <section className="bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800">
        <h2 className="text-3xl font-bold mb-8 text-center">Impacto hasta la Fecha</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">50K+</div>
            <p className="text-muted-foreground">Productos rastreados actualmente</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">1M+</div>
            <p className="text-muted-foreground">Puntos de datos de precios históricos</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 mb-2">500 tons</div>
            <p className="text-muted-foreground">De residuos evitados estimados</p>
          </div>
        </div>
      </section> */}

      {/* Historia */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold mb-8">Nuestra Historia</h2>
        <div className="prose prose-stone dark:prose-invert max-w-none space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            RefurbTrack comenzó en 2025 como respuesta a un problema que enfrentaban miles de consumidores: ¿cómo saber si un precio de un móvil reacondicionado es realmente una buena oferta? ¿O si es más barato que hace un mes?
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            El mercado de tecnología reacondicionada está en auge, pero es fragmentado. Cada vendedor tiene sus propios precios, sin correlación clara. Los usuarios tenían que visitar múltiples sitios, abrir hojas de cálculo, o simplemente aceptar cualquier precio que encontraran.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Así nació la idea: crear un comparador independiente que aggregase datos de todos los principales reacondicionadores (Back Market, Amazon Renewed, eBay Refurbished, etc.) y brindase inteligencia de precios a los usuarios de forma gratuita y accesible.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pero no queríamos solo un comparador de precios más. Queríamos alinearnos con la economía circular, mostrar el impacto ambiental real, y mantener la máxima transparencia sobre cómo podemos ganar dinero (comisiones de afiliación, sin anuncios intrusivos).
          </p>
        </div>
      </section>

      {/* Por qué reacondicionado */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold mb-8">¿Por Qué Tecnología Reacondicionada?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Economía Circular</h4>
                <p className="text-muted-foreground text-sm">Cada dispositivo reacondicionado salva 77 kg de CO2 versus fabricar uno nuevo. Amplifiquemos ese impacto.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Acceso Democratizado</h4>
                <p className="text-muted-foreground text-sm">Tecnología premium a precios justos. No debería ser lujo tener un dispositivo de calidad.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Transparencia de Precios</h4>
                <p className="text-muted-foreground text-sm">El cliente merece saber si está comprando bien. Datos públicos, decisiones inteligentes.</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border">
            <h4 className="font-bold mb-4 text-emerald-700 dark:text-emerald-300">Impacto Ambiental por Dispositivo</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>Emisiones CO2 evitadas</span>
                <span className="font-bold">77 kg</span>
              </li>
              <li className="flex justify-between">
                <span>Agua ahorrada</span>
                <span className="font-bold">240 L</span>
              </li>
              <li className="flex justify-between">
                <span>Residuos evitados</span>
                <span className="font-bold">50 kg</span>
              </li>
              <li className="flex justify-between">
                <span>Energía ahorrada</span>
                <span className="font-bold">240 kWh</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">*Comparación: dispositivo reacondicionado vs. nuevo en la misma categoría</p>
          </div>
        </div>
      </section>

      {/* Disclaimer de Afiliación (Crucial para aprobación) */}
      <section className="bg-muted/50 p-8 rounded-2xl border border-border">
        <h3 className="font-bold text-foreground mb-4 text-lg">✅ Transparencia y Modelo de Negocio</h3>
        <p className="text-muted-foreground mb-4">
          RefurbTrack es un <strong>comparador independiente y gratuito</strong> para el usuario. No vendemos productos directamente, ni gestionamos stock, envíos o soporte al cliente.
        </p>
        <div className="bg-background p-4 rounded border border-border mb-4">
          <p className="text-muted-foreground text-sm">
            <strong>¿Cómo podemos ganar dinero?</strong> Nuestra plataforma se sostiene gracias a acuerdos de afiliación con marketplaces verificados. Cuando encuentras un producto que te gusta y decides comprarlo a través de nuestros enlaces, podemos recibir una pequeña comisión sin coste adicional para ti. Esto nos permite mantener la tecnología libre de anuncios intrusivos y 100% enfocada en el usuario.
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          <strong>Compromiso:</strong> Nuestros rankings, recomendaciones y precios mostrados se basan exclusivamente en datos objetivos (precio, estado, garantía, reseñas verificadas) y NO están influenciados por las comisiones de afiliación.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">¿Listo para Ahorrar?</h2>
        <p className="text-lg text-muted-foreground">Explora nuestra colección de dispositivos reacondicionados verificados y comienza a comparar precios inteligentemente.</p>
        <div className="flex gap-3 justify-center mt-6">
          <a href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors">
            Ir a Buscar
          </a>
          <a href="/company/how-it-works" className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-medium transition-colors">
            Cómo Funciona
          </a>
        </div>
      </section>
    </div>
  )
}