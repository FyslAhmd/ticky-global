import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { trpc } from '@/providers/trpc'

/** Fires a pageview event on every public route change. Mount once inside the public Layout. */
export function usePageTracking() {
  const { pathname, hash } = useLocation()
  const track = trpc.public.track.useMutation()
  const lastPath = useRef<string>('')

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash])
}
