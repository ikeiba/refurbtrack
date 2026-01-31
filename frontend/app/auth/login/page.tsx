"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login({ email, password })
      router.push("/") // Redirigir a la home tras login
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-emerald-100 dark:border-emerald-900 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <LogIn className="h-6 w-6 text-emerald-600" />
            </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Bienvenido de nuevo</CardTitle>
        <CardDescription className="text-center">
          Introduce tus credenciales para acceder a tu panel
        </CardDescription>
      </CardHeader>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/auth/forgot-password" className="text-sm text-emerald-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...
                </>
            ) : (
                "Iniciar Sesión"
            )}
          </Button>
          <div className="text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register" className="font-medium text-emerald-600 hover:underline">
              Regístrate gratis
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}