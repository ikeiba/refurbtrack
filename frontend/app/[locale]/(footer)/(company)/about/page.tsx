// app/[locale]/(footer)/(company)/about/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { AboutES } from "@/components/content/company/AboutES"
import { AboutEN } from "@/components/content/company/AboutEN"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const title = t("meta_about_title", language)
  const description = t("meta_about_description", language)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { "es-es": "/es-es/about", "en-gb": "/en-gb/about" },
    },
    openGraph: { title, description },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params
  const locale = parseLocale(raw)

  return locale === "en-gb"
    ? <AboutEN locale={locale} />
    : <AboutES locale={locale} />
}