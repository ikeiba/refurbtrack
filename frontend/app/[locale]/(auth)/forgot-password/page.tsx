"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, ChevronLeft } from "lucide-react"
import Link from "next/link"
// IMPORTAMOS LA FUNCIÓN DEL SERVICIO
import { requestPasswordReset } from "@/services/api"
import { useParams } from "next/navigation"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // USAMOS LA FUNCIÓN IMPORTADA (Mucho más limpio)
      await requestPasswordReset(email, locale)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || t("could_not_process", language))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-emerald-100 dark:border-emerald-900 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">{t("recover_password", language)}</CardTitle>
        <CardDescription className="text-center">
          {t("recover_password_desc", language)}
        </CardDescription>
      </CardHeader>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email", language)}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t("email_placeholder", language)} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-6">
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("sending", language)}
                </>
              ) : (
                t("send_recovery_link", language)
              )}
            </Button>
            <Link href={`/${locale}/login`} className="flex items-center justify-center gap-2 text-sm text-emerald-600 hover:underline">
              <ChevronLeft className="w-4 h-4" />
              {t("back_to_login", language)}
            </Link>
          </CardFooter>
        </form>
      ) : (
        <CardContent className="space-y-4 pt-6">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              {t("email_sent", language)}
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
              {t("email_sent_desc", language, { email })}
            </p>
          </div>
          <Link href={`/${locale}/login`} className="block">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              {t("back_to_login", language)}
            </Button>
          </Link>
        </CardContent>
      )}
    </Card>
  )
}
