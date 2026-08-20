"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { sendContactMessage } from "@/services/api"
import { useParams } from "next/navigation"
import { parseLocale, getLanguage } from "@/lib/i18n"
import { t } from "@/lib/translations"

export function ContactForm() {
  const params = useParams()
  const locale = parseLocale(params?.locale as string | undefined)
  const language = getLanguage(locale)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await sendContactMessage({ name, email, subject, message })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || t("contact_send_error", language))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 border p-6 rounded-xl bg-card shadow-sm">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 rounded-lg">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
            {t("contact_sent_title", language)}
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
            {t("contact_sent_desc", language)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-xl bg-card shadow-sm">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <label className="text-sm font-medium">{t("contact_full_name", language)}</label>
        <Input
          placeholder={t("contact_full_name_placeholder", language)}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">{t("email", language)} *</label>
        <Input
          type="email"
          placeholder={t("email_placeholder", language)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">{t("contact_subject", language)}</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="">{t("contact_subject_placeholder", language)}</option>
          <option value="sugerencia">{t("contact_subject_suggestion", language)}</option>
          <option value="colaboracion">{t("contact_subject_collab", language)}</option>
          <option value="tecnico">{t("contact_subject_technical", language)}</option>
          <option value="otro">{t("contact_subject_other", language)}</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">{t("contact_message", language)}</label>
        <Textarea
          placeholder={t("contact_message_placeholder", language)}
          className="min-h-[150px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <div className="bg-muted/50 p-3 rounded text-xs text-muted-foreground">
        {t("contact_consent", language)}
        <a href={`/${locale}/privacy`} className="text-emerald-600 hover:underline">
          {t("contact_privacy_link", language)}
        </a>
        {t("contact_consent_after", language)}
      </div>

      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("contact_sending", language)}
          </>
        ) : (
          t("contact_send", language)
        )}
      </Button>
    </form>
  )
}
