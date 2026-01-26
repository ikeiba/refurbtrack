import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"


const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RefurbTrack - Refurbished Tech Price Tracker",
  description:
    "Track prices from Back Market and other refurbished tech marketplaces. Find the best deals on iPhones, iPads, and more.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
      className="font-sans antialiased">{children}
      <Toaster /> {/* <--- ¡ESTO ES LO QUE FALTA! */}
      </body>
    </html>
  )
}
