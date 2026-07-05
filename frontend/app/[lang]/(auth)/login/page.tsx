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
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { API_URL } from "@/services/api"

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
      router.push("/es") // Redirigir a la home tras login
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsSubmitting(true)
    setError("")
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const res = await fetch(`${apiUrl}/auth/google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) throw new Error("Error autenticando con Google");
      
      const data = await res.json();
      
      // 👇 AQUÍ ESTÁ LA MAGIA ARREGLADA 👇
      // Usamos exactamente los nombres que espera tu AuthContext
      localStorage.setItem('accessToken', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      }
      // Guardamos también el email que nos devuelve el backend de Django
      localStorage.setItem('userEmail', data.user.email);
      
      // Forzamos la recarga para que el AuthContext lea los datos
      window.location.href = "/es";
    } catch (err: any) {
      setError(err.message || "Error al conectar con Google")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
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
                <Link href="/es/forgot-password" className="text-sm text-emerald-600 hover:underline">
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

            {/* Separador */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">
                  O continúa con
                </span>
              </div>
            </div>

            {/* Botón de Google */}
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Error en el pop-up de Google")}
                theme="outline"
              />
            </div>

            <div className="text-center text-sm">
              ¿No tienes cuenta?{" "}
              <Link href="/es/register" className="font-medium text-emerald-600 hover:underline">
                Regístrate gratis
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </GoogleOAuthProvider>
  )
}