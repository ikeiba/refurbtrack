"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Leaf } from "lucide-react" // <--- 1. Importar el icono de la hoja

export function HomeHero() {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-border bg-muted/30">
      
      
      {/* 1. FONDO DIFUMINADO ANIMADO (Blobs) */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-60 dark:opacity-30">
        {/* Mancha 1: Verde Esmeralda */}
        <div className="absolute top-20 left-340 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob "></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* 2. NUEVA ETIQUETA "CONSUMO CONSCIENTE" */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/20 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-sm font-medium mb-8 shadow-sm ring-1 ring-emerald-500/20">
            <Leaf className="w-4 h-4 fill-emerald-800 dark:fill-emerald-200" />
            Consumo Consciente: Ahorra CO2 y Dinero
        </div>
        
        {/* TÍTULO PRINCIPAL */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
          Compara precios de iPhones,{" "}
          <br className="hidden sm:block" />
          <span className="text-emerald-600 relative inline-block">
            reacondicionados en Back Market
            {/* Subrayado SVG movido aquí */}
            <svg
              className="absolute w-full h-3 -bottom-1 left-0 text-emerald-600 opacity-20"
              preserveAspectRatio="none"
              viewBox="0 0 100 10"
            >
              <path
                d="M0 5 Q 50 10 100 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
              />
            </svg>
          </span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
          Consulta el historial de precios de iPhones reacondicionados en Back Market. 
          Cada dispositivo reacondicionado ahorra hasta 80kg de CO2. 
          Encuentra la mejor oferta con garantía
        </p>
      </div>
    </section>
  )
}