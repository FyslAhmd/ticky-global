import { useRef } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Quote, ArrowRight } from 'lucide-react'
import Stars from '@/components/Stars'
import { reviews as fallbackReviews, type Review } from '@/data/reviews'
import { trpc } from '@/providers/trpc'

export default function LeadersCarousel() {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }))
  const query = trpc.public.reviews.useQuery(undefined, { retry: 1 })
  const reviews: Review[] = query.data?.length
    ? query.data.map((r) => ({ ...r, id: r.slug, photo: r.photo ?? '' }))
    : fallbackReviews

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Client stories
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Business leaders who made the switch
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From London to Austin to Sydney — hear from the founders and directors whose teams,
              and margins, were transformed by Westbridge.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full font-semibold">
            <Link to="/reviews">
              Read all reviews
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          <Carousel
            opts={{ align: 'start', loop: true }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link to={`/reviews#${review.id}`} className="block h-full">
                    <Card className="group h-full overflow-hidden rounded-2xl border-slate-200 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10">
                      {/* Photo */}
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={review.photo}
                          alt={`${review.name}, ${review.role} at ${review.company}`}
                          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute right-3 top-3 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-600/95">
                          Saves {review.saving}
                        </Badge>
                      </div>

                      <CardContent className="p-6">
                        <Stars rating={review.rating} />
                        <div className="mt-3 flex items-start gap-2.5">
                          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                          <p className="line-clamp-3 text-[15px] font-medium leading-relaxed text-slate-700">
                            {review.quote}
                          </p>
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <p className="font-bold text-slate-900">{review.name}</p>
                          <p className="text-sm text-slate-500">
                            {review.role}, {review.company}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">{review.location}</p>
                        </div>

                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition-colors group-hover:text-blue-800">
                          Read {review.name.split(' ')[0]}'s story
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-8 flex items-center justify-center gap-3">
              <CarouselPrevious className="static translate-y-0 rounded-full border-slate-300 hover:border-blue-700 hover:bg-blue-700 hover:text-white" />
              <CarouselNext className="static translate-y-0 rounded-full border-slate-300 hover:border-blue-700 hover:bg-blue-700 hover:text-white" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  )
}
