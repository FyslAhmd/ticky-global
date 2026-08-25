import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Pencil, Trash2, Mail, Phone, UsersRound } from 'lucide-react'

const stageStyles: Record<string, string> = {
  lead: 'bg-sky-100 text-sky-700 hover:bg-sky-100',
  prospect: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  customer: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  churned: 'bg-slate-200 text-slate-500 hover:bg-slate-200',
}

type Contact = {
  id: number
  name: string
  company: string | null
  email: string | null
  phone: string | null
  source: string | null
  stage: 'lead' | 'prospect' | 'customer' | 'churned'
  notes: string | null
}

export default function AdminCrm() {
  const list = trpc.crm.list.useQuery(undefined, { retry: false })
  const utils = trpc.useUtils()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Contact | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const create = trpc.crm.create.useMutation({
    onSuccess: () => { setDialogOpen(false); utils.crm.list.invalidate() },
    onError: (e) => setError(e.message),
  })
  const update = trpc.crm.update.useMutation({
    onSuccess: () => { setDialogOpen(false); utils.crm.list.invalidate() },
    onError: (e) => setError(e.message),
  })
  const del = trpc.crm.delete.useMutation({ onSuccess: () => utils.crm.list.invalidate() })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    const payload = {
      name: String(data.get('name') ?? ''),
      company: String(data.get('company') ?? '') || undefined,
      email: String(data.get('email') ?? '') || undefined,
      phone: String(data.get('phone') ?? '') || undefined,
      source: String(data.get('source') ?? '') || undefined,
      stage: (String(data.get('stage') ?? 'lead')) as Contact['stage'],
      notes: String(data.get('notes') ?? '') || undefined,
    }
    if (editing) update.mutate({ id: editing.id, data: payload })
    else create.mutate(payload)
  }

  const contacts = (list.data ?? []).filter((c) => filter === 'all' || c.stage === filter)

  return (
    <div>
      <AdminHeader
        title="CRM & contacts"
        description="Your customer contact list — track leads through to customers. Form enquiries land under Enquiries; this list is for everything else."
      >
        <Button onClick={() => { setEditing(null); setError(null); setDialogOpen(true) }} className="rounded-full bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-1.5 h-4 w-4" />
          Add contact
        </Button>
      </AdminHeader>

      <div className="mb-5 flex flex-wrap gap-2">
        {['all', 'lead', 'prospect', 'customer', 'churned'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
              filter === s ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {s === 'all' ? `All (${(list.data ?? []).length})` : `${s} (${(list.data ?? []).filter((c) => c.stage === s).length})`}
          </button>
        ))}
      </div>

      {list.isLoading ? (
        <AdminLoading />
      ) : contacts.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-slate-300">
          <CardContent className="flex flex-col items-center p-10 text-center">
            <UsersRound className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">No contacts here yet. Add your first lead or customer.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contacts.map((c) => (
            <Card key={c.id} className="rounded-2xl border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{c.name}</p>
                    {c.company && <p className="truncate text-sm text-slate-500">{c.company}</p>}
                  </div>
                  <Badge className={`shrink-0 rounded-full text-[11px] font-semibold capitalize ${stageStyles[c.stage]}`}>
                    {c.stage}
                  </Badge>
                </div>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  {c.email && (
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {c.email}
                    </p>
                  )}
                  {c.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {c.phone}
                    </p>
                  )}
                  {c.source && <p className="text-xs text-slate-400">Source: {c.source}</p>}
                </div>
                {c.notes && <p className="mt-3 line-clamp-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">{c.notes}</p>}
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setEditing(c); setError(null); setDialogOpen(true) }}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Delete ${c.name}?`)) del.mutate({ id: c.id })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
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
            <DialogTitle>{editing ? `Edit ${editing.name}` : 'Add contact'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required defaultValue={editing?.name ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" defaultValue={editing?.company ?? ''} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={editing?.email ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={editing?.phone ?? ''} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="source">Source</Label>
                <Input id="source" name="source" placeholder="Referral, LinkedIn…" defaultValue={editing?.source ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label>Stage</Label>
                <Select name="stage" defaultValue={editing?.stage ?? 'lead'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="churned">Churned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} defaultValue={editing?.notes ?? ''} />
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={create.isPending || update.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
                {editing ? 'Save changes' : 'Add contact'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
