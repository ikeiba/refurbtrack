"use client"

import { Search, Bell, User, Menu, Moon, Sun, LogOut, LayoutDashboard, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { countries } from "@/lib/mock-data"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

interface HeaderProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onSearchSubmit?: (query: string) => void
  onMenuClick?: () => void
  showSearch?: boolean 
}

export function Header({ 
  selectedCountry, 
  onCountryChange, 
  searchQuery = "", 
  onSearchChange, 
  onSearchSubmit,
  onMenuClick,
  showSearch = true 
}: HeaderProps) {
  
  const [isDark, setIsDark] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const [inputValue, setInputValue] = useState(searchQuery || "")
  
  const currentCountry = countries.find((c) => c.code === selectedCountry)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  useEffect(() => {
    setInputValue(searchQuery || "")
  }, [searchQuery])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearchSubmit) {
      const trimmed = inputValue.trim()
      onSearchSubmit(trimmed)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        
        {/* === ZONA IZQUIERDA === */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* LOGO - Botón para volver a home sin filtros */}
        <button 
          onClick={() => router.push("/")} 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          {/* 1. Inyectamos el SVG directamente desde la carpeta public */}
          <img 
            src="/favicon.svg" 
            alt="Logo de RefurbTrack" 
            className="h-8 w-8" 
          />
          
          {/* 2. Estilizamos el texto para darle identidad de marca */}
          <span className="hidden text-xl tracking-tight sm:inline-block">
            <span className="font-extrabold text-foreground">Refurb</span>
            <span className="font-semibold text-emerald-600">Track</span>
          </span>
        </button>

        {/* === ZONA CENTRAL === */}
        {showSearch ? (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="w-full pl-9 focus-visible:ring-emerald-500"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!onSearchChange && !onSearchSubmit}
                />
              </div>
            </div>
        ) : (
            <div className="flex-1" />
        )}

        {/* === ZONA DERECHA === */}
        <div className="flex items-center gap-2">
          
          {/* Selector de País */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild id="country-menu-trigger">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent border-transparent hover:border-border">
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

          {/* Tema Oscuro/Claro */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* CAMPANA DE NOTIFICACIONES (COMENTADA)
          {isAuthenticated ? (
            // CASO A: LOGUEADO -> Ve notificaciones (Simulado)
            <DropdownMenu>
                <DropdownMenuTrigger asChild id="bell-menu-trigger">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-medium text-white">
                        2
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Mis Alertas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        <p>¡El iPhone 13 ha bajado de precio!</p>
                        {/* Aquí conectaremos las notificaciones reales más adelante 
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // CASO B: INVITADO -> Tooltip invitando a entrar
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild id="bell-menu-trigger">
                        <Button variant="ghost" size="icon" className="text-muted-foreground/60">
                            <Bell className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Inicia sesión para gestionar alertas</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          )}
          */}
          {/* MENÚ DE USUARIO */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild id="user-menu-trigger">
              <Button variant="ghost" size="icon" className={isAuthenticated ? "text-emerald-600" : ""}>
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isAuthenticated ? (
                <>
                    {/* MENÚ PARA USUARIO REGISTRADO */}
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Mi Cuenta</p>
                            <p className="text-xs leading-none text-muted-foreground truncate">
                                {user}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Mi Panel</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                </>
              ) : (
                <>
                    {/* MENÚ PARA INVITADO */}
                    <DropdownMenuLabel>Acceso Usuarios</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/auth/login")}>
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Iniciar Sesión</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/auth/register")}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Registrarse</span>
                    </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  )
}