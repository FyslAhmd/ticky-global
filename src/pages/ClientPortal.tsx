import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  CalendarCheck,
  ArrowLeft,
  BellRing,
} from 'lucide-react'

const planned = [
  {
    icon: Users,
    title: 'Your team, in one place',
    text: 'See your Westbridge team members, their roles, schedules and leave — without a single email.',
  },
  {
    icon: FileText,
    title: 'Invoices & contracts',
    text: 'Download monthly invoices, review your agreements and manage payment details securely.',
  },
  {
    icon: BarChart3,
    title: 'Performance reporting',
    text: 'Weekly activity summaries, KPI tracking and productivity reports for every team member.',
  },
  {
    icon: MessageSquare,
    title: 'Direct support channel',
    text: 'Message your account manager, raise requests and track responses in one thread.',
  },
  {
    icon: CalendarCheck,
    title: 'Reviews & check-ins',
    text: 'Book quarterly reviews, onboarding check-ins and replacement requests in a couple of clicks.',
  },
  {
    icon: BellRing,
    title: 'Announcements',
    text: 'Holiday calendars, service updates and new role availability, pushed straight to you.',
  },
]

export default function ClientPortal() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <Users className="h-8 w-8 text-emerald-700" />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-emerald-700">
            Client Portal
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Coming soon for Westbridge clients
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            We're building a dedicated portal where every Westbridge client can manage their
            offshore team, invoices and reporting in one place. Here's a preview of what's on the
            way.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {planned.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >
              <Card className="h-full rounded-2xl border-slate-200">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.text}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-12 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-8 py-10 text-center text-white"
        >
          <h2 className="text-2xl font-extrabold tracking-tight">Want early access?</h2>
          <p className="mx-auto mt-2 max-w-md text-emerald-100">
            Existing clients will be invited first. If you'd like to be notified the moment the
            portal opens, get in touch with your account manager or drop us a line.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-7 font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-transparent px-7 font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Westbridge staff? Use the{' '}
          <Link to="/admin" className="font-semibold text-blue-700 hover:underline">
            Admin / Office portal
          </Link>{' '}
          instead.
        </p>
      </div>
    </section>
  )
}
