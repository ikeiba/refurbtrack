export default function FooterPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="prose prose-stone dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  )
}