'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { type ConsentState, getConsent, setConsent } from '@/lib/consent'

type ConsentContextType = {
  consent: ConsentState | null
  acceptAll: () => void
  rejectAll: () => void
  updateConsent: (state: ConsentState) => void
}

const ConsentContext = createContext<ConsentContextType | null>(null)

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState | null>(null)

  useEffect(() => {
    // Hydrate from localStorage on mount
    const stored = getConsent()
    if (stored) setConsentState(stored)
  }, [])

  const acceptAll = () => {
    const state: ConsentState = { analytics: true, marketing: true, decided: true }
    setConsent(state)
    setConsentState(state)
  }

  const rejectAll = () => {
    const state: ConsentState = { analytics: false, marketing: false, decided: true }
    setConsent(state)
    setConsentState(state)
  }

  const updateConsent = (state: ConsentState) => {
    const full = { ...state, decided: true }
    setConsent(full)
    setConsentState(full)
  }

  return (
    <ConsentContext.Provider value={{ consent, acceptAll, rejectAll, updateConsent }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider')
  return ctx
}