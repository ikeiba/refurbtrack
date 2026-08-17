'use client'

import { getConsent } from '@/lib/consent'

export type AnalyticsEvent =
  | 'product_view'
  | 'search'
  | 'filter_used'
  | 'price_comparison_click'
  | 'alert_started'
  | 'alert_created'
  | 'outbound_click'
  | 'signup'
  | 'return_visit'

type Params = Record<string, string | number | boolean | undefined>

let queue: { event: AnalyticsEvent; params?: Params }[] = []

const gtagReady = () =>
  typeof window !== 'undefined' && typeof (window as any).gtag === 'function'

function send(event: AnalyticsEvent, params?: Params) {
  ;(window as any).gtag('event', event, params)
}

export function track(event: AnalyticsEvent, params?: Params) {
  if (typeof window === 'undefined') return
  if (!getConsent()?.analytics) return
  if (!gtagReady()) {
    queue.push({ event, params })
    return
  }
  send(event, params)
}

export function flushAnalyticsQueue() {
  if (!gtagReady() || queue.length === 0) return
  const copy = queue
  queue = []
  copy.forEach(({ event, params }) => send(event, params))
}

const RETURN_KEY = 'refurbtrack_returning'

export function trackReturnVisit() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(RETURN_KEY)) {
    track('return_visit')
  } else {
    localStorage.setItem(RETURN_KEY, '1')
  }
}
