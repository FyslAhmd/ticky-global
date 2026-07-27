import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { trpc } from '@/providers/trpc'
import { renderMarkdown } from '@/lib/markdown'
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>()
  const page = trpc.public.pageBySlug.useQuery(
    { slug: slug ?? '' },
    { enabled: !!slug, retry: false },
  )

  if (page.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
      </div>
    )
  }

  if (page.isError || !page.data) {
    return (
      <section className="bg-gradient-to-b from-blue-50 to-white py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Page not found</h1>
          <p className="mt-4 text-lg text-slate-600">
            This page doesn't exist or hasn't been published yet.
          </p>
          <Button asChild className="mt-8 rounded-full bg-blue-700 hover:bg-blue-800">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  const p = page.data

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Westbridge Global
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {p.title}
            </h1>
            {p.excerpt && <p className="mt-4 text-lg leading-relaxed text-slate-600">{p.excerpt}</p>}
            <p className="mt-4 text-sm text-slate-400">
              {new Date(p.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white pb-20 pt-4 lg:pb-28">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prose prose-slate mx-auto max-w-3xl px-4 prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-extrabold prose-h2:tracking-tight prose-h2:text-slate-900 prose-h3:mt-8 prose-h3:text-xl prose-h3:font-bold prose-h3:text-slate-900 prose-p:text-[16px] prose-p:leading-relaxed prose-p:text-slate-600 prose-li:text-[16px] prose-li:text-slate-600 sm:px-6 lg:px-8"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }}
        />

        <div className="mx-auto mt-16 max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-900 px-8 py-12 text-center text-white">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Ready to build your offshore team?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Book a free discovery call and see exactly what you could save.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 rounded-full bg-white font-semibold text-blue-800 hover:bg-blue-50"
            >
              <Link to="/contact">
                Book Your Free Discovery Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
