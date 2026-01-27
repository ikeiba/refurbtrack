"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function HomeHero() {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-border bg-muted/30">
      
      
      {/* 1. FONDO DIFUMINADO ANIMADO (Blobs) */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-60 dark:opacity-30">
        {/* Mancha 1: Verde Esmeralda */}
        <div className="absolute top-20 left-340 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob "></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* 2. TÍTULO PRINCIPAL CON ESTILO STITCH */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
          Rastrea los{" "}
          <span className="text-emerald-600 relative inline-block">
            mejores precios
            {/* El subrayado orgánico SVG */}
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
          </span>{" "}
          <br className="hidden sm:block" />
          de iPhones reacondicionados
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
          Compara precios de productos reacondicionados en múltiples marketplaces. 
          Encuentra las mejores ofertas verificadas por calidad y ahorra hasta un 40%.
        </p>
      </div>
    </section>
  )
}