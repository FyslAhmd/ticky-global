import { useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AdminHeader, AdminLoading } from '@/components/AdminLayout'
import { trpc } from '@/providers/trpc'
import { useUploadImage } from '@/components/ImagePicker'
import { Upload, Loader2, Trash2, Copy, Check, Images } from 'lucide-react'
import { toast } from 'sonner'

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminMedia() {
  const list = trpc.media.list.useQuery(undefined, { retry: false })
  const utils = trpc.useUtils()
  const doUpload = useUploadImage()
  const del = trpc.media.delete.useMutation({
    onSuccess: () => { utils.media.list.invalidate(); toast.success('Image deleted') },
    onError: (e) => toast.error(e.message),
  })
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        await doUpload(file)
      }
      await utils.media.list.invalidate()
      toast.success(files.length > 1 ? `${files.length} images uploaded` : 'Image uploaded')
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = async (id: number, url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.error('Could not copy — select the URL manually')
    }
  }

  return (
    <div>
      <AdminHeader
        title="Media library"
        description="Upload images once and reuse them anywhere — reviews, blog covers, pages and more. Max 5MB per image (JPG, PNG, WebP, GIF, SVG, AVIF)."
      >
        <Button
          className="rounded-full bg-blue-700 hover:bg-blue-800"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
          Upload images
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </AdminHeader>

      {list.isLoading ? (
        <AdminLoading />
      ) : (list.data ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <Images className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No images uploaded yet.</p>
          <p className="text-xs text-slate-400">Upload your first image to start building the library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(list.data ?? []).map((m) => (
            <Card key={m.id} className="overflow-hidden rounded-2xl border-slate-200">
              <img src={m.url} alt={m.fileName} className="h-36 w-full object-cover" loading="lazy" />
              <CardContent className="p-3">
                <p className="truncate text-xs font-medium text-slate-800" title={m.fileName}>{m.fileName}</p>
                <p className="text-[10px] text-slate-400">{formatSize(m.size)} · {new Date(m.createdAt).toLocaleDateString('en-GB')}</p>
                <div className="mt-2 flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 flex-1 rounded-full text-xs" onClick={() => copyUrl(m.id, m.url)}>
                    {copied === m.id ? <Check className="mr-1 h-3 w-3 text-emerald-600" /> : <Copy className="mr-1 h-3 w-3" />}
                    {copied === m.id ? 'Copied' : 'Copy URL'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 rounded-full px-2 text-red-600 hover:bg-red-50"
                    disabled={del.isPending}
                    onClick={() => {
                      if (window.confirm(`Delete "${m.fileName}"? This can't be undone.`)) del.mutate({ id: m.id })
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
