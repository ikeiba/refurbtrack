"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { sendContactMessage } from "@/services/api"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await sendContactMessage({ name, email, subject, message })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "No se pudo enviar el mensaje")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 border p-6 rounded-xl bg-card shadow-sm">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 rounded-lg">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
            ✓ Mensaje enviado correctamente
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
            Gracias por escribirnos. Te responderemos en un plazo de 24-48 horas laborables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-xl bg-card shadow-sm">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <label className="text-sm font-medium">Nombre completo *</label>
        <Input
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Email *</label>
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Asunto *</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="">Selecciona un asunto</option>
          {/*<option value="error-datos">❌ Error en datos/precios</option>*/}
          <option value="sugerencia">💡 Sugerencia de mejora</option>
          <option value="colaboracion">🤝 Propuesta de colaboración</option>
          <option value="tecnico">🔧 Problema técnico</option>
          <option value="otro">📩 Otro</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Mensaje *</label>
        <Textarea
          placeholder="Describe tu consulta con el máximo detalle posible. Si reportas un error, incluye la URL del producto afectado."
          className="min-h-[150px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <div className="bg-muted/50 p-3 rounded text-xs text-muted-foreground">
        Al enviar este formulario, aceptas nuestra{" "}
        <a href="/es/privacy" className="text-emerald-600 hover:underline">
          Política de Privacidad
        </a>
        . Solo usaremos tu email para responder a tu consulta.
      </div>

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
          "Enviar Mensaje"
        )}
      </Button>
    </form>
  )
}
