/**
 * Google Tag Manager + GA4 integration.
 *
 * GTM is the single snippet loaded on the site. GA4, Google Ads conversion
 * tags and any future pixels (Meta, LinkedIn, etc.) are configured inside
 * the GTM container by the PPC specialist — no code changes needed.
 *
 * Set VITE_GTM_ID (e.g. GTM-XXXXXXX) in .env to activate. When unset,
 * nothing loads and pushes are safely ignored (local/dev mode).
 */

export const GTM_ID: string = import.meta.env.VITE_GTM_ID ?? ''

type DataLayerEvent = {
  event: string
  page_path?: string
  page_title?: string
  [key: string]: unknown
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[]
  }
}

export function isTrackingEnabled() {
  return /^GTM-[A-Z0-9]+$/i.test(GTM_ID)
}

/** Push an event onto the GTM dataLayer. No-op until VITE_GTM_ID is set. */
export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...params })
}

let booted = false

/** Inject the GTM container script (head) once. The <noscript> iframe lives in index.html. */
export function initTracking() {
  if (booted || !isTrackingEnabled()) return
  booted = true

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({
    'gtm.start': Date.now(),
    event: 'gtm.js',
  } as unknown as DataLayerEvent)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
  document.head.appendChild(script)
}

// ---------------------------------------------------------------------------
// Standard events — wire these to Google Ads / GA4 conversions inside GTM
// ---------------------------------------------------------------------------

/** Fired when the contact/enquiry form is successfully submitted. */
export function trackEnquirySubmitted(data: {
  roleInterest?: string
  hours?: string
  path: string
}) {
  pushEvent('enquiry_submitted', {
    page_path: data.path,
    role_interest: data.roleInterest ?? 'unspecified',
    hours: data.hours ?? 'unspecified',
  })
}

/** Fired when a visitor uses the savings calculator (role/location/hours change with a result shown). */
export function trackCalculatorUsed(data: {
  roleId: string
  roleTitle: string
  region: string
  hours: string
  annualSaving: number
  currency: string
}) {
  pushEvent('calculator_used', {
    role_id: data.roleId,
    role_title: data.roleTitle,
    region: data.region,
    hours: data.hours,
    annual_saving: data.annualSaving,
    currency: data.currency,
  })
}

/** Fired on clicks of "Book a Discovery Call" / "Lock in this saving" CTAs. */
export function trackCtaClick(data: { label: string; path: string }) {
  pushEvent('cta_click', {
    cta_label: data.label,
    page_path: data.path,
  })
}
