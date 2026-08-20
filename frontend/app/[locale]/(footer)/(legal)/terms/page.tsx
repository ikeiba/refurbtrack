// app/[locale]/(footer)/(legal)/terms/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { TermsES } from "@/components/content/legal/TermsES"
import { TermsEN } from "@/components/content/legal/TermsEN"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const title = t("meta_terms_title", language)
  const description = t("meta_terms_description", language)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { "es-es": "/es-es/terms", "en-gb": "/en-gb/terms" },
    },
    openGraph: { title, description },
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale: raw } = await params
  const locale = parseLocale(raw)

  return locale === "en-gb"
    ? <TermsEN locale={locale} />
    : <TermsES locale={locale} />
}