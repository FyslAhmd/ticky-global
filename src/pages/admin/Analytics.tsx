import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Eye, Inbox, Globe2, FileBarChart } from 'lucide-react'

const ranges = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
]

const chartConfig = {
  views: { label: 'Page views', color: '#1D4ED8' },
} satisfies ChartConfig

export default function Analytics() {
  const [days, setDays] = useState(30)
  const summary = trpc.staff.analyticsSummary.useQuery({ days })

  return (
    <div>
      <AdminHeader
        title="Traffic analytics"
        description="Page views tracked automatically across the public site. Bots are filtered out."
      >
        <div className="flex gap-1.5 rounded-full bg-slate-100 p-1">
          {ranges.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                days === r.days ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </AdminHeader>

      {summary.isLoading ? (
        <AdminLoading />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Eye, label: 'Total page views', value: summary.data?.totalViews ?? 0 },
              { icon: Inbox, label: 'New enquiries', value: summary.data?.newEnquiries ?? 0 },
              {
                icon: FileBarChart,
                label: 'Pages tracked',
                value: summary.data?.topPages.length ?? 0,
              },
              {
                icon: Globe2,
                label: 'Traffic sources',
                value: summary.data?.topReferrers.length ?? 0,
              },
            ].map((s) => (
              <Card key={s.label} className="rounded-2xl border-slate-200">
                <CardContent className="p-6">
                  <s.icon className="h-5 w-5 text-slate-400" />
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 rounded-2xl border-slate-200">
            <CardContent className="p-6">
              <h2 className="font-bold text-slate-900">Daily page views</h2>
              <ChartContainer config={chartConfig} className="mt-4 h-72 w-full">
                <AreaChart data={summary.data?.byDay ?? []} margin={{ left: -12, right: 8 }}>
                  <defs>
                    <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: string) => v.slice(5)}
                    fontSize={12}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#1D4ED8"
                    strokeWidth={2.5}
                    fill="url(#views)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-6">
                <h2 className="font-bold text-slate-900">Top pages</h2>
                <div className="mt-4 space-y-3">
                  {(summary.data?.topPages ?? []).map((p) => {
                    const max = summary.data?.topPages[0]?.views ?? 1
                    return (
                      <div key={p.path}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{p.path}</span>
                          <span className="text-slate-500">{p.views} views</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-blue-600" style={{ width: `${(p.views / max) * 100}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200">
              <CardContent className="p-6">
                <h2 className="font-bold text-slate-900">Top referrers</h2>
                <div className="mt-4 space-y-3">
                  {(summary.data?.topReferrers ?? []).length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-400">
                      No external referrers yet — mostly direct traffic.
                    </p>
                  )}
                  {(summary.data?.topReferrers ?? []).map((r) => (
                    <div key={r.referrer} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{r.referrer}</span>
                      <span className="text-slate-500">{r.views} visits</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
