import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, Mail, Phone, CalendarCheck, Clock3, ShieldCheck, CircleAlert } from 'lucide-react'
import { roles } from '@/data/content'
import { trpc } from '@/providers/trpc'

const expectations = [
  {
    icon: CalendarCheck,
    title: 'A 30-minute call, on your schedule',
    text: 'We learn about your business and the role you are thinking about.',
  },
  {
    icon: Clock3,
    title: 'An exact price within 24 hours',
    text: 'A written quote for part-time or full-time, in your currency, with no obligation.',
  },
  {
    icon: ShieldCheck,
    title: 'Real candidate profiles',
    text: 'See video introductions of pre-vetted professionals before you commit to anything.',
  },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = trpc.public.submitEnquiry.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => setError(e.message || 'Something went wrong — please try again.'),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    submit.mutate({
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? '') || undefined,
      roleInterest: String(data.get('roleInterest') ?? '') || undefined,
      hours: (String(data.get('hours') ?? '') || undefined) as 'full' | 'part' | 'unsure' | undefined,
      message: String(data.get('message') ?? '') || undefined,
    })
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Book a discovery call
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Let's find your first Westbridge hire
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              Tell us a little about what you need and we will be in touch within one business day
              to arrange your free discovery call. No pressure, no obligation — just a clear picture
              of what you could save.
            </p>

            <div className="mt-10 space-y-6">
              {expectations.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-3 border-t border-slate-200 pt-8 text-sm text-slate-600">
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-700" /> hello@westbridgeglobal.com
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-700" /> +44 (0)20 7946 0820
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="rounded-3xl border-slate-200 shadow-xl shadow-blue-900/5">
              <CardContent className="p-7 sm:p-9">
                {submitted ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
                      Request received
                    </h2>
                    <p className="mt-3 max-w-sm text-slate-600">
                      Thank you — a member of the Westbridge team will contact you within one
                      business day to arrange your discovery call.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-8 rounded-full"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit another enquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name *</Label>
                        <Input id="name" name="name" required placeholder="Jane Smith" className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company *</Label>
                        <Input id="company" name="company" required placeholder="Acme Ltd" className="h-11" />
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Work email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="jane@acme.com"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+44 ..." className="h-11" />
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Role you're interested in</Label>
                        <Select name="roleInterest">
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r.id} value={r.title}>
                                {r.title}
                              </SelectItem>
                            ))}
                            <SelectItem value="Something else">Something else</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Hours</Label>
                        <Select name="hours">
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select hours" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full-time (40h / week)</SelectItem>
                            <SelectItem value="part">Part-time (20h / week)</SelectItem>
                            <SelectItem value="unsure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us about what you need</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="e.g. We need a telesales caller to book demos for our SaaS product, working UK hours..."
                      />
                    </div>
                    {error && (
                      <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        <CircleAlert className="h-4 w-4 shrink-0" />
                        {error}
                      </p>
                    )}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submit.isPending}
                      className="w-full rounded-full bg-blue-700 text-base font-semibold hover:bg-blue-800"
                    >
                      {submit.isPending ? 'Sending...' : 'Request My Discovery Call'}
                    </Button>
                    <p className="text-center text-xs text-slate-400">
                      By submitting, you agree to be contacted about your enquiry. We never share
                      your details.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
