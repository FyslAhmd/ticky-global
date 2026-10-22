import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { useBatchSelection, BatchActionBar, SelectAllCheckbox, RowCheckbox } from '@/components/BatchActions'
import { trpc } from '@/providers/trpc'
import { CalendarCheck, Trash2, Loader2, Settings2, CalendarDays, Mail, Building2, Phone } from 'lucide-react'
import { toast } from 'sonner'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMEZONES = [
  'Europe/London', 'Europe/Dublin', 'America/New_York', 'America/Chicago',
  'America/Denver', 'America/Los_Angeles', 'America/Toronto', 'Australia/Sydney',
  'Australia/Melbourne', 'Pacific/Auckland', 'Asia/Manila',
]

const statusStyles: Record<string, string> = {
  booked: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  completed: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  cancelled: 'bg-slate-100 text-slate-500 hover:bg-slate-100',
}

export default function AdminBookings() {
  const utils = trpc.useUtils()
  const list = trpc.booking.list.useQuery(undefined, { retry: false, refetchInterval: 15000 })
  const settings = trpc.booking.getSettings.useQuery(undefined, { retry: false })
  const setStatus = trpc.booking.setStatus.useMutation({ onSuccess: () => utils.booking.list.invalidate() })
  const del = trpc.booking.delete.useMutation({
    onSuccess: () => { utils.booking.list.invalidate(); toast.success('Booking deleted') },
  })
  const batch = useBatchSelection()
  const bulkStatus = trpc.booking.bulkStatus.useMutation({
    onSuccess: (r) => {
      utils.booking.list.invalidate()
      batch.clear()
      toast.success(`${r.count} booking${r.count > 1 ? 's' : ''} updated`)
    },
    onError: (e) => toast.error(e.message),
  })
  const bulkDelete = trpc.booking.bulkDelete.useMutation({
    onSuccess: (r) => {
      utils.booking.list.invalidate()
      batch.clear()
      toast.success(`${r.count} booking${r.count > 1 ? 's' : ''} deleted`)
    },
    onError: (e) => toast.error(e.message),
  })
  const save = trpc.booking.saveSettings.useMutation({
    onSuccess: () => { toast.success('Booking settings saved'); utils.booking.getSettings.invalidate() },
    onError: (e) => toast.error(e.message),
  })

  const [form, setForm] = useState({
    enabled: true,
    calendlyUrl: '',
    timezone: 'Europe/London',
    slotMinutes: 30,
    startTime: '09:00',
    endTime: '17:30',
    days: [1, 2, 3, 4, 5] as number[],
  })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (settings.data) setForm(settings.data as typeof form)
  }, [settings.data])

  if (list.isLoading || settings.isLoading) return <AdminLoading />

  const upcoming = (list.data ?? []).filter((b) => b.status === 'booked')
  const past = (list.data ?? []).filter((b) => b.status !== 'booked')

  const toggleDay = (d: number) =>
    setForm((f) => ({ ...f, days: f.days.includes(d) ? f.days.filter((x) => x !== d) : [...f.days, d].sort() }))

  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader
        title="Discovery call bookings"
        description="Calls booked through the website's /book page. Each booking also appears in Enquiries."
      >
        <Button variant="outline" className="rounded-full" onClick={() => setShowSettings((v) => !v)}>
          <Settings2 className="mr-1.5 h-4 w-4" />
          {showSettings ? 'Hide settings' : 'Booking settings'}
        </Button>
      </AdminHeader>

      {showSettings && (
        <Card className="mb-6 rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Booking page settings</CardTitle>
            <CardDescription>
              Control your availability and time zone. Paste a Calendly URL to embed your Calendly calendar instead of the built-in one.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-900">Booking page enabled</p>
                <p className="text-xs text-slate-500">When off, /book shows a "contact us" message instead.</p>
              </div>
              <Switch checked={form.enabled} onCheckedChange={(v) => setForm((f) => ({ ...f, enabled: v }))} />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="calendlyUrl">Calendly event URL (optional)</Label>
              <Input
                id="calendlyUrl"
                value={form.calendlyUrl}
                onChange={(e) => setForm((f) => ({ ...f, calendlyUrl: e.target.value.trim() }))}
                placeholder="https://calendly.com/your-name/discovery-call"
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-400">If set, the /book page embeds this Calendly calendar and the built-in availability below is ignored.</p>
            </div>

            {!form.calendlyUrl && (
              <>
                <div className="grid gap-1.5">
                  <Label>Available days</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAY_NAMES.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(i)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          form.days.includes(i) ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="startTime">First slot</Label>
                    <Input id="startTime" type="time" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="endTime">Last slot ends by</Label>
                    <Input id="endTime" type="time" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Slot length</Label>
                    <Select value={String(form.slotMinutes)} onValueChange={(v) => setForm((f) => ({ ...f, slotMinutes: Number(v) }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[15, 20, 30, 45, 60].map((m) => <SelectItem key={m} value={String(m)}>{m} minutes</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label>Your time zone</Label>
                  <Select value={form.timezone} onValueChange={(v) => setForm((f) => ({ ...f, timezone: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => <SelectItem key={tz} value={tz}>{tz.replace('_', ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="w-fit rounded-full bg-blue-700 hover:bg-blue-800">
              {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upcoming */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <CalendarCheck className="h-4 w-4 text-blue-700" /> Upcoming ({upcoming.length})
        </h2>
        {upcoming.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <SelectAllCheckbox selection={batch} ids={upcoming.map((b) => b.id)} />
            Select all
          </div>
        )}
      </div>
      {upcoming.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
          No upcoming bookings. Share tickyglobal.com/book with prospects.
        </p>
      ) : (
        <div className="grid gap-3">
          {upcoming.map((b) => (
            <Card key={b.id} className={`rounded-2xl border-slate-200 ${batch.selected.has(b.id) ? 'ring-2 ring-blue-300' : ''}`}>
              <CardContent className="flex flex-wrap items-center gap-4 p-4">
                <RowCheckbox selection={batch} id={b.id} />
                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-blue-700 text-white">
                    <span className="text-sm font-bold leading-none">{b.date.split('-')[2]}</span>
                    <span className="text-[9px] uppercase">{new Date(`${b.date}T12:00:00`).toLocaleDateString('en-GB', { month: 'short' })}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{b.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <CalendarDays className="h-3 w-3" /> {b.date} at {b.time}
                    </p>
                  </div>
                </div>
                <div className="min-w-0 flex-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1 truncate"><Mail className="h-3 w-3 shrink-0" /> {b.email}</p>
                  {b.company && <p className="flex items-center gap-1"><Building2 className="h-3 w-3 shrink-0" /> {b.company}</p>}
                  {b.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" /> {b.phone}</p>}
                  {b.roleInterest && <p className="mt-0.5 text-slate-400">Interested in: {b.roleInterest}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge className={statusStyles[b.status]}>{b.status}</Badge>
                  <Select value={b.status} onValueChange={(v) => setStatus.mutate({ id: b.id, status: v as never })}>
                    <SelectTrigger className="h-8 w-28 rounded-full text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm" variant="ghost" className="h-8 rounded-full px-2 text-red-600 hover:bg-red-50"
                    onClick={() => { if (confirm(`Delete booking for ${b.name}?`)) del.mutate({ id: b.id }) }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 font-bold text-slate-900">Past &amp; cancelled ({past.length})</h2>
          <div className="grid gap-2">
            {past.map((b) => (
              <div key={b.id} className={`flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm ${batch.selected.has(b.id) ? 'ring-2 ring-blue-300' : ''}`}>
                <span className="flex items-center gap-3 text-slate-700">
                  <RowCheckbox selection={batch} id={b.id} />
                  {b.name} — {b.date} at {b.time}
                </span>
                <Badge className={statusStyles[b.status]}>{b.status}</Badge>
              </div>
            ))}
          </div>
        </>
      )}

      <BatchActionBar
        selection={batch}
        busy={bulkStatus.isPending || bulkDelete.isPending}
        statusOptions={[
          { value: 'booked', label: 'Booked' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
        ]}
        onSetStatus={(status) => bulkStatus.mutate({ ids: [...batch.selected], status: status as never })}
        onDelete={() => bulkDelete.mutate({ ids: [...batch.selected] })}
      />
    </div>
  )
}
