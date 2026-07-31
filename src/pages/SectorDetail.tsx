import { Link, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Quote,
  PiggyBank,
  ChevronRight,
} from 'lucide-react'
import { getSector, sectors } from '@/data/sectors'
import { sectorIcons } from '@/pages/Sectors'
import { roles } from '@/data/content'
import NotFound from '@/pages/NotFound'

export default function SectorDetail() {
  const { slug } = useParams<{ slug: string }>()
  const sector = slug ? getSector(slug) : undefined
  if (!sector) return <NotFound />

  const Icon = sectorIcons[sector.slug] ?? CheckCircle2
  const relatedRoles = sector.exampleRoles
    .map((er) => ({ role: roles.find((r) => r.id === er.roleId), note: er.note }))
    .filter((x) => x.role)
  const otherSectors = sectors.filter((s) => s.slug !== sector.slug).slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
            <Link to="/sectors" className="hover:text-blue-700">
              Sectors
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-700">{sector.name}</span>
          </nav>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white">
              <Icon className="h-8 w-8" />
            </div>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Outsourcing for {sector.name}
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {sector.tagline}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{sector.heroIntro}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                How {sector.businessNoun} benefit from outsourcing to the Philippines
              </h2>
              {sector.overview.map((para) => (
                <p key={para.slice(0, 40)} className="mt-5 leading-relaxed text-slate-600">
                  {para}
                </p>
              ))}

              <h3 className="mt-10 text-xl font-bold text-slate-900">Where the value lands</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {sector.benefits.map((b) => (
                  <div key={b.title} className="rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      <h4 className="font-bold text-slate-900">{b.title}</h4>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="rounded-2xl border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <PiggyBank className="h-5 w-5" />
                    <h3 className="font-bold">Typical cost savings</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    {sector.savingsNote}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900">
                    Roles {sector.shortName.toLowerCase()} businesses hire through Ticky
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {relatedRoles.map(({ role, note }) => (
                      <li key={role!.id}>
                        <Link
                          to={`/roles/${role!.id}`}
                          className="group block rounded-xl border border-slate-100 p-3.5 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
                        >
                          <p className="flex items-center justify-between text-sm font-bold text-slate-900">
                            {role!.title}
                            <ArrowRight className="h-4 w-4 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">{note}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 w-full rounded-full border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Link to="/pricing">See pricing in your currency</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Case study */}
      <section className="bg-slate-50 py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
          >
            <Card className="overflow-hidden rounded-3xl border-slate-200">
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-white sm:p-10">
                <div className="flex items-center gap-2 text-blue-200">
                  <Quote className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-wider">
                    Client example — {sector.caseStudy.business}
                  </p>
                </div>
                <p className="mt-5 text-lg leading-relaxed">
                  <span className="font-semibold">The challenge:</span>{' '}
                  {sector.caseStudy.challenge}
                </p>
                <p className="mt-4 text-lg leading-relaxed">
                  <span className="font-semibold">The outcome:</span> {sector.caseStudy.result}
                </p>
                <Badge className="mt-6 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-500">
                  {sector.caseStudy.saving}
                </Badge>
              </div>
            </Card>
          </motion.div>

          <div className="mt-10 text-center">
            <Button
              asChild
              className="rounded-full bg-blue-700 px-7 font-semibold hover:bg-blue-800"
            >
              <Link to="/contact">
                Explore this for your business
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Other sectors */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Explore other sectors
            </h2>
            <Link
              to="/sectors"
              className="flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              All sectors
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherSectors.map((s) => {
              const SIcon = sectorIcons[s.slug] ?? CheckCircle2
              return (
                <Link
                  key={s.slug}
                  to={`/sectors/${s.slug}`}
                  className="group rounded-2xl border border-slate-200 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <SIcon className="h-6 w-6 text-blue-700" />
                  <p className="mt-3 font-bold text-slate-900 group-hover:text-blue-700">
                    {s.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.tagline}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
