// components/faq.tsx
// FAQ reutilizable y accesible. Usa <details>/<summary> nativos para que el
// contenido sea visible para crawlers y usable sin JavaScript.

export interface FaqItem {
  question: string
  answer: string
}

export function Faq({ items, title = "Preguntas frecuentes" }: { items: FaqItem[]; title?: string }) {
  if (items.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-lg border border-border bg-card p-5 shadow-sm open:ring-1 open:ring-emerald-500/30"
          >
            <summary className="cursor-pointer list-none font-semibold text-foreground flex items-center justify-between">
              <span>{item.question}</span>
              <span className="ml-4 text-emerald-600 transition-transform group-open:rotate-45 text-xl leading-none">
                +
              </span>
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
