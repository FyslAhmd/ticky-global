import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckSquare, Square, Trash2, X, Loader2 } from 'lucide-react'

export type BatchSelection = {
  selected: Set<number>
  toggle: (id: number) => void
  toggleAll: (ids: number[]) => void
  clear: () => void
  isAllSelected: (ids: number[]) => boolean
}

export function useBatchSelection(): BatchSelection {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  return {
    selected,
    toggle: (id) =>
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      }),
    toggleAll: (ids) =>
      setSelected((prev) => (ids.every((id) => prev.has(id)) && ids.length > 0 ? new Set() : new Set(ids))),
    clear: () => setSelected(new Set()),
    isAllSelected: (ids) => ids.length > 0 && ids.every((id) => selected.has(id)),
  }
}

export function SelectAllCheckbox({
  selection,
  ids,
}: {
  selection: BatchSelection
  ids: number[]
}) {
  const all = selection.isAllSelected(ids)
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); selection.toggleAll(ids) }}
      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600"
      title={all ? 'Deselect all' : 'Select all'}
    >
      {all ? <CheckSquare className="h-4 w-4 text-blue-700" /> : <Square className="h-4 w-4" />}
    </button>
  )
}

export function RowCheckbox({
  selection,
  id,
}: {
  selection: BatchSelection
  id: number
}) {
  return (
    <span onClick={(e) => e.stopPropagation()} className="inline-flex">
      <Checkbox
        checked={selection.selected.has(id)}
        onCheckedChange={() => selection.toggle(id)}
        aria-label="Select row"
      />
    </span>
  )
}

/** Floating action bar shown when rows are selected. */
export function BatchActionBar({
  selection,
  statusOptions,
  onSetStatus,
  onDelete,
  busy,
}: {
  selection: BatchSelection
  statusOptions: { value: string; label: string }[]
  onSetStatus: (status: string) => void
  onDelete: () => void
  busy: boolean
}) {
  const count = selection.selected.size
  if (count === 0) return null
  return (
    <div className="sticky bottom-4 z-20 mx-auto mt-4 flex w-fit flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-lg">
      <span className="text-sm font-semibold text-slate-700">{count} selected</span>
      <Select onValueChange={onSetStatus} disabled={busy}>
        <SelectTrigger className="h-8 w-36 rounded-full text-xs">
          <SelectValue placeholder="Set status…" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((o) => (
            <SelectItem key={o.value} value={o.value} className="capitalize">{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="outline"
        className="h-8 rounded-full text-xs text-red-600 hover:bg-red-50"
        disabled={busy}
        onClick={() => {
          if (window.confirm(`Delete ${count} selected item${count > 1 ? 's' : ''}? This can't be undone.`)) onDelete()
        }}
      >
        {busy ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1 h-3.5 w-3.5" />}
        Delete
      </Button>
      <Button size="sm" variant="ghost" className="h-8 rounded-full px-2" onClick={selection.clear} aria-label="Clear selection">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
