// app/[locale]/(footer)/(company)/blog/impacto-ambiental-reacondicionado/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { absoluteUrl, blogPostPath } from "@/lib/urls"
import { ImpactoAmbientalES } from "@/components/content/blog/ImpactoAmbientalES"
import { ImpactoAmbientalEN } from "@/components/content/blog/ImpactoAmbientalEN"

const SLUG = "impacto-ambiental-reacondicionado"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const canonical = absoluteUrl(blogPostPath(locale, SLUG))
  const title = t("meta_blog_impacto_title", language)
  const description = t("meta_blog_impacto_description", language)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale: raw } = await params
  const locale = parseLocale(raw)

  return locale === "en-gb"
    ? <ImpactoAmbientalEN locale={locale} />
    : <ImpactoAmbientalES locale={locale} />
}