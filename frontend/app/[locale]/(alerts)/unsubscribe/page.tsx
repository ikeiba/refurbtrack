"use client"

import { useSearchParams, useParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { API_URL } from "@/services/api"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// IMPORTAR LA FUNCIÓN
import { unsubscribeAlert } from "@/services/api"
import { parseLocale, getMarket, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      return
    }

    // Llamamos a nuestro nuevo endpoint
    unsubscribeAlert(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"))
  }, [token])

  return (
    <Card className="w-full max-w-md text-center shadow-lg">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />}
          {status === "success" && <CheckCircle2 className="h-12 w-12 text-emerald-600" />}
          {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
        </div>
        <CardTitle>
          {status === "loading" && t("processing", language)}
          {status === "success" && t("alert_removed", language)}
          {status === "error" && t("error", language)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && (
          <p className="text-muted-foreground">
            {t("unsubscribe_success_desc", language)}
          </p>
        )}
        {status === "error" && (
          <p className="text-muted-foreground">
            {t("unsubscribe_error_desc", language)}
          </p>
        )}
        
        <div className="pt-4">
            <Link href={`/${locale}`}>
                <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4"/> {t("back_home", language)}
                </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function UnsubscribePage() {
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
                    <UnsubscribeContent />
                </Suspense>
            </div>
            <Footer />
        </div>
    )
}