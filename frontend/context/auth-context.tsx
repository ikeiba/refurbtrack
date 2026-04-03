"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { authService, UserData, LoginResponse } from "@/services/auth"
import { useRouter } from "next/navigation"

// Definimos qué información tendrá nuestro "cerebro"
interface AuthContextType {
  user: string | null // Guardaremos el email del usuario
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: UserData) => Promise<void>
  register: (data: UserData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null) // Email
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Para no mostrar nada hasta verificar sesión
  
  const router = useRouter()

  // AL CARGAR LA PÁGINA: Comprobar si hay sesión guardada
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken")
      const userEmail = localStorage.getItem("userEmail")

      if (accessToken && userEmail) {
        // Aquí podríamos validar el token con el backend si quisiéramos ser muy estrictos
        // Por ahora, asumimos que si hay token, está logueado (la API rebotará si caducó)
        setUser(userEmail)
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (data: UserData) => {
    try {
      const tokens: LoginResponse = await authService.login(data)
      
      // Guardamos las llaves
      localStorage.setItem("accessToken", tokens.access)
      localStorage.setItem("refreshToken", tokens.refresh)
      localStorage.setItem("userEmail", data.email)

      setUser(data.email)
      setIsAuthenticated(true)
      
      router.refresh() // Refresca los componentes (Header, etc.)
    } catch (error) {
      throw error // Lo lanzamos para que el formulario muestre el error rojo
    }
  }

  const register = async (data: UserData) => {
    try {
      await authService.register(data)
      // Después de registrarse, hacemos login automático
      await login(data)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userEmail")
    setUser(null)
    setIsAuthenticated(false)
    router.push("/es") // Volver a home
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el cerebro fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}