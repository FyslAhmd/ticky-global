import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useInView, animate } from 'framer-motion'
import { Button } from '@/components/ui/button'
import SavingsCalculator from '@/sections/SavingsCalculator'
import { roles, testimonials } from '@/data/content'
import { trackCtaClick } from '@/lib/tracking'
import {
  ArrowRight, CheckCircle2, TrendingDown, Calculator, Phone,
  Sparkles, Users, Banknote, ShieldCheck, Clock3, Flame,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Animated number that counts up when scrolled into view              */
/* ------------------------------------------------------------------ */
function Counter({ to, prefix = '', suffix = '', duration = 1.6 }: {
  to: number; prefix?: string; suffix?: string; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

const gbp = (n: number) => `£${n.toLocaleString()}`

// Real UK figures from the pricing data
const uk = roles.map((r) => {
  const save = r.native.uk - r.ticky.uk
  const pct = Math.round((save / r.native.uk) * 100)
  return { ...r, save, pct, annual: save * 12 }
})
const avgMonthlySave = Math.round(uk.reduce((s, r) => s + r.save, 0) / uk.length)

/* ------------------------------------------------------------------ */
/* HOMEPAGE — high-conversion, stats-led design (published)            */
/* ------------------------------------------------------------------ */
export default function HomeAlt() {
  const [monthsWaited, setMonthsWaited] = useState(1)

  const cta = (label: string) => trackCtaClick({ label, path: '/' })

  return (
    <div className="bg-slate-950 text-white">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Banner image — softened and brightened so the page feels warm, not gloomy */}
        <img
          src="/images/hero-banner.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Warm light wash: bright centre fading to soft slate at the edges, keeping text crisp */}
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.10),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/15 to-slate-950" />
        <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-20 pt-16 text-center sm:px-10 sm:pt-24 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex max-w-full items-center justify-center gap-3 rounded-full border-2 border-emerald-400/60 bg-emerald-500/15 px-6 py-3.5 text-lg font-extrabold text-emerald-300 shadow-[0_0_40px_rgba(52,211,153,0.25)] sm:px-9 sm:py-4 sm:text-2xl">
              <TrendingDown className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
              <span className="leading-snug">Our clients save an average of <span className="whitespace-nowrap text-emerald-400">72%</span> on staffing costs</span>
            </span>

            <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Your next great hire costs{' '}
              <span className="relative whitespace-nowrap text-emerald-400">
                half as much
                <svg className="absolute -bottom-2.5 left-0 w-full" viewBox="0 0 220 12" fill="none" aria-hidden="true">
                  <path d="M3 9c60-6 154-6 214-2" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Degree-educated, western-standard Filipino professionals — sales, admin, marketing
              and more — working your hours, for a fraction of a native hire.
            </p>
          </motion.div>

          {/* The money shot — three giant animated stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6"
          >
            {[
              { big: <Counter to={72} suffix="%" />, label: 'average client saving', sub: 'vs. a native western hire' },
              { big: <Counter to={avgMonthlySave} prefix="£" />, label: 'saved per role, per month', sub: 'based on current UK pricing' },
              { big: <Counter to={14} suffix=" days" />, label: 'brief to start', sub: 'pre-vetted talent, ready to go' },
            ].map((s, i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-5xl font-extrabold tracking-tight text-emerald-400">{s.big}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white">{s.label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="rounded-full bg-emerald-500 px-8 py-6 text-lg font-bold text-emerald-950 shadow-2xl shadow-emerald-500/25 hover:bg-emerald-400">
              <Link to="/book" onClick={() => cta('Hero — Book discovery call')}>
                Book a Free Discovery Call <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-white/5 px-8 py-6 text-lg font-bold text-white hover:bg-white/10 hover:text-white">
              <a href="#the-maths" onClick={() => cta('Hero — See the maths')}>
                <Calculator className="mr-2 h-5 w-5" /> See the Maths
              </a>
            </Button>
          </motion.div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-300">
            {['No long lock-in contracts', 'Replacement guarantee', 'One simple monthly invoice'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ OFFICE ADMINISTRATOR OVERVIEW / COMPARISON ============ */}
      <section className="border-t border-white/10 bg-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-12">
            {/* Video */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              className="mx-auto w-full max-w-[220px] lg:mx-0"
            >
              <div className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-emerald-500/10">
                <video
                  src="/uploads/office-admin-overview.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-[9/16] w-full bg-slate-950 object-cover"
                />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-slate-200">Robert Dwyer — Co-Founder</p>
            </motion.div>

            {/* Comparison copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="lg:max-w-4xl"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">Role spotlight — Office Administrator</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                A western-standard Office Administrator for{' '}
                <span className="text-emerald-400">up to 70% less</span> than a native hire.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
                Inbox, diary, data entry, documents and the day-to-day coordination that keeps your business
                running — handled by a degree-educated Filipino professional working your exact business hours.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Native UK hire</p>
                  <p className="mt-1.5 text-2xl font-extrabold text-slate-400 line-through decoration-red-400 decoration-2">{gbp(2800)}<span className="text-sm font-medium">/mo</span></p>
                  <p className="mt-1 text-xs text-slate-500">fully loaded</p>
                </div>
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">With Ticky</p>
                  <p className="mt-1.5 text-2xl font-extrabold text-emerald-400">{gbp(1085)}<span className="text-sm font-medium">/mo</span></p>
                  <p className="mt-1 text-xs text-emerald-300/70">everything included</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">You save</p>
                  <p className="mt-1.5 text-2xl font-extrabold text-white">61%<span className="text-sm font-medium text-slate-400"> — {gbp(20580)}/yr</span></p>
                  <p className="mt-1 text-xs text-slate-500">part-time saves up to 70%</p>
                </div>
              </div>

              <ul className="mt-7 grid gap-2.5 text-[15px] font-medium text-slate-200 sm:grid-cols-2">
                {[
                  'Inbox & diary management',
                  'Data entry, CRM & spreadsheets',
                  'Document preparation',
                  'Supplier, travel & meeting coordination',
                  'Trained on Microsoft 365 & Google Workspace',
                  'Your business hours, part- or full-time',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-emerald-500 px-7 font-bold text-emerald-950 hover:bg-emerald-400">
                  <Link to="/book" onClick={() => cta('Admin spotlight — Book call')}>
                    Hire an Office Administrator <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-white/5 px-7 font-bold text-white hover:bg-white/10 hover:text-white">
                  <Link to="/roles/admin" onClick={() => cta('Admin spotlight — Role detail')}>
                    See the full role breakdown
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ THE MATHS — role by role ============ */}
      <section id="the-maths" className="border-t border-white/10 bg-white py-16 text-slate-900 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-emerald-600">The maths, role by role</p>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            This is what “half as much” actually looks like
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Fully-loaded monthly cost of a UK hire vs. the same role through Ticky Global.
            Real numbers from our current pricing — no smoke, no mirrors.
          </p>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60">
            {uk.slice(0, 6).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${i % 2 ? 'bg-slate-50' : 'bg-white'}`}
              >
                <div className="sm:w-56">
                  <p className="font-bold text-slate-900">{r.shortTitle}</p>
                  <p className="text-xs text-slate-500">full-time, your business hours</p>
                </div>
                <div className="flex items-center gap-6 sm:gap-10">
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">UK hire</p>
                    <p className="text-lg font-bold text-slate-400 line-through decoration-red-400 decoration-2">{gbp(r.native.uk)}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">With Ticky</p>
                    <p className="text-2xl font-extrabold text-emerald-600">{gbp(r.ticky.uk)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:w-52 sm:justify-end">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-extrabold text-emerald-700">
                    Save {r.pct}%
                  </span>
                  <span className="text-sm font-semibold text-slate-600">{gbp(r.annual)}/yr</span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            UK hire cost includes salary, employer NI, pension, benefits, equipment & office space. Ticky fee is fully loaded — salary, HR, payroll, equipment & management.
          </p>
        </div>
      </section>

      {/* ============ DOUBLE THE TEAM ============ */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">Or look at it this way</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                The budget for <span className="text-slate-400 line-through decoration-red-400">one</span> UK hire builds you a{' '}
                <span className="text-emerald-400">team of two</span> — with change left over.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-300">
                A UK sales executive costs around {gbp(4200)}/month fully loaded. The same money gets you
                a Ticky sales executive <em>and</em> a Ticky telesales rep feeding them — and you still keep{' '}
                <strong className="text-emerald-400">{gbp(4200 - 1720 - 1260)}</strong> every single month.
              </p>
              <Button asChild size="lg" className="mt-7 rounded-full bg-emerald-500 px-7 font-bold text-emerald-950 hover:bg-emerald-400">
                <Link to="/book" onClick={() => cta('Double the team — Book call')}>
                  Build my team <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-6 text-center">
                <Users className="mx-auto h-8 w-8 text-red-300" />
                <p className="mt-3 text-4xl font-extrabold text-red-300">1</p>
                <p className="mt-1 text-sm font-semibold text-slate-300">UK sales hire</p>
                <p className="mt-2 text-2xl font-extrabold text-white">{gbp(4200)}<span className="text-sm font-medium text-slate-400">/mo</span></p>
              </div>
              <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center">
                <Users className="mx-auto h-8 w-8 text-emerald-300" />
                <p className="mt-3 text-4xl font-extrabold text-emerald-300">2</p>
                <p className="mt-1 text-sm font-semibold text-slate-300">Ticky hires</p>
                <p className="mt-2 text-2xl font-extrabold text-white">{gbp(2980)}<span className="text-sm font-medium text-slate-400">/mo</span></p>
                <p className="mt-2 inline-block rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-300">
                  + {gbp(1220)}/mo left over
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ INTERACTIVE SAVINGS (full calculator) ============ */}
      <SavingsCalculator />

      {/* ============ PROOF ============ */}
      <section className="border-t border-white/10 bg-white py-16 text-slate-900 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-emerald-600">Clients already banking it</p>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Real clients. Real savings.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-sm font-extrabold text-white">
                  <Banknote className="h-3.5 w-3.5" />{t.saving}
                </span>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{t.initials}</span>
                  <span>
                    <span className="block text-sm font-bold">{t.name}</span>
                    <span className="block text-xs text-slate-500">{t.role} — {t.company}</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COST OF WAITING ============ */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Flame className="mx-auto h-9 w-9 text-amber-400" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Every month you wait has a price tag.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            The average client saves <strong className="text-emerald-400">{gbp(avgMonthlySave)} per role, per month</strong>.
            Drag the slider — that's money that could have stayed in your business.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <input
              type="range" min={1} max={12} value={monthsWaited}
              onChange={(e) => setMonthsWaited(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Waiting {monthsWaited} {monthsWaited === 1 ? 'month' : 'months'} costs you
            </p>
            <p className="mt-2 text-6xl font-extrabold tracking-tight text-amber-400">
              {gbp(avgMonthlySave * monthsWaited)}
            </p>
            <p className="mt-1 text-sm text-slate-500">per role, gone — not invested, not saved, just spent</p>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="border-t border-white/10 bg-gradient-to-b from-emerald-950/50 to-slate-950 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Your next great hire costs <span className="text-emerald-400">half as much</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            One 30-minute call. We'll map your role, show you pre-vetted candidates and give you
            an exact monthly price. No obligation, no hard sell.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-emerald-500 px-9 py-6 text-lg font-bold text-emerald-950 shadow-2xl shadow-emerald-500/30 hover:bg-emerald-400">
              <Link to="/book" onClick={() => cta('Final CTA — Book call')}>
                Book Your Free Discovery Call <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-white/5 px-8 py-6 text-base font-bold text-white hover:bg-white/10 hover:text-white">
              <a href="tel:08081753413" onClick={() => cta('Final CTA — Phone')}>
                <Phone className="mr-2 h-4 w-4" /> 0808 175 3413
              </a>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Replacement guarantee</li>
            <li className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-emerald-400" /> Starting in as little as 14 days</li>
            <li className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-emerald-400" /> 72% average client saving</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
