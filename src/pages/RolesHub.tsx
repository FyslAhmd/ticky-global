import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Phone,
  Briefcase,
  ClipboardList,
  Megaphone,
  Headset,
  Calculator as CalcIcon,
  UserCog,
  Share2,
  Target,
  ArrowRight,
  GraduationCap,
  Languages,
  ShieldCheck,
} from 'lucide-react'
import { roles } from '@/data/content'
import { roleDetails } from '@/data/roleDetails'

export const roleIcons: Record<string, React.ElementType> = {
  telesales: Phone,
  'sales-exec': Briefcase,
  admin: ClipboardList,
  marketing: Megaphone,
  'customer-service': Headset,
  bookkeeper: CalcIcon,
  ea: UserCog,
  social: Share2,
  ppc: Target,
}

const calibreHighlights = [
  {
    icon: GraduationCap,
    title: 'Degree-educated professionals',
    text: 'Every candidate holds a university degree and passes skills testing against your specific brief.',
  },
  {
    icon: Languages,
    title: 'Western-standard English',
    text: 'English is an official language of the Philippines. Written and spoken assessments plus live interviews come as standard.',
  },
  {
    icon: ShieldCheck,
    title: 'Employed, equipped & managed',
    text: 'Ticky employs your team directly — payroll, HR, secure equipment and a dedicated management layer included.',
  },
]

export default function RolesHub() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Our roles</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Filipino professionals for every office function
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              From telesales and customer service to bookkeeping and marketing, Ticky Global
              recruits, employs and manages dedicated professionals for businesses across the UK,
              US, Canada, Australia and New Zealand — full-time or part-time, from around half the
              cost of a native hire.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {calibreHighlights.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <c.icon className="h-6 w-6 text-blue-700" />
                <h2 className="mt-3 font-bold text-slate-900">{c.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role, i) => {
              const Icon = roleIcons[role.id] ?? Briefcase
              const detail = roleDetails[role.id]
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                >
                  <Link to={`/roles/${role.id}`} className="block h-full">
                    <Card className="h-full rounded-2xl border-slate-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/5">
                      <CardContent className="flex h-full flex-col p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                              <Icon className="h-6 w-6" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">{role.title}</h2>
                          </div>
                          {role.popular && (
                            <Badge className="shrink-0 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50">
                              Most in demand
                            </Badge>
                          )}
                        </div>
                        <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-600">
                          {role.description}
                        </p>
                        {detail && (
                          <p className="mt-3 text-sm font-medium text-blue-700">
                            From £{role.ticky.uk.toLocaleString()}/mo — {detail.caseStudy.saving}{' '}
                            for one client
                          </p>
                        )}
                        <span className="mt-5 flex items-center text-sm font-semibold text-blue-700">
                          Calibre, offering & case study
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-14 rounded-3xl bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-center text-white sm:p-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Need a role you don't see here?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-blue-100">
              If it is done at a desk, we can almost certainly recruit it. Tell us the brief on a
              free discovery call.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-white px-7 font-semibold text-blue-800 hover:bg-blue-50"
              >
                <Link to="/contact">
                  Book a Discovery Call
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/40 px-7 font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
