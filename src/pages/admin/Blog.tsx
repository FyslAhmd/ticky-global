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

export default function AdminBlog() {
  const list = trpc.marketing.blog.list.useQuery(undefined, { retry: false })

  return (
    <div>
      <AdminHeader
        title="Blog"
        description="Published posts appear publicly at /blog — a strong SEO channel for outsourcing and offshore-staffing searches."
      >
        <Button asChild className="rounded-full bg-blue-700 hover:bg-blue-800">
          <Link to="/admin/blog/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New post
          </Link>
        </Button>
      </AdminHeader>

      {list.isLoading ? (
        <AdminLoading />
      ) : (list.data ?? []).length === 0 ? (
        <Card className="rounded-2xl border-dashed border-slate-300">
          <CardContent className="p-10 text-center text-sm text-slate-500">
            No posts yet. Create your first post to start building organic search traffic.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(list.data ?? []).map((p) => (
            <Card key={p.id} className="flex flex-col rounded-2xl border-slate-200">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold leading-snug text-slate-900">{p.title}</p>
                  <Badge className={`shrink-0 rounded-full text-[11px] font-semibold capitalize ${statusStyles[p.status]}`}>
                    {p.status}
                  </Badge>
                </div>
                {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.excerpt}</p>}
                <p className="mt-2 text-xs text-slate-400">/blog/{p.slug}</p>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to={`/admin/blog/${p.id}`}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Link>
                  </Button>
                  {p.status === 'published' && (
                    <Button asChild size="sm" variant="ghost" className="rounded-full text-blue-700">
                      <Link to={`/blog/${p.slug}`}>
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        View
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
