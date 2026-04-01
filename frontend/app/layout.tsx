import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer" 
import { AuthProvider } from "@/context/auth-context" 

// <--- 1. Importar el proveedor y el componente del banner de cookies
import { ConsentProvider } from "@/context/ConsentContext"
import { CookieBanner } from "@/components/CookieBanner"

import { AnalyticsScripts } from "@/components/AnalyticsScripts"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RefurbTrack - Refurbished Tech Price Tracker",
  description:
    "Track prices from Back Market and other refurbished tech marketplaces. Find the best deals on iPhones, iPads, and more.",
  generator: "v0.app",
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "refurbtrack",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_inter.className} font-sans antialiased`}>
        
        {/* <--- 2. Envolver toda la aplicación con el ConsentProvider */}
        <ConsentProvider>
          <AuthProvider>
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
          
          {/* <--- 3. Renderizar el Banner al final del body */}
          <CookieBanner />
          <AnalyticsScripts /> {/* <--- Añade esta línea aquí */}
        </ConsentProvider>

      </body>
    </html>
  )
}