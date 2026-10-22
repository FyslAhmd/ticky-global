import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import { Loader2, Send, CheckCircle2, Info } from 'lucide-react'
import { toast } from 'sonner'

type Form = {
  enabled: boolean
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  fromEmail: string
  fromName: string
  managerEmail: string
  notifyManagerOnBooking: boolean
  confirmToClient: boolean
}

const EMPTY: Form = {
  enabled: false,
  host: '',
  port: 587,
  secure: false,
  user: '',
  password: '',
  fromEmail: 'hello@tickyglobal.com',
  fromName: 'Ticky Global',
  managerEmail: 'hello@tickyglobal.com',
  notifyManagerOnBooking: true,
  confirmToClient: true,
}

export default function AdminEmail() {
  const get = trpc.booking.getEmailSettings.useQuery(undefined, { retry: false })
  const save = trpc.booking.saveEmailSettings.useMutation({
    onSuccess: () => { toast.success('Email settings saved'); get.refetch() },
    onError: (e) => toast.error(e.message),
  })
  const test = trpc.booking.testEmail.useMutation({
    onSuccess: () => toast.success('Test email sent — check the manager inbox'),
    onError: (e) => toast.error(`Test failed: ${e.message}`),
  })
  const [form, setForm] = useState<Form>(EMPTY)

  useEffect(() => {
    if (get.data) setForm(get.data as Form)
  }, [get.data])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  if (get.isLoading) return <AdminLoading />

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader
        title="Email notifications"
        description="Send booking notifications to your manager and confirmation emails to clients — from hello@tickyglobal.com via your own mail provider (SMTP)."
      />

      {/* Master switch + toggles */}
      <Card className="rounded-2xl border-slate-200">
        <CardContent className="grid gap-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">Email sending enabled</p>
              <p className="text-sm text-slate-500">Off — no emails are sent. On after your SMTP details below are saved.</p>
            </div>
            <Switch checked={form.enabled} onCheckedChange={(v) => set('enabled', v)} />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="font-medium text-slate-900">Notify manager on new booking</p>
              <p className="text-xs text-slate-500">Sends booking details to the manager email below.</p>
            </div>
            <Switch checked={form.notifyManagerOnBooking} onCheckedChange={(v) => set('notifyManagerOnBooking', v)} />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="font-medium text-slate-900">Confirmation email to client</p>
              <p className="text-xs text-slate-500">Branded confirmation with their date &amp; time.</p>
            </div>
            <Switch checked={form.confirmToClient} onCheckedChange={(v) => set('confirmToClient', v)} />
          </div>
        </CardContent>
      </Card>

      {/* SMTP details */}
      <Card className="mt-4 rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">SMTP server details</CardTitle>
          <CardDescription>
            Get these from whoever hosts your email (e.g. Google Workspace, Microsoft 365, or your domain host).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_120px_140px]">
            <div className="grid gap-1.5">
              <Label htmlFor="host">SMTP host</Label>
              <Input id="host" value={form.host} onChange={(e) => set('host', e.target.value.trim())} placeholder="smtp.gmail.com" className="font-mono text-sm" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="port">Port</Label>
              <Input id="port" type="number" value={form.port} onChange={(e) => set('port', Number(e.target.value) || 587)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Security</Label>
              <Select value={form.secure ? 'ssl' : 'starttls'} onValueChange={(v) => { const secure = v === 'ssl'; setForm((f) => ({ ...f, secure, port: secure ? 465 : 587 })) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starttls">STARTTLS (587)</SelectItem>
                  <SelectItem value="ssl">SSL (465)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="user">Username</Label>
              <Input id="user" value={form.user} onChange={(e) => set('user', e.target.value.trim())} placeholder="hello@tickyglobal.com" className="font-mono text-sm" autoComplete="off" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password / app password</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••" autoComplete="new-password" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card className="mt-4 rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Email addresses</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="fromEmail">Send from</Label>
              <Input id="fromEmail" type="email" value={form.fromEmail} onChange={(e) => set('fromEmail', e.target.value.trim())} placeholder="hello@tickyglobal.com" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="fromName">Sender name</Label>
              <Input id="fromName" value={form.fromName} onChange={(e) => set('fromName', e.target.value)} placeholder="Ticky Global" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="managerEmail">Manager notification email</Label>
            <Input id="managerEmail" type="email" value={form.managerEmail} onChange={(e) => set('managerEmail', e.target.value.trim())} placeholder="hello@tickyglobal.com" />
            <p className="text-xs text-slate-400">New booking alerts go here. This can be any address — it doesn't have to match the sender.</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => save.mutate(form)} disabled={save.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save settings
        </Button>
        <Button variant="outline" className="rounded-full" disabled={test.isPending || !get.data?.host} onClick={() => test.mutate()}>
          {test.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Send test email
        </Button>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
        <p className="flex items-center gap-2 font-semibold text-slate-900"><Info className="h-4 w-4 text-blue-700" /> Quick setup guides</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li><strong>Google Workspace / Gmail:</strong> host <code className="rounded bg-white px-1">smtp.gmail.com</code>, port 587. You'll need an <em>App Password</em> (Google Account → Security → 2-Step Verification → App passwords), not your normal password.</li>
          <li><strong>Microsoft 365 / Outlook:</strong> host <code className="rounded bg-white px-1">smtp.office365.com</code>, port 587.</li>
          <li><strong>Your domain host (cPanel etc.):</strong> usually <code className="rounded bg-white px-1">mail.tickyglobal.com</code>, port 587 or 465 — check your hosting email settings page.</li>
        </ul>
        <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-500">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
          After saving, use "Send test email" to confirm everything works before real bookings come in.
        </p>
      </div>
    </div>
  )
}
