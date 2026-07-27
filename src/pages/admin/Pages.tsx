import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import { Plus, Pencil, ExternalLink } from 'lucide-react'

const statusStyles: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  draft: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  archived: 'bg-slate-200 text-slate-500 hover:bg-slate-200',
}

export default function AdminPages() {
  const list = trpc.staff.pages.list.useQuery()

  return (
    <div>
      <AdminHeader
        title="Pages"
        description="Create and publish new content pages. Live pages appear at /p/your-slug."
      >
        <Button asChild className="rounded-full bg-blue-700 hover:bg-blue-800">
          <Link to="/admin/pages/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New page
          </Link>
        </Button>
      </AdminHeader>

      {list.isLoading ? (
        <AdminLoading />
      ) : (
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">URL</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(list.data ?? []).map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-blue-50/40">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{p.title}</p>
                      {p.excerpt && <p className="line-clamp-1 text-xs text-slate-500">{p.excerpt}</p>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">/p/{p.slug}</td>
                    <td className="px-6 py-4">
                      <Badge className={`rounded-full text-[11px] font-semibold capitalize ${statusStyles[p.status]}`}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(p.updatedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button asChild size="sm" variant="outline" className="rounded-full">
                          <Link to={`/admin/pages/${p.id}`}>
                            <Pencil className="mr-1.5 h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                        {p.status === 'published' && (
                          <Button asChild size="sm" variant="ghost" className="rounded-full text-blue-700">
                            <Link to={`/p/${p.slug}`} target="_blank">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {(list.data ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No pages yet — create your first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
