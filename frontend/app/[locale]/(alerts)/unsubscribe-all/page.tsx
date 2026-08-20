"use client"

import { useSearchParams, useParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { API_URL } from "@/services/api"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// IMPORTAR LA FUNCIÓN
import { unsubscribeSubscriber } from "@/services/api"
import { parseLocale, getMarket, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

function UnsubscribeAllContent() {
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)
  const token = searchParams.get("token")
  
  // Estados: 'confirm' (preguntar), 'loading' (procesando), 'success' (borrado), 'error' (fallo)
  const [status, setStatus] = useState<"confirm" | "loading" | "success" | "error">(
    !token ? "error" : "confirm"
  )

  const handleUnsubscribeAll = async () => {
    if (!token) return
    setStatus("loading")

    try {
      // USAMOS LA NUEVA FUNCIÓN
      await unsubscribeSubscriber(token)
      
      // Si llega aquí es que no lanzó error (res.ok fue true en api.ts)
      setStatus("success")
      
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-md text-center shadow-lg">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {status === "confirm" && <AlertTriangle className="h-12 w-12 text-orange-500" />}
          {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />}
          {status === "success" && <CheckCircle2 className="h-12 w-12 text-emerald-600" />}
          {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
        </div>
        
        <CardTitle>
          {status === "confirm" && t("unsubscribe_all_confirm", language)}
          {status === "loading" && t("unsubscribe_all_loading", language)}
          {status === "success" && t("miss_you", language)}
          {status === "error" && t("error", language)}
        </CardTitle>
        
        {status === "confirm" && (
            <CardDescription className="pt-2">
                {t("unsubscribe_all_desc", language)}
            </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ESTADO: PREGUNTAR */}
        {status === "confirm" && (
            <div className="flex flex-col gap-3">
                <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleUnsubscribeAll}
                >
                    {t("unsubscribe_all_confirm_btn", language)}
                </Button>
                <Link href={`/${locale}`}>
                    <Button variant="outline" className="w-full">
                        {t("cancel_back_home", language)}
                    </Button>
                </Link>
            </div>
        )}

        {/* ESTADO: ÉXITO */}
        {status === "success" && (
          <>
            <p className="text-muted-foreground">
              {t("unsubscribe_all_success_desc", language)}
            </p>
            <Link href={`/${locale}`}>
                <Button variant="outline" className="gap-2 mt-4">
                    <ArrowLeft className="h-4 w-4"/> {t("back_home", language)}
                </Button>
            </Link>
          </>
        )}

        {/* ESTADO: ERROR */}
        {status === "error" && (
          <>
            <p className="text-muted-foreground">
              {t("unsubscribe_error_desc", language)}
            </p>
            <div className="pt-4">
              <Link href={`/${locale}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4"/> {t("back_home", language)}
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function UnsubscribeAllPage() {
    const params = useParams()
    const market = getMarket(params?.locale as string | undefined)
    const [country, setCountry] = useState<string>(market)
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header 
                selectedCountry={country}
                onCountryChange={setCountry}
                showSearch={false}
            />
            <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
                <Suspense fallback={<div>{t("loading", getLanguage(params?.locale as string | undefined))}</div>}>
                    <UnsubscribeAllContent />
                </Suspense>
            </div>
            <Footer />
        </div>
    )
}