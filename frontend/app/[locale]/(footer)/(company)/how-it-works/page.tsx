// app/[locale]/(footer)/(company)/how-it-works/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { HowItWorksES } from "@/components/content/company/HowItWorksES"
import { HowItWorksEN } from "@/components/content/company/HowItWorksEN"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const title = t("meta_how_it_works_title", language)
  const description = t("meta_how_it_works_description", language)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/how-it-works`,
      languages: { "es-es": "/es-es/how-it-works", "en-gb": "/en-gb/how-it-works" },
    },
    openGraph: { title, description },
  }
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale: raw } = await params
  const locale = parseLocale(raw)

  return locale === "en-gb"
    ? <HowItWorksEN locale={locale} />
    : <HowItWorksES locale={locale} />
}