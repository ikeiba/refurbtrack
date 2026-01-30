import Link from "next/link"
import { Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* COLUMNA 1: MARCA */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* Logo "R" en caja verde */}
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                R
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                RefurbTrack
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Facilitando la transición hacia una economía circular y sostenible a través de la transparencia en precios de tecnología reacondicionada.
            </p>
          </div>

          {/* COLUMNA 2: PRODUCTOS */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Productos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="" className="hover:text-emerald-600 transition-colors">
                  iPhones
                </Link>
              </li>
              <li>
                  En breve...
              </li>
              {/*
              <li>
                <Link href="#" className="hover:text-emerald-600 transition-colors">
                  MacBooks
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-600 transition-colors">
                  Apple Watch
                </Link>
              </li> */}
            </ul>
          </div>

          {/* COLUMNA 3: COMPAÑÍA */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Compañía</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/company/about" className="hover:text-emerald-600 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/company/how-it-works" className="hover:text-emerald-600 transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/company/blog" className="hover:text-emerald-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/company/contact" className="hover:text-emerald-600 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/privacy" className="hover:text-emerald-600 transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-emerald-600 transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-emerald-600 transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* LÍNEA DIVISORIA Y COPYRIGHT */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 RefurbTrack. Todos los derechos reservados.
          </p>
          
          <div className="flex gap-8">
            <p className="text-sm text-muted-foreground">
              Podemos ganar una comisión cuando entras en los enlaces para hacer una compra.
              Haz clic {" "}
              <a href="/company/how-it-works" className="text-emerald-600 hover:underline">
              aquí 
              </a>
              {" "} para saber con mas detalle cómo ganamos dinero. 
            </p>
          </div>
          {/* REDES SOCIALES */}
          {/*
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  )
}