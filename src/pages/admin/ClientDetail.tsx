import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import { ArrowLeft, Plus, Trash2, Send, KeyRound, CalendarDays, GraduationCap, FileText, UserRound } from 'lucide-react'

const trainingStatusStyles: Record<string, string> = {
  planned: 'bg-sky-100 text-sky-700 hover:bg-sky-100',
  in_progress: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  completed: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
}

export default function AdminClientDetail() {
  const { id } = useParams()
  const clientId = Number(id)
  const utils = trpc.useUtils()

  const client = trpc.clients.get.useQuery({ id: clientId }, { retry: false })
  const portalUsers = trpc.clients.portalUsers.list.useQuery({ clientId }, { retry: false })
  const holidays = trpc.clients.holidays.list.useQuery({}, { retry: false })
  const training = trpc.clients.training.list.useQuery({ clientId }, { retry: false })
  const messages = trpc.clients.messages.list.useQuery({ clientId }, { retry: false, refetchInterval: 5000 })

  const [error, setError] = useState<string | null>(null)
  const [portalDialog, setPortalDialog] = useState(false)
  const [holidayDialog, setHolidayDialog] = useState(false)
  const [trainingDialog, setTrainingDialog] = useState(false)
  const [msgBody, setMsgBody] = useState('')
  const msgEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.data?.length])

  const update = trpc.clients.update.useMutation({ onSuccess: () => utils.clients.get.invalidate() })
  const del = trpc.clients.delete.useMutation()
  const createPortalUser = trpc.clients.portalUsers.create.useMutation({
    onSuccess: () => { setPortalDialog(false); utils.clients.portalUsers.list.invalidate() },
    onError: (e) => setError(e.message),
  })
  const resetPw = trpc.clients.portalUsers.resetPassword.useMutation()
  const delPortalUser = trpc.clients.portalUsers.delete.useMutation({ onSuccess: () => utils.clients.portalUsers.list.invalidate() })
  const createHoliday = trpc.clients.holidays.create.useMutation({
    onSuccess: () => { setHolidayDialog(false); utils.clients.holidays.list.invalidate() },
    onError: (e) => setError(e.message),
  })
  const delHoliday = trpc.clients.holidays.delete.useMutation({ onSuccess: () => utils.clients.holidays.list.invalidate() })
  const createTraining = trpc.clients.training.create.useMutation({
    onSuccess: () => { setTrainingDialog(false); utils.clients.training.list.invalidate() },
    onError: (e) => setError(e.message),
  })
  const updateTraining = trpc.clients.training.update.useMutation({ onSuccess: () => utils.clients.training.list.invalidate() })
  const delTraining = trpc.clients.training.delete.useMutation({ onSuccess: () => utils.clients.training.list.invalidate() })
  const sendMsg = trpc.clients.messages.send.useMutation({
    onSuccess: () => { setMsgBody(''); utils.clients.messages.list.invalidate() },
  })

  if (client.isLoading) return <AdminLoading />
  const c = client.data
  if (!c) return <p className="text-sm text-slate-500">Client not found.</p>

  const saveDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    update.mutate({
      id: clientId,
      data: {
        company: String(data.get('company') ?? ''),
        contactName: String(data.get('contactName') ?? '') || undefined,
        country: String(data.get('country') ?? 'uk'),
        accountManager: String(data.get('accountManager') ?? '') || undefined,
        tickerName: String(data.get('tickerName') ?? '') || undefined,
        tickerRole: String(data.get('tickerRole') ?? '') || undefined,
        tickerStartDate: String(data.get('tickerStartDate') ?? '') || undefined,
        contractSummary: String(data.get('contractSummary') ?? '') || undefined,
        contractFileUrl: String(data.get('contractFileUrl') ?? '') || undefined,
        holidayEntitlementDays: Number(data.get('holidayEntitlementDays') ?? 20),
        holidayUsedDays: Number(data.get('holidayUsedDays') ?? 0),
        status: String(data.get('status') ?? 'onboarding') as never,
      },
    })
  }

  return (
    <div>
      <AdminHeader title={c.company} description={`Client #${c.id} · ${c.contactName ?? 'no primary contact set'}`}>
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/admin/clients">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              All clients
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-red-600 hover:bg-red-50"
            onClick={async () => {
              if (confirm(`Delete ${c.company}, their portal logins, training plans and messages?`)) {
                await del.mutateAsync({ id: clientId })
                window.location.href = '/admin/clients'
              }
            }}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Delete
          </Button>
        </div>
      </AdminHeader>

      <Tabs defaultValue="details">
        <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-white p-1 ring-1 ring-slate-200">
          <TabsTrigger value="details" className="rounded-lg">Details & Ticker</TabsTrigger>
          <TabsTrigger value="portal" className="rounded-lg">Portal access</TabsTrigger>
          <TabsTrigger value="holidays" className="rounded-lg">Holidays</TabsTrigger>
          <TabsTrigger value="training" className="rounded-lg">Training plan</TabsTrigger>
          <TabsTrigger value="messages" className="rounded-lg">Messages</TabsTrigger>
        </TabsList>

        {/* Details & Ticker */}
        <TabsContent value="details">
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-6">
              <form onSubmit={saveDetails} className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" defaultValue={c.company} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Primary contact</Label>
                  <Input id="contactName" name="contactName" defaultValue={c.contactName ?? ''} />
                </div>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Select name="country" defaultValue={c.country}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">🇬🇧 UK</SelectItem>
                      <SelectItem value="us">🇺🇸 US</SelectItem>
                      <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                      <SelectItem value="au">🇦🇺 Australia</SelectItem>
                      <SelectItem value="nz">🇳🇿 New Zealand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select name="status" defaultValue={c.status}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="offboarded">Offboarded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accountManager">Account manager</Label>
                  <Input id="accountManager" name="accountManager" defaultValue={c.accountManager ?? ''} />
                </div>

                <div className="md:col-span-2 mt-2 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-bold text-slate-900">
                  <UserRound className="h-4 w-4 text-blue-700" /> Their Ticker
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tickerName">Ticker name</Label>
                  <Input id="tickerName" name="tickerName" defaultValue={c.tickerName ?? ''} placeholder="Angela Reyes" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tickerRole">Ticker role</Label>
                  <Input id="tickerRole" name="tickerRole" defaultValue={c.tickerRole ?? ''} placeholder="Telesales / SDR" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tickerStartDate">Start date</Label>
                  <Input id="tickerStartDate" name="tickerStartDate" type="date" defaultValue={c.tickerStartDate ?? ''} />
                </div>

                <div className="md:col-span-2 mt-2 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-bold text-slate-900">
                  <FileText className="h-4 w-4 text-blue-700" /> Contract & holiday entitlement
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="contractSummary">Contract summary (shown in the client portal)</Label>
                  <Textarea id="contractSummary" name="contractSummary" rows={4} defaultValue={c.contractSummary ?? ''} placeholder="Full-time SDR, monthly rolling after 90-day initial term, invoice monthly in GBP…" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="contractFileUrl">Contract file URL (PDF link the client can download)</Label>
                  <Input id="contractFileUrl" name="contractFileUrl" defaultValue={c.contractFileUrl ?? ''} placeholder="https://…/contract.pdf" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="holidayEntitlementDays">Holiday entitlement (days/year)</Label>
                  <Input id="holidayEntitlementDays" name="holidayEntitlementDays" type="number" min={0} max={60} defaultValue={c.holidayEntitlementDays} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="holidayUsedDays">Holiday used (days)</Label>
                  <Input id="holidayUsedDays" name="holidayUsedDays" type="number" min={0} max={60} defaultValue={c.holidayUsedDays} />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" disabled={update.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
                    {update.isPending ? 'Saving…' : 'Save client details'}
                  </Button>
                  {update.isSuccess && <span className="ml-3 text-sm text-emerald-600">Saved ✓</span>}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portal access */}
        <TabsContent value="portal">
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">Client portal logins</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Create email + password access for this client at <code className="rounded bg-slate-100 px-1">/client-portal</code>.
                  </p>
                </div>
                <Button onClick={() => { setError(null); setPortalDialog(true) }} className="rounded-full bg-blue-700 hover:bg-blue-800">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create portal login
                </Button>
              </div>
              <div className="mt-5 divide-y divide-slate-100">
                {(portalUsers.data ?? []).length === 0 && (
                  <p className="py-6 text-sm text-slate-400">No portal logins yet for this client.</p>
                )}
                {(portalUsers.data ?? []).map((u) => (
                  <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{u.name ?? u.email}</p>
                      <p className="text-xs text-slate-500">{u.email}{u.lastSignInAt ? ` · last signed in ${new Date(u.lastSignInAt).toLocaleDateString()}` : ''}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={async () => {
                          const pw = prompt(`New password for ${u.email} (min 8 characters):`)
                          if (pw && pw.length >= 8) {
                            await resetPw.mutateAsync({ id: u.id, password: pw })
                            alert('Password updated.')
                          }
                        }}
                      >
                        <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                        Reset password
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-red-600 hover:bg-red-50"
                        onClick={() => { if (confirm(`Remove portal access for ${u.email}?`)) delPortalUser.mutate({ id: u.id }) }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holidays */}
        <TabsContent value="holidays">
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-slate-900">
                    <CalendarDays className="h-4 w-4 text-blue-700" /> Philippines national holidays
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">Shown to every client so they can plan around their Ticker's days off.</p>
                </div>
                <Button onClick={() => { setError(null); setHolidayDialog(true) }} className="rounded-full bg-blue-700 hover:bg-blue-800">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add holiday
                </Button>
              </div>
              <div className="mt-5 divide-y divide-slate-100">
                {(holidays.data ?? []).length === 0 && (
                  <p className="py-6 text-sm text-slate-400">No holidays added yet — add this year's PH holidays.</p>
                )}
                {(holidays.data ?? []).map((h) => (
                  <div key={h.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-sm font-semibold text-slate-900">{h.date}</span>
                      <span className="text-sm text-slate-700">{h.name}</span>
                      <Badge variant="secondary" className={`rounded-full text-[10px] capitalize ${h.type === 'regular' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {h.type}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="rounded-full text-red-600 hover:bg-red-50" onClick={() => delHoliday.mutate({ id: h.id })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training */}
        <TabsContent value="training">
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-slate-900">
                    <GraduationCap className="h-4 w-4 text-blue-700" /> Training plan for {c.tickerName ?? 'their Ticker'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">Visible in the client portal so clients can see development progress.</p>
                </div>
                <Button onClick={() => { setError(null); setTrainingDialog(true) }} className="rounded-full bg-blue-700 hover:bg-blue-800">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add item
                </Button>
              </div>
              <div className="mt-5 divide-y divide-slate-100">
                {(training.data ?? []).length === 0 && (
                  <p className="py-6 text-sm text-slate-400">No training items yet.</p>
                )}
                {(training.data ?? []).map((t) => (
                  <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                      {t.description && <p className="text-xs text-slate-500">{t.description}</p>}
                      {t.dueDate && <p className="text-xs text-slate-400">Due: {t.dueDate}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={t.status}
                        onValueChange={(v) => updateTraining.mutate({ id: t.id, data: { status: v as never } })}
                      >
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="in_progress">In progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge className={`rounded-full text-[10px] ${trainingStatusStyles[t.status]}`}>{t.status.replace('_', ' ')}</Badge>
                      <Button size="sm" variant="ghost" className="rounded-full text-red-600 hover:bg-red-50" onClick={() => delTraining.mutate({ id: t.id })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages */}
        <TabsContent value="messages">
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="flex h-[520px] flex-col p-0">
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {(messages.data ?? []).length === 0 && (
                  <p className="py-10 text-center text-sm text-slate-400">
                    No messages yet. Messages the client sends from their portal appear here in real time.
                  </p>
                )}
                {(messages.data ?? []).map((m) => (
                  <div key={m.id} className={`flex ${m.senderType === 'staff' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.senderType === 'staff' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-800'}`}>
                      <p className={`mb-0.5 text-[10px] font-semibold uppercase tracking-wide ${m.senderType === 'staff' ? 'text-blue-200' : 'text-slate-400'}`}>
                        {m.senderName ?? (m.senderType === 'staff' ? 'Staff' : 'Client')} · {new Date(m.createdAt).toLocaleString()}
                      </p>
                      {m.body}
                    </div>
                  </div>
                ))}
                <div ref={msgEndRef} />
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (msgBody.trim()) sendMsg.mutate({ clientId, body: msgBody.trim() })
                }}
                className="flex gap-2 border-t border-slate-100 p-4"
              >
                <Input
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  placeholder="Message the client…"
                  className="flex-1"
                />
                <Button type="submit" disabled={sendMsg.isPending || !msgBody.trim()} className="rounded-full bg-blue-700 hover:bg-blue-800">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Portal login dialog */}
      <Dialog open={portalDialog} onOpenChange={setPortalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create portal login for {c.company}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setError(null)
              const data = new FormData(e.currentTarget)
              createPortalUser.mutate({
                clientId,
                name: String(data.get('name') ?? '') || undefined,
                email: String(data.get('email') ?? ''),
                password: String(data.get('password') ?? ''),
              })
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="pname">Contact name</Label>
              <Input id="pname" name="name" defaultValue={c.contactName ?? ''} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pemail">Email *</Label>
              <Input id="pemail" name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ppassword">Password * (share securely with the client)</Label>
              <Input id="ppassword" name="password" type="text" required minLength={8} placeholder="Min 8 characters" />
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={createPortalUser.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
                Create login
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Holiday dialog */}
      <Dialog open={holidayDialog} onOpenChange={setHolidayDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add national holiday</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setError(null)
              const data = new FormData(e.currentTarget)
              const dateStr = String(data.get('date') ?? '')
              createHoliday.mutate({
                name: String(data.get('name') ?? ''),
                date: dateStr,
                year: Number(dateStr.slice(0, 4)) || new Date().getFullYear(),
                type: String(data.get('type') ?? 'regular') as never,
                note: String(data.get('note') ?? '') || undefined,
              })
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="hname">Name *</Label>
              <Input id="hname" name="name" required placeholder="Independence Day" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hdate">Date *</Label>
              <Input id="hdate" name="date" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select name="type" defaultValue="regular">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular holiday</SelectItem>
                  <SelectItem value="special">Special non-working day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={createHoliday.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
                Add holiday
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Training dialog */}
      <Dialog open={trainingDialog} onOpenChange={setTrainingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add training item</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setError(null)
              const data = new FormData(e.currentTarget)
              createTraining.mutate({
                clientId,
                title: String(data.get('title') ?? ''),
                description: String(data.get('description') ?? '') || undefined,
                dueDate: String(data.get('dueDate') ?? '') || undefined,
              })
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="ttitle">Title *</Label>
              <Input id="ttitle" name="title" required placeholder="HubSpot CRM advanced certification" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tdesc">Description</Label>
              <Textarea id="tdesc" name="description" rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tdue">Due date</Label>
              <Input id="tdue" name="dueDate" type="date" />
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={createTraining.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
                Add item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
