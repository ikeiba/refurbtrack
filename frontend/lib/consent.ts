export type ConsentState = {
  analytics: boolean
  marketing: boolean
  decided: boolean
}

const CONSENT_KEY = 'refurbtrack_consent'

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setConsent(state: ConsentState): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
}

export function clearConsent(): void {
  localStorage.removeItem(CONSENT_KEY)
}