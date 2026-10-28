import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Video, CalendarDays, ShieldCheck, Home, ArrowRight } from 'lucide-react'
import { pushEvent } from '@/lib/tracking'

function prettyDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

/**
 * Booking confirmation page — reached ONLY after a successful booking
 * (redirected from /book). Track this URL in GA4 / Google Ads as the
 * discovery-call conversion: a page_view of /booked = one booking.
 */
export default function Booked() {
  const [params] = useSearchParams()
  const date = params.get('date')
  const time = params.get('time')

  useEffect(() => {
    document.title = 'Booking confirmed — Ticky Global'
    // explicit conversion event for GA4/GTM listeners
    pushEvent('booking_confirmed', {
      page_path: '/booked',
      booking_date: date ?? '',
      booking_time: time ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="bg-gradient-to-b from-emerald-50 to-white py-16 sm:py-20">
      <div className="mx-auto max-w-xl px-4">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="rounded-3xl border-emerald-200 bg-emerald-50/50 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-slate-900">You're booked in!</h1>
              {date && time ? (
                <>
                  <p className="mt-2 text-lg font-medium text-blue-800">{prettyDate(date)} at {time}</p>
                  <p className="text-sm text-slate-500">(UK time)</p>
                </>
              ) : (
                <p className="mt-2 text-slate-600">Your discovery call is confirmed.</p>
              )}
              <div className="mx-auto mt-6 max-w-sm space-y-2.5 rounded-2xl bg-white p-5 text-left text-sm text-slate-600">
                <p className="flex items-start gap-2"><Video className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /> We'll send a video call link to your email shortly before the call.</p>
                <p className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /> Need to change it? Just reply to the confirmation or call <a href="tel:+448081753413" className="font-medium text-blue-700 hover:underline">0808 175 3413</a>.</p>
                <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /> No obligation — it's a friendly chat about whether we're a fit.</p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/"><Home className="mr-1.5 h-4 w-4" /> Back to homepage</Link>
                </Button>
                <Button asChild className="rounded-full bg-blue-700 hover:bg-blue-800">
                  <Link to="/roles">Explore our roles <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
