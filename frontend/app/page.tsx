import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { defaultLocale, parseLocale } from "@/lib/i18n";

export default async function RootPage() {
  // Detectamos el locale del navegador vía Accept-Language (opcional) para
  // enviar al usuario a /es-es o /en-gb. Fallback: es-es.
  let locale = defaultLocale;
  try {
    const requestHeaders = await headers();
    const acceptLanguage = requestHeaders.get("accept-language") || "";
    const first = acceptLanguage.split(",")[0]?.trim();
    if (first) {
      locale = parseLocale(first);
    }
  } catch {
    locale = defaultLocale;
  }

  // 308 (Permanente) en producción para traspasar la autoridad SEO al locale por defecto.
  redirect(`/${locale}`);
}
