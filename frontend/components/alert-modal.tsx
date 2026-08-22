//? MODAL PARA CREAR ALERTAS DE PRECIO (EN LA PÁGINA DE PRODUCTO)
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Loader2, Battery, BatteryFull } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { cn, getColorHex } from "@/lib/utils" // <--- Importamos getColorHex
import { createAlert } from "@/services/api"
import { t } from "@/lib/translations"
import { useAuth } from "@/context/auth-context" // <--- 1. Importar el cerebro
import { useRouter, useParams } from "next/navigation"
import { track } from "@/lib/analytics"
import { parseLocale, getLanguage, getCurrency, getMarket } from "@/lib/i18n"
import { formatCurrency } from "@/lib/format"


interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    specs: { storage: string; color: string }[]
  }
  currentConfig: {
    color: string
    storage: string
    condition: string
    batteryNew: boolean
    price: number
  }
}

export function AlertModal({ isOpen, onClose, product, currentConfig }: AlertModalProps) {
  const { user, isAuthenticated } = useAuth() // <--- 2. Sacar el usuario
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)
  const currency = getCurrency(locale)
  const currencySymbol = currency === "GBP" ? "£" : "€"
  const [loading, setLoading] = useState(false)

  // --- ESTADOS ---
  const [email, setEmail] = useState("")
  const [targetPrice, setTargetPrice] = useState(currentConfig.price.toString())

  const [selectedStorages, setSelectedStorages] = useState<string[]>([currentConfig.storage])
  const [selectedColors, setSelectedColors] = useState<string[]>([currentConfig.color])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([currentConfig.condition])
  const [selectedBattery, setSelectedBattery] = useState<string[]>(currentConfig.batteryNew ? ['new'] : ['standard'])

  const [anyStorage, setAnyStorage] = useState(false)
  const [anyColor, setAnyColor] = useState(false)
  const [anyCondition, setAnyCondition] = useState(false)
  const [anyBattery, setAnyBattery] = useState(false)

  // Definir estos antes de los useEffect
  const availableStorages = Array.from(new Set(product.specs.map(s => s.storage)))
  const availableColors = Array.from(new Set(product.specs.map(s => s.color)))
  const conditions = ["Fair", "Good", "Excellent", "Premium"]

  // Reset al abrir
  useEffect(() => {
    if (isOpen) {
      setTargetPrice(currentConfig.price.toString())
      setSelectedStorages([currentConfig.storage])
      setSelectedColors([currentConfig.color])
      setSelectedConditions([currentConfig.condition])
      setSelectedBattery(currentConfig.batteryNew ? ['new'] : ['standard'])
      
      setAnyStorage(false)
      setAnyColor(false)
      setAnyCondition(false)
      setAnyBattery(false)

      // CAMBIO AQUÍ:
      if (isAuthenticated && user) {
        setEmail(user) // Si está logueado, ponemos su email
      } else {
        setEmail("")   // Si no, lo limpiamos
      }
    }
  }, [isOpen, currentConfig, isAuthenticated, user])

  // Auto-marcar "Cualquiera" si se seleccionan todas las opciones
  useEffect(() => {
    // Almacenamiento: Si se seleccionaron todos, marcar "Cualquiera"
    if (selectedStorages.length === availableStorages.length && availableStorages.length > 0) {
      setAnyStorage(true)
      setSelectedStorages([])
    }
  }, [selectedStorages, availableStorages])

  useEffect(() => {
    // Color: Si se seleccionaron todos, marcar "Cualquiera"
    if (selectedColors.length === availableColors.length && availableColors.length > 0) {
      setAnyColor(true)
      setSelectedColors([])
    }
  }, [selectedColors, availableColors])

  useEffect(() => {
    // Condición: Si se seleccionaron todos, marcar "Cualquiera"
    if (selectedConditions.length === conditions.length && conditions.length > 0) {
      setAnyCondition(true)
      setSelectedConditions([])
    }
  }, [selectedConditions, conditions])

  useEffect(() => {
    // Batería: Si se seleccionaron ambas (nueva y estándar), marcar "Cualquiera"
    if (selectedBattery.length === 2) {
      setAnyBattery(true)
      setSelectedBattery([])
    }
  }, [selectedBattery])

  // Helpers
  const toggleSelection = (list: string[], item: string, setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  // Submit
  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({ title: t("missing_data", language), description: t("missing_data_desc", language), variant: "destructive" })
      return
    }

    setLoading(true)

    let batteryPayload: boolean | null = null
    if (!anyBattery) {
        const hasNew = selectedBattery.includes('new')
        const hasStd = selectedBattery.includes('standard')
        if (hasNew && hasStd) batteryPayload = null
        else if (hasNew) batteryPayload = true
        else if (hasStd) batteryPayload = false
    }

    try {
      await createAlert({
        email,
        price_threshold: Number(targetPrice),
        product_id: product.id,
        country: 'ES',
        market_code: getMarket(locale),
        target_colors: anyColor ? [] : selectedColors,
        target_storages: anyStorage ? [] : selectedStorages,
        target_conditions: anyCondition ? [] : selectedConditions,
        battery_new: batteryPayload
      })

      track('alert_created', {
        price_threshold: Number(targetPrice),
        storages: anyStorage ? 'any' : selectedStorages.join('/'),
        colors: anyColor ? 'any' : selectedColors.join('/'),
        conditions: anyCondition ? 'any' : selectedConditions.join('/'),
        battery: batteryPayload === null ? 'any' : batteryPayload ? 'new' : 'standard',
      })

      toast({
        title: t("alert_created", language),
        description: t("alert_created_desc", language, { email }),
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
        action: (
          <ToastAction altText="Ir a mi panel" onClick={() => router.push(`/${locale}/dashboard`)}>
            {t("go_to_dashboard", language)}
          </ToastAction>
        )
      })
      onClose()
      setEmail("")
    } catch (error) {
      console.error(error)
      toast({ title: t("error", language), description: t("could_not_save_alert", language), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Helper para descripción del resumen - Incluye batería
  const getAlertDescription = () => {
    const parts = []

    // Almacenamiento (Suele ser igual en ambos idiomas, ej: 128GB)
    parts.push(anyStorage ? t("any_storage", language) : selectedStorages.join("/"))

    // Color: Usamos .map(c => t(c, language)) para convertir ["Blue", "Red"] en "Azul/Rojo"
    parts.push(anyColor ? t("any_color", language) : selectedColors.map(c => t(c, language)).join("/"))

    // Estado: Convertimos ["Fair"] en "Correcto"
    parts.push(anyCondition ? t("any_condition", language) : selectedConditions.map(c => t(c, language)).join("/"))
    
    // Batería
    if (anyBattery) {
      parts.push(t("any_battery", language))
    } else {
      // Simplificamos la lógica usando map y el traductor
      // Si selectedBattery es ['new', 'standard'] -> mostrará "Nueva/Estándar"
      const batteryLabels = selectedBattery.map(b => t(b, language))
      parts.push(batteryLabels.join("/"))
    }

    return parts.join(" + ")
  }

  // Validar que todos los campos tengan algo seleccionado
  const isFormValid = () => {
    if (!email || !targetPrice) return false
    if (!anyStorage && selectedStorages.length === 0) return false
    if (!anyColor && selectedColors.length === 0) return false
    if (!anyCondition && selectedConditions.length === 0) return false
    if (!anyBattery && selectedBattery.length === 0) return false
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-h-[90vh] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-emerald-700">
            <Bell className="h-5 w-5" />
            {t("create_price_alert", language)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          
          {/* 1. HEADER DEL PRODUCTO (Estilo v0) */}
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4 border border-border">
            <div>
              <p className="font-semibold text-lg">{product.name}</p>
              <p className="text-sm text-muted-foreground">{t("configure_prefs_hint", language)}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">{t("current_price", language)}</p>
                <p className="font-bold text-lg">{formatCurrency(currentConfig.price, currency, language)}</p>
            </div>
          </div>

          {/* 2. INPUTS DE EMAIL Y PRECIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">{t("your_email", language)}</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="hola@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // CAMBIO AQUÍ: Si está autenticado, deshabilitamos el campo y le bajamos la opacidad
                    disabled={isAuthenticated} 
                    className={cn(isAuthenticated && "bg-muted text-muted-foreground opacity-100 cursor-not-allowed")}
                />
                {/* Opcional: Mensaje pequeño para que sepa por qué está bloqueado */}
                {/*
                {isAuthenticated && (
                  <p className="text-xs text-muted-foreground">Sesión iniciada como {user}</p>
                )}
                */}
            </div>
            {/* Precio con símbolo de moneda dinámico */}
            <div className="space-y-2">
                <Label htmlFor="price">{t("notify_if_below", language)}</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                    <Input 
                        id="price" 
                        type="number" 
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="pl-8 font-semibold" 
                    />
                </div>
            </div>
          </div>

          {/* 3. ALMACENAMIENTO (Estilo Pill) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{t("storage", language)}</p>
              <div className="flex items-center gap-2">
                <Checkbox id="any-storage" checked={anyStorage} onCheckedChange={(c) => setAnyStorage(!!c)} className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"/>
                <Label htmlFor="any-storage" className="text-sm text-muted-foreground cursor-pointer">{t("any", language)}</Label>
              </div>
            </div>
            {!anyStorage && (
              <div className="flex flex-wrap gap-2">
                {availableStorages.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => toggleSelection(selectedStorages, storage, setSelectedStorages)}
                    className={cn(
                      "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                      selectedStorages.includes(storage)
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-border bg-transparent hover:border-emerald-600/50"
                    )}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            )}
            {anyStorage && (
              <p className="text-sm text-muted-foreground italic">{t("any_storage", language)}</p>
            )}
          </div>

          {/* 4. COLOR (Estilo Círculos) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{t("color", language)}</p>
              <div className="flex items-center gap-2">
                <Checkbox id="any-color" checked={anyColor} onCheckedChange={(c) => setAnyColor(!!c)} className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"/>
                <Label htmlFor="any-color" className="text-sm text-muted-foreground cursor-pointer">{t("any", language)}</Label>
              </div>
            </div>
            {!anyColor && (
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleSelection(selectedColors, color, setSelectedColors)}
                    className={cn(
                      "h-11 w-11 rounded-full border-2 transition-all hover:scale-110",
                      selectedColors.includes(color)
                        ? "border-emerald-600 ring-2 ring-emerald-600 ring-offset-2 ring-offset-background"
                        : "border-border opacity-60 hover:opacity-100"
                    )}
                    style={{ backgroundColor: getColorHex(color) }}
                    title={t(color, language)}
                  />
                ))}
              </div>
            )}
            {anyColor && (
              <p className="text-sm text-muted-foreground italic">{t("any_color", language)}</p>
            )}
            {!anyColor && selectedColors.length > 0 && (
                <p className="text-xs text-muted-foreground">{t("selected_suffix", language, { values: selectedColors.map(c => t(c, language)).join(", ") })}</p>
            )}
          </div>

          {/* 5. ESTADO (Estilo Pill) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{t("condition", language)}</p>
              <div className="flex items-center gap-2">
                <Checkbox id="any-cond" checked={anyCondition} onCheckedChange={(c) => setAnyCondition(!!c)} className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"/>
                <Label htmlFor="any-cond" className="text-sm text-muted-foreground cursor-pointer">{t("any", language)}</Label>
              </div>
            </div>
            {!anyCondition && (
              <div className="flex flex-wrap gap-2">
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => toggleSelection(selectedConditions, cond, setSelectedConditions)}
                    className={cn(
                      "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                      selectedConditions.includes(cond)
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-border bg-transparent hover:border-emerald-600/50"
                    )}
                  >
                    {t(cond, language)}
                  </button>
                ))}
              </div>
            )}
            {anyCondition && (
              <p className="text-sm text-muted-foreground italic">{t("any_condition", language)}</p>
            )}
          </div>

          {/* 6. BATERÍA */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{t("battery", language)}</p>
              <div className="flex items-center gap-2">
                <Checkbox id="any-batt" checked={anyBattery} onCheckedChange={(c) => setAnyBattery(!!c)} className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"/>
                <Label htmlFor="any-batt" className="text-sm text-muted-foreground cursor-pointer">{t("any", language)}</Label>
              </div>
            </div>
            {!anyBattery && (
              <div className="flex flex-wrap gap-2">
                 <button
                    onClick={() => toggleSelection(selectedBattery, 'standard', setSelectedBattery)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                      selectedBattery.includes('standard')
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <Battery className="h-4 w-4" /> {t("standard", language)}
                  </button>
                  <button
                    onClick={() => toggleSelection(selectedBattery, 'new', setSelectedBattery)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                      selectedBattery.includes('new')
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <BatteryFull className="h-4 w-4" /> {t("new", language)} (100%)
                  </button>
              </div>
            )}
            {anyBattery && (
              <p className="text-sm text-muted-foreground italic">{t("any_battery", language)}</p>
            )}
          </div>

          {/* 7. RESUMEN VERDE (Estilo v0) */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
<p className="text-emerald-800 dark:text-emerald-200">
               <span className="font-medium">{t("summary_label", language)}</span>{" "}
               {t("notify_to", language, {
                 email: email || "...",
                 description: getAlertDescription(),
                 price: formatCurrency(Number(targetPrice), currency, language),
               })}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent min-h-12 sm:min-h-0" onClick={onClose}>{t("cancel", language)}</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !isFormValid()}
              className="flex-1 min-h-12 sm:min-h-0 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Bell className="mr-2 h-4 w-4" />
              {t("create_alert", language)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}