'use client'

import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useConsent } from '@/context/ConsentContext'

export function AnalyticsScripts() {
  const { consent } = useConsent()

  // Si no hay consentimiento EXPLÍCITO para analítica, no renderizamos nada
  if (!consent?.analytics) return null

  return (
    <>
      {/* Google Analytics 4 (Tráfico y Adquisición) */}
      <GoogleAnalytics gaId="G-M8QQK0QTH8" />

      {/* Microsoft Clarity (Mapas de calor y grabaciones de sesión) */}
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
  )
}