// app/[locale]/layout.tsx

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
import { locales, getLanguage, parseLocale } from "@/lib/i18n"
import { t } from "@/lib/translations"

const _inter = Inter({ subsets: ["latin"] })

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://refurbtrack.com'

// Metadata por locale (Fase 4): alternates con hreflang y canonical del locale.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const language = getLanguage(locale)
  return {
    metadataBase: new URL(baseUrl),
    title: t("meta_default_title", language),
    description: t("meta_default_description", language),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "es-es": "/es-es",
        "en-gb": "/en-gb",
      },
    },
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
}

// 1. ZONA FRÍA: Generación estática para los dos locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  // 2. Tipamos los params como Promesa (Next.js 16)
  params: Promise<{ locale: string }> 
}>) {
  // 3. Resolvemos la promesa para sacar el locale
  const resolvedParams = await params
  const locale = parseLocale(resolvedParams.locale)
  const language = getLanguage(locale)

  return (
    <html lang={language} suppressHydrationWarning>
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
