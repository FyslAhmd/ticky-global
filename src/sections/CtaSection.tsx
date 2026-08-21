import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, CalendarCheck } from 'lucide-react'
import { trackCtaClick } from '@/lib/tracking'

export default function CtaSection() {
  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 px-6 py-16 text-center text-white sm:px-12 lg:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(52,211,153,0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgba(147,197,253,0.3), transparent 40%)',
            }}
          />
          <div className="relative">
            <CalendarCheck className="mx-auto h-10 w-10 text-emerald-300" />
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to cut your staffing costs in half?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
              Book a free, no-obligation discovery call. We will scope your role, show you real
              candidate profiles and give you an exact price — all in 30 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-8 text-base font-semibold text-blue-800 hover:bg-blue-50"
              >
                <Link
                  to="/contact"
                  onClick={() =>
                    trackCtaClick({
                      label: 'Book Your Free Discovery Call',
                      path: window.location.pathname,
                    })
                  }
                >
                  Book Your Free Discovery Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/roles">Explore Our Roles</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              No commitment · No recruitment fee until you hire · Monthly rolling contracts
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
