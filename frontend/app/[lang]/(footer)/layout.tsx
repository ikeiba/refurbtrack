import { FooterPageShell } from "@/components/footer-page-shell"

export default function FooterPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Envolvemos todo con el Shell que tiene el Header
    <FooterPageShell>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-stone dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </FooterPageShell>
  )
}