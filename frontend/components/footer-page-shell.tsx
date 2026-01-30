"use client"

import { useState } from "react"
import { Header } from "@/components/header"

export function FooterPageShell({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState("ES")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER CONFIGURADO:
        - showSearch={false} -> Oculta la lupa
      */}
      <Header 
        selectedCountry={country}
        onCountryChange={setCountry}
        showSearch={false} 
      />
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}