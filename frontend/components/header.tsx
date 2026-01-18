"use client"

import { Search, Bell, User, Menu, Moon, Sun, ChevronLeft } from "lucide-react" // <--- 1. Añadido ChevronLeft
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { countries } from "@/lib/mock-data"
import { useEffect, useState } from "react"

interface HeaderProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
  
  // 2. Props de búsqueda y menú ahora son OPCIONALES (?) para no romper la ProductPage
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onMenuClick?: () => void

  // 3. Nuevas props para el botón de atrás
  showBackButton?: boolean
  onBackClick?: () => void
}

export function Header({ 
  selectedCountry, 
  onCountryChange, 
  searchQuery = "", // Valor por defecto para evitar errores si no se pasa
  onSearchChange, 
  onMenuClick,
  showBackButton,   // Recibimos la prop
  onBackClick       // Recibimos la función
}: HeaderProps) {
  
  const [isDark, setIsDark] = useState(false)
  const currentCountry = countries.find((c) => c.code === selectedCountry)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        
        {/* === ZONA IZQUIERDA: MENÚ O VOLVER === */}
        {showBackButton ? (
           // CASO A: Estamos en producto -> Mostramos FLECHA (visible en móvil y escritorio)
           <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-2">
             <ChevronLeft className="h-6 w-6" /> {/* Icono un poco más grande */}
             <span className="sr-only">Go back</span>
           </Button>
        ) : (
           // CASO B: Estamos en home -> Mostramos MENÚ HAMBURGUESA (solo móvil)
           <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
             <Menu className="h-5 w-5" />
             <span className="sr-only">Toggle menu</span>
           </Button>
        )}

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-primary-foreground">
            <span className="text-sm font-bold text-white">R</span>
          </div>
          <span className="hidden text-xl font-semibold tracking-tight sm:inline-block">RefurbTrack</span>
        </div>

        {/* === ZONA CENTRAL: BUSCADOR === */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-9"
              value={searchQuery || ""} // Evitamos valor undefined 
              // Protegemos la llamada: solo ejecuta si la función existe
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              // Si no hay función de búsqueda (ProductPage), deshabilitamos visualmente o dejamos funcional solo visual
              disabled={!onSearchChange} 
            />
          </div>
        </div>

        {/* === ZONA DERECHA: ACCIONES === */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <span className="text-base">{currentCountry?.flag}</span>
                <span className="hidden sm:inline">{currentCountry?.code}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {countries.map((country) => (
                <DropdownMenuItem key={country.code} onClick={() => onCountryChange(country.code)} className="gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-medium text-white">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}