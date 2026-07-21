import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Phone,
  Briefcase,
  ClipboardList,
  Megaphone,
  Headset,
  Calculator as CalcIcon,
  UserCog,
  Share2,
  CheckCircle2,
  Wrench,
  ArrowRight,
} from 'lucide-react'
import { roles, regions, type Region } from '@/data/content'

const iconMap: Record<string, React.ElementType> = {
  telesales: Phone,
  'sales-exec': Briefcase,
  admin: ClipboardList,
  marketing: Megaphone,
  'customer-service': Headset,
  bookkeeper: CalcIcon,
  ea: UserCog,
  social: Share2,
}

export default function Roles() {
  const [region, setRegion] = useState<Region>('uk')
  const sym = regions[region].symbol

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Roles & pricing
              </p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Every role your office needs, at half the cost
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                All prices are fully loaded monthly fees — salary, benefits, HR, equipment, secure
                office facilities and a dedicated account manager included. Part-time is simply
                50% of the full-time fee.
              </p>
            </div>
            <div className="w-full max-w-[240px]">
              <p className="mb-2 text-sm font-semibold text-slate-700">Show pricing for</p>
              <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
                <SelectTrigger className="h-11 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(regions).map(([key, r]) => (
                    <SelectItem key={key} value={key}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {roles.map((role, i) => {
              const Icon = iconMap[role.id] ?? Briefcase
              const savingPct = Math.round(
                ((role.native[region] - role.westbridge[region]) / role.native[region]) * 100,
              )
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                >
                  <Card className="h-full rounded-2xl border-slate-200 transition-shadow hover:shadow-lg hover:shadow-blue-900/5">
                    <CardContent className="p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-slate-900">{role.title}</h2>
                            {role.popular && (
                              <Badge className="mt-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50">
                                Most in demand
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge className="shrink-0 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-600">
                          Save {savingPct}%
                        </Badge>
                      </div>

                      <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                        {role.description}
                      </p>

                      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {role.responsibilities.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {r}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 flex flex-wrap items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5 text-slate-400" />
                        {role.tools.map((tool) => (
                          <Badge
                            key={tool}
                            variant="secondary"
                            className="rounded-full bg-slate-100 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-xl bg-slate-50 p-5">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Native {regions[region].name} hire:{' '}
                            <span className="line-through">
                              {sym}
                              {role.native[region].toLocaleString()}/mo
                            </span>
                          </p>
                          <p className="mt-1 text-2xl font-extrabold text-slate-900">
                            {sym}
                            {role.westbridge[region].toLocaleString()}
                            <span className="text-sm font-medium text-slate-500"> / month FT</span>
                          </p>
                          <p className="text-xs text-slate-500">
                            or {sym}
                            {Math.round(role.westbridge[region] / 2).toLocaleString()}/mo part-time
                          </p>
                        </div>
                        <Button
                          asChild
                          className="rounded-full bg-blue-700 font-semibold hover:bg-blue-800"
                        >
                          <Link to="/contact">
                            Hire this role
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-slate-400">
            Native hire figures are indicative fully-loaded costs (salary, employer taxes, benefits,
            equipment and recruitment overheads) for comparable roles. Final Westbridge pricing is
            confirmed on your discovery call based on seniority and requirements.
          </p>
        </div>
      </section>
    </>
  )
}
