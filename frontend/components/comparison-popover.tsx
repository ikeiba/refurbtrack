"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Loader2 } from "lucide-react"
import { getProducts, getProductDetail } from "@/services/api"
import type { ProductSummary, ProductDetail, Offer } from "@/lib/types"

interface ComparisonPopoverProps {
  onCompare: (offer: Offer, label: string) => void
}

export function ComparisonPopover({ onCompare }: ComparisonPopoverProps) {
  const [open, setOpen] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Datos
  const [productList, setProductList] = useState<ProductSummary[]>([])
  const [targetProduct, setTargetProduct] = useState<ProductDetail | null>(null)

  // Selecciones
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [color, setColor] = useState<string>("") // <--- NUEVO
  const [storage, setStorage] = useState<string>("")
  const [condition, setCondition] = useState<string>("Good")
  const [batteryNew, setBatteryNew] = useState<string>("false")

  // 1. Cargar lista al abrir
  useEffect(() => {
    if (open && productList.length === 0) {
      setLoadingList(true)
      getProducts().then(setProductList).finally(() => setLoadingList(false))
    }
  }, [open, productList.length])

  // 2. Cargar detalles al elegir producto
  const handleProductChange = async (productId: string) => {
    setSelectedProductId(productId)
    setLoadingDetails(true)
    setTargetProduct(null)
    setColor("")
    setStorage("")

    try {
      const details = await getProductDetail(productId)
      setTargetProduct(details as unknown as ProductDetail)
      
      // Preseleccionar primer color disponible
      if (details.specs.length > 0) {
        setColor(details.specs[0].color)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingDetails(false)
    }
  }

  // 3. Confirmar
  const handleConfirm = () => {
    if (!targetProduct) return

    // Buscar la Spec exacta (Color + Almacenamiento)
    const targetSpec = targetProduct.specs.find(s => s.color === color && s.storage === storage)
    
    if (!targetSpec) {
        alert("Esa combinación de Color/GB no existe.")
        return
    }

    // Buscar Oferta
    const isNewBatt = batteryNew === "true"
    const targetOffer = targetSpec.offers.find(
      o => o.condition === condition && o.battery_new === isNewBatt
    )

    if (targetOffer) {
      const battLabel = isNewBatt ? "(Bat. Nueva)" : ""
      // Etiqueta completa con color
      const label = `${targetProduct.name} ${color} ${storage}GB - ${condition} ${battLabel}`.trim()
      
      onCompare(targetOffer, label)
      setOpen(false)
    } else {
      alert("No hay datos para esta combinación.")
    }
  }

  // Listas dinámicas para los selects
  const availableColors = targetProduct 
    ? Array.from(new Set(targetProduct.specs.map(s => s.color)))
    : []

  // Filtramos almacenamientos disponibles SOLO para el color seleccionado
  const availableStorages = targetProduct && color
    ? Array.from(new Set(targetProduct.specs.filter(s => s.color === color).map(s => s.storage)))
    : []
  
  // Efecto: Cuando cambia el color, preseleccionar primer almacenamiento válido
  useEffect(() => {
    if (availableStorages.length > 0 && !availableStorages.includes(storage)) {
      setStorage(availableStorages[0])
    }
  }, [color, availableStorages, storage])


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 border-dashed">
          <Plus className="w-4 h-4" />
          Añadir Comparación
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[90vh] overflow-y-auto" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Comparar precios</h4>
            <p className="text-sm text-muted-foreground">Añade otra línea al gráfico.</p>
          </div>
          
          <div className="grid gap-3">
            {/* 1. Producto */}
            <div className="grid gap-1.5">
              <Label>Modelo</Label>
              <Select value={selectedProductId} onValueChange={handleProductChange}>
                <SelectTrigger><SelectValue placeholder={loadingList ? "Cargando..." : "Seleccionar"} /></SelectTrigger>
                <SelectContent>
                  {productList.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {loadingDetails && <div className="flex gap-2 items-center text-sm text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin"/> Cargando opciones...</div>}

            {targetProduct && !loadingDetails && (
                <>
                    {/* 2. Color (NUEVO) */}
                    <div className="grid gap-1.5">
                        <Label>Color</Label>
                        <Select value={color} onValueChange={setColor}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {availableColors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 3. Capacidad */}
                    <div className="grid gap-1.5">
                        <Label>Capacidad</Label>
                        <Select value={storage} onValueChange={setStorage}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {availableStorages.map(s => <SelectItem key={s} value={s}>{s} GB</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 4. Estado */}
                    <div className="grid gap-1.5">
                        <Label>Estado</Label>
                        <Select value={condition} onValueChange={setCondition}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {["Fair", "Good", "Excellent", "Premium"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 5. Batería */}
                    <div className="grid gap-1.5">
                        <Label>Batería</Label>
                        <Select value={batteryNew} onValueChange={setBatteryNew}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="false">Estándar</SelectItem>
                                <SelectItem value="true">Nueva (100%)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleConfirm} className="w-full mt-2">Ver en gráfico</Button>
                </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}