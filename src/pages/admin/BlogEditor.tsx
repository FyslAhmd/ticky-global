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
import { ArrowLeft, Trash2, Save, Eye } from 'lucide-react'
import { renderMarkdown } from '@/lib/markdown'

type PublishStatus = 'draft' | 'published' | 'archived'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function BlogEditor() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const list = trpc.marketing.blog.list.useQuery(undefined, { enabled: !isNew })
  const [loaded, setLoaded] = useState(isNew)
  const [slugTouched, setSlugTouched] = useState(false)
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
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
          coverImage: p.coverImage ?? '',
          status: p.status,
        })
        setLoaded(true)
      }
    }
  }, [isNew, list.data, id, loaded])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const onError = (e: { message: string }) => setError(e.message)
  const create = trpc.marketing.blog.create.useMutation({
    onSuccess: () => {
      utils.marketing.blog.list.invalidate()
      navigate('/admin/blog')
    },
    onError,
  })
  const update = trpc.marketing.blog.update.useMutation({
    onSuccess: () => {
      utils.marketing.blog.list.invalidate()
      navigate('/admin/blog')
    },
    onError,
  })
  const remove = trpc.marketing.blog.delete.useMutation({
    onSuccess: () => {
      utils.marketing.blog.list.invalidate()
      navigate('/admin/blog')
    },
  })

  const save = () => {
    setError(null)
    if (isNew) create.mutate(form)
    else update.mutate({ id: Number(id), data: form })
  }

  if (!isNew && list.isLoading) return <AdminLoading />

  return (
    <div>
      <AdminHeader title={isNew ? 'New blog post' : 'Edit blog post'}>
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/admin/blog">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to blog
          </Link>
        </Button>
      </AdminHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => {
                  set('title', e.target.value)
                  if (!slugTouched) set('slug', slugify(e.target.value))
                }}
                placeholder="e.g. How much does a Filipino virtual assistant cost in 2026?"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  set('slug', slugify(e.target.value))
                }}
                placeholder="how-much-does-a-filipino-va-cost"
              />
              <p className="text-xs text-slate-400">Public URL: /blog/{form.slug || '…'}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Excerpt (shown on the blog index & in search results)</Label>
              <Textarea
                id="excerpt"
                rows={2}
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coverImage">Cover image URL (optional)</Label>
              <Input
                id="coverImage"
                value={form.coverImage}
                onChange={(e) => set('coverImage', e.target.value)}
                placeholder="/images/blog-cover.jpg or https://…"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content (markdown)</Label>
                <Button type="button" size="sm" variant="ghost" className="rounded-full" onClick={() => setPreview((v) => !v)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  {preview ? 'Edit' : 'Preview'}
                </Button>
              </div>
              {preview ? (
                <div
                  className="prose prose-slate max-w-none rounded-xl border border-slate-200 p-5"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) }}
                />
              ) : (
                <Textarea
                  id="content"
                  rows={16}
                  value={form.content}
                  onChange={(e) => set('content', e.target.value)}
                  placeholder="## Start with a strong heading&#10;&#10;Write in markdown…"
                  className="font-mono text-sm"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit rounded-2xl border-slate-200">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v as PublishStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <Button
              onClick={save}
              disabled={create.isPending || update.isPending || !form.title || !form.slug || !form.content}
              className="w-full rounded-full bg-blue-700 hover:bg-blue-800"
            >
              <Save className="mr-1.5 h-4 w-4" />
              {isNew ? 'Create post' : 'Save changes'}
            </Button>
            {!isNew && (
              <Button
                variant="ghost"
                className="w-full rounded-full text-red-600 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Delete this post? This cannot be undone.')) remove.mutate({ id: Number(id) })
                }}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete post
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
