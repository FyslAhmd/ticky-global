import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import { ArrowLeft, Trash2, Save, ExternalLink, Eye } from 'lucide-react'
import { renderMarkdown } from '@/lib/markdown'

type PublishStatus = 'draft' | 'published' | 'archived'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function PageEditor() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const list = trpc.staff.pages.list.useQuery(undefined, { enabled: !isNew })
  const [loaded, setLoaded] = useState(isNew)
  const [slugTouched, setSlugTouched] = useState(false)
  const [preview, setPreview] = useState(false)

  const [form, setForm] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    status: 'draft' as PublishStatus,
  })

  useEffect(() => {
    if (!isNew && list.data && !loaded) {
      const p = list.data.find((x) => x.id === Number(id))
      if (p) {
        setForm({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt ?? '',
          content: p.content,
          status: p.status,
        })
        setLoaded(true)
      }
    }
  }, [isNew, list.data, id, loaded])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const create = trpc.staff.pages.create.useMutation({
    onSuccess: () => {
      utils.staff.pages.list.invalidate()
      navigate('/admin/pages')
    },
  })
  const update = trpc.staff.pages.update.useMutation({
    onSuccess: () => {
      utils.staff.pages.list.invalidate()
      navigate('/admin/pages')
    },
  })
  const remove = trpc.staff.pages.delete.useMutation({
    onSuccess: () => {
      utils.staff.pages.list.invalidate()
      navigate('/admin/pages')
    },
  })

  if (!loaded) return <AdminLoading />

  const payload = { ...form, slug: form.slug || slugify(form.title), excerpt: form.excerpt || undefined }
  const valid = payload.title && payload.content && /^[a-z0-9-]+$/.test(payload.slug)
  const saving = create.isPending || update.isPending

  const submit = () => {
    if (!valid) return
    if (isNew) create.mutate(payload as typeof payload & { excerpt?: string })
    else update.mutate({ id: Number(id), data: { ...payload, excerpt: form.excerpt } })
  }

  return (
    <div className="max-w-4xl">
      <AdminHeader title={isNew ? 'Create page' : `Edit — ${form.title}`}>
        <div className="flex gap-2">
          {form.status === 'published' && !isNew && (
            <Button asChild variant="outline" className="rounded-full">
              <Link to={`/p/${form.slug}`} target="_blank">
                <ExternalLink className="mr-1.5 h-4 w-4" />
                View live
              </Link>
            </Button>
          )}
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/admin/pages">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </AdminHeader>

      <div className="space-y-6">
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-[1fr_260px]">
              <div className="space-y-2">
                <Label>Page title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    set('title', e.target.value)
                    if (!slugTouched) set('slug', slugify(e.target.value))
                  }}
                  placeholder="Why outsource to the Philippines?"
                />
              </div>
              <div className="space-y-2">
                <Label>URL slug *</Label>
                <div className="flex items-center">
                  <span className="rounded-l-md border border-r-0 border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-slate-400">/p/</span>
                  <Input
                    className="rounded-l-none"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true)
                      set('slug', slugify(e.target.value))
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt (shown in listings & previews)</Label>
              <Input
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="A one-sentence summary of this page"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <Label className="text-base font-bold text-slate-900">Content *</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => setPreview((p) => !p)}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                {preview ? 'Edit' : 'Preview'}
              </Button>
            </div>
            {preview ? (
              <article
                className="prose prose-slate max-w-none rounded-xl border border-slate-100 bg-slate-50/50 p-6"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) }}
              />
            ) : (
              <>
                <Textarea
                  rows={18}
                  className="font-mono text-sm leading-relaxed"
                  value={form.content}
                  onChange={(e) => set('content', e.target.value)}
                  placeholder={'## Section heading\n\nWrite your content here...\n\n- Bullet one\n- Bullet two\n\n1. Numbered step\n2. Next step'}
                />
                <p className="mt-3 text-xs text-slate-400">
                  Formatting: <code>## Heading</code>, <code>### Subheading</code>,{' '}
                  <code>**bold**</code>, <code>*italic*</code>, <code>- bullet list</code>,{' '}
                  <code>1. numbered list</code>. Blank line = new paragraph.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardContent className="flex flex-wrap items-end justify-between gap-4 p-6">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v as PublishStatus)}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {!isNew && (
                <Button
                  variant="ghost"
                  className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={remove.isPending}
                  onClick={() => {
                    if (confirm('Delete this page permanently?')) remove.mutate({ id: Number(id) })
                  }}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button
                className="rounded-full bg-blue-700 px-6 hover:bg-blue-800"
                disabled={!valid || saving}
                onClick={submit}
              >
                <Save className="mr-1.5 h-4 w-4" />
                {saving ? 'Saving...' : isNew ? 'Create page' : 'Save changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
