"use client"

import { useState, useEffect } from "react"
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Bell,
  GitCompare,
  X,
  Check,
  ExternalLink,
  Battery,
  BatteryFull,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"
import { mockProducts, storageOptions, colorOptions, conditions, batteryHealthOptions } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { ImageCarousel } from "@/components/image-carousel"

interface PriceHistoryModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function PriceHistoryModal({ product, isOpen, onClose }: PriceHistoryModalProps) {
  const { toast } = useToast()
  const [selectedVariant, setSelectedVariant] = useState<{
    storage: string
    color: string
    colorHex: string
  } | null>(null)

  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertPrice, setAlertPrice] = useState("")

  const [selectedStorages, setSelectedStorages] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedBatteryHealth, setSelectedBatteryHealth] = useState<string[]>([])
  const [anyStorage, setAnyStorage] = useState(false)
  const [anyColor, setAnyColor] = useState(false)
  const [anyCondition, setAnyCondition] = useState(false)
  const [anyBattery, setAnyBattery] = useState(false)

  const [compareMode, setCompareMode] = useState(false)
  const [compareProduct, setCompareProduct] = useState<Product | null>(null)
  const [compareSearchOpen, setCompareSearchOpen] = useState(false)

  useEffect(() => {
    if (product) {
      setSelectedVariant({
        storage: product.storage,
        color: product.color,
        colorHex: product.colorHex,
      })
      setAlertPrice(String(product.price))
      setCompareMode(false)
      setCompareProduct(null)
    }
  }, [product])

  useEffect(() => {
    if (showAlertModal && product) {
      setSelectedStorages([product.storage])
      setSelectedColors([product.color])
      setSelectedConditions([product.condition])
      setSelectedBatteryHealth(product.newBattery ? ["new"] : ["default"])
      setAnyStorage(false)
      setAnyColor(false)
      setAnyCondition(false)
      setAnyBattery(false)
    }
  }, [showAlertModal, product])

  if (!product) return null

  const priceHistory = product.priceHistory
  const minPrice = Math.min(...priceHistory.map((p) => p.price))
  const maxPrice = Math.max(...priceHistory.map((p) => p.price))
  const currentPrice = priceHistory[priceHistory.length - 1]?.price ?? product.price
  const previousPrice = priceHistory[priceHistory.length - 2]?.price ?? currentPrice
  const trend = currentPrice < previousPrice ? "down" : currentPrice > previousPrice ? "up" : "stable"

  const uniqueStorages = [...new Set(product.variants.map((v) => v.storage))]
  const uniqueColors = product.variants
    .filter((v) => v.storage === selectedVariant?.storage)
    .map((v) => ({ color: v.color, colorHex: v.colorHex }))
    .filter((v, i, arr) => arr.findIndex((a) => a.color === v.color) === i)

  const selectedVariantPrice =
    product.variants.find((v) => v.storage === selectedVariant?.storage && v.color === selectedVariant?.color)?.price ??
    product.price

  const toggleStorage = (storage: string) => {
    setSelectedStorages((prev) => (prev.includes(storage) ? prev.filter((s) => s !== storage) : [...prev, storage]))
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  const toggleBattery = (battery: string) => {
    setSelectedBatteryHealth((prev) =>
      prev.includes(battery) ? prev.filter((b) => b !== battery) : [...prev, battery],
    )
  }

  const getAlertDescription = () => {
    const parts: string[] = [product.model]

    if (!anyStorage) {
      parts.push(selectedStorages.length > 1 ? `(${selectedStorages.join(" or ")})` : selectedStorages[0] || "")
    }
    if (!anyColor) {
      parts.push(selectedColors.length > 1 ? `(${selectedColors.join(" or ")})` : selectedColors[0] || "")
    }

    let desc = parts.filter(Boolean).join(" ")

    const wildcards: string[] = []
    if (anyStorage) wildcards.push("any storage")
    if (anyColor) wildcards.push("any color")
    if (anyCondition) wildcards.push("any condition")
    if (anyBattery) wildcards.push("any battery")

    if (wildcards.length > 0) {
      desc += ` (${wildcards.join(", ")})`
    } else {
      const specifics: string[] = []
      if (selectedConditions.length > 0 && selectedConditions.length < conditions.length) {
        specifics.push(selectedConditions.join("/"))
      }
      if (selectedBatteryHealth.length > 0 && selectedBatteryHealth.length < 2) {
        specifics.push(selectedBatteryHealth.includes("new") ? "new battery" : "original battery")
      }
      if (specifics.length > 0) {
        desc += ` - ${specifics.join(", ")}`
      }
    }

    return desc
  }

  const handleSetAlert = () => {
    toast({
      title: "Price Alert Set",
      description: `We'll notify you when ${getAlertDescription()} drops below €${alertPrice}`,
    })
    setShowAlertModal(false)
  }

  const comparableProducts = mockProducts.filter((p) => p.id !== product.id)

  const getMergedChartData = () => {
    if (!compareProduct) {
      return priceHistory.map((p) => ({ date: p.date, price1: p.price }))
    }

    const dateMap = new Map<string, { price1?: number; price2?: number }>()

    priceHistory.forEach((p) => {
      dateMap.set(p.date, { ...dateMap.get(p.date), price1: p.price })
    })

    compareProduct.priceHistory.forEach((p) => {
      dateMap.set(p.date, { ...dateMap.get(p.date), price2: p.price })
    })

    return Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, prices]) => ({ date, ...prices }))
  }

  const chartData = getMergedChartData()

  const allPrices = compareProduct
    ? [...priceHistory.map((p) => p.price), ...compareProduct.priceHistory.map((p) => p.price)]
    : priceHistory.map((p) => p.price)
  const chartMinPrice = Math.min(...allPrices)
  const chartMaxPrice = Math.max(...allPrices)

  const savingsVsNew = product.newRetailPrice - selectedVariantPrice
  const savingsVsNewPercent = Math.round((savingsVsNew / product.newRetailPrice) * 100)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto pb-24 md:pb-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="h-5 w-5 rounded-full border border-border"
              style={{ backgroundColor: selectedVariant?.colorHex }}
            />
            <span className="text-balance">
              {product.model} - {selectedVariant?.storage} {selectedVariant?.color}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ImageCarousel images={product.images} alt={product.title} />

          {/* Price Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-xl font-bold">€{selectedVariantPrice}</p>
              <div className="mt-1 flex items-center justify-center gap-1">
                {trend === "down" && <TrendingDown className="h-4 w-4 text-emerald-600" />}
                {trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                {trend === "stable" && <Minus className="h-4 w-4 text-muted-foreground" />}
                <span
                  className={cn(
                    "text-xs",
                    trend === "down" && "text-emerald-600",
                    trend === "up" && "text-red-500",
                    trend === "stable" && "text-muted-foreground",
                  )}
                >
                  {trend === "down" && "Dropping"}
                  {trend === "up" && "Rising"}
                  {trend === "stable" && "Stable"}
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-xs text-muted-foreground">30-Day Low</p>
              <p className="text-xl font-bold text-emerald-600">€{minPrice}</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-xs text-muted-foreground">30-Day High</p>
              <p className="text-xl font-bold">€{maxPrice}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                Save €{savingsVsNew} vs buying new
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                New retail price: <span className="line-through">€{product.newRetailPrice}</span>
              </p>
            </div>
            <div className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-bold text-white">
              -{savingsVsNewPercent}%
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Price History (30 Days)</p>
            <div className="flex items-center gap-2">
              {compareProduct && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCompareProduct(null)
                    setCompareMode(false)
                  }}
                  className="h-7 gap-1 text-xs text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                  Clear comparison
                </Button>
              )}
              <Popover open={compareSearchOpen} onOpenChange={setCompareSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant={compareProduct ? "secondary" : "outline"} size="sm" className="h-8 gap-1.5">
                    <GitCompare className="h-4 w-4" />
                    {compareProduct ? "Comparing..." : "Compare"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search product to compare..." />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup heading="Products">
                        {comparableProducts.map((p) => (
                          <CommandItem
                            key={p.id}
                            value={p.title}
                            onSelect={() => {
                              setCompareProduct(p)
                              setCompareMode(true)
                              setCompareSearchOpen(false)
                            }}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="h-4 w-4 rounded-full border border-border"
                              style={{ backgroundColor: p.colorHex }}
                            />
                            <span className="flex-1 truncate text-sm">{p.title}</span>
                            <span className="text-xs text-muted-foreground">€{p.price}</span>
                            {compareProduct?.id === p.id && <Check className="h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getDate()}/${date.getMonth() + 1}`
                  }}
                  className="text-muted-foreground"
                />
                <YAxis
                  domain={[chartMinPrice - 50, chartMaxPrice + 50]}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `€${value}`}
                  className="text-muted-foreground"
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
                          <p className="mb-1 text-xs text-muted-foreground">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                              {entry.name}: €{entry.value}
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {compareProduct && (
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="price1"
                  name={product.model}
                  stroke="#059669"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#059669" }}
                />
                {compareProduct && (
                  <Line
                    type="monotone"
                    dataKey="price2"
                    name={compareProduct.model}
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#6366f1" }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Variant Selector */}
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Storage</p>
              <div className="flex flex-wrap gap-2">
                {uniqueStorages.map((storage) => (
                  <Button
                    key={storage}
                    variant={selectedVariant?.storage === storage ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSelectedVariant((prev) => ({
                        storage,
                        color: prev?.color ?? product.color,
                        colorHex: prev?.colorHex ?? product.colorHex,
                      }))
                    }
                    className={cn(
                      selectedVariant?.storage === storage && "bg-emerald-600 text-white hover:bg-emerald-700",
                    )}
                  >
                    {storage}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Color</p>
              <TooltipProvider>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map((colorOption) => (
                    <Tooltip key={colorOption.color}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() =>
                            setSelectedVariant((prev) => ({
                              storage: prev?.storage ?? product.storage,
                              color: colorOption.color,
                              colorHex: colorOption.colorHex,
                            }))
                          }
                          className={cn(
                            "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                            selectedVariant?.color === colorOption.color
                              ? "border-emerald-600 ring-2 ring-emerald-600 ring-offset-2 ring-offset-background"
                              : "border-border",
                          )}
                          style={{ backgroundColor: colorOption.colorHex }}
                          aria-label={colorOption.color}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{colorOption.color}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>

          <div className="hidden gap-3 md:flex">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAlertModal(true)}>
              <Bell className="mr-2 h-4 w-4" />
              Set Price Alert
            </Button>
            <Button className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700">
              <ExternalLink className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-50 flex gap-3 border-t border-border bg-background/80 p-4 backdrop-blur-lg md:hidden">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAlertModal(true)}>
            <Bell className="mr-2 h-4 w-4" />
            Set Alert
          </Button>
          <Button className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700">
            <ExternalLink className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
        </div>
      </DialogContent>

      <Dialog open={showAlertModal} onOpenChange={setShowAlertModal}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-600" />
              Set Price Alert
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <div
                className="h-10 w-10 rounded-full border border-border"
                style={{ backgroundColor: product.colorHex }}
              />
              <div className="flex-1">
                <p className="font-medium">{product.model}</p>
                <p className="text-sm text-muted-foreground">Configure your flexible alert below</p>
              </div>
            </div>

            <div>
              <Label htmlFor="alert-price" className="text-sm font-medium">
                Notify me when price drops below
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <Input
                  id="alert-price"
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="pl-8"
                  placeholder="Enter target price"
                />
              </div>
            </div>

            {/* Storage Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Storage</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="any-storage"
                    checked={anyStorage}
                    onCheckedChange={(checked) => setAnyStorage(checked as boolean)}
                  />
                  <Label htmlFor="any-storage" className="cursor-pointer text-sm text-muted-foreground">
                    Any
                  </Label>
                </div>
              </div>
              {!anyStorage && (
                <div className="flex flex-wrap gap-2">
                  {storageOptions.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => toggleStorage(storage)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                        selectedStorages.includes(storage)
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-border bg-transparent hover:border-emerald-600/50",
                      )}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              )}
              {anyStorage && <p className="text-sm text-muted-foreground">Matches all storage options</p>}
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Color</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="any-color"
                    checked={anyColor}
                    onCheckedChange={(checked) => setAnyColor(checked as boolean)}
                  />
                  <Label htmlFor="any-color" className="cursor-pointer text-sm text-muted-foreground">
                    Any
                  </Label>
                </div>
              </div>
              {!anyColor && (
                <TooltipProvider>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((colorOpt) => (
                      <Tooltip key={colorOpt.name}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => toggleColor(colorOpt.name)}
                            className={cn(
                              "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                              selectedColors.includes(colorOpt.name)
                                ? "border-emerald-600 ring-2 ring-emerald-600 ring-offset-2 ring-offset-background"
                                : "border-border opacity-50 hover:opacity-100",
                            )}
                            style={{ backgroundColor: colorOpt.hex }}
                            aria-label={colorOpt.name}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{colorOpt.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              )}
              {anyColor && <p className="text-sm text-muted-foreground">Matches all colors</p>}
              {!anyColor && selectedColors.length > 0 && (
                <p className="text-xs text-muted-foreground">Selected: {selectedColors.join(", ")}</p>
              )}
            </div>

            {/* Condition Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Condition</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="any-condition"
                    checked={anyCondition}
                    onCheckedChange={(checked) => setAnyCondition(checked as boolean)}
                  />
                  <Label htmlFor="any-condition" className="cursor-pointer text-sm text-muted-foreground">
                    Any
                  </Label>
                </div>
              </div>
              {!anyCondition && (
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => toggleCondition(condition)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                        selectedConditions.includes(condition)
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-border bg-transparent hover:border-emerald-600/50",
                      )}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              )}
              {anyCondition && <p className="text-sm text-muted-foreground">Matches all conditions</p>}
            </div>

            {/* Battery Health Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Battery Health</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="any-battery"
                    checked={anyBattery}
                    onCheckedChange={(checked) => setAnyBattery(checked as boolean)}
                  />
                  <Label htmlFor="any-battery" className="cursor-pointer text-sm text-muted-foreground">
                    Any
                  </Label>
                </div>
              </div>
              {!anyBattery && (
                <div className="flex flex-wrap gap-2">
                  {batteryHealthOptions.map((battery) => (
                    <button
                      key={battery.value}
                      onClick={() => toggleBattery(battery.value)}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                        selectedBatteryHealth.includes(battery.value)
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-border bg-transparent hover:border-emerald-600/50",
                      )}
                    >
                      {battery.value === "new" ? <BatteryFull className="h-4 w-4" /> : <Battery className="h-4 w-4" />}
                      {battery.label}
                    </button>
                  ))}
                </div>
              )}
              {anyBattery && <p className="text-sm text-muted-foreground">Matches any battery condition</p>}
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                <span className="font-medium">Alert Summary:</span> We will notify you when{" "}
                <span className="font-semibold">{getAlertDescription()}</span> drops below{" "}
                <span className="font-semibold">€{alertPrice || "..."}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAlertModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={handleSetAlert}
                disabled={!alertPrice}
              >
                <Bell className="mr-2 h-4 w-4" />
                Set Alert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
