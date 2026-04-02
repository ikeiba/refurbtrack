'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useConsent } from '@/context/ConsentContext'

export function AnalyticsScripts() {
  const { consent } = useConsent()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 1. Interceptor de Navegación SPA para Awin
  // Al cambiar la ruta o los parámetros (ej. filtros), notificamos al Master Tag
  useEffect(() => {
    if (consent?.marketing && typeof window !== 'undefined') {
      // Usamos any para saltar el tipado estricto temporalmente sobre el objeto global de Awin
      const awinWindow = window as any
      if (awinWindow.AWIN?.Tracking?.run) {
        awinWindow.AWIN.Tracking.run()
      }
    }
  }, [pathname, searchParams, consent?.marketing])

  // Eliminamos el early return para evaluar cada bloque de forma independiente
  return (
    <>
      {/* ─── BLOQUE DE ANALÍTICA (GA4 & Clarity) ─── */}
      {consent?.analytics && (
        <>
          <GoogleAnalytics gaId="G-M8QQK0QTH8" />
          
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "w4ynomg8pj");
              `,
            }}
          />
        </>
      )}

      {/* ─── BLOQUE DE MARKETING (Awin Master Tag) ─── */}
      {consent?.marketing && (
        <Script
          id="awin-master-tag"
          strategy="afterInteractive"
          // URL corregida para el Publisher Master Tag
          src="https://www.dwin2.com/pub.2838864.min.js"
          onLoad={() => {
            const awinWindow = window as any
            if (awinWindow.AWIN?.Tracking?.run) {
              awinWindow.AWIN.Tracking.run()
            }
          }}
        />
      )}
    </>
  )
}