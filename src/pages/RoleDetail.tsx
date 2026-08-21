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
  Wrench,
  ChevronRight,
  GraduationCap,
  Target,
} from 'lucide-react'
import { roles, regions, regionKeys } from '@/data/content'
import { getRoleDetail } from '@/data/roleDetails'
import { roleIcons } from '@/pages/RolesHub'
import NotFound from '@/pages/NotFound'

export default function RoleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const role = roles.find((r) => r.id === slug)
  const detail = slug ? getRoleDetail(slug) : undefined
  if (!role || !detail) return <NotFound />

  const Icon = roleIcons[role.id] ?? CheckCircle2
  const otherRoles = roles.filter((r) => r.id !== role.id).slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
            <Link to="/roles" className="hover:text-blue-700">
              Roles
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-700">{role.title}</span>
          </nav>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white">
              <Icon className="h-8 w-8" />
            </div>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Hire a {role.title} from the Philippines
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {role.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{detail.heroIntro}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calibre & offering */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  The calibre you can expect
                </h2>
              </div>
              <p className="mt-4 leading-relaxed text-slate-600">{detail.calibre.intro}</p>
              <ul className="mt-5 space-y-3">
                {detail.calibre.points.map((point) => (
                  <li key={point.slice(0, 40)} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="leading-relaxed text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-2.5">
                <Target className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  What's included in the offering
                </h2>
              </div>
              <p className="mt-4 leading-relaxed text-slate-600">{detail.offering}</p>

              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {role.responsibilities.map((resp) => (
                  <li key={resp} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {resp}
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900">Typical monthly savings</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Fully loaded native hire vs Ticky "starting from" fee (full-time)
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {regionKeys.map((key) => {
                      const r = regions[key]
                      const pct = Math.round(
                        ((role.native[key] - role.ticky[key]) / role.native[key]) * 100,
                      )
                      return (
                        <li
                          key={key}
                          className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5"
                        >
                          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <span>{r.flag}</span> {r.label}
                          </span>
                          <span className="text-sm font-bold text-emerald-600">
                            Save {pct}% · from {r.symbol}
                            {role.ticky[key].toLocaleString()}/mo
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <Button
                    asChild
                    className="mt-4 w-full rounded-full bg-blue-700 font-semibold hover:bg-blue-800"
                  >
                    <Link to={`/pricing/${regionKeys[0]}`}>Full pricing breakdown</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900">Ideal for</h3>
                  <ul className="mt-3 space-y-2.5">
                    {detail.idealFor.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
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
                    Case study — {detail.caseStudy.business}
                  </p>
                </div>
                <blockquote className="mt-5 text-xl font-medium leading-relaxed">
                  "{detail.caseStudy.quote}"
                </blockquote>
                <p className="mt-4 leading-relaxed text-blue-100">{detail.caseStudy.result}</p>
                <Badge className="mt-6 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-500">
                  {detail.caseStudy.saving}
                </Badge>
              </div>
            </Card>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="rounded-full bg-blue-700 px-7 font-semibold hover:bg-blue-800"
            >
              <Link to="/contact">
                Hire a {role.shortTitle.toLowerCase()} professional
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-blue-200 px-7 font-semibold text-blue-700 hover:bg-blue-50"
            >
              <Link to="/#savings">Calculate your saving</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Other roles */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Explore other roles
            </h2>
            <Link
              to="/roles"
              className="flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              All roles
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherRoles.map((r) => {
              const RIcon = roleIcons[r.id] ?? CheckCircle2
              return (
                <Link
                  key={r.id}
                  to={`/roles/${r.id}`}
                  className="group rounded-2xl border border-slate-200 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <RIcon className="h-6 w-6 text-blue-700" />
                  <p className="mt-3 font-bold text-slate-900 group-hover:text-blue-700">
                    {r.shortTitle}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {r.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
