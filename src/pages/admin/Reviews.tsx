import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import { Plus, Pencil, ExternalLink } from 'lucide-react'
import Stars from '@/components/Stars'

const statusStyles: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  draft: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  archived: 'bg-slate-200 text-slate-500 hover:bg-slate-200',
}

export default function AdminReviews() {
  const list = trpc.staff.reviews.list.useQuery()

  return (
    <div>
      <AdminHeader
        title="Client reviews"
        description="Published reviews appear on the homepage carousel and the public Reviews page."
      >
        <Button asChild className="rounded-full bg-blue-700 hover:bg-blue-800">
          <Link to="/admin/reviews/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add review
          </Link>
        </Button>
      </AdminHeader>

      {list.isLoading ? (
        <AdminLoading />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(list.data ?? []).map((r) => (
            <Card key={r.id} className="overflow-hidden rounded-2xl border-slate-200">
              <div className="relative h-40 bg-slate-100">
                {r.photo ? (
                  <img src={r.photo} alt={r.name} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl font-bold text-slate-300">
                    {r.name.split(' ').map((p) => p[0]).join('')}
                  </div>
                )}
                <Badge className={`absolute right-3 top-3 rounded-full text-[11px] font-semibold capitalize ${statusStyles[r.status]}`}>
                  {r.status}
                </Badge>
              </div>
              <CardContent className="p-5">
                <Stars rating={r.rating} />
                <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-700">"{r.quote}"</p>
                <p className="mt-3 font-bold text-slate-900">{r.name}</p>
                <p className="text-xs text-slate-500">
                  {r.role}, {r.company} · {r.location}
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to={`/admin/reviews/${r.id}`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  {r.status === 'published' && (
                    <Button asChild size="sm" variant="ghost" className="rounded-full text-blue-700">
                      <Link to={`/reviews#${r.slug}`} target="_blank">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        View live
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
