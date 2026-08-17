'use client'

import { useEffect, Suspense } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useConsent } from '@/context/ConsentContext'
import { flushAnalyticsQueue, trackReturnVisit } from '@/lib/analytics'

// 1. Movemos toda la lógica a un componente interno
function AnalyticsContent() {
  const { consent } = useConsent()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Interceptor de Navegación SPA para Awin
  useEffect(() => {
    if (consent?.marketing && typeof window !== 'undefined') {
      const awinWindow = window as any
      if (awinWindow.AWIN?.Tracking?.run) {
        awinWindow.AWIN.Tracking.run()
      }
    }
  }, [pathname, searchParams, consent?.marketing])

  // Vaciado de la cola de eventos GA4 (reintenta hasta que gtag esté listo)
  useEffect(() => {
    if (!consent?.analytics) return
    flushAnalyticsQueue()
    const id = setInterval(flushAnalyticsQueue, 1500)
    return () => clearInterval(id)
  }, [consent?.analytics])

  // Marca de visita recurrente
  useEffect(() => {
    trackReturnVisit()
  }, [])

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

// 2. Exportamos el componente envuelto en Suspense
export function AnalyticsScripts() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  )
}