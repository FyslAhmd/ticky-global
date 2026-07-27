import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Quote, ArrowRight, ArrowLeft, PiggyBank, Users, Building2, TrendingDown, Star } from 'lucide-react'
import Stars from '@/components/Stars'
import { reviews } from '@/data/reviews'

const aggregates = [
  { icon: Star, value: '5.0', label: 'Average client rating' },
  { icon: Users, value: '120+', label: 'Businesses supported' },
  { icon: PiggyBank, value: '£4.2m+', label: 'Client staffing costs saved' },
]

export default function Reviews() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Client reviews
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Real businesses. Real savings.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Founders and directors across the UK, US and Australia on what happened when they
              moved their office functions to a Westbridge team in the Philippines.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {aggregates.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Card className="rounded-2xl border-slate-200 text-center">
                  <CardContent className="p-6">
                    <a.icon className="mx-auto h-6 w-6 text-blue-700" />
                    <p className="mt-2 text-3xl font-extrabold text-slate-900">{a.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{a.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          {reviews.map((review, i) => (
            <motion.article
              key={review.id}
              id={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55 }}
              className="scroll-mt-24"
            >
              <Card
                className={`overflow-hidden rounded-3xl border-slate-200 shadow-sm ${
                  i % 2 === 1 ? 'bg-slate-50/60' : ''
                }`}
              >
                <div className={`grid lg:grid-cols-[320px_1fr] ${i % 2 === 1 ? 'lg:grid-cols-[1fr_320px]' : ''}`}>
                  {/* Photo panel */}
                  <div className={`relative ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img
                      src={review.photo}
                      alt={`${review.name}, ${review.role} at ${review.company}`}
                      className="h-64 w-full object-cover object-top lg:h-full"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-5 lg:p-6">
                      <p className="text-lg font-bold text-white">{review.name}</p>
                      <p className="text-sm text-slate-300">
                        {review.role}, {review.company}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                        <Building2 className="h-3.5 w-3.5" />
                        {review.industry} · {review.location}
                      </div>
                    </div>
                  </div>

                  {/* Story panel */}
                  <CardContent className={`p-7 sm:p-10 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Stars rating={review.rating} className="h-5 w-5" />
                      <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-600">
                        <TrendingDown className="mr-1 h-3.5 w-3.5" />
                        Saves {review.saving}
                      </Badge>
                    </div>

                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      "{review.headline}"
                    </h2>

                    <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-slate-600">
                      {review.story.map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Westbridge team:
                      </span>
                      {review.hires.map((hire) => (
                        <Badge
                          key={hire}
                          variant="secondary"
                          className="rounded-full bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          {hire}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-white pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 px-6 py-16 text-center text-white sm:px-12">
            <Quote className="mx-auto h-9 w-9 text-emerald-300" />
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to write your own success story?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
              Book a free discovery call and we'll show you exactly what your business could save —
              with real candidate profiles to review.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-8 text-base font-semibold text-blue-800 hover:bg-blue-50"
              >
                <Link to="/contact">
                  Book Your Free Discovery Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
