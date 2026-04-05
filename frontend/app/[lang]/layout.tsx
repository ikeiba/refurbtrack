// app/[lang]/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// ¡OJO! Hemos bajado un nivel, así que hay que subir uno para encontrar el CSS
import "../globals.css" 
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer" 
import { AuthProvider } from "@/context/auth-context" 
import { ConsentProvider } from "@/context/ConsentContext"
import { CookieBanner } from "@/components/CookieBanner"
import { AnalyticsScripts } from "@/components/AnalyticsScripts"

const _inter = Inter({ subsets: ["latin"] })

// La metadata se queda igual por ahora
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbtrack.com'),
  title: "RefurbTrack - Refurbished Tech Price Tracker",
  description:
    "Compara precios históricos de iPhones reacondicionados en Back Market. Encuentra las mejores ofertas en tecnología reacondicionada.",
  manifest: "/site.webmanifest",
  verification: {
    google: "cdvImXJDTi0mo4J1NSj6wCfbuMkBB6ybvInJn2UwI9A", 
  },
  appleWebApp: {
    title: "refurbtrack",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    'awin': 'Awin'
  }
}

// 1. ZONA FRÍA: Activamos la generación estática para el idioma español
export async function generateStaticParams() {
  return [{ lang: 'es' }]
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  // 2. Tipamos los params como Promesa (Next.js 16)
  params: Promise<{ lang: string }> 
}>) {
  // 3. Resolvemos la promesa para sacar el idioma
  const resolvedParams = await params
  const lang = resolvedParams.lang

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${_inter.className} font-sans antialiased`}>
        <ConsentProvider>
          <AuthProvider>
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
          <CookieBanner />
          <AnalyticsScripts />
        </ConsentProvider>
      </body>
    </html>
  )
}