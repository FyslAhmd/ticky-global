import { useState } from 'react'
import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Plus, ArrowRight, UserRound } from 'lucide-react'

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  onboarding: 'bg-sky-100 text-sky-700 hover:bg-sky-100',
  paused: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  offboarded: 'bg-slate-200 text-slate-500 hover:bg-slate-200',
}

export default function AdminClients() {
  const list = trpc.clients.list.useQuery(undefined, { retry: false })
  const utils = trpc.useUtils()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = trpc.clients.create.useMutation({
    onSuccess: () => { setDialogOpen(false); utils.clients.list.invalidate() },
    onError: (e) => setError(e.message),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    create.mutate({
      company: String(data.get('company') ?? ''),
      contactName: String(data.get('contactName') ?? '') || undefined,
      country: String(data.get('country') ?? 'uk'),
      status: String(data.get('status') ?? 'onboarding') as never,
    })
  }

  return (
    <div>
      <AdminHeader
        title="Clients"
        description="Set up client companies, manage their Ticker details, and create client-portal logins."
      >
        <Button onClick={() => { setError(null); setDialogOpen(true) }} className="rounded-full bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-1.5 h-4 w-4" />
          New client
        </Button>
      </AdminHeader>

      {list.isLoading ? (
        <AdminLoading />
      ) : (list.data ?? []).length === 0 ? (
        <Card className="rounded-2xl border-dashed border-slate-300">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <UserRound className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">
              No clients yet. Create one here, then open it to add their Ticker details, portal login and training plans.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(list.data ?? []).map((c) => (
            <Card key={c.id} className="rounded-2xl border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{c.company}</p>
                    {c.contactName && <p className="truncate text-sm text-slate-500">{c.contactName}</p>}
                  </div>
                  <Badge className={`shrink-0 rounded-full text-[11px] font-semibold capitalize ${statusStyles[c.status]}`}>
                    {c.status}
                  </Badge>
                </div>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  {c.tickerName ? (
                    <p>
                      Ticker: <span className="font-semibold text-slate-800">{c.tickerName}</span>
                      {c.tickerRole ? ` — ${c.tickerRole}` : ''}
                    </p>
                  ) : (
                    <p className="text-slate-400">No Ticker assigned yet</p>
                  )}
                  {c.accountManager && <p className="text-xs text-slate-400">AM: {c.accountManager}</p>}
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <Button asChild size="sm" className="w-full rounded-full bg-blue-700 hover:bg-blue-800">
                    <Link to={`/admin/clients/${c.id}`}>
                      Manage client & portal
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company *</Label>
              <Input id="company" name="company" required placeholder="Acme Ltd" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactName">Primary contact</Label>
              <Input id="contactName" name="contactName" placeholder="Jane Smith" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Select name="country" defaultValue="uk">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                <Select name="status" defaultValue="onboarding">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="offboarded">Offboarded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={create.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
                Create client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
