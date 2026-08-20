// components/header-wrapper.tsx
"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header" // Ajusta a tu ruta real
import { parseLocale, getMarket } from "@/lib/i18n"

export function HeaderWrapper() {
  const router = useRouter()
  const params = useParams() // <-- NUEVO: Capturamos los parámetros de la URL activa
  
  // Extraemos el locale (con un fallback de seguridad por si falla)
  const locale = parseLocale(params?.locale as string | undefined)

  // El país/mercado se deriva del locale de la URL (fuente única de verdad),
  // así no se resetea a ES al navegar/cambiar de idioma.
  const country = getMarket(locale)
  const [searchQuery, setSearchQuery] = useState("")

  const handleHeaderSearch = (query: string) => {
    const trimmed = query.trim()
    // Mantenemos el locale en la ruta para que el middleware no rompa la URL
    const targetUrl = trimmed 
      ? `/${locale}?q=${encodeURIComponent(trimmed)}` 
      : `/${locale}`
      
    router.push(targetUrl)
  }

  return (
    <Header
      selectedCountry={country}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleHeaderSearch}
    />
  )
}