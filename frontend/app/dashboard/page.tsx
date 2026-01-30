"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { getUserAlerts, deleteAlert } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Bell, ExternalLink, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
    const [selectedCountry, setSelectedCountry] = useState("ES")
  const [searchQuery, setSearchQuery] = useState("")
  
  const { toast } = useToast()
  const router = useRouter()

    const handleHeaderSearch = (query: string) => {
        const trimmed = query.trim()
        router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/")
    }

  // 1. CARGAR DATOS
  useEffect(() => {
    // Si termina de cargar auth y no está logueado, fuera
    if (!authLoading && !isAuthenticated) {
        router.push("/auth/login")
        return
    }

    if (isAuthenticated) {
        const token = localStorage.getItem("accessToken")
        if (token) {
            getUserAlerts(token)
                .then(data => {
                    setAlerts(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        }
    }
  }, [isAuthenticated, authLoading, router])

  // 2. BORRAR ALERTA
  const handleDelete = async (id: number) => {
    setDeletingId(id)
    const token = localStorage.getItem("accessToken")
    if (!token) return

    try {
        await deleteAlert(id, token)
        // Actualizamos la lista localmente
        setAlerts(prev => prev.filter(a => a.id !== id))
        toast({ title: "Alerta eliminada", className: "bg-emerald-50 text-emerald-800 border-emerald-200" })
    } catch (error) {
        console.error(error)
        toast({ title: "Error", description: "No se pudo eliminar", variant: "default" })
    } finally {
        setDeletingId(null)
    }
  }

  // 3. RENDERIZADO
  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-emerald-600"/></div>
  }

    return (
        <div className="min-h-screen bg-background">
            <Header
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleHeaderSearch}
            />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Mi Panel</h1>
            <p className="text-muted-foreground">Gestiona tus alertas de precios activas para {user}</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        // --- ESTADO VACÍO ---
        <Card className="border-dashed border-2 py-12 text-center bg-muted/20">
            <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Bell className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold">No tienes alertas activas</h3>
                <p className="text-muted-foreground max-w-sm">
                    Busca un producto que te guste y crea una alerta para que te avisemos cuando baje de precio.
                </p>
                <Link href="/">
                    <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                        Explorar Productos <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </Card>
      ) : (
        // --- LISTA DE ALERTAS ---
        <div className="grid gap-4">
            {alerts.map((alert) => (
                <Card key={alert.id} className="overflow-hidden hover:border-emerald-500/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                        
                        {/* Info Principal */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg">
                                    Producto {alert.product_name} {/* TODO: Necesitamos que el backend mande el nombre del producto */}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
                                    Activa
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">
                                Avisar si baja de <span className="font-bold text-foreground">{alert.price_threshold}€</span>
                            </p>
                            
                            {/* Filtros aplicados */}
                            <div className="flex flex-wrap gap-2 text-xs">
                                {alert.battery_new !== null && (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Batería: {alert.battery_new ? "Nueva" : "Estándar"}
                                    </span>
                                )}
                                {alert.target_storages?.length > 0 && (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        GB: {alert.target_storages.join(", ")}
                                    </span>
                                )}
                                {alert.target_conditions?.length > 0 && (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Estado: {alert.target_conditions.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-3">
                            <Link href={`/product/${alert.product}`}>
                                <Button variant="outline" size="sm" className="gap-2">
                                    Ver producto <ExternalLink className="h-3 w-3" />
                                </Button>
                            </Link>
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(alert.id)}
                                disabled={deletingId === alert.id}
                            >
                                {deletingId === alert.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      )}
            </div>
        </div>
  )
}