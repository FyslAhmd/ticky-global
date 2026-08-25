import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Trash2, Link2, Music2 } from 'lucide-react'

const PLATFORMS = [
  { key: 'facebook', label: 'Facebook', icon: Facebook, hint: 'https://facebook.com/tickyglobal', color: 'text-blue-600 bg-blue-50' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, hint: 'https://instagram.com/tickyglobal', color: 'text-pink-600 bg-pink-50' },
  { key: 'tiktok', label: 'TikTok', icon: Music2, hint: 'https://tiktok.com/@tickyglobal', color: 'text-slate-900 bg-slate-100' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, hint: 'https://youtube.com/@tickyglobal', color: 'text-red-600 bg-red-50' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, hint: 'https://linkedin.com/company/tickyglobal', color: 'text-sky-700 bg-sky-50' },
  { key: 'x', label: 'X (Twitter)', icon: Twitter, hint: 'https://x.com/tickyglobal', color: 'text-slate-900 bg-slate-100' },
] as const

export default function AdminSocials() {
  const list = trpc.marketing.socials.list.useQuery(undefined, { retry: false })
  const upsert = trpc.marketing.socials.upsert.useMutation({ onSuccess: () => list.refetch() })
  const del = trpc.marketing.socials.delete.useMutation({ onSuccess: () => list.refetch() })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const urls = Object.fromEntries((list.data ?? []).map((l) => [l.platform, l]))

  const handleSave = (platform: string) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const url = String(data.get('url') ?? '').trim()
    if (!url) return
    try {
      await upsert.mutateAsync({ platform: platform as never, url })
      setErrors((prev) => ({ ...prev, [platform]: '' }))
    } catch (err) {
      setErrors((prev) => ({ ...prev, [platform]: (err as Error).message }))
    }
  }

  return (
    <div>
      <AdminHeader
        title="Social media links"
        description="Connect your social profiles — linked accounts appear in the website footer automatically. Leave blank to hide a platform."
      />

      {list.isLoading ? (
        <AdminLoading />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {PLATFORMS.map((p) => {
            const existing = urls[p.key]
            return (
              <Card key={p.key} className="rounded-2xl border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${p.color}`}>
                      <p.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{p.label}</p>
                      {existing ? (
                        <a
                          href={existing.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          <Link2 className="h-3 w-3" />
                          {existing.url}
                        </a>
                      ) : (
                        <p className="text-xs text-slate-400">Not connected</p>
                      )}
                    </div>
                  </div>
                  <form onSubmit={handleSave(p.key)} className="mt-4 flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`url_${p.key}`} className="sr-only">
                        {p.label} URL
                      </Label>
                      <Input
                        id={`url_${p.key}`}
                        name="url"
                        type="url"
                        placeholder={p.hint}
                        defaultValue={existing?.url ?? ''}
                        key={existing?.url ?? 'empty'}
                      />
                    </div>
                    <Button type="submit" size="sm" className="rounded-full bg-blue-700 hover:bg-blue-800" disabled={upsert.isPending}>
                      Save
                    </Button>
                    {existing && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Remove the ${p.label} link?`)) del.mutate({ id: existing.id })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </form>
                  {errors[p.key] && <p className="mt-2 text-xs text-red-600">{errors[p.key]}</p>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
