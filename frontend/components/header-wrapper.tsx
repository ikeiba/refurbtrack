// components/header-wrapper.tsx
"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header" // Ajusta a tu ruta real

export function HeaderWrapper() {
  const router = useRouter()
  const params = useParams() // <-- NUEVO: Capturamos los parámetros de la URL activa
  
  // Extraemos el idioma (con un fallback de seguridad por si falla)
  const lang = params?.lang || "es"

  const [country, setCountry] = useState("ES")
  const [searchQuery, setSearchQuery] = useState("")

  const handleHeaderSearch = (query: string) => {
    const trimmed = query.trim()
    // AHORA SÍ: Mantenemos el idioma en la ruta para que el middleware no rompa la URL
    const targetUrl = trimmed 
      ? `/${lang}?q=${encodeURIComponent(trimmed)}` 
      : `/${lang}`
      
    router.push(targetUrl)
  }

  return (
    <Header
      selectedCountry={country}
      onCountryChange={setCountry}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleHeaderSearch}
    />
  )
}