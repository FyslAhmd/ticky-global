import { useEffect, useRef, useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2, Lock, UserCheck, FileText, Download, CalendarDays, PartyPopper,
  GraduationCap, MessageSquare, Send, LogOut, Sparkles, ArrowRight, Shield,
} from "lucide-react";
import { Link } from "react-router";
import { roles, regions, regionKeys } from "@/data/content";

function LoginCard() {
  const utils = trpc.useUtils();
  const login = trpc.auth.clientLogin.useMutation({
    onSuccess: () => utils.portal.me.invalidate(),
    onError: (e) => toast.error(e.message),
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"><Lock className="h-6 w-6 text-blue-700" /></div>
          <CardTitle className="text-2xl">Client Portal</CardTitle>
          <CardDescription>Sign in with the login created by your Ticky Global account manager.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login.mutate({ email: email.trim().toLowerCase(), password });
            }}
          >
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button className="w-full bg-blue-700 hover:bg-blue-800" disabled={login.isPending}>
              {login.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            No login yet? Contact your account manager or email{" "}
            <a href="mailto:hello@tickyglobal.com" className="font-medium text-blue-700">hello@tickyglobal.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Dashboard() {
  const utils = trpc.useUtils();
  const me = trpc.portal.me.useQuery();
  const dash = trpc.portal.dashboard.useQuery();
  const messages = trpc.portal.messages.list.useQuery(undefined, { refetchInterval: 5000 });
  const send = trpc.portal.messages.send.useMutation({
    onSuccess: () => { setBody(""); utils.portal.messages.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => { utils.portal.me.invalidate(); utils.portal.dashboard.invalidate(); },
  });
  const [body, setBody] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.data?.length]);

  if (dash.isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
  const c = dash.data?.client;
  if (!c) return <p className="py-20 text-center text-slate-500">Your client record is not set up yet — please contact your account manager.</p>;
  const remaining = Math.max(0, c.holidayEntitlementDays - c.holidayUsedDays);
  const meName = me.data?.name || c.contactName;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back, {meName}</h1>
          <p className="mt-1 text-sm text-slate-500">{c.company} · Client portal</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => logout.mutate()} disabled={logout.isPending}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Ticker info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="h-5 w-5 text-blue-700" /> Your Ticker</CardTitle>
          </CardHeader>
          <CardContent>
            {c.tickerName ? (
              <div className="flex items-start gap-4">
                {c.tickerPhoto ? (
                  <img src={c.tickerPhoto} alt={c.tickerName} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                    {c.tickerName.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold text-slate-900">{c.tickerName}</p>
                  {c.tickerRole && <p className="text-sm text-slate-600">{c.tickerRole}</p>}
                  {c.tickerStartDate && <p className="mt-1 text-xs text-slate-500">With you since {c.tickerStartDate}</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Your dedicated team member will appear here once assigned.</p>
            )}
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <span className="font-medium text-slate-900">Account manager:</span> {c.accountManager || "Your Ticky Global account manager"}
            </div>
          </CardContent>
        </Card>

        {/* Contract */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5 text-blue-700" /> Your contract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-slate-600">
              {c.contractSummary || "Your contract summary will appear here once your agreement is in place."}
            </p>
            {c.contractFileUrl && (
              <a href={c.contractFileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="mt-4"><Download className="mr-2 h-4 w-4" /> Download contract</Button>
              </a>
            )}
          </CardContent>
        </Card>

        {/* Holiday entitlement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><CalendarDays className="h-5 w-5 text-blue-700" /> Holiday entitlement</CardTitle>
            <CardDescription>Your Ticker's annual leave allowance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-2xl font-bold text-slate-900">{c.holidayEntitlementDays}</p><p className="text-xs text-slate-500">Total days</p></div>
              <div className="rounded-xl bg-amber-50 p-4"><p className="text-2xl font-bold text-amber-700">{c.holidayUsedDays}</p><p className="text-xs text-slate-500">Used</p></div>
              <div className="rounded-xl bg-emerald-50 p-4"><p className="text-2xl font-bold text-emerald-700">{remaining}</p><p className="text-xs text-slate-500">Remaining</p></div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Leave is coordinated with your account manager so cover is always planned in advance.</p>
          </CardContent>
        </Card>

        {/* National holidays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><PartyPopper className="h-5 w-5 text-blue-700" /> Philippine national holidays {new Date().getFullYear()}</CardTitle>
            <CardDescription>Your Ticker may be off on these dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {(dash.data?.holidays ?? []).map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{h.name}</p>
                    {h.note && <p className="text-xs text-slate-500">{h.note}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-700">{h.date}</p>
                    <Badge variant="outline" className={h.type === "special" ? "text-amber-700" : "text-red-700"}>{h.type}</Badge>
                  </div>
                </div>
              ))}
              {(dash.data?.holidays ?? []).length === 0 && <p className="text-sm text-slate-500">Holiday calendar coming soon.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Training plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5 text-blue-700" /> Training &amp; development</CardTitle>
            <CardDescription>Ongoing development plan for your Ticker</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(dash.data?.training ?? []).map((t) => (
                <div key={t.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{t.title}</p>
                    <Badge variant={t.status === "completed" ? "default" : t.status === "in_progress" ? "secondary" : "outline"}>
                      {t.status.replace("_", " ")}
                    </Badge>
                  </div>
                  {t.description && <p className="mt-1 text-sm text-slate-600">{t.description}</p>}
                  {t.dueDate && <p className="mt-1 text-xs text-slate-500">Target: {t.dueDate}</p>}
                </div>
              ))}
              {(dash.data?.training ?? []).length === 0 && <p className="text-sm text-slate-500">Training plans will appear here as they're scheduled.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Messaging */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><MessageSquare className="h-5 w-5 text-blue-700" /> Message your account manager</CardTitle>
            <CardDescription>Questions about your service or your Ticker — we reply promptly</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="h-64 flex-1 space-y-3 overflow-y-auto rounded-lg border bg-slate-50 p-3">
              {(messages.data ?? []).map((m) => (
                <div key={m.id} className={`flex ${m.senderType === "client" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.senderType === "client" ? "bg-blue-700 text-white" : "border bg-white text-slate-800"}`}>
                    <p className="mb-0.5 text-[10px] opacity-70">{m.senderName}</p>
                    {m.body}
                  </div>
                </div>
              ))}
              {(messages.data ?? []).length === 0 && (
                <p className="py-10 text-center text-sm text-slate-400">Say hello — your account manager is here to help.</p>
              )}
              <div ref={endRef} />
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!body.trim()) return;
                send.mutate({ body: body.trim() });
              }}
            >
              <Textarea rows={1} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a message…" className="min-h-0 resize-none" />
              <Button className="bg-blue-700 hover:bg-blue-800" disabled={send.isPending}><Send className="h-4 w-4" /></Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Cross-sell */}
      <Card className="mt-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5 text-blue-700" /> Grow your team with Ticky Global</CardTitle>
          <CardDescription>Other roles businesses like yours hire with us — from £1,030/month with the same dedicated support.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roles.filter((r) => r.id !== "ppc").slice(0, 6).map((r) => (
              <Link key={r.id} to={`/roles/${r.id}`} className="group rounded-xl border bg-white p-4 transition hover:border-blue-300 hover:shadow-sm">
                <p className="font-medium text-slate-900 group-hover:text-blue-700">{r.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  from £{r.ticky.uk.toLocaleString()}/month · save {Math.round((1 - r.ticky.uk / r.native.uk) * 100)}%
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-700">Learn more <ArrowRight className="h-3 w-3" /></p>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link to="/contact"><Button className="bg-blue-700 hover:bg-blue-800">Discuss adding another role</Button></Link>
            <p className="text-xs text-slate-500">
              Available in {regionKeys.map((k) => regions[k].label).join(", ").replace(/,([^,]*)$/, " and$1")}.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <Shield className="h-3.5 w-3.5" /> Your data is private to your company and Ticky Global.
      </p>
    </div>
  );
}

export default function ClientPortal() {
  const me = trpc.portal.me.useQuery();
  if (me.isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
  return me.data ? <Dashboard /> : <LoginCard />;
}
