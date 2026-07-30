import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import {
  Eye,
  Inbox,
  Star,
  FileText,
  ArrowRight,
  TrendingUp,
  Plus,
  CircleAlert,
} from 'lucide-react'

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-emerald-100 text-emerald-700',
  won: 'bg-green-600 text-white',
  lost: 'bg-slate-200 text-slate-600',
}

export default function Dashboard() {
  const analytics = trpc.staff.analyticsSummary.useQuery({ days: 30 })
  const enquiries = trpc.staff.enquiries.list.useQuery()
  const reviews = trpc.staff.reviews.list.useQuery()
  const pages = trpc.staff.pages.list.useQuery()

  if (analytics.isLoading || enquiries.isLoading || reviews.isLoading || pages.isLoading) {
    return <AdminLoading />
  }

  const newCount = (enquiries.data ?? []).filter((e) => e.status === 'new').length
  const publishedReviews = (reviews.data ?? []).filter((r) => r.status === 'published').length
  const publishedPages = (pages.data ?? []).filter((p) => p.status === 'published').length

  const stats = [
    {
      label: 'Page views (30d)',
      value: analytics.data?.totalViews ?? 0,
      icon: Eye,
      to: '/admin/analytics',
    },
    {
      label: 'New enquiries',
      value: newCount,
      icon: Inbox,
      to: '/admin/enquiries',
      highlight: newCount > 0,
    },
    {
      label: 'Published reviews',
      value: publishedReviews,
      icon: Star,
      to: '/admin/reviews',
    },
    {
      label: 'Live pages',
      value: publishedPages,
      icon: FileText,
      to: '/admin/pages',
    },
  ]

  const latest = (enquiries.data ?? []).slice(0, 5)

  return (
    <div>
      <AdminHeader title="Dashboard" description="What's happening across the Ticky Global site.">
        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/admin/reviews/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New review
            </Link>
          </Button>
          <Button asChild className="rounded-full bg-blue-700 hover:bg-blue-800">
            <Link to="/admin/pages/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New page
            </Link>
          </Button>
        </div>
      </AdminHeader>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="rounded-2xl border-slate-200 transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <s.icon className={`h-5 w-5 ${s.highlight ? 'text-blue-700' : 'text-slate-400'}`} />
                  {s.highlight && (
                    <Badge className="rounded-full bg-blue-700 text-[10px] font-bold text-white hover:bg-blue-700">
                      ACTION NEEDED
                    </Badge>
                  )}
                </div>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Latest enquiries */}
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Latest enquiries</h2>
              <Link to="/admin/enquiries" className="flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {latest.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">No enquiries yet.</p>
              )}
              {latest.map((e) => (
                <Link
                  key={e.id}
                  to={`/admin/enquiries?id=${e.id}`}
                  className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {e.name} <span className="font-normal text-slate-400">· {e.company}</span>
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {e.roleInterest ?? 'General enquiry'} — {new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <Badge className={`shrink-0 rounded-full text-[11px] font-semibold hover:${statusColors[e.status]} ${statusColors[e.status]}`}>
                    {e.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic snapshot */}
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Top pages (30 days)</h2>
              <Link to="/admin/analytics" className="flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800">
                Full analytics <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {(analytics.data?.topPages ?? []).slice(0, 6).map((p) => {
                const max = analytics.data?.topPages[0]?.views ?? 1
                return (
                  <div key={p.path}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{p.path}</span>
                      <span className="text-slate-500">{p.views}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${(p.views / max) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              Tracking is live on every public page automatically.
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              <CircleAlert className="h-4 w-4 shrink-0" />
              Bot and crawler traffic is filtered out server-side.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
