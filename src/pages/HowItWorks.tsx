import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  LineChart,
  RefreshCcw,
} from 'lucide-react'
import { steps } from '@/data/content'

const ongoing = [
  {
    icon: HeartHandshake,
    title: 'Dedicated account manager',
    text: 'One point of contact who knows your business and checks in proactively — not a faceless support queue.',
  },
  {
    icon: LineChart,
    title: 'Performance management',
    text: 'Time tracking, productivity reporting and structured reviews keep output high and visible to you.',
  },
  {
    icon: ShieldCheck,
    title: 'Security & compliance',
    text: 'Managed, encrypted equipment, NDAs, 2FA and support for your own VPN, VDI and GDPR requirements.',
  },
  {
    icon: RefreshCcw,
    title: 'Free replacement guarantee',
    text: 'If a placement is not working out, we recruit and onboard a replacement at no additional cost.',
  },
]

export default function HowItWorks() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              How it works
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Hiring offshore, minus the hard parts
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              We recruit, vet, train, employ and manage your Filipino team members. You interview,
              choose and direct their work. From first call to start date in around two weeks.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative space-y-10 before:absolute before:inset-y-2 before:left-[27px] before:w-0.5 before:bg-blue-100 sm:before:left-1/2 sm:before:-translate-x-1/2">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col gap-6 pl-16 sm:w-1/2 sm:pl-0 ${
                  i % 2 === 0
                    ? 'sm:pr-14 sm:text-right'
                    : 'sm:ml-auto sm:pl-14'
                }`}
              >
                {/* node */}
                <div
                  className={`absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-lg font-extrabold text-white shadow-lg shadow-blue-700/25 sm:top-0 ${
                    i % 2 === 0 ? 'sm:-right-7 sm:left-auto' : 'sm:-left-7'
                  }`}
                >
                  {step.number}
                </div>
                <Card className="rounded-2xl border-slate-200">
                  <CardContent className="p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {step.timeframe}
                    </p>
                    <h2 className="mt-1.5 text-xl font-bold text-slate-900">{step.title}</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                    <ul
                      className={`mt-4 space-y-2 text-sm text-slate-600 ${
                        i % 2 === 0 ? 'sm:flex sm:flex-col sm:items-end' : ''
                      }`}
                    >
                      {step.details.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing support */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              After they start
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              We stay involved, so you don't have to worry
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Ticky is not a recruitment agency that disappears after placement. We employ,
              house, equip and support your team for as long as you work with us.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ongoing.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Card className="h-full rounded-2xl border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-blue-700 px-8 text-base font-semibold hover:bg-blue-800"
            >
              <Link to="/contact">
                Start with a free discovery call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
