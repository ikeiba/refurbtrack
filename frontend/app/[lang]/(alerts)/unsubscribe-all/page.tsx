"use client"

import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { API_URL } from "@/services/api"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// IMPORTAR LA FUNCIÓN
import { unsubscribeSubscriber } from "@/services/api"

function UnsubscribeAllContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  // Estados: 'confirm' (preguntar), 'loading' (procesando), 'success' (borrado), 'error' (fallo)
  const [status, setStatus] = useState<"confirm" | "loading" | "success" | "error">(
    !token ? "error" : "confirm"
  )

  const handleUnsubscribeAll = async () => {
    if (!token) return
    setStatus("loading")

    try {
      // USAMOS LA NUEVA FUNCIÓN
      await unsubscribeSubscriber(token)
      
      // Si llega aquí es que no lanzó error (res.ok fue true en api.ts)
      setStatus("success")
      
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <Card className="w-full max-w-md text-center shadow-lg">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {status === "confirm" && <AlertTriangle className="h-12 w-12 text-orange-500" />}
          {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />}
          {status === "success" && <CheckCircle2 className="h-12 w-12 text-emerald-600" />}
          {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
        </div>
        
        <CardTitle>
          {status === "confirm" && "¿Darte de baja de todo?"}
          {status === "loading" && "Procesando baja..."}
          {status === "success" && "Te echaremos de menos"}
          {status === "error" && "Error"}
        </CardTitle>
        
        {status === "confirm" && (
            <CardDescription className="pt-2">
                Estás a punto de eliminar <strong>todas tus alertas</strong> y tu cuenta de suscriptor. 
                Dejarás de recibir cualquier correo nuestro.
            </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ESTADO: PREGUNTAR */}
        {status === "confirm" && (
            <div className="flex flex-col gap-3">
                <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleUnsubscribeAll}
                >
                    Sí, eliminar todas mis alertas
                </Button>
                <Link href="/es">
                    <Button variant="outline" className="w-full">
                        Cancelar y volver al inicio
                    </Button>
                </Link>
            </div>
        )}

        {/* ESTADO: ÉXITO */}
        {status === "success" && (
          <>
            <p className="text-muted-foreground">
              Has sido dado de baja correctamente. Todas tus alertas han sido eliminadas de nuestro sistema.
            </p>
            <Link href="/es">
                <Button variant="outline" className="gap-2 mt-4">
                    <ArrowLeft className="h-4 w-4"/> Volver al inicio
                </Button>
            </Link>
          </>
        )}

        {/* ESTADO: ERROR */}
        {status === "error" && (
          <>
            <p className="text-muted-foreground">
              El enlace ha caducado o no es válido. Ve a tu panel para gestionar tus alertas.
            </p>
            <div className="pt-4">
              <Link href="/es">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4"/> Volver al inicio
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function UnsubscribeAllPage() {
    const [country, setCountry] = useState("ES")
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header 
                selectedCountry={country}
                onCountryChange={setCountry}
                showSearch={false}
            />
            <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
                <Suspense fallback={<div>Cargando...</div>}>
                    <UnsubscribeAllContent />
                </Suspense>
            </div>
            <Footer />
        </div>
    )
}