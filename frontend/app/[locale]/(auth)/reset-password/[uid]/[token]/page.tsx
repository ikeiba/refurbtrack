"use client"

import { useState, use } from "react" // <--- 1. IMPORTA 'use'
import { useRouter, useParams } from "next/navigation" // OJO: next/navigation en App Router
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Lock, CheckCircle2 } from "lucide-react"
import { confirmPasswordReset } from "@/services/api" // <--- IMPORTAR

import Link from "next/link"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

// Next.js pasa los parámetros de la URL como props al componente
export default function ResetPasswordConfirmPage({ params }: { params: Promise<{ uid: string; token: string }> }) {
  // 3. DESEMPAQUETA LOS PARÁMETROS USANDO EL HOOK use()
  // Esto convierte la promesa en las variables reales
  const { uid, token } = use(params)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const urlParams = useParams()
  const locale = parseLocale(urlParams?.locale as string | undefined)
  const language = getLanguage(locale)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError(t("passwords_mismatch", language))
      return
    }

    if (password.length < 6) {
      setError(t("password_too_short", language))
      return
    }

    setIsSubmitting(true)

    try {
      // USAMOS LA FUNCIÓN IMPORTADA
      await confirmPasswordReset({
        uid: uid,
        token: token,
        password: password
      })

      setSuccess(true)
      setTimeout(() => {
        router.push(`/${locale}/login`)
      }, 3000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <Card className="w-full border-emerald-100 dark:border-emerald-900 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
              {success ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <Lock className="h-6 w-6 text-emerald-600" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t("reset_password", language)}</CardTitle>
          {!success && <CardDescription>{t("enter_new_password", language)}</CardDescription>}
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-emerald-700 font-medium">{t("password_updated", language)}</p>
              <p className="text-sm text-gray-500">{t("redirecting_to_login", language)}</p>
              
              {/* Usamos asChild para que el botón se comporte como un enlace */}
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href={`/${locale}/login`}> {/* La URL es /es-es/login porque (auth) no cuenta */}
                  {t("go_to_login_now", language)}
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">{t("new_password", language)}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">{t("confirm_password", language)}</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t("saving", language)}</> : t("change_password", language)}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}