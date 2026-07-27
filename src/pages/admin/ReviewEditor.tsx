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
import { ArrowLeft, Trash2, Save, Plus, X } from 'lucide-react'

type PublishStatus = 'draft' | 'published' | 'archived'

interface FormState {
  slug: string
  name: string
  role: string
  company: string
  location: string
  industry: string
  hires: string[]
  saving: string
  rating: number
  headline: string
  quote: string
  story: string
  photo: string
  status: PublishStatus
  sortOrder: number
}

const empty: FormState = {
  slug: '',
  name: '',
  role: '',
  company: '',
  location: '',
  industry: '',
  hires: [''],
  saving: '',
  rating: 5,
  headline: '',
  quote: '',
  story: '',
  photo: '',
  status: 'draft',
  sortOrder: 0,
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ReviewEditor() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const list = trpc.staff.reviews.list.useQuery(undefined, { enabled: !isNew })
  const [form, setForm] = useState<FormState>(empty)
  const [loaded, setLoaded] = useState(isNew)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (!isNew && list.data && !loaded) {
      const r = list.data.find((x) => x.id === Number(id))
      if (r) {
        setForm({
          slug: r.slug,
          name: r.name,
          role: r.role,
          company: r.company,
          location: r.location,
          industry: r.industry,
          hires: JSON.parse(r.hires),
          saving: r.saving,
          rating: r.rating,
          headline: r.headline,
          quote: r.quote,
          story: (JSON.parse(r.story) as string[]).join('\n\n'),
          photo: r.photo ?? '',
          status: r.status,
          sortOrder: r.sortOrder,
        })
        setLoaded(true)
      }
    }
  }, [isNew, list.data, id, loaded])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const create = trpc.staff.reviews.create.useMutation({
    onSuccess: () => {
      utils.staff.reviews.list.invalidate()
      navigate('/admin/reviews')
    },
  })
  const update = trpc.staff.reviews.update.useMutation({
    onSuccess: () => {
      utils.staff.reviews.list.invalidate()
      navigate('/admin/reviews')
    },
  })
  const remove = trpc.staff.reviews.delete.useMutation({
    onSuccess: () => {
      utils.staff.reviews.list.invalidate()
      navigate('/admin/reviews')
    },
  })

  if (!loaded) return <AdminLoading />

  const payload = {
    ...form,
    slug: form.slug || slugify(form.name),
    hires: form.hires.filter((h) => h.trim()),
    story: form.story.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    photo: form.photo || undefined,
  }

  const valid =
    payload.name && payload.role && payload.company && payload.location &&
    payload.industry && payload.saving && payload.headline && payload.quote &&
    payload.hires.length > 0 && payload.story.length > 0 && payload.slug

  const saving = create.isPending || update.isPending

  const submit = () => {
    if (!valid) return
    if (isNew) create.mutate(payload)
    else update.mutate({ id: Number(id), data: payload })
  }

  return (
    <div className="max-w-3xl">
      <AdminHeader title={isNew ? 'Add client review' : `Edit review — ${form.name}`}>
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/admin/reviews">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to reviews
          </Link>
        </Button>
      </AdminHeader>

      <div className="space-y-6">
        {/* Client details */}
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="space-y-5 p-6">
            <h2 className="font-bold text-slate-900">Client details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    set('name', e.target.value)
                    if (!slugTouched) set('slug', slugify(e.target.value))
                  }}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="space-y-2">
                <Label>URL slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set('slug', slugify(e.target.value))
                  }}
                  placeholder="jane-smith"
                />
              </div>
              <div className="space-y-2">
                <Label>Job title *</Label>
                <Input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Managing Director" />
              </div>
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Acme Ltd" />
              </div>
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="London, UK" />
              </div>
              <div className="space-y-2">
                <Label>Industry *</Label>
                <Input value={form.industry} onChange={(e) => set('industry', e.target.value)} placeholder="B2B SaaS" />
              </div>
              <div className="space-y-2">
                <Label>Annual saving badge *</Label>
                <Input value={form.saving} onChange={(e) => set('saving', e.target.value)} placeholder="£38,000 / year" />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <Select value={String(form.rating)} onValueChange={(v) => set('rating', Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} stars</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Photo URL</Label>
              <Input
                value={form.photo}
                onChange={(e) => set('photo', e.target.value)}
                placeholder="/images/review-jane.jpg or https://..."
              />
              {form.photo && (
                <img src={form.photo} alt="preview" className="h-24 w-24 rounded-xl object-cover object-top" />
              )}
              <p className="text-xs text-slate-400">
                Leave blank to show initials. For uploads, place the image in the site's public/images folder or use any public URL.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Review content */}
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="space-y-5 p-6">
            <h2 className="font-bold text-slate-900">Review content</h2>
            <div className="space-y-2">
              <Label>Headline *</Label>
              <Input
                value={form.headline}
                onChange={(e) => set('headline', e.target.value)}
                placeholder="Books more meetings than the two UK hires she replaced"
              />
            </div>
            <div className="space-y-2">
              <Label>Short quote (shown on homepage carousel) *</Label>
              <Textarea rows={3} value={form.quote} onChange={(e) => set('quote', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Full story (blank line between paragraphs) *</Label>
              <Textarea
                rows={10}
                value={form.story}
                onChange={(e) => set('story', e.target.value)}
                placeholder={'Paragraph one...\n\nParagraph two...'}
              />
            </div>
            <div className="space-y-2">
              <Label>Westbridge team hired *</Label>
              {form.hires.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={h}
                    onChange={(e) =>
                      set('hires', form.hires.map((x, j) => (j === i ? e.target.value : x)))
                    }
                    placeholder="Telesales / SDR"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => set('hires', form.hires.filter((_, j) => j !== i))}
                    disabled={form.hires.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => set('hires', [...form.hires, ''])}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add role
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="flex flex-wrap items-end gap-4 p-6">
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
            <div className="space-y-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                className="w-28"
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', Number(e.target.value))}
              />
            </div>
            <div className="ml-auto flex gap-2">
              {!isNew && (
                <Button
                  variant="ghost"
                  className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={remove.isPending}
                  onClick={() => {
                    if (confirm('Delete this review permanently?')) remove.mutate({ id: Number(id) })
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
                {saving ? 'Saving...' : isNew ? 'Create review' : 'Save changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
