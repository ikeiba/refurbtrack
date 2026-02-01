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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // USAMOS LA FUNCIÓN IMPORTADA (Mucho más limpio)
      await requestPasswordReset(email)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Error al enviar el email de recuperación")
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
        <CardTitle className="text-2xl font-bold text-center">Recuperar contraseña</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu email y te enviaremos un enlace para restaurar tu contraseña
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
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="tu@email.com" 
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                "Enviar enlace de recuperación"
              )}
            </Button>
            <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-emerald-600 hover:underline">
              <ChevronLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </CardFooter>
        </form>
      ) : (
        <CardContent className="space-y-4 pt-6">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              ✓ Email enviado correctamente
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
              Revisa tu bandeja de entrada (y la carpeta de spam) en los próximos minutos.
            </p>
          </div>
          <Link href="/auth/login" className="block">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Volver al login
            </Button>
          </Link>
        </CardContent>
      )}
    </Card>
  )
}
