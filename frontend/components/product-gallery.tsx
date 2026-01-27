//? GALERÍA DE IMÁGENES DEL PRODUCTO (EN LA PÁGINA DE PRODUCTO)
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Fallback si no hay imágenes
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted/30 rounded-2xl flex items-center justify-center text-4xl">
        📱
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pt-12">
      {/* IMAGEN PRINCIPAL (Estilo v0) */}
      {/* bg-muted/30 le da ese fondo gris suave. rounded-2xl bordes muy redondos. */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/60">
        <img
          src={images[selectedIndex]}
          alt="Product view"
          // p-8 da el margen interno para que el móvil no toque los bordes
          // mix-blend-multiply ayuda a que el fondo blanco de la foto se funda con el gris
          className="h-full w-full object-contain p-14 mix-blend-multiply transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* MINIATURAS (Estilo v0) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative aspect-square w-16 overflow-hidden rounded-lg border-2 transition-all bg-muted/30",
                selectedIndex === idx 
                  ? "border-foreground" // Borde negro si está seleccionado
                  : "border-transparent hover:border-foreground/50" // Hover suave
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-contain p-1 mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}