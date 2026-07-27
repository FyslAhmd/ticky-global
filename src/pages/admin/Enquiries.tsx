import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import { Mail, Phone, Building2, Clock3, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const statuses = ['new', 'contacted', 'qualified', 'won', 'lost'] as const
type Status = (typeof statuses)[number]

const statusStyles: Record<Status, string> = {
  new: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  contacted: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  qualified: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  won: 'bg-green-600 text-white hover:bg-green-600',
  lost: 'bg-slate-200 text-slate-600 hover:bg-slate-200',
}

export default function Enquiries() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<string>('all')
  const { user } = useAuth()
  const utils = trpc.useUtils()

  const list = trpc.staff.enquiries.list.useQuery(
    filter === 'all' ? undefined : { status: filter as Status },
  )

  const selectedId = Number(searchParams.get('id') ?? 0)
  const selected = useMemo(
    () => (list.data ?? []).find((e) => e.id === selectedId) ?? null,
    [list.data, selectedId],
  )

  const [notes, setNotes] = useState<string | null>(null)

  const update = trpc.staff.enquiries.update.useMutation({
    onSuccess: () => utils.staff.enquiries.list.invalidate(),
  })
  const remove = trpc.staff.enquiries.delete.useMutation({
    onSuccess: () => {
      utils.staff.enquiries.list.invalidate()
      close()
    },
  })

  const close = () => {
    searchParams.delete('id')
    setSearchParams(searchParams, { replace: true })
    setNotes(null)
  }

  const open = (id: number) => {
    searchParams.set('id', String(id))
    setSearchParams(searchParams, { replace: true })
    setNotes(null)
  }

  return (
    <div>
      <AdminHeader
        title="Enquiries"
        description="Discovery call requests and contact form submissions from the public site."
      >
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-10 w-44 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminHeader>

      {list.isLoading ? (
        <AdminLoading />
      ) : (
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role interest</th>
                  <th className="px-6 py-4">Hours</th>
                  <th className="px-6 py-4">Received</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(list.data ?? []).map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => open(e.id)}
                    className="cursor-pointer transition-colors hover:bg-blue-50/40"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{e.name}</p>
                      <p className="text-xs text-slate-500">{e.company}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{e.roleInterest ?? '—'}</td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{e.hours ?? '—'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(e.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`rounded-full text-[11px] font-semibold capitalize ${statusStyles[e.status]}`}>
                        {e.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(list.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selected.name}
                  <Badge className={`rounded-full text-[11px] font-semibold capitalize ${statusStyles[selected.status]}`}>
                    {selected.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Received{' '}
                  {new Date(selected.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2 text-slate-600">
                  <Building2 className="h-4 w-4 text-slate-400" /> {selected.company}
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  {selected.hours === 'full'
                    ? 'Full-time (40h/week)'
                    : selected.hours === 'part'
                      ? 'Part-time (20h/week)'
                      : 'Not sure yet'}
                </p>
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-blue-700 hover:underline">
                  <Mail className="h-4 w-4" /> {selected.email}
                </a>
                {selected.phone && (
                  <p className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" /> {selected.phone}
                  </p>
                )}
              </div>

              {selected.roleInterest && (
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Role interest:</span> {selected.roleInterest}
                </p>
              )}

              {selected.message && (
                <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  {selected.message}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Internal notes</label>
                <Textarea
                  rows={3}
                  defaultValue={notes ?? selected.notes ?? ''}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Call outcome, next steps..."
                />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={notes === null || update.isPending}
                  onClick={() => update.mutate({ id: selected.id, notes: notes ?? '' })}
                >
                  Save notes
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => update.mutate({ id: selected.id, status: s })}
                      disabled={update.isPending}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                        selected.status === s
                          ? statusStyles[s] + ' ring-2 ring-offset-1 ring-slate-400'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {user?.role === 'admin' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={remove.isPending}
                    onClick={() => remove.mutate({ id: selected.id })}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
