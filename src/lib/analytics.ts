import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { trpc } from '@/providers/trpc'
import { initTracking, pushEvent } from '@/lib/tracking'

/** Fires a pageview event on every public route change. Mount once inside the public Layout. */
export function usePageTracking() {
  const { pathname, hash } = useLocation()
  const track = trpc.public.track.useMutation()
  const lastPath = useRef<string>('')

  useEffect(() => {
    initTracking()
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return
    if (lastPath.current === pathname + hash) return
    lastPath.current = pathname + hash

    let referrer: string | undefined
    try {
      if (document.referrer) {
        const host = new URL(document.referrer).hostname
        if (host !== window.location.hostname) referrer = host
      }
    } catch {
      /* ignore */
    }

    track.mutate({ type: 'pageview', path: pathname, referrer })
    // GA4 page_view via GTM — GTM's History Change listener uses these to track SPA navigation
    pushEvent('page_view', { page_path: pathname, page_title: document.title })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash])
}
