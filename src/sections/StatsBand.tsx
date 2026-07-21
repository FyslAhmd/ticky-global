import { motion } from 'framer-motion'
import { stats } from '@/data/content'

export default function StatsBand() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center"
          >
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {stat.value}
            </p>
            <p className="mx-auto mt-2 max-w-[220px] text-sm leading-snug text-slate-500">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
