// app/[locale]/(footer)/(company)/blog/[slug]/page.tsx
// Ruta dinámica del blog: resuelve un slug de la URL (ES o EN) al artículo
// correcto según el locale, de modo que la URL siempre esté en el idioma del
// mercado (/en-gb/blog/savings-strategy-timing, no /en-gb/blog/estrategia-...).
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { absoluteUrl, blogPostPath } from "@/lib/urls"
import { blogPostBySlug, blogPostSlug, blogPostSlugsForLocale } from "@/lib/blog"

import { GuiaCompradoresES } from "@/components/content/blog/GuiaCompradoresES"
import { GuiaCompradoresEN } from "@/components/content/blog/GuiaCompradoresEN"
import { ImpactoAmbientalES } from "@/components/content/blog/ImpactoAmbientalES"
import { ImpactoAmbientalEN } from "@/components/content/blog/ImpactoAmbientalEN"
import { MarketplacesES } from "@/components/content/blog/MarketplacesES"
import { MarketplacesEN } from "@/components/content/blog/MarketplacesEN"
import { EstrategiaAhorroES } from "@/components/content/blog/EstrategiaAhorroES"
import { EstrategiaAhorroEN } from "@/components/content/blog/EstrategiaAhorroEN"
import { MitosES } from "@/components/content/blog/MitosES"
import { MitosEN } from "@/components/content/blog/MitosEN"
import { TendenciasES } from "@/components/content/blog/TendenciasES"
import { TendenciasEN } from "@/components/content/blog/TendenciasEN"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

const CONTENT: Record<
  string,
  { es: (p: { locale: string }) => React.ReactElement; en: (p: { locale: string }) => React.ReactElement; title: string; description: string }
> = {
  "guia-compradores-refurbished": {
    es: (p) => <GuiaCompradoresES {...p} />,
    en: (p) => <GuiaCompradoresEN {...p} />,
    title: "meta_blog_guia_title",
    description: "meta_blog_guia_description",
  },
  "impacto-ambiental-reacondicionado": {
    es: (p) => <ImpactoAmbientalES {...p} />,
    en: (p) => <ImpactoAmbientalEN {...p} />,
    title: "meta_blog_impacto_title",
    description: "meta_blog_impacto_description",
  },
  "diferencias-entre-marketplaces": {
    es: (p) => <MarketplacesES {...p} />,
    en: (p) => <MarketplacesEN {...p} />,
    title: "meta_blog_marketplaces_title",
    description: "meta_blog_marketplaces_description",
  },
  "estrategia-ahorro-temporal": {
    es: (p) => <EstrategiaAhorroES {...p} />,
    en: (p) => <EstrategiaAhorroEN {...p} />,
    title: "meta_blog_ahorro_title",
    description: "meta_blog_ahorro_description",
  },
  "falsos-mitos-reacondicionados": {
    es: (p) => <MitosES {...p} />,
    en: (p) => <MitosEN {...p} />,
    title: "meta_blog_mitos_title",
    description: "meta_blog_mitos_description",
  },
  "tendencias-mercado-refurbished-2026": {
    es: (p) => <TendenciasES {...p} />,
    en: (p) => <TendenciasEN {...p} />,
    title: "meta_blog_tendencias_title",
    description: "meta_blog_tendencias_description",
  },
}

export function generateStaticParams() {
  return ["es-es", "en-gb"].flatMap((locale) =>
    blogPostSlugsForLocale(locale).map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const locale = parseLocale(raw)
  const language = getLanguage(locale)

  const pair = blogPostBySlug(slug)
  if (!pair) return {}
  const canonicalSlug = blogPostSlug(pair.slugES, locale)
  const content = CONTENT[pair.slugES]
  if (!content) return {}

  const canonical = absoluteUrl(blogPostPath(locale, canonicalSlug))
  const title = t(content.title, language)
  const description = t(content.description, language)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale: raw, slug } = await params
  const locale = parseLocale(raw)

  const pair = blogPostBySlug(slug)
  if (!pair) notFound()
  const content = CONTENT[pair.slugES]
  if (!content) notFound()

  const component = locale === "en-gb" ? content.en : content.es
  return component({ locale })
}