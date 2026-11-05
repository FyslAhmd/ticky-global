import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Eye, Inbox, Globe2, FileBarChart, Radio } from 'lucide-react'

type Preset = 'today' | 7 | 30 | 90 | 'custom'

const presets: { key: Preset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 7, label: '7 days' },
  { key: 30, label: '30 days' },
  { key: 90, label: '90 days' },
  { key: 'custom', label: 'Custom' },
]

const chartConfig = {
  views: { label: 'Page views', color: '#1D4ED8' },
} satisfies ChartConfig

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function timeAgo(at: string) {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(at).getTime()) / 1000))
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Analytics() {
  const [preset, setPreset] = useState<Preset>(30)
  const [from, setFrom] = useState(() => iso(new Date(Date.now() - 14 * 86400000)))
  const [to, setTo] = useState(() => iso(new Date()))

  const input = useMemo(() => {
    if (preset === 'today') {
      const today = iso(new Date())
      return { from: today, to: today }
    }
    if (preset === 'custom') return { from, to: to >= from ? to : from }
    return { days: preset }
  }, [preset, from, to])

  const live = preset === 'today'
  const summary = trpc.staff.analyticsSummary.useQuery(input, {
    refetchInterval: live ? 30000 : false,
  })
  const activity = trpc.staff.recentActivity.useQuery(undefined, {
    refetchInterval: live ? 15000 : false,
  })

  const byHour = useMemo(() => {
    const map = new Map((summary.data?.byHour ?? []).map((h) => [h.hour, h.views]))
    const nowHour = new Date().getHours()
    // Fill every hour from midnight up to the current hour so the chart reads naturally
    return Array.from({ length: nowHour + 1 }, (_, h) => ({
      hour: `${String(h).padStart(2, '0')}:00`,
      views: map.get(h) ?? 0,
    }))
  }, [summary.data?.byHour])

  return (
    <div>
      <AdminHeader
        title="Traffic analytics"
        description="Page views tracked automatically across the public site. Bots are filtered out."
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5 rounded-full bg-slate-100 p-1">
            {presets.map((r) => (
              <button
                key={String(r.key)}
                onClick={() => setPreset(r.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  preset === r.key ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {preset === 'custom' && (
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <input
                type="date"
                value={from}
                max={iso(new Date())}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
              />
              <span className="text-xs font-medium text-slate-400">to</span>
              <input
                type="date"
                value={to}
                min={from}
                max={iso(new Date())}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
              />
            </div>
          )}
          {live && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live — auto-refreshing
            </span>
          )}
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
              {live ? (
                <>
                  <h2 className="font-bold text-slate-900">Page views by hour — today</h2>
                  <ChartContainer config={chartConfig} className="mt-4 h-72 w-full">
                    <BarChart data={byHour} margin={{ left: -12, right: 8 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="views" fill="#1D4ED8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </>
              ) : (
                <>
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
                </>
              )}
            </CardContent>
          </Card>

          {live && (
            <Card className="mt-6 rounded-2xl border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-600" />
                  <h2 className="font-bold text-slate-900">Live activity — latest visits</h2>
                </div>
                <p className="mt-1 text-xs text-slate-400">Refreshes every 15 seconds.</p>
                <div className="mt-4 divide-y divide-slate-100">
                  {(activity.data ?? []).length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-400">No visits recorded yet today.</p>
                  )}
                  {(activity.data ?? []).map((e) => (
                    <div key={e.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Eye className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                        <span className="truncate font-medium text-slate-700">{e.path}</span>
                        {e.referrer && (
                          <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 sm:inline">
                            via {e.referrer}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">{timeAgo(e.at)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
