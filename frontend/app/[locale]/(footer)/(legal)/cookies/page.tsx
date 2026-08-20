// app/[locale]/(footer)/(legal)/cookies/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { CookiesES } from "@/components/content/legal/CookiesES"
import { CookiesEN } from "@/components/content/legal/CookiesEN"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const title = t("meta_cookies_title", language)
  const description = t("meta_cookies_description", language)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/cookies`,
      languages: { "es-es": "/es-es/cookies", "en-gb": "/en-gb/cookies" },
    },
    openGraph: { title, description },
  }
}

export default async function CookiesPage({ params }: Props) {
  const { locale: raw } = await params
  const locale = parseLocale(raw)

  return locale === "en-gb"
    ? <CookiesEN locale={locale} />
    : <CookiesES locale={locale} />
}