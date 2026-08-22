'use client'

import { useState, useEffect } from 'react'
import { useConsent } from '@/context/ConsentContext'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { parseLocale, getLanguage } from '@/lib/i18n'
import { t } from '@/lib/translations'

export function CookieBanner() {
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)
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
              {t("cookie_banner_text", language)}
              <Link href={`/${locale}/cookies`} className="underline font-semibold text-blue-600">{t("cookie_policy_link", language)}</Link>.
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button onClick={() => setShowConfig(true)} className="w-full md:w-auto text-sm px-4 py-2 min-h-11 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
                {t("configure", language)}
              </button>
              <button onClick={rejectAll} className="w-full md:w-auto text-sm px-4 py-2 min-h-11 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">
                {t("reject", language)}
              </button>
              <button onClick={acceptAll} className="w-full md:w-auto text-sm px-4 py-2 min-h-11 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                {t("accept_all", language)}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">{t("cookie_config_title", language)}</h3>
            <p className="text-sm">{t("cookie_config_desc", language)}</p>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium text-sm">{t("technical_cookies", language)}</p>
                <p className="text-xs text-gray-500">{t("technical_cookies_desc", language)}</p>
              </div>
              <input type="checkbox" checked disabled className="h-4 w-4 accent-blue-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium text-sm">{t("analytics_cookies", language)}</p>
                <p className="text-xs text-gray-500">{t("analytics_cookies_desc", language)}</p>
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
                <p className="font-medium text-sm">{t("marketing_cookies", language)}</p>
                <p className="text-xs text-gray-500">{t("marketing_cookies_desc", language)}</p>
              </div>
              <input 
                type="checkbox" 
                checked={localConsent.marketing} 
                onChange={(e) => setLocalConsent({...localConsent, marketing: e.target.checked})}
                className="h-4 w-4 accent-blue-600 cursor-pointer" 
              />
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <button onClick={handleSavePreferences} className="w-full md:w-auto text-sm px-4 py-2 min-h-11 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                {t("save_preferences", language)}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}