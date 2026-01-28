import { Leaf, Search, ShieldCheck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Nuestra Misión</h1>
        <p className="text-xl text-muted-foreground">
          Acelerar la transición hacia una economía circular mediante la transparencia en el mercado de la tecnología reacondicionada.
        </p>
      </section>

      {/* Qué hacemos */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="space-y-2">
            <Search className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-lg">Rastreo Inteligente</h3>
            <p className="text-sm text-muted-foreground">Monitorizamos miles de precios diariamente para detectar las mejores oportunidades reales, eliminando el ruido de falsas ofertas.</p>
        </div>
        <div className="space-y-2">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-lg">Impacto Real</h3>
            <p className="text-sm text-muted-foreground">Cada dispositivo tiene una historia. Te ayudamos a calcular tu ahorro de CO2 y residuos electrónicos con cada decisión de compra.</p>
        </div>
        <div className="space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h3 className="font-bold text-lg">Calidad Garantizada</h3>
            <p className="text-sm text-muted-foreground">Solo indexamos productos de reacondicionadores certificados que ofrecen garantía (mínimo 1 año) y periodos de prueba.</p>
        </div>
      </section>

      {/* Disclaimer Transparencia (Importante para Awin) */}
      <section className="bg-muted/30 p-6 rounded-xl border border-border text-sm text-muted-foreground">
        <h4 className="font-bold text-foreground mb-2">Nuestro Modelo de Negocio</h4>
        <p>
          RefurbTrack es un comparador independiente. No vendemos productos directamente ni gestionamos envíos. 
          Nuestra plataforma se sostiene gracias a acuerdos de afiliación: cuando encuentras un producto que te gusta y decides comprarlo a través de nuestros enlaces en plataformas como Back Market, podemos recibir una pequeña comisión sin coste adicional para ti. Esto nos permite mantener la herramienta gratuita y libre de anuncios intrusivos.
        </p>
      </section>
    </div>
  )
}