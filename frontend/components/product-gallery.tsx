"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// Si usas iconos, importa ChevronLeft/Right, si no, usa texto "<" ">"

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Si no hay imágenes, mostramos un placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center text-4xl">
        📱
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* IMAGEN PRINCIPAL GRANDE */}
      <div className="relative aspect-square bg-white rounded-xl overflow-hidden border flex items-center justify-center p-8">
        <img
          src={images[selectedIndex]}
          alt="Product view"
          className="object-contain w-full h-full mix-blend-multiply transition-all duration-300 hover:scale-105"
        />
      </div>

      {/* MINIATURAS (Solo si hay más de una) */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-auto pb-2 justify-center">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden bg-white p-2 transition-all",
                selectedIndex === idx 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-transparent hover:border-muted-foreground/25"
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="object-contain w-full h-full mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}