// app/[locale]/(footer)/(company)/contact/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { ContactES } from "@/components/content/company/ContactES"
import { ContactEN } from "@/components/content/company/ContactEN"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const title = t("meta_contact_title", language)
  const description = t("meta_contact_description", language)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { "es-es": "/es-es/contact", "en-gb": "/en-gb/contact" },
    },
    openGraph: { title, description },
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale: raw } = await params
  const locale = parseLocale(raw)

  return locale === "en-gb"
    ? <ContactEN locale={locale} />
    : <ContactES locale={locale} />
}