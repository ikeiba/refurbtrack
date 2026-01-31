"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, login } = useAuth()
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
      await register({ email, password })
      // Iniciar sesión automáticamente después del registro
      await login({ email, password })
      // Redirigir a la pantalla de inicio
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-emerald-100 dark:border-emerald-900 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-emerald-600" />
            </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Crea tu cuenta</CardTitle>
        <CardDescription className="text-center">
          Únete a RefurbTrack para gestionar tus alertas y guardar favoritos
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
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando cuenta...
                </>
            ) : (
                "Registrarse"
            )}
          </Button>
          <div className="text-center text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="font-medium text-emerald-600 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}