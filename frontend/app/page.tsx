import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirigimos automáticamente al idioma por defecto.
  // En Next.js, esto genera una redirección HTTP 307 (Temporal) en desarrollo 
  // y 308 (Permanente) en producción, lo cual es perfecto para traspasar la autoridad SEO.
  redirect("/es");
}