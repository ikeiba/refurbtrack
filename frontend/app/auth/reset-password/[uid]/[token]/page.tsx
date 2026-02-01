"use client"

import { useState, use } from "react" // <--- 1. IMPORTA 'use'
import { useRouter } from "next/navigation" // OJO: next/navigation en App Router
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Lock, CheckCircle2 } from "lucide-react"
import { confirmPasswordReset } from "@/services/api" // <--- IMPORTAR

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
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
        router.push("/auth/login")
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
          <CardTitle className="text-2xl font-bold">Restablecer Contraseña</CardTitle>
          {!success && <CardDescription>Introduce tu nueva contraseña</CardDescription>}
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-emerald-700 font-medium">¡Contraseña actualizada correctamente!</p>
              <p className="text-sm text-gray-500">Redirigiendo al login...</p>
              <Button onClick={() => router.push("/auth/login")} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Ir al Login ahora
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
                <Label htmlFor="password">Nueva Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar Contraseña</Label>
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
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Guardando...</> : "Cambiar Contraseña"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}