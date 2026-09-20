import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import {
  BarChart3, Tag, Target, CheckCircle2, XCircle, Loader2, FlaskConical,
  Activity, Info, ExternalLink,
} from 'lucide-react'

type Form = {
  enabled: boolean
  gtmId: string
  ga4Id: string
  googleAdsId: string
  conversionLabels: { enquiry_submitted: string; calculator_used: string; cta_click: string }
}

const EMPTY: Form = {
  enabled: false,
  gtmId: '',
  ga4Id: '',
  googleAdsId: '',
  conversionLabels: { enquiry_submitted: '', calculator_used: '', cta_click: '' },
}

function StatusCard({
  title,
  icon: Icon,
  configured,
  detail,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  configured: boolean
  detail: string
}) {
  return (
    <Card className="rounded-2xl border-slate-200">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${configured ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900">{title}</p>
            {configured ? (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle2 className="mr-1 h-3 w-3" />Connected</Badge>
            ) : (
              <Badge variant="outline" className="text-slate-400"><XCircle className="mr-1 h-3 w-3" />Not set</Badge>
            )}
          </div>
          <p className="truncate text-xs text-slate-500">{detail}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminIntegrations() {
  const get = trpc.integrations.get.useQuery(undefined, { retry: false })
  const events = trpc.integrations.recentEvents.useQuery(undefined, { retry: false, refetchInterval: 15000 })
  const update = trpc.integrations.update.useMutation({ onSuccess: () => get.refetch() })
  const [form, setForm] = useState<Form>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [testSent, setTestSent] = useState(false)

  useEffect(() => {
    if (get.data) setForm(get.data as Form)
  }, [get.data])

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }))
  const setLabel = (key: keyof Form['conversionLabels'], value: string) =>
    setForm((f) => ({ ...f, conversionLabels: { ...f.conversionLabels, [key]: value } }))

  const handleSave = async () => {
    setError(null)
    setSaved(false)
    try {
      await update.mutateAsync(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const sendTestEvent = () => {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer ?? []
    w.dataLayer.push({ event: 'integration_test', source: 'admin_panel', ts: Date.now() })
    setTestSent(true)
    setTimeout(() => setTestSent(false), 4000)
  }

  if (get.isLoading) return <AdminLoading />

  const gtmSet = Boolean(form.gtmId)
  const ga4Set = Boolean(form.ga4Id)
  const adsSet = Boolean(form.googleAdsId)

  return (
    <div className="mx-auto max-w-4xl">
      <AdminHeader
        title="Integrations &amp; Conversion Tracking"
        description="Connect Google Analytics (GA4), Google Tag Manager and Google Ads. Changes go live on the website immediately — no developer needed."
      />

      {/* Status overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatusCard title="GA4 Analytics" icon={BarChart3} configured={form.enabled && (ga4Set || gtmSet)} detail={ga4Set ? form.ga4Id : gtmSet ? 'via GTM container' : 'Measurement ID not set'} />
        <StatusCard title="Google Tag Manager" icon={Tag} configured={form.enabled && gtmSet} detail={gtmSet ? form.gtmId : 'Container ID not set'} />
        <StatusCard title="Google Ads" icon={Target} configured={form.enabled && (adsSet || gtmSet)} detail={adsSet ? form.googleAdsId : gtmSet ? 'via GTM container' : 'Conversion ID not set'} />
      </div>

      {/* Master switch */}
      <Card className="mt-6 rounded-2xl border-slate-200">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold text-slate-900">Tracking enabled</p>
            <p className="text-sm text-slate-500">
              {form.enabled
                ? 'Tracking scripts are live on the website.'
                : 'Off — nothing is sent to Google. Flip on once your IDs are entered.'}
            </p>
          </div>
          <Switch checked={form.enabled} onCheckedChange={(v) => set('enabled', v)} />
        </CardContent>
      </Card>

      {/* IDs */}
      <Card className="mt-4 rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Account IDs</CardTitle>
          <CardDescription>
            Find these in each Google product under Admin → Account settings. Leave GTM blank to run GA4 and Google Ads directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="ga4Id">GA4 Measurement ID</Label>
            <Input id="ga4Id" value={form.ga4Id} onChange={(e) => set('ga4Id', e.target.value.trim().toUpperCase())} placeholder="G-XXXXXXXXXX" className="font-mono" />
            <p className="text-xs text-slate-400">GA4 → Admin → Data streams → your web stream</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="gtmId">Google Tag Manager Container ID <span className="font-normal text-slate-400">(optional)</span></Label>
            <Input id="gtmId" value={form.gtmId} onChange={(e) => set('gtmId', e.target.value.trim().toUpperCase())} placeholder="GTM-XXXXXXX" className="font-mono" />
            <p className="text-xs text-slate-400">If set, the GTM container loads and manages all tags — use this if you prefer to build tags/triggers inside GTM.</p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="googleAdsId">Google Ads Conversion ID</Label>
            <Input id="googleAdsId" value={form.googleAdsId} onChange={(e) => set('googleAdsId', e.target.value.trim().toUpperCase())} placeholder="AW-123456789" className="font-mono" />
            <p className="text-xs text-slate-400">Google Ads → Goals → Conversions → your conversion action → Tag setup</p>
          </div>
        </CardContent>
      </Card>

      {/* Conversion labels */}
      <Card className="mt-4 rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Conversion labels <span className="text-sm font-normal text-slate-400">(direct mode only)</span></CardTitle>
          <CardDescription>
            The website already fires <code className="rounded bg-slate-100 px-1">enquiry_submitted</code>, <code className="rounded bg-slate-100 px-1">calculator_used</code> and <code className="rounded bg-slate-100 px-1">cta_click</code> events.
            Paste each conversion action's label here to count it in Google Ads. If you use GTM, leave these blank and map the events to conversion tags inside GTM instead (avoids double-counting).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {(
            [
              ['enquiry_submitted', 'Enquiry form submitted', 'Your primary lead conversion — fires on every contact form success.'],
              ['calculator_used', 'Savings calculator used', 'Fires when a visitor gets a savings estimate.'],
              ['cta_click', 'CTA clicked', 'Fires on “Book a Discovery Call” and pricing CTAs.'],
            ] as const
          ).map(([key, label, hint]) => (
            <div key={key} className="grid gap-1.5">
              <Label htmlFor={key}>{label} <span className="font-mono text-xs font-normal text-slate-400">({key})</span></Label>
              <Input id={key} value={form.conversionLabels[key]} onChange={(e) => setLabel(key, e.target.value.trim())} placeholder="e.g. AbC1dEfG2hI" className="font-mono" />
              <p className="text-xs text-slate-400">{hint}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Saved — tracking is now live with these settings.</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={update.isPending} className="rounded-full bg-blue-700 hover:bg-blue-800">
          {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save &amp; publish
        </Button>
        <Button variant="outline" onClick={sendTestEvent} className="rounded-full">
          <FlaskConical className="mr-2 h-4 w-4" />
          {testSent ? 'Test event sent ✓' : 'Send test event'}
        </Button>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Test events appear in GA4 → Reports → Realtime within a minute, and in GTM's Preview mode if you use GTM.
      </p>

      {/* Live data check */}
      <Card className="mt-6 rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-blue-700" /> Recent website events</CardTitle>
          <CardDescription>The site's own event log — confirms visitors and enquiries are being recorded before you check Google.</CardDescription>
        </CardHeader>
        <CardContent>
          {(events.data ?? []).length === 0 ? (
            <p className="text-sm text-slate-400">No events recorded yet.</p>
          ) : (
            <div className="max-h-64 space-y-1.5 overflow-y-auto">
              {(events.data ?? []).map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                  <span className="font-medium text-slate-700">{e.type}</span>
                  <span className="font-mono text-slate-500">{e.path}</span>
                  <span className="text-slate-400">{new Date(e.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup guide */}
      <Card className="mt-6 rounded-2xl border-blue-100 bg-blue-50/40">
        <CardHeader>
          <CardTitle className="text-base">Linking GA4 ↔ Google Ads (one-time, in Google)</CardTitle>
          <CardDescription>Do this once inside your Google accounts so conversion data flows both ways.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>In <strong>GA4</strong>: Admin → Product links → <strong>Google Ads links</strong> → link your Google Ads account (enables audiences + conversion export).</li>
            <li>In <strong>GA4</strong>: Admin → Events → mark <code className="rounded bg-white px-1">enquiry_submitted</code> as a <strong>key event</strong> (formerly “conversion”).</li>
            <li>In <strong>Google Ads</strong>: Goals → Conversions → New conversion action → <strong>Import → Google Analytics 4 → Web</strong> → import <code className="rounded bg-white px-1">enquiry_submitted</code>.</li>
            <li>Alternatively use a <strong>Google Ads conversion action with a label</strong> and paste the label above — the site fires it directly.</li>
            <li>Verify in Google Ads → Goals → Conversions that the status shows <strong>“Recording conversions”</strong> after a test enquiry.</li>
          </ol>
          <a
            href="https://support.google.com/analytics/answer/9379420"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
          >
            Google's official linking guide <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
