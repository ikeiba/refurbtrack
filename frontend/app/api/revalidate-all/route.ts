import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  // El segundo parámetro 'layout' purga la caché en cascada
  // destruyendo el caché de la Home, Categorías, Marcas y Productos de golpe.
  revalidatePath('/', 'layout')
  
  return NextResponse.json({ 
    revalidated: true, 
    message: 'Caché global de Next.js purgada y destruida con éxito.', 
    now: Date.now() 
  })
}