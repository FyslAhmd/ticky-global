import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, PiggyBank } from 'lucide-react'
import { roles, regions, type Region } from '@/data/content'
import { trackCalculatorUsed, trackCtaClick } from '@/lib/tracking'

type Hours = 'full' | 'part'

export default function SavingsCalculator() {
  const [roleId, setRoleId] = useState(roles[0].id)
  const [region, setRegion] = useState<Region>('uk')
  const [hours, setHours] = useState<Hours>('full')

  const result = useMemo(() => {
    const role = roles.find((r) => r.id === roleId)!
    const factor = hours === 'full' ? 1 : 0.5
    const native = Math.round(role.native[region] * factor)
    const wb = Math.round(role.ticky[region] * factor)
    const monthly = native - wb
    const pct = Math.round((monthly / native) * 100)
    return { role, native, wb, monthly, annual: monthly * 12, pct }
  }, [roleId, region, hours])

  const sym = regions[region].symbol
  const fmt = (n: number) => `${sym}${n.toLocaleString()}`

  // Fire a calculator_used conversion event (debounced) when the visitor changes inputs
  const calcTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (calcTimer.current) clearTimeout(calcTimer.current)
    calcTimer.current = setTimeout(() => {
      trackCalculatorUsed({
        roleId: result.role.id,
        roleTitle: result.role.title,
        region,
        hours,
        annualSaving: result.annual,
        currency: regions[region].currency,
      })
    }, 1500)
    return () => {
      if (calcTimer.current) clearTimeout(calcTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, region, hours])

  return (
    <section id="savings" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Savings calculator
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            See exactly what you would save
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Compare the fully-loaded cost of a native western hire with a Ticky professional.
            No hidden extras — our fee includes salary, HR, equipment and management.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border-slate-200 shadow-xl shadow-slate-900/5">
            <div className="grid md:grid-cols-[1fr_1.1fr]">
              {/* Controls */}
              <CardContent className="space-y-6 p-7 sm:p-9">
                <div className="space-y-2 rounded-2xl bg-blue-50 p-4 ring-1 ring-blue-100">
                  <Label htmlFor="region" className="text-sm font-bold text-blue-800">
                    Your location
                  </Label>
                  <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
                    <SelectTrigger
                      id="region"
                      className="h-12 border-2 border-blue-600 bg-white text-base font-semibold text-blue-800"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(regions).map(([key, r]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <span>{r.flag}</span>
                            <span>{r.label}</span>
                            <span className="text-slate-400">({r.symbol} {r.currency})</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold text-slate-700">
                    Role
                  </Label>
                  <Select value={roleId} onValueChange={setRoleId}>
                    <SelectTrigger id="role" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Hours</Label>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                    {(
                      [
                        ['full', 'Full-time · 40h'],
                        ['part', 'Part-time · 20h'],
                      ] as [Hours, string][]
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setHours(value)}
                        className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                          hours === value
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-400">
                  Native hire cost includes salary, employer taxes, pension/benefits, equipment and
                  typical recruitment overheads. Ticky fees are fully loaded "starting from"
                  figures, confirmed on your discovery call.
                </p>
              </CardContent>

              {/* Result */}
              <div className="flex flex-col justify-center bg-gradient-to-br from-blue-700 to-blue-900 p-7 text-white sm:p-9">
                <div className="flex items-center gap-2 text-blue-200">
                  <PiggyBank className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Your estimated saving
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                    <span className="text-sm text-blue-100">
                      Native {regions[region].name} hire / month
                    </span>
                    <span className="text-xl font-bold text-blue-100 line-through decoration-red-300/80">
                      {fmt(result.native)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-white/15 pb-4">
                    <span className="text-sm text-blue-100">Ticky / month</span>
                    <span className="text-2xl font-extrabold">
                      <span className="mr-1.5 align-middle text-xs font-semibold uppercase tracking-wide text-blue-200">
                        From
                      </span>
                      {fmt(result.wb)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-emerald-300">You save / year</span>
                    <span className="text-3xl font-extrabold text-emerald-300 sm:text-4xl">
                      {fmt(result.annual)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-emerald-200">
                  That's a {result.pct}% reduction in staffing cost
                </div>

                <Button
                  asChild
                  className="mt-6 w-full rounded-full bg-white font-semibold text-blue-800 hover:bg-blue-50"
                >
                  <Link
                    to="/contact"
                    onClick={() =>
                      trackCtaClick({ label: 'Lock in this saving', path: window.location.pathname })
                    }
                  >
                    Lock in this saving
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
