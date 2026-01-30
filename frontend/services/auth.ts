import { API_URL } from "./api" // Asegúrate de tener tu constante base URL aquí

// Tipos de datos que esperamos
export interface LoginResponse {
  access: string
  refresh: string
}

export interface UserData {
  email: string
  password?: string
}

export const authService = {
  // 1. REGISTRO
  async register(data: UserData) {
    const res = await fetch(`${API_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json()
      // Convertimos el error del backend en algo legible
      throw new Error(error.email?.[0] || error.password?.[0] || "Error en el registro")
    }
    
    return res.json()
  },

  // 2. LOGIN
  async login(data: UserData): Promise<LoginResponse> {
    // Truco: Django espera un campo "username", pero nosotros usamos el email.
    // Así que enviamos el email dentro del campo "username".
    const payload = {
        username: data.email,
        password: data.password
    }

    const res = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error("Credenciales incorrectas")
    }

    return res.json()
  },

  // 3. REFRESH TOKEN (Para no pedir login cada hora)
  async refreshToken(refresh: string): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })

    if (!res.ok) throw new Error("Sesión caducada")
    return res.json()
  }
}