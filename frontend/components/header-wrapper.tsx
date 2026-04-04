// components/header-wrapper.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// Importa tu componente Header real aquí (ajusta la ruta según tu proyecto)
import { Header } from "@/components/header" 

export function HeaderWrapper() {
  const router = useRouter()
  const [country, setCountry] = useState("ES")
  const [searchQuery, setSearchQuery] = useState("")

  const handleHeaderSearch = (query: string) => {
    const trimmed = query.trim()
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/")
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