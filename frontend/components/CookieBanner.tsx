'use client'

import { useState, useEffect } from 'react'
import { useConsent } from '@/context/ConsentContext'
import Link from 'next/link'

export function CookieBanner() {
  const { consent, acceptAll, rejectAll, updateConsent } = useConsent()
  const [showConfig, setShowConfig] = useState(false)
  const [localConsent, setLocalConsent] = useState({ analytics: false, marketing: false })
  const [mounted, setMounted] = useState(false)

  // Evitar errores de hidratación asegurando que solo se renderice en el cliente
  useEffect(() => { setMounted(true) }, [])

  if (!mounted || consent?.decided) return null

  const handleSavePreferences = () => {
    updateConsent(localConsent)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] text-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        
        {!showConfig ? (
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <p className="text-sm">
              Utilizamos cookies propias y de terceros para analizar nuestro tráfico y mejorar tu experiencia. 
              Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias. Lee nuestra{' '}
              <Link href="/legal/cookies" className="underline font-semibold text-blue-600">Política de Cookies</Link>.
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button onClick={() => setShowConfig(true)} className="text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
                Configurar
              </button>
              <button onClick={rejectAll} className="text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
                Rechazar
              </button>
              <button onClick={acceptAll} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Configuración de Cookies</h3>
            <p className="text-sm">Selecciona qué tipo de cookies permites instalar en tu navegador.</p>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium text-sm">Cookies Técnicas (Estrictamente necesarias)</p>
                <p className="text-xs text-gray-500">Necesarias para que la web funcione. No se pueden desactivar.</p>
              </div>
              <input type="checkbox" checked disabled className="h-4 w-4 accent-blue-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium text-sm">Cookies de Analítica</p>
                <p className="text-xs text-gray-500">Nos permiten entender cómo interactúas con la web (Google Analytics, Clarity).</p>
              </div>
              <input 
                type="checkbox" 
                checked={localConsent.analytics} 
                onChange={(e) => setLocalConsent({...localConsent, analytics: e.target.checked})}
                className="h-4 w-4 accent-blue-600 cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium text-sm">Cookies de Marketing / Afiliación</p>
                <p className="text-xs text-gray-500">Necesarias para el seguimiento de compras y enlaces de afiliados (Awin).</p>
              </div>
              <input 
                type="checkbox" 
                checked={localConsent.marketing} 
                onChange={(e) => setLocalConsent({...localConsent, marketing: e.target.checked})}
                className="h-4 w-4 accent-blue-600 cursor-pointer" 
              />
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <button onClick={handleSavePreferences} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Guardar preferencias
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}