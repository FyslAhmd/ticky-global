import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { steps } from '@/data/content'

export default function ProcessPreview() {
  return (
    <section className="bg-slate-950 py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-400">How it works</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            From brief to new hire in about two weeks
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            A simple, proven process. You make the final hiring decision — we handle everything else.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <span className="text-4xl font-extrabold text-blue-500/40">{step.number}</span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {step.timeframe}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-blue-600 px-7 font-semibold hover:bg-blue-500"
          >
            <Link to="/how-it-works">
              See the full process
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
