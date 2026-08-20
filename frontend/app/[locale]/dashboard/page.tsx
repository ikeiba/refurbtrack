"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { getUserAlerts, deleteAlert } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Bell, ExternalLink, ArrowRight, Activity, ShoppingCart, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { t } from "@/lib/translations"
import { type AlertItem } from "@/lib/types"
import { API_URL } from "@/services/api"
import { parseLocale, getLanguage, getCurrency } from "@/lib/i18n"
import { formatCurrency } from "@/lib/format"

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
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)
  const currency = getCurrency(locale)

  const handleHeaderSearch = (query: string) => {
    const trimmed = query.trim()
    router.push(trimmed ? `/${locale}?q=${encodeURIComponent(trimmed)}` : `/${locale}`)
  }

  // 2. FUNCIONES MANEJADORAS
  const handleUnsubscribeAll = async () => {
    try {
        await unsubscribeAllAlerts()
        setAlerts([]) // Limpiamos la lista visualmente
        toast({ title: t("unsubscribe_completed", language), description: t("unsubscribed_all", language) })
    } catch (error) {
        toast({ title: t("error", language), description: t("could_not_process", language), variant: "destructive" })
    }
  }

  const handleDeleteAccount = async () => {
    try {
        await deleteUserAccount()
        // Forzamos logout manual
        localStorage.clear()
        window.location.href = "/" // Redirigir a home recargando
    } catch (error) {
        toast({ title: t("error", language), description: t("could_not_delete_account", language), variant: "destructive" })
    }
  }

  // 1. CARGAR DATOS
  useEffect(() => {
    // Si termina de cargar auth y no está logueado, fuera
    if (!authLoading && !isAuthenticated) {
        router.push(`/${locale}/login`)
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
        toast({ title: t("alert_deleted", language), className: "bg-emerald-50 text-emerald-800 border-emerald-200" })
    } catch (error) {
        toast({ title: t("error", language), description: t("could_not_delete", language), variant: "destructive" })
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
            <h1 className="text-3xl font-bold tracking-tight">{t("my_panel", language)}</h1>
            <p className="text-muted-foreground">{t("manage_alerts_for", language, { user })}</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        // --- ESTADO VACÍO ---
        <Card className="border-dashed border-2 py-12 text-center bg-muted/20">
            <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Bell className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold">{t("no_active_alerts", language)}</h3>
                <p className="text-muted-foreground max-w-sm">
                    {t("no_active_alerts_desc", language)}
                </p>
                <Link href={`/${locale}`}>
                    <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                        {t("explore_products", language)} <ArrowRight className="ml-2 h-4 w-4" />
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
                                    {t("active", language)}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">
                                {t("notify_drop_below", language, { price: formatCurrency(alert.price_threshold, currency, language) })}
                            </p>
                            
                            {/* Filtros aplicados */}
                            <div className="flex flex-wrap gap-2 text-xs">
                                {/* Almacenamiento */}
                                <span className="bg-secondary px-2 py-1 rounded">
                                    {t("storage_suffix", language, { values: alert.target_storages?.length > 0 ? `${alert.target_storages.join(", ")}GB` : t("any", language) })}
                                </span>

                                {/* Color */}
                                <span className="bg-secondary px-2 py-1 rounded">
                                    {t("color_suffix", language, { values: alert.target_colors?.length > 0 ? alert.target_colors.map((c: string) => t(c, language)).join(", ") : t("any", language) })}
                                </span>

                                {/* Estado */}
                                <span className="bg-secondary px-2 py-1 rounded">
                                    {t("condition_suffix", language, { values: alert.target_conditions?.length > 0 ? alert.target_conditions.map((c: string) => t(c, language)).join(", ") : t("any", language) })}
                                </span>

                                {/* Batería */}
                                <span className="bg-secondary px-2 py-1 rounded">
                                    {t("battery_suffix", language, { values: alert.battery_new !== null ? (alert.battery_new ? t("new", language) : t("standard", language)) : t("any", language) })}
                                </span>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            {/* BOTÓN 1: VER EN TU WEB (Gráficos y Datos) */}
                            <Link 
                                href={`/${locale}${alert.target_path}`}
                                className="w-full sm:w-auto"
                            >
                                <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-9">
                                    <Activity className="h-3.5 w-3.5" />
                                    {t("history", language)}
                                </Button>
                            </Link>

                            {/* BOTÓN 2: COMPRAR (Ruta externa gestionada por Django) */}
                            <a 
                                // Usamos la API_URL que configuramos en el api.ts para que el clic
                                // vaya directo al contenedor de Django y registre la telemetría
                                href={`${API_URL.replace('/api', '')}${alert.target_affiliate_url}`} 
                                target="_blank" 
                                rel="sponsored noopener"
                                className="w-full sm:w-auto"
                            >
                                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 text-xs h-9">
                                <ShoppingCart className="h-3.5 w-3.5" />
                                {t("buy", language)}
                                </Button>
                            </a>
                            
                            {/* BOTÓN 3: BORRAR (Ghost) */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-red-500 h-9 w-9"
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
            {t("danger_zone", language)}
        </h3>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* TARJETA 1: BAJA DE ALERTAS */}
            <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/20 dark:border-orange-900/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">
                        {t("stop_notifications", language)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {t("stop_notifications_desc", language)}
                    </p>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-100 text-xs h-9">
                                {t("delete_alerts", language)}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("are_you_sure", language)}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("will_delete_n_alerts", language, { count: alerts.length })}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("cancel", language)}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleUnsubscribeAll} className="bg-orange-600 hover:bg-orange-700">
                                    {t("yes_delete", language)}
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
                        {t("delete_account", language)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {t("delete_account_desc", language)}
                    </p>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-xs h-9">
                                {t("delete_account", language)}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("delete_account_confirm", language)}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("delete_account_confirm_desc", language, { user })}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t("cancel", language)}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                    {t("yes_delete", language)}
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