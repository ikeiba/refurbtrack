"use client"

import Link from "next/link"
import { Twitter, Instagram } from "lucide-react"
import { useParams } from "next/navigation"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function Footer() {
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)

  return (
    <footer className="bg-background border-t border-border pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* COLUMNA 1: MARCA */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* 1. Inyectamos el SVG directamente desde la carpeta public */}
              <img 
                src="/favicon.svg" 
                alt={t("logo_alt", language)} 
                className="h-8 w-8" 
              />
              
              {/* 2. Estilizamos el texto para darle identidad de marca */}
              <span className="hidden text-xl tracking-tight sm:inline-block">
                <span className="font-extrabold text-foreground">Refurb</span>
                <span className="font-semibold text-emerald-600">Track</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("footer_tagline", language)}
            </p>
          </div>

          {/* COLUMNA 2: PRODUCTOS */}
          <div>
            <h4 className="font-bold text-foreground mb-4">{t("footer_products", language)}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/smartphone/apple`} className="hover:text-emerald-600 transition-colors">
                  {t("footer_iphones", language)}
                </Link>
              </li>
              <li>
                  {t("footer_coming_soon", language)}
              </li>
              {/*
              <li>
                <Link href="#" className="hover:text-emerald-600 transition-colors">
                  MacBooks
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-600 transition-colors">
                  Apple Watch
                </Link>
              </li> */}
            </ul>
          </div>

          {/* COLUMNA 3: COMPAÑÍA */}
          <div>
            <h4 className="font-bold text-foreground mb-4">{t("footer_company", language)}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-emerald-600 transition-colors">
                  {t("about_us", language)}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/how-it-works`} className="hover:text-emerald-600 transition-colors">
                  {t("how_it_works", language)}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="hover:text-emerald-600 transition-colors">
                  {t("blog", language)}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-emerald-600 transition-colors">
                  {t("contact", language)}
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL */}
          <div>
            <h4 className="font-bold text-foreground mb-4">{t("footer_legal", language)}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-emerald-600 transition-colors">
                  {t("privacy", language)}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:text-emerald-600 transition-colors">
                  {t("terms", language)}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="hover:text-emerald-600 transition-colors">
                  {t("cookies", language)}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* LÍNEA DIVISORIA Y COPYRIGHT */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t("footer_copyright", language)}
          </p>
          
          <div className="flex gap-8">
            <p className="text-sm text-muted-foreground">
              {t("affiliate_disclosure", language)}
              <a href={`/${locale}/how-it-works`} className="text-emerald-600 hover:underline">
                {t("footer_here", language)}
              </a>
              {t("affiliate_disclosure_after", language)}
            </p>
          </div>
          {/* REDES SOCIALES */}
          {/*
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  )
}