//? POPOVER PARA AÑADIR LÍNEAS DE COMPARACIÓN AL GRÁFICO (EN LA PÁGINA DE PRODUCTO)
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Loader2 } from "lucide-react"
import { getProducts, getProductDetail } from "@/services/api"
import type { ProductSummary, ProductDetail, Offer } from "@/lib/types"
import { t } from "@/lib/translations" // <--- 1. IMPORTAR TRADUCTOR
import { useParams } from "next/navigation"
import { parseLocale, getLanguage } from "@/lib/i18n"

interface ComparisonPopoverProps {
  onCompare: (offer: Offer, label: string) => void
}

export function ComparisonPopover({ onCompare }: ComparisonPopoverProps) {
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)

  const [open, setOpen] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Datos
  const [productList, setProductList] = useState<ProductSummary[]>([])
  const [targetProduct, setTargetProduct] = useState<ProductDetail | null>(null)

  // Selecciones
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [color, setColor] = useState<string>("") 
  const [storage, setStorage] = useState<string>("")
  const [condition, setCondition] = useState<string>("Good") // Interno: Inglés
  const [batteryNew, setBatteryNew] = useState<string>("false")

  // 1. Cargar lista al abrir
  useEffect(() => {
    if (open && productList.length === 0) {
      setLoadingList(true)
      getProducts(locale).then(setProductList).finally(() => setLoadingList(false))
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
      const details = await getProductDetail(productId, locale)
      setTargetProduct(details as unknown as ProductDetail)
      
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

    const targetSpec = targetProduct.specs.find(s => s.color === color && s.storage === storage)
    
    if (!targetSpec) {
        alert(t("combination_not_found", language))
        return
    }

    const isNewBatt = batteryNew === "true"
    const targetOffer = targetSpec.offers.find(
      o => o.condition === condition && o.battery_new === isNewBatt
    )

    if (targetOffer) {
      // Usamos t() para que la leyenda del gráfico diga "Azul" y "Correcto"
      const battLabel = isNewBatt ? `(${t("new", language)})` : ""
      const label = `${targetProduct.name} ${t(color, language)} ${storage}GB - ${t(condition, language)} ${battLabel}`.trim()
      
      onCompare(targetOffer, label)
      setOpen(false)
    } else {
      alert(t("no_data_combination", language))
    }
  }

  const availableColors = targetProduct 
    ? Array.from(new Set(targetProduct.specs.map(s => s.color)))
    : []

  const availableStorages = targetProduct && color
    ? Array.from(new Set(targetProduct.specs.filter(s => s.color === color).map(s => s.storage)))
    : []
  
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
          {t("add_comparison", language)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[90vh] overflow-y-auto" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t("compare_prices", language)}</h4>
            <p className="text-sm text-muted-foreground">{t("add_line_hint", language)}</p>
          </div>
          
          <div className="grid gap-3">
            {/* 1. Producto */}
            <div className="grid gap-1.5">
              <Label>{t("model_label", language)}</Label>
              <Select value={selectedProductId} onValueChange={handleProductChange}>
                <SelectTrigger><SelectValue placeholder={loadingList ? t("loading", language) : t("select", language)} /></SelectTrigger>
                <SelectContent>
                  {productList.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {loadingDetails && <div className="flex gap-2 items-center text-sm text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin"/> {t("loading_options", language)}</div>}

            {targetProduct && !loadingDetails && (
                <>
                    {/* 2. Color */}
                    <div className="grid gap-1.5">
                        <Label>{t("color", language)}</Label>
                        <Select value={color} onValueChange={setColor}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {availableColors.map(c => (
                                  // 3. TRADUCCIÓN VISUAL: Value=Inglés ("Blue"), Texto=Español ("Azul")
                                  <SelectItem key={c} value={c}>{t(c, language)}</SelectItem> 
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 3. Capacidad */}
                    <div className="grid gap-1.5">
                        <Label>{t("capacity", language)}</Label>
                        <Select value={storage} onValueChange={setStorage}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {availableStorages.map(s => <SelectItem key={s} value={s}>{s} GB</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 4. Estado */}
                    <div className="grid gap-1.5">
                        <Label>{t("condition", language)}</Label>
                        <Select value={condition} onValueChange={setCondition}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {["Fair", "Good", "Excellent", "Premium"].map(c => (
                                  // 3. TRADUCCIÓN VISUAL
                                  <SelectItem key={c} value={c}>{t(c, language)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 5. Batería */}
                    <div className="grid gap-1.5">
                        <Label>{t("battery", language)}</Label>
                        <Select value={batteryNew} onValueChange={setBatteryNew}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {/* 3. TRADUCCIÓN VISUAL usando claves del diccionario */}
                                <SelectItem value="false">{t("standard", language)}</SelectItem>
                                <SelectItem value="true">{t("new", language)}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleConfirm} className="w-full mt-2">{t("view_on_chart", language)}</Button>
                </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}