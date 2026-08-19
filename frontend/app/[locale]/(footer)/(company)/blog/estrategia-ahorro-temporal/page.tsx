// app/[locale]/(footer)/(company)/blog/estrategia-ahorro-temporal/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { absoluteUrl, blogPostPath } from "@/lib/urls"
import { EstrategiaAhorroES } from "@/components/content/blog/EstrategiaAhorroES"
import { EstrategiaAhorroEN } from "@/components/content/blog/EstrategiaAhorroEN"

const SLUG = "estrategia-ahorro-temporal"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const canonical = absoluteUrl(blogPostPath(locale, SLUG))
  const title = t("meta_blog_ahorro_title", language)
  const description = t("meta_blog_ahorro_description", language)

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
    ? <EstrategiaAhorroEN locale={locale} />
    : <EstrategiaAhorroES locale={locale} />
}