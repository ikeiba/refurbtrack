// components/ui/breadcrumbs.tsx
import Link from "next/link";
import { cn } from "@/lib/utils"; // Asumo que usas la utilidad estándar de Tailwind/shadcn

export interface BreadcrumbItem {
  label: string;
  href?: string; // Si no tiene href, asumimos que es la página actual (el último nodo)
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              {isLast || !item.href ? (
                // Nodo final (sin enlace)
                <span
                  aria-current="page"
                  className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none capitalize"
                >
                  {item.label}
                </span>
              ) : (
                // Nodos intermedios (con enlace)
                <>
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors capitalize"
                  >
                    {item.label}
                  </Link>
                  <span className="opacity-50">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}