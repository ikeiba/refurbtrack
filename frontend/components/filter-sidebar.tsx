"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { models, storageOptions, colorOptions } from "@/lib/mock-data"
import type { Filters } from "@/lib/types"

interface FilterSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  isOpen: boolean
  onClose: () => void
}

const conditionColors: Record<string, string> = {
  Fair: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Excellent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  Premium: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
}

export function FilterSidebar({ filters, onFiltersChange, isOpen, onClose }: FilterSidebarProps) {
  const updateFilters = (updates: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleArrayFilter = (key: keyof Filters, value: string) => {
    const current = filters[key] as string[]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    updateFilters({ [key]: updated })
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 border-r border-border bg-background transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-semibold">Filters</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Model Filter */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Model</h3>
                <div className="space-y-2">
                  {models.map((model) => (
                    <div key={model} className="flex items-center gap-2">
                      <Checkbox
                        id={`model-${model}`}
                        checked={filters.models.includes(model)}
                        onCheckedChange={() => toggleArrayFilter("models", model)}
                      />
                      <Label htmlFor={`model-${model}`} className="text-sm font-normal">
                        {model}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Condition Filter */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Condition</h3>
                <div className="space-y-2">
                  {["Fair", "Good", "Excellent", "Premium"].map((condition) => (
                    <div key={condition} className="flex items-center gap-2">
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={filters.conditions.includes(condition)}
                        onCheckedChange={() => toggleArrayFilter("conditions", condition)}
                      />
                      <Label htmlFor={`condition-${condition}`} className="flex items-center gap-2 text-sm font-normal">
                        <Badge variant="secondary" className={cn("text-xs", conditionColors[condition])}>
                          {condition}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Battery Filter */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Battery</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-battery" className="flex items-center gap-2 text-sm">
                    <span>🔋</span>
                    <span>New Battery Only</span>
                  </Label>
                  <Switch
                    id="new-battery"
                    checked={filters.newBatteryOnly}
                    onCheckedChange={(checked) => updateFilters({ newBatteryOnly: checked })}
                  />
                </div>
              </div>

              <Separator />

              {/* Storage Filter */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Storage</h3>
                <div className="flex flex-wrap gap-2">
                  {storageOptions.map((storage) => (
                    <Button
                      key={storage}
                      variant={filters.storages.includes(storage) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayFilter("storages", storage)}
                      className={cn(
                        "h-8",
                        filters.storages.includes(storage) && "bg-emerald-600 text-white hover:bg-emerald-700",
                      )}
                    >
                      {storage}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Color Filter */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Color</h3>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <Tooltip key={color.name}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => toggleArrayFilter("colors", color.name)}
                            className={cn(
                              "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                              filters.colors.includes(color.name)
                                ? "border-emerald-600 ring-2 ring-emerald-600 ring-offset-2 ring-offset-background"
                                : "border-border",
                            )}
                            style={{ backgroundColor: color.hex }}
                            aria-label={color.name}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </div>

              <Separator />

              {/* Price Range Filter */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                    min={0}
                    max={2000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>€{filters.priceRange[0]}</span>
                    <span>€{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="border-t border-border p-4">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() =>
                onFiltersChange({
                  models: [],
                  conditions: [],
                  newBatteryOnly: false,
                  storages: [],
                  colors: [],
                  priceRange: [0, 2000],
                })
              }
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
