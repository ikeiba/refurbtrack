import { getCatalog } from "@/services/api"
import DashboardClient from "@/components/dashboard-client"

// Este es un SERVER COMPONENT por defecto (no tiene "use client")
export default async function Page() {
  
  // 1. Fetching de datos en el SERVIDOR (rápido, seguro, SEO-friendly)
  // Esta función llama a tu Django API local
  const data = await getCatalog()

  console.log(`✅ Datos recibidos en Next.js: ${data.length} productos`)

  // 2. Pasamos los datos al componente cliente (DashboardClient)
  return <DashboardClient initialData={data} />
}