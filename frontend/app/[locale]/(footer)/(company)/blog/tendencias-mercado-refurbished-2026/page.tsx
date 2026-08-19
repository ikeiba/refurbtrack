// app/[locale]/(footer)/(company)/blog/tendencias-mercado-refurbished-2026/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { absoluteUrl, blogPostPath } from "@/lib/urls"
import { TendenciasES } from "@/components/content/blog/TendenciasES"
import { TendenciasEN } from "@/components/content/blog/TendenciasEN"

const SLUG = "tendencias-mercado-refurbished-2026"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const canonical = absoluteUrl(blogPostPath(locale, SLUG))
  const title = t("meta_blog_tendencias_title", language)
  const description = t("meta_blog_tendencias_description", language)

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
    ? <TendenciasEN locale={locale} />
    : <TendenciasES locale={locale} />
}