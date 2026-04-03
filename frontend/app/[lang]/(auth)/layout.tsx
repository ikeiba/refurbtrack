// app/[lang]/(auth)/layout.tsx

import { Header } from "@/components/header"

// 1. Añadimos async a la función
export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode
  // 2. Tipamos params como una Promesa
  params: Promise<{ lang: string }> 
}) {
  // 3. Resolvemos la promesa antes de leer sus propiedades
  const resolvedParams = await params
  
  // 4. Ahora sí podemos extraer el idioma y ponerlo en mayúsculas
  const currentCountry = resolvedParams.lang.toUpperCase() 

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedCountry={currentCountry}
        showSearch={false} 
      />
      <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
}