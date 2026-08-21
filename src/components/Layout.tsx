import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CtaBand from '@/components/CtaBand'
import { usePageTracking } from '@/lib/analytics'

export default function Layout() {
  const { pathname, hash } = useLocation()
  usePageTracking()

  useEffect(() => {
    if (hash) {
      // wait a tick for the target page to render before scrolling to the anchor
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
      return () => clearTimeout(timer)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  // Home and Contact already end with their own conversion CTA
  const hasOwnCta = pathname === '/' || pathname === '/contact'

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hasOwnCta && <CtaBand />}
      <Footer />
    </div>
  )
}
