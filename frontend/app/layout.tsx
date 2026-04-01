import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer" // <--- 1. Importar
import { AuthProvider } from "@/context/auth-context" // <--- Importar el AuthProvider


const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RefurbTrack - Refurbished Tech Price Tracker",
  description:
    "Track prices from Back Market and other refurbished tech marketplaces. Find the best deals on iPhones, iPads, and more.",
  generator: "v0.app",
  // 1. Añadimos el manifest
  manifest: "/site.webmanifest",
  // 2. Añadimos el título para aplicaciones web de Apple (PWA)
  appleWebApp: {
    title: "refurbtrack",
  },
  // 3. Sustituimos los iconos antiguos por los nuevos de tu paquete
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
        <AuthProvider>
          {children}
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
