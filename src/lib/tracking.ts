/**
 * Runtime tracking loader — GA4, Google Tag Manager and Google Ads conversions.
 *
 * The PPC manager configures everything from the admin panel
 * (Admin → Integrations). The config is stored in the database and fetched
 * at runtime, so IDs can be changed without a code deployment.
 * VITE_GTM_ID in .env still works as a build-time fallback.
 *
 * Three integration modes:
 *  - GTM set      → the GTM container loads; GA4 / Ads tags are managed inside GTM.
 *  - No GTM       → gtag.js loads directly with the GA4 measurement ID and the
 *                   Google Ads conversion ID, and conversions fire directly.
 *  - Conversions  → in direct mode, enquiry_submitted / calculator_used /
 *                   cta_click also fire Google Ads conversions when a label
 *                   is set for that event. When GTM is present, conversions
 *                   are left to GTM to avoid double-counting.
 */

export const GTM_ID: string = import.meta.env.VITE_GTM_ID ?? ''

export type TrackingConfig = {
  enabled: boolean
  gtmId: string
  ga4Id: string
  googleAdsId: string
  conversionLabels: {
    enquiry_submitted: string
    calculator_used: string
    cta_click: string
  }
}

type DataLayerEvent = {
  event: string
  page_path?: string
  page_title?: string
  [key: string]: unknown
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[]
    gtag?: (...args: unknown[]) => void
  }
}

let config: TrackingConfig | null = null
let loadPromise: Promise<TrackingConfig | null> | null = null
let booted = false

/** Fetch the tracking config from the server (once). Env fallback if the API is unreachable. */
export function loadTrackingConfig(): Promise<TrackingConfig | null> {
  if (config) return Promise.resolve(config)
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    try {
      const res = await fetch('/api/trpc/marketingPublic.trackingConfig')
      const json = await res.json()
      const data = json?.result?.data?.json as TrackingConfig | undefined
      if (data?.enabled) {
        config = data
        return config
      }
    } catch {
      /* fall through to env */
    }
    // build-time fallback
    if (/^GTM-[A-Z0-9]+$/i.test(GTM_ID)) {
      config = {
        enabled: true,
        gtmId: GTM_ID,
        ga4Id: '',
        googleAdsId: '',
        conversionLabels: { enquiry_submitted: '', calculator_used: '', cta_click: '' },
      }
      return config
    }
    config = null
    return null
  })()
  return loadPromise
}

export function getTrackingConfigSync() {
  return config
}

/** Push an event onto the dataLayer. No-op until config has loaded. */
export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...params })
}

function injectGtm(gtmId: string) {
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' } as unknown as DataLayerEvent)
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`
  document.head.appendChild(script)
}

function injectGtag(ids: string[]) {
  if (ids.length === 0) return
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args as unknown as DataLayerEvent)
  }
  window.gtag('js', new Date())
  for (const id of ids) window.gtag('config', id)
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`
  document.head.appendChild(script)
}

/** Load config and inject the required scripts. Safe to call on every route change. */
export function initTracking() {
  if (typeof window === 'undefined') return
  void loadTrackingConfig().then((cfg) => {
    if (booted || !cfg?.enabled) return
    booted = true
    if (cfg.gtmId) {
      injectGtm(cfg.gtmId)
    } else {
      // direct mode — no GTM container
      const ids = [cfg.ga4Id, cfg.googleAdsId].filter(Boolean)
      injectGtag(ids)
    }
  })
}

/** Fire a Google Ads conversion directly (only when GTM is NOT managing tags). */
function fireAdsConversion(eventName: keyof TrackingConfig['conversionLabels']) {
  if (!config?.enabled || config.gtmId) return // GTM mode → conversions handled in GTM
  const label = config.conversionLabels[eventName]
  if (!config.googleAdsId || !label || typeof window.gtag !== 'function') return
  window.gtag('event', 'conversion', { send_to: `${config.googleAdsId}/${label}` })
}

// ---------------------------------------------------------------------------
// Standard events — wire these to Google Ads / GA4 conversions in GTM,
// or set conversion labels in Admin → Integrations for direct mode.
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
  fireAdsConversion('enquiry_submitted')
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
  fireAdsConversion('calculator_used')
}

/** Fired on clicks of "Book a Discovery Call" / "Lock in this saving" CTAs. */
export function trackCtaClick(data: { label: string; path: string }) {
  pushEvent('cta_click', {
    cta_label: data.label,
    page_path: data.path,
  })
  fireAdsConversion('cta_click')
}
