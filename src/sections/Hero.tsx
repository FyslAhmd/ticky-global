import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calculator, CheckCircle2, TrendingDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      {/* subtle grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(219 234 254 / 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgb(219 234 254 / 0.6) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Badge className="mb-5 gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
              <TrendingDown className="h-4 w-4" />
              Save at least 50% on staffing costs
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              Your next great hire costs{' '}
              <span className="relative whitespace-nowrap text-blue-700">
                half as much
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 12" fill="none" aria-hidden="true">
                  <path d="M3 9c60-6 154-6 214-2" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Westbridge Global recruits highly trained, western-standard office professionals from
              the Philippines — sales, telesales, administration, marketing and more. Clear written
              and spoken English, your business hours, part-time or full-time.
            </p>

            <ul className="mt-6 space-y-2.5 text-[15px] text-slate-700">
              {[
                'Pre-vetted, degree-educated Filipino professionals',
                'Working your UK, US or Australian business hours',
                'One simple monthly invoice — we handle HR, payroll & equipment',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-blue-700 px-7 text-base font-semibold shadow-lg shadow-blue-700/25 hover:bg-blue-800"
              >
                <Link to="/contact">
                  Book a Free Discovery Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-slate-300 px-7 text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                <a href="#savings">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Your Savings
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-blue-900/10">
              <img
                src="/images/hero-team.jpg"
                alt="Westbridge Global team of Filipino professionals in a modern Manila office"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>

            {/* floating stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -left-4 top-8 rounded-2xl border border-slate-100 bg-white/95 px-5 py-4 shadow-xl backdrop-blur sm:-left-8"
            >
              <p className="text-2xl font-extrabold text-emerald-600">64%</p>
              <p className="text-xs font-medium text-slate-500">average client saving</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-6 right-4 rounded-2xl border border-slate-100 bg-white/95 px-5 py-4 shadow-xl backdrop-blur sm:right-8"
            >
              <p className="text-2xl font-extrabold text-blue-700">14 days</p>
              <p className="text-xs font-medium text-slate-500">average brief-to-start time</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
