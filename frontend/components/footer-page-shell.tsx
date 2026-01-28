"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"

export function FooterPageShell({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState("ES")
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER CONFIGURADO:
         - showSearch={false} -> Oculta la lupa
         - showBackButton={true} -> Muestra la flecha para volver
      */}
      <Header 
        selectedCountry={country}
        onCountryChange={setCountry}
        showSearch={false} 
        showBackButton={true}
        onBackClick={() => router.push("/")}
      />
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}