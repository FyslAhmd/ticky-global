import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calculator, CheckCircle2, TrendingDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      {/* Banner image — full width on desktop, tighter crop with shifted focus on mobile */}
      <img
        src="/images/hero-banner.jpg"
        alt="Ticky Global team of Filipino professionals in a modern Manila office"
        className="absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-[center_30%]"
      />
      {/* Legibility overlays: strong dark gradient from the left (where the copy sits) + overall tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

      {/* Overlayed messaging */}
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 md:min-h-[640px] lg:min-h-[78vh] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <Badge className="mb-5 gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-1.5 text-sm font-semibold text-emerald-300 backdrop-blur-sm hover:bg-emerald-500/15">
            <TrendingDown className="h-4 w-4" />
            Save at least 50% on staffing costs
          </Badge>

          <h1 className="text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your next great hire costs{' '}
            <span className="relative whitespace-nowrap text-[#93C5FD] drop-shadow-[0_1px_2px_rgba(2,6,23,0.8)]">
              half as much
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 12" fill="none" aria-hidden="true">
                <path d="M3 9c60-6 154-6 214-2" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">
            Ticky Global recruits highly trained, western-standard office professionals from
            the Philippines — sales, telesales, administration, marketing and more. Clear written
            and spoken English, your business hours, part-time or full-time.
          </p>

          <ul className="mt-6 space-y-2.5 text-[15px] font-medium text-white">
            {[
              'Pre-vetted, degree-educated Filipino professionals',
              'Working your UK, US, Canadian, Australian or NZ business hours',
              'One simple monthly invoice — we handle HR, payroll & equipment',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-blue-600 px-7 text-base font-semibold shadow-xl shadow-blue-950/40 hover:bg-blue-500"
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
              className="rounded-full border-white/50 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <a href="#savings">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Your Savings
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Floating stat chips over the banner (desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute bottom-8 right-8 hidden flex-col gap-3 lg:flex"
      >
        <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white shadow-xl backdrop-blur-md">
          <p className="text-xl font-extrabold text-emerald-300">64%</p>
          <p className="text-xs font-medium text-slate-200">average client saving</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-white shadow-xl backdrop-blur-md">
          <p className="text-xl font-extrabold text-blue-300">14 days</p>
          <p className="text-xs font-medium text-slate-200">average brief-to-start time</p>
        </div>
      </motion.div>
    </section>
  )
}
