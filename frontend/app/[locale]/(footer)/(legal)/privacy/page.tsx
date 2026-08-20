// app/[locale]/(footer)/(legal)/privacy/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { PrivacyES } from "@/components/content/legal/PrivacyES"
import { PrivacyEN } from "@/components/content/legal/PrivacyEN"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const title = t("meta_privacy_title", language)
  const description = t("meta_privacy_description", language)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { "es-es": "/es-es/privacy", "en-gb": "/en-gb/privacy" },
    },
    openGraph: { title, description },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale: raw } = await params
  const locale = parseLocale(raw)

  return locale === "en-gb"
    ? <PrivacyEN locale={locale} />
    : <PrivacyES locale={locale} />
}