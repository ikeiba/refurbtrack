"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { getUserAlerts, deleteAlert } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Bell, ExternalLink, ArrowRight, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { t } from "@/lib/translations"
import { type AlertItem } from "@/lib/types"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { unsubscribeAllAlerts, deleteUserAccount } from "@/services/api"
import { LogOut, UserX, AlertTriangle } from "lucide-react" // Iconos nuevos

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

  // 2. FUNCIONES MANEJADORAS
  const handleUnsubscribeAll = async () => {
    try {
        await unsubscribeAllAlerts()
        setAlerts([]) // Limpiamos la lista visualmente
        toast({ title: "Baja completada", description: "Has dejado de seguir todos los productos." })
    } catch (error) {
        toast({ title: "Error", description: "No se pudo procesar la baja", variant: "destructive" })
    }
  }

  const handleDeleteAccount = async () => {
    try {
        await deleteUserAccount()
        // Forzamos logout manual
        localStorage.clear()
        window.location.href = "/" // Redirigir a home recargando
    } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar la cuenta", variant: "destructive" })
    }
  }

  // 1. CARGAR DATOS
  useEffect(() => {
    // Si termina de cargar auth y no está logueado, fuera
    if (!authLoading && !isAuthenticated) {
        router.push("/auth/login")
        return
    }

    if (isAuthenticated) {
        // YA NO NECESITAMOS LEER EL TOKEN AQUI MANUALMENTE
        setLoading(true)
        getUserAlerts() // <--- Llamada limpia sin argumentos
            .then(data => {
                setAlerts(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }
  }, [isAuthenticated, authLoading, router])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    
    try {
        await deleteAlert(id) // <--- Llamada limpia sin token
        setAlerts(prev => prev.filter(a => a.id !== id))
        toast({ title: "Alerta eliminada", className: "bg-emerald-50 text-emerald-800 border-emerald-200" })
    } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" })
    } finally {
        setDeletingId(null)
    }
  }

  // 3. RENDERIZADO
  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-emerald-600"/></div>
  }

    return (
        <div className="bg-background">
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
                        
                        {/* Imagen del Producto */}
                        <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {alert.product_image ? (
                                <img 
                                    src={alert.product_image.startsWith("/") ? alert.product_image : `/${alert.product_image}`} 
                                    alt={alert.product_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            )}
                        </div>

                        {/* Info Principal */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg">
                                    {alert.product_name || `Producto ${alert.product}`}
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
                                {/* Almacenamiento */}
                                {alert.target_storages?.length > 0 ? (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Almacenamiento: {alert.target_storages.join(", ")}GB
                                    </span>
                                ) : (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Almacenamiento: Cualquiera
                                    </span>
                                )}

                                {/* Color */}
                                {alert.target_colors?.length > 0 ? (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Color: {alert.target_colors.map(c => t(c)).join(", ")}
                                    </span>
                                ) : (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Color: Cualquiera
                                    </span>
                                )}

                                {/* Estado */}
                                {alert.target_conditions?.length > 0 ? (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Estado: {alert.target_conditions.map(c => t(c)).join(", ")}
                                    </span>
                                ) : (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Estado: Cualquiera
                                    </span>
                                )}

                                {/* Batería */}
                                {alert.battery_new !== null ? (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Batería: {alert.battery_new ? "Nueva" : "Estándar"}
                                    </span>
                                ) : (
                                    <span className="bg-secondary px-2 py-1 rounded">
                                        Batería: Cualquiera
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

      {/* --- ZONA DE PELIGRO --- */}
      <div className="mt-28 pt-6 border-t">
        <h3 className="text-sm font-semibold mb-6 text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Zona de Peligro
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* TARJETA 1: BAJA DE ALERTAS */}
            <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/20 dark:border-orange-900/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">
                        Detener Notificaciones
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Elimina todas tus alertas sin borrar tu cuenta.
                    </p>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-100 text-xs h-9">
                                Eliminar alertas
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esto eliminará tus {alerts.length} alertas activas.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleUnsubscribeAll} className="bg-orange-600 hover:bg-orange-700">
                                    Sí, eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

            {/* TARJETA 2: ELIMINAR CUENTA */}
            <Card className="border-red-200 bg-red-50/30 dark:bg-red-950/20 dark:border-red-900/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
                        Eliminar Cuenta
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Borra permanentemente tu cuenta y todos tus datos.
                    </p>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-xs h-9">
                                Eliminar cuenta
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar cuenta permanentemente?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esto borrará tu usuario <strong>{user}</strong> y todos tus datos. No se puede deshacer.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                    Sí, eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  </div>
  )
}