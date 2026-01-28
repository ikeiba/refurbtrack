//? GALERÍA DE IMÁGENES DEL PRODUCTO (EN LA PÁGINA DE PRODUCTO)
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  onImageClick?: () => void // <--- 1. Nueva prop opcional
}

export function ProductGallery({ images, onImageClick }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted/30 rounded-2xl flex items-center justify-center text-4xl">
        📱
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pt-12">
      {/* IMAGEN PRINCIPAL */}
      <div 
        // 2. Añadimos el evento onClick al contenedor
        onClick={onImageClick}
        className={cn(
            "relative aspect-square overflow-hidden rounded-2xl bg-muted/60",
            // 3. Si hay función de click, cambiamos el cursor y añadimos efecto visual
            onImageClick && "cursor-pointer transition-opacity active:scale-95"
        )}
      >
        <img
          src={images[selectedIndex]}
          alt="Product view"
          // Mantengo tus clases originales
          className="h-full w-full object-contain p-14 mix-blend-multiply transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* MINIATURAS (Sin cambios) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative aspect-square w-16 overflow-hidden rounded-lg border-2 transition-all bg-muted/30",
                selectedIndex === idx 
                  ? "border-foreground" 
                  : "border-transparent hover:border-foreground/50"
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