"use client"

import { useState } from "react"
import { Header } from "@/components/header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [country, setCountry] = useState("ES")

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedCountry={country}
        onCountryChange={setCountry}
        showSearch={false}
      />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
}