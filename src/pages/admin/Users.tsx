import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useAuth } from '@/hooks/useAuth'
import { Plus, Pencil, Trash2, ShieldCheck, KeyRound } from 'lucide-react'

const PERMISSION_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  enquiries: 'Enquiries',
  crm: 'CRM & Contacts',
  clients: 'Clients & Portals',
  marketing: 'Marketing (Socials & Blog)',
  reviews: 'Reviews',
  pages: 'Pages',
  analytics: 'Analytics',
  users: 'Users & Access',
}

type StaffUser = {
  id: number
  name: string | null
  email: string
  role: 'user' | 'admin'
  permissions: string
  lastSignInAt: Date | string | null
}

export default function AdminUsers() {
  const { user: me } = useAuth()
  const utils = trpc.useUtils()
  const list = trpc.users.list.useQuery(undefined, { retry: false })
  const keys = trpc.users.permissionKeys.useQuery(undefined, { retry: false })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<StaffUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    await list.refetch()
  }

  const createMut = trpc.users.create.useMutation({
    onSuccess: async () => {
      setDialogOpen(false)
      await refresh()
    },
    onError: (e) => setError(e.message),
  })
  const updateMut = trpc.users.update.useMutation({
    onSuccess: async () => {
      setDialogOpen(false)
      await refresh()
      await utils.invalidate()
    },
    onError: (e) => setError(e.message),
  })
  const deleteMut = trpc.users.delete.useMutation({ onSuccess: refresh })

  const openCreate = () => {
    setEditing(null)
    setError(null)
    setDialogOpen(true)
  }
  const openEdit = (u: StaffUser) => {
    setEditing(u)
    setError(null)
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    const permissions = (keys.data ?? []).filter((k) => data.get(`perm_${k}`) === 'on') as never[]
    const base = {
      name: String(data.get('name') ?? ''),
      role: String(data.get('role') ?? 'user') as 'user' | 'admin',
      permissions,
    }
    const password = String(data.get('password') ?? '')
    if (editing) {
      updateMut.mutate({
        id: editing.id,
        ...base,
        ...(password ? { password } : {}),
      })
    } else {
      createMut.mutate({
        ...base,
        email: String(data.get('email') ?? ''),
        password,
      })
    }
  }

  if (me?.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        <ShieldCheck className="mb-2 h-5 w-5" />
        Only administrators can manage users and access levels.
      </div>
    )
  }

  return (
    <div>
      <AdminHeader
        title="Users & access"
        description="Create staff logins and control exactly which admin sections each person can open. Admins always have full access."
      >
        <Button onClick={openCreate} className="rounded-full bg-blue-700 hover:bg-blue-800">
          <Plus className="mr-1.5 h-4 w-4" />
          Add user
        </Button>
      </AdminHeader>

      {list.isLoading ? (
        <AdminLoading />
      ) : list.error ? (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{list.error.message}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(list.data ?? []).map((u) => (
            <Card key={u.id} className="rounded-2xl border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{u.name ?? u.email}</p>
                    <p className="truncate text-sm text-slate-500">{u.email}</p>
                  </div>
                  <Badge
                    className={`shrink-0 rounded-full text-[11px] font-semibold capitalize ${
                      u.role === 'admin'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {u.role}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {u.role === 'admin' ? (
                    <Badge variant="secondary" className="rounded-full bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-50">
                      Full access
                    </Badge>
                  ) : u.permissions ? (
                    u.permissions.split(',').filter(Boolean).map((p) => (
                      <Badge key={p} variant="secondary" className="rounded-full bg-slate-100 text-[11px] capitalize text-slate-600 hover:bg-slate-100">
                        {PERMISSION_LABELS[p] ?? p}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No section access — sign-in only</span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => openEdit(u)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  {u.id !== me?.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        if (confirm(`Delete ${u.email}? This cannot be undone.`)) deleteMut.mutate({ id: u.id })
                      }}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.email}` : 'Create staff user'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name ?? ''} />
            </div>
            {!editing && (
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                {editing ? 'New password (leave blank to keep current)' : 'Password'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                placeholder="At least 8 characters"
                {...(editing ? {} : { required: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select name="role" defaultValue={editing?.role ?? 'user'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Staff user — section access below</SelectItem>
                  <SelectItem value="admin">Admin — full access to everything</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Section access (staff users)
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(keys.data ?? []).map((k) => (
                  <label key={k} className="flex items-center gap-2 text-sm text-slate-700">
                    <Checkbox
                      name={`perm_${k}`}
                      defaultChecked={editing?.permissions.split(',').includes(k)}
                    />
                    {PERMISSION_LABELS[k] ?? k}
                  </label>
                ))}
              </div>
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
                {editing ? 'Save changes' : 'Create user'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
