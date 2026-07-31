import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  Calculator,
  Building2,
  ShoppingCart,
  Scale,
  HeartPulse,
  Code2,
  Palette,
  ArrowRight,
  TrendingDown,
} from 'lucide-react'
import { sectors } from '@/data/sectors'

export const sectorIcons: Record<string, React.ElementType> = {
  'recruitment-staffing': Users,
  'accounting-finance': Calculator,
  'real-estate-property': Building2,
  'ecommerce-retail': ShoppingCart,
  'legal-professional-services': Scale,
  'healthcare-medical': HeartPulse,
  'it-software': Code2,
  'marketing-creative-agencies': Palette,
}

export default function Sectors() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Sectors</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Outsourcing that understands your industry
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Every sector has its own workflows, software and pressures. Ticky Global builds
              dedicated Filipino teams for businesses across the UK, US, Canada, Australia and New
              Zealand — matched to your industry, working your hours, at 50–70% below the cost of a
              native hire. Explore how your sector benefits.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4">
            <TrendingDown className="h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-900">
              Across every sector below, clients typically save <strong>60% or more</strong> per
              role — fully loaded, with management, HR, equipment and payroll included.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector, i) => {
              const Icon = sectorIcons[sector.slug] ?? Users
              return (
                <motion.div
                  key={sector.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
                >
                  <Link to={`/sectors/${sector.slug}`} className="block h-full">
                    <Card className="h-full rounded-2xl border-slate-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/5">
                      <CardContent className="flex h-full flex-col p-7">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-slate-900">{sector.name}</h2>
                        <p className="mt-1 text-sm font-medium text-blue-700">{sector.tagline}</p>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                          {sector.heroIntro}
                        </p>
                        <div className="mt-5 flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            {sector.caseStudy.saving}
                          </Badge>
                          <span className="flex items-center text-sm font-semibold text-blue-700">
                            Explore
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-14 rounded-3xl bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-center text-white sm:p-12">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Don't see your sector? We probably still cover it.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-blue-100">
              If the role is done at a desk, it can almost always be done from the Philippines.
              Tell us what you need on a free discovery call.
            </p>
            <Button
              asChild
              className="mt-6 rounded-full bg-white px-7 font-semibold text-blue-800 hover:bg-blue-50"
            >
              <Link to="/contact">
                Book a Discovery Call
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
