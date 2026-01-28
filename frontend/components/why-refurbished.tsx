import { TreePine, Sprout } from "lucide-react"

export function WhyRefurbished() {
  return (
    <section className="py-12 container mx-auto px-4">
      <div className="relative overflow-hidden rounded-[3rem] bg-emerald-600 px-6 py-12 text-center text-white shadow-xl shadow-emerald-600/20 sm:px-12">
        
        {/* Contenido Principal (z-10 para estar encima del icono de fondo) */}
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Icono Principal */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <TreePine className="h-8 w-8 text-white" />
          </div>

          <h3 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Por qué comprar reacondicionado?
          </h3>

          <p className="mx-auto max-w-2xl text-lg text-emerald-50 opacity-90">
            Un teléfono nuevo requiere la extracción de 200kg de materias primas. 
            Al elegir uno reacondicionado, evitas el 90% de ese impacto y prolongas 
            la vida de un producto perfectamente funcional.
          </p>
        </div>

        {/* Icono de Fondo Decorativo (Gigante y sutil) */}
        <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-10">
          <Sprout className="h-64 w-64 text-white" strokeWidth={1} />
        </div>
        
        {/* Otro icono decorativo opcional a la derecha */}
        <div className="pointer-events-none absolute -top-10 -right-10 opacity-10 transform rotate-180">
          <Sprout className="h-64 w-64 text-white" strokeWidth={1} />
        </div>

      </div>
    </section>
  )
}