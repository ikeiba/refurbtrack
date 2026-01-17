"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Loader2, Battery, BatteryFull } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { createAlert } from "@/services/api"
import type { ProductDetail } from "@/lib/types"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductDetail
  // Configuración actual para pre-rellenar
  currentConfig: {
    color: string
    storage: string
    condition: string
    batteryNew: boolean
    price: number
  }
}

export function AlertModal({ isOpen, onClose, product, currentConfig }: AlertModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // --- ESTADOS DEL FORMULARIO ---
  const [email, setEmail] = useState("")
  const [targetPrice, setTargetPrice] = useState(currentConfig.price.toString())

  // --- ESTADOS DE SELECCIÓN FLEXIBLE ---
  // Inicializamos con la selección actual del usuario
  const [selectedStorages, setSelectedStorages] = useState<string[]>([currentConfig.storage])
  const [selectedColors, setSelectedColors] = useState<string[]>([currentConfig.color])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([currentConfig.condition])
  // Usamos strings 'new'/'standard' para la UI de batería
  const [selectedBattery, setSelectedBattery] = useState<string[]>(currentConfig.batteryNew ? ['new'] : ['standard'])

  // Checkboxes "ANY" (Me da igual)
  const [anyStorage, setAnyStorage] = useState(false)
  const [anyColor, setAnyColor] = useState(false)
  const [anyCondition, setAnyCondition] = useState(false)
  const [anyBattery, setAnyBattery] = useState(false)

  // Resetear formulario cuando se abre el modal o cambia la config
  useEffect(() => {
    if (isOpen) {
      setTargetPrice(currentConfig.price.toString())
      setSelectedStorages([currentConfig.storage])
      setSelectedColors([currentConfig.color])
      setSelectedConditions([currentConfig.condition])
      setSelectedBattery(currentConfig.batteryNew ? ['new'] : ['standard'])
      
      // Por defecto desactivamos los "Any" para ser específicos, 
      // pero el usuario puede activarlos
      setAnyStorage(false)
      setAnyColor(false)
      setAnyCondition(false)
      setAnyBattery(false)
    }
  }, [isOpen, currentConfig])

  // --- HELPERS PARA TOGGLES ---
  const toggleSelection = (list: string[], item: string, setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  // --- OBTENER OPCIONES DISPONIBLES DEL PRODUCTO ---
  // Extraemos todas las opciones únicas que existen en las specs de este producto
  const availableStorages = Array.from(new Set(product.specs.map(s => s.storage)))
  const availableColors = Array.from(new Set(product.specs.map(s => s.color)))
  const conditions = ["Fair", "Good", "Excellent", "Premium"] // Estándar de BackMarket

  // --- ENVÍO DEL FORMULARIO ---
  const handleSubmit = async () => {
    if (!email || !targetPrice) {
      toast({ title: "Faltan datos", description: "Introduce tu email y un precio.", variant: "destructive" })
      return
    }

    setLoading(true)

    // LÓGICA DE MAPEO: UI -> BACKEND
    // Si "Any" está marcado, enviamos lista vacía []. Si no, la lista seleccionada.
    
    // Mapeo especial para batería
    let batteryPayload: boolean | null = null
    if (anyBattery) {
        batteryPayload = null
    } else {
        const hasNew = selectedBattery.includes('new')
        const hasStd = selectedBattery.includes('standard')
        
        if (hasNew && hasStd) batteryPayload = null // Si marca las dos, es como "Any"
        else if (hasNew) batteryPayload = true
        else if (hasStd) batteryPayload = false
        // Si no marca nada, asumimos null o podríamos bloquear
    }

    try {
      await createAlert({
        email,
        price_threshold: Number(targetPrice),
        product_id: product.id,
        country: 'ES',
        // Backend espera listas vacías para "Cualquiera"
        target_colors: anyColor ? [] : selectedColors,
        target_storages: anyStorage ? [] : selectedStorages,
        target_conditions: anyCondition ? [] : selectedConditions,
        battery_new: batteryPayload
      })

      toast({
        title: "¡Alerta Creada!",
        description: `Te avisaremos en ${email} cuando baje de ${targetPrice}€`,
        className: "bg-emerald-50 border-emerald-200 text-emerald-800"
      })
      onClose()
      setEmail("") // Limpiar email para privacidad (o déjalo si prefieres UX)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "No se pudo guardar la alerta.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // --- DESCRIPCIÓN DINÁMICA (Resumen) ---
  const getSummary = () => {
    const parts = []
    if (anyStorage) parts.push("cualquier capacidad")
    else parts.push(selectedStorages.join("/"))
    
    if (anyColor) parts.push("cualquier color")
    
    if (anyCondition) parts.push("cualquier estado")
    else parts.push(selectedConditions.join("/"))

    return parts.join(" + ")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bell className="h-5 w-5 text-primary" />
            Crear Alerta Flexible
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Header del Producto */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 border">
            <div className="flex-1">
              <p className="font-bold text-lg">{product.name}</p>
              <p className="text-sm text-muted-foreground">Configura los filtros exactos que buscas.</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">Actual</p>
                <p className="font-bold text-lg">{currentConfig.price}€</p>
            </div>
          </div>

          {/* Inputs Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Avisar si baja de (€)</Label>
                <Input 
                    id="price" 
                    type="number" 
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                />
            </div>
          </div>

          {/* SELECCIÓN 1: ALMACENAMIENTO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Almacenamiento</p>
              <div className="flex items-center gap-2">
                <Checkbox id="any-storage" checked={anyStorage} onCheckedChange={(c) => setAnyStorage(!!c)} />
                <Label htmlFor="any-storage" className="text-sm text-muted-foreground cursor-pointer">Me da igual</Label>
              </div>
            </div>
            {!anyStorage && (
              <div className="flex flex-wrap gap-2">
                {availableStorages.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => toggleSelection(selectedStorages, storage, setSelectedStorages)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm font-medium transition-all",
                      selectedStorages.includes(storage)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-transparent hover:bg-muted",
                    )}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SELECCIÓN 2: COLOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Color</p>
              <div className="flex items-center gap-2">
                <Checkbox id="any-color" checked={anyColor} onCheckedChange={(c) => setAnyColor(!!c)} />
                <Label htmlFor="any-color" className="text-sm text-muted-foreground cursor-pointer">Me da igual</Label>
              </div>
            </div>
            {!anyColor && (
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleSelection(selectedColors, color, setSelectedColors)}
                    className={cn(
                      "rounded-full border px-4 py-1 text-sm font-medium transition-all",
                      selectedColors.includes(color)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-transparent hover:bg-muted",
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SELECCIÓN 3: ESTADO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Estado</p>
              <div className="flex items-center gap-2">
                <Checkbox id="any-cond" checked={anyCondition} onCheckedChange={(c) => setAnyCondition(!!c)} />
                <Label htmlFor="any-cond" className="text-sm text-muted-foreground cursor-pointer">Me da igual</Label>
              </div>
            </div>
            {!anyCondition && (
              <div className="flex flex-wrap gap-2">
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => toggleSelection(selectedConditions, cond, setSelectedConditions)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm font-medium transition-all",
                      selectedConditions.includes(cond)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-transparent hover:bg-muted",
                    )}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SELECCIÓN 4: BATERÍA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Batería</p>
              <div className="flex items-center gap-2">
                <Checkbox id="any-batt" checked={anyBattery} onCheckedChange={(c) => setAnyBattery(!!c)} />
                <Label htmlFor="any-batt" className="text-sm text-muted-foreground cursor-pointer">Me da igual</Label>
              </div>
            </div>
            {!anyBattery && (
              <div className="flex flex-wrap gap-2">
                 <button
                    onClick={() => toggleSelection(selectedBattery, 'standard', setSelectedBattery)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-all",
                      selectedBattery.includes('standard')
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-muted",
                    )}
                  >
                    <Battery className="h-4 w-4" /> Estándar
                  </button>
                  <button
                    onClick={() => toggleSelection(selectedBattery, 'new', setSelectedBattery)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-all",
                      selectedBattery.includes('new')
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-muted",
                    )}
                  >
                    <BatteryFull className="h-4 w-4" /> Nueva (100%)
                  </button>
              </div>
            )}
          </div>

          {/* RESUMEN */}
          <div className="rounded-lg border bg-muted/40 p-4 text-sm">
            <span className="font-semibold text-primary">Resumen: </span>
            Avisar a <b>{email || "..."}</b> si baja de <b>{targetPrice}€</b> buscando: <br/>
            <span className="text-muted-foreground italic">{getSummary()}</span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={loading || !email}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Alerta
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}