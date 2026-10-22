import { useEffect, useMemo, useState } from 'react'
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
import { trpc } from '@/providers/trpc'
import { roles } from '@/data/content'
import { trackCtaClick } from '@/lib/tracking'
import {
  CalendarDays, ChevronLeft, ChevronRight, Clock3, CheckCircle2, Loader2,
  ArrowLeft, ArrowRight, ShieldCheck, Video, CalendarCheck,
} from 'lucide-react'

type Step = 'date' | 'time' | 'details' | 'done'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DOW = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function prettyDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Book() {
  const config = trpc.booking.config.useQuery()
  const [step, setStep] = useState<Step>('date')
  const [monthOffset, setMonthOffset] = useState(0)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const slots = trpc.booking.slots.useQuery(
    { date: date ?? '' },
    { enabled: Boolean(date) },
  )
  const book = trpc.booking.book.useMutation({
    onSuccess: () => setStep('done'),
    onError: (e) => setError(e.message),
  })

  const cfg = config.data

  // Calendly mode — embed the widget
  useEffect(() => {
    if (cfg?.calendlyUrl) {
      const s = document.createElement('script')
      s.src = 'https://assets.calendly.com/assets/external/widget.js'
      s.async = true
      document.head.appendChild(s)
      return () => { document.head.removeChild(s) }
    }
  }, [cfg?.calendlyUrl])

  const calendarDays = useMemo(() => {
    if (!cfg) return []
    const today = new Date()
    const first = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
    const year = first.getFullYear()
    const month = first.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // Monday-first offset
    const startDow = (first.getDay() + 6) % 7
    const todayISO = toISO(today)
    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 60)
    const maxISO = toISO(maxDate)

    const cells: ({ iso: string; day: number; available: boolean } | null)[] = []
    for (let i = 0; i < startDow; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISO(new Date(year, month, d))
      const dow = new Date(year, month, d).getDay()
      const available =
        iso >= todayISO && iso <= maxISO && cfg.days.includes(dow)
      cells.push({ iso, day: d, available })
    }
    return cells
  }, [cfg, monthOffset])

  if (config.isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
  }

  if (!cfg?.enabled) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Online booking is temporarily unavailable</h1>
        <p className="mt-3 text-slate-600">
          Please use the <a href="/contact" className="font-medium text-blue-700 hover:underline">contact form</a> or
          call <a href="tel:+448081753413" className="font-medium text-blue-700 hover:underline">0808 175 3413</a> and we'll arrange a time.
        </p>
      </div>
    )
  }

  if (cfg.calendlyUrl) {
    return (
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Book your discovery call</h1>
            <p className="mt-3 text-slate-600">Pick a time that suits you — the calendar below shows our live availability.</p>
          </div>
          <div
            className="calendly-inline-widget mt-8 w-full rounded-2xl"
            data-url={cfg.calendlyUrl}
            style={{ minWidth: 320, height: 700 }}
          />
        </div>
      </section>
    )
  }

  const monthLabel = (() => {
    const today = new Date()
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  })()

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Book a discovery call</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pick a time that suits you
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            A relaxed 30-minute video call about the role you're thinking about — no obligation, no hard sell.
            All times shown in {cfg.timezone.replace('_', ' ')} time.
          </p>
        </motion.div>

        {step !== 'done' ? (
          <Card className="mx-auto mt-10 max-w-3xl rounded-3xl border-slate-200 shadow-sm">
            <CardContent className="p-5 sm:p-8">
              {/* progress */}
              <div className="mb-6 flex items-center gap-2 text-xs font-medium">
                {(['date', 'time', 'details'] as const).map((s, i) => {
                  const labels = ['Choose a date', 'Choose a time', 'Your details']
                  const idx = ['date', 'time', 'details'].indexOf(step)
                  return (
                    <div key={s} className="flex items-center gap-2">
                      {i > 0 && <div className="h-px w-6 bg-slate-200 sm:w-10" />}
                      <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${idx >= i ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {i + 1}. {labels[i]}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* STEP 1: date */}
              {step === 'date' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="rounded-full" disabled={monthOffset === 0} onClick={() => setMonthOffset((m) => m - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <p className="font-semibold text-slate-900">{monthLabel}</p>
                    <Button variant="ghost" size="sm" className="rounded-full" disabled={monthOffset >= 2} onClick={() => setMonthOffset((m) => m + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
                    {DOW.map((d) => <div key={d} className="py-1">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, i) =>
                      cell === null ? (
                        <div key={`e${i}`} />
                      ) : (
                        <button
                          key={cell.iso}
                          type="button"
                          disabled={!cell.available}
                          onClick={() => { setDate(cell.iso); setTime(null); setStep('time') }}
                          className={`rounded-xl py-2.5 text-sm font-medium transition ${
                            date === cell.iso
                              ? 'bg-blue-700 text-white'
                              : cell.available
                                ? 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                                : 'cursor-not-allowed text-slate-300'
                          }`}
                        >
                          {cell.day}
                        </button>
                      ),
                    )}
                  </div>
                  <p className="mt-4 text-center text-xs text-slate-400">Available days are highlighted. You can book up to 60 days ahead.</p>
                </div>
              )}

              {/* STEP 2: time */}
              {step === 'time' && date && (
                <div>
                  <button type="button" onClick={() => setStep('date')} className="mb-4 flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> {prettyDate(date)}
                  </button>
                  {slots.isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
                  ) : (slots.data?.available ?? []).length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No slots left on this day — please pick another date.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {(slots.data?.available ?? []).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setTime(t); setStep('details') }}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"
                        >
                          <Clock3 className="h-3.5 w-3.5 text-blue-600" /> {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: details */}
              {step === 'details' && date && time && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setError(null)
                    const data = new FormData(e.currentTarget)
                    trackCtaClick({ label: 'Discovery call booked', path: '/book' })
                    book.mutate({
                      name: String(data.get('name') ?? ''),
                      email: String(data.get('email') ?? ''),
                      company: String(data.get('company') ?? '') || undefined,
                      phone: String(data.get('phone') ?? '') || undefined,
                      roleInterest: String(data.get('roleInterest') ?? '') || undefined,
                      date,
                      time,
                      notes: String(data.get('notes') ?? '') || undefined,
                    })
                  }}
                  className="space-y-4"
                >
                  <button type="button" onClick={() => setStep('time')} className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> {prettyDate(date)} at {time}
                  </button>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Your name *</Label>
                      <Input id="name" name="name" required placeholder="Jane Smith" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Work email *</Label>
                      <Input id="email" name="email" type="email" required placeholder="jane@company.com" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" placeholder="Acme Ltd" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+44 …" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="roleInterest">Role you're thinking about</Label>
                      <Select name="roleInterest">
                        <SelectTrigger><SelectValue placeholder="Choose a role (optional)" /></SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r.id} value={r.title}>{r.title}</SelectItem>
                          ))}
                          <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="notes">Anything we should prepare? (optional)</Label>
                      <Textarea id="notes" name="notes" rows={3} placeholder="Tell us briefly what you need…" />
                    </div>
                  </div>
                  {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
                  <Button type="submit" disabled={book.isPending} className="w-full rounded-full bg-blue-700 py-6 text-base hover:bg-blue-800">
                    {book.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck className="mr-2 h-4 w-4" />}
                    Confirm booking — {prettyDate(date)} at {time}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ) : (
          /* STEP 4: confirmation */
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="mx-auto mt-10 max-w-xl rounded-3xl border-emerald-200 bg-emerald-50/50 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">You're booked in!</h2>
                <p className="mt-2 text-lg font-medium text-blue-800">{prettyDate(date!)} at {time}</p>
                <p className="text-sm text-slate-500">({cfg.timezone.replace('_', ' ')} time)</p>
                <div className="mx-auto mt-6 max-w-sm space-y-2.5 rounded-2xl bg-white p-5 text-left text-sm text-slate-600">
                  <p className="flex items-start gap-2"><Video className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /> We'll send a video call link to your email shortly before the call.</p>
                  <p className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /> Need to change it? Just reply to the confirmation or call 0808 175 3413.</p>
                  <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /> No obligation — it's a friendly chat about whether we're a fit.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'date' && (
          <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center text-xs text-slate-400">
            <ArrowRight className="h-3.5 w-3.5" /> Prefer email? <a href="/contact" className="font-medium text-blue-700 hover:underline">Send us a message instead</a>
          </div>
        )}
      </div>
    </section>
  )
}
