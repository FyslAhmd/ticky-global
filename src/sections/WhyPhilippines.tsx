import { motion } from 'framer-motion'
import { Languages, Globe2, Clock3, GraduationCap } from 'lucide-react'

const features = [
  {
    icon: Languages,
    title: 'Clear, natural English',
    text: 'English is an official language of the Philippines and the language of business and higher education. Every candidate is screened for neutral accent, fluent speech and polished writing.',
  },
  {
    icon: Globe2,
    title: 'Westernised culture',
    text: 'Decades of close ties with the US, UK and Australia mean Filipino professionals intuitively understand western business etiquette, humour and customer expectations.',
  },
  {
    icon: Clock3,
    title: 'Your hours, covered',
    text: 'A well-established night-shift culture built on serving western markets means your team works your business day — UK, US or Australian time.',
  },
  {
    icon: GraduationCap,
    title: 'Deep graduate talent pool',
    text: 'The Philippines produces hundreds of thousands of university graduates a year. We hire the top slice and train them further before they ever join your team.',
  },
]

export default function WhyPhilippines() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5">
                <img
                  src="/images/why-philippines.jpg"
                  alt="Filipino professionals on a video call with a western client"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-2 rounded-2xl bg-blue-700 px-6 py-4 text-white shadow-xl sm:right-6">
                <p className="text-2xl font-extrabold">Top 3</p>
                <p className="text-xs font-medium text-blue-200">
                  largest English-speaking nation in the world
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Why the Philippines
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Western standard. Half the cost.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              The Philippines is the world's leading destination for offshore office talent — and
              for good reason. It is not about cheaper labour; it is about exceptional people at a
              fair local wage.
            </p>

            <div className="mt-8 space-y-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{f.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
