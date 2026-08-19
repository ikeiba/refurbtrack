// app/[locale]/(footer)/(company)/blog/page.tsx
import type { Metadata } from "next"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { BlogES } from "@/components/content/blog/BlogES"
import { BlogEN } from "@/components/content/blog/BlogEN"

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)
  const title = t("meta_blog_title", language)
  const description = t("meta_blog_description", language)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { "es-es": "/es-es/blog", "en-gb": "/en-gb/blog" },
    },
    openGraph: { title, description },
  }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const [{ locale: raw }, { category }] = await Promise.all([params, searchParams])
  const locale = parseLocale(raw)
  const selectedCategory = category || "Todas"

  return locale === "en-gb"
    ? <BlogEN locale={locale} selectedCategory={selectedCategory} />
    : <BlogES locale={locale} selectedCategory={selectedCategory} />
}