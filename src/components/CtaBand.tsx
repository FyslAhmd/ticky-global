import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { trackCtaClick } from '@/lib/tracking'

/**
 * Shared call-to-action band. Renders above the footer on public pages that
 * do not include their own closing CTA (home and contact have their own).
 */
export default function CtaBand({
  title = 'Ready to see what you could save?',
  text = 'Book a free 30-minute discovery call. We will map the role, shortlist pre-vetted candidates and give you an exact monthly price in your currency — no obligation.',
  primaryLabel = 'Book a Discovery Call',
}: {
  title?: string
  text?: string
  primaryLabel?: string
}) {
  return (
    <section className="bg-white pb-20 pt-4 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
        >
          <Card className="overflow-hidden rounded-3xl border-none bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 shadow-xl shadow-blue-900/20">
            <CardContent className="relative flex flex-col items-start gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-2xl"
              />
              <div className="max-w-2xl">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-blue-100 sm:text-lg">{text}</p>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-blue-100">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Reply within one business day
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Exact price in writing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    No lock-in after 90 days
                  </li>
                </ul>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[280px]">
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full bg-white text-base font-bold text-blue-800 hover:bg-blue-50"
                >
                  <Link
                    to="/contact"
                    onClick={() =>
                      trackCtaClick({ label: primaryLabel, path: window.location.pathname })
                    }
                  >
                    {primaryLabel}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-white/30 bg-transparent text-base font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  <Link
                    to="/pricing"
                    onClick={() =>
                      trackCtaClick({ label: 'See pricing (CTA band)', path: window.location.pathname })
                    }
                  >
                    See starting-from pricing
                  </Link>
                </Button>
                <p className="text-center text-xs text-blue-200">
                  or call the UK office: 0808 175 3413
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
