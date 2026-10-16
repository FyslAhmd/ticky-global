import { useRef, useState } from 'react'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImageIcon, Upload, Loader2, Library, X } from 'lucide-react'

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function useUploadImage() {
  const upload = trpc.media.upload.useMutation()
  return async (file: File): Promise<string> => {
    const dataBase64 = await readFileAsBase64(file)
    const res = await upload.mutateAsync({
      fileName: file.name,
      mimeType: file.type,
      dataBase64,
    })
    return res.url
  }
}

/** Library browser dialog — pick any previously uploaded image. */
export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
}) {
  const list = trpc.media.list.useQuery(undefined, { enabled: open })
  const utils = trpc.useUtils()
  const doUpload = useUploadImage()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const url = await doUpload(file)
      await utils.media.list.invalidate()
      onSelect(url)
      onOpenChange(false)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Image library</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Choose an existing image or upload a new one (max 5MB).</p>
          <Button
            size="sm"
            className="rounded-full bg-blue-700 hover:bg-blue-800"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
            Upload
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void handleUpload(f)
              e.target.value = ''
            }}
          />
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <div className="max-h-80 overflow-y-auto">
          {list.isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
          ) : (list.data ?? []).length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">No uploads yet — upload your first image.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {(list.data ?? []).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { onSelect(m.url); onOpenChange(false) }}
                  className="group overflow-hidden rounded-xl border border-slate-200 text-left transition hover:border-blue-400 hover:shadow-sm"
                >
                  <img src={m.url} alt={m.fileName} className="h-24 w-full object-cover" loading="lazy" />
                  <p className="truncate px-2 py-1 text-[10px] text-slate-500 group-hover:text-blue-700">{m.fileName}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Image field with preview, direct upload and library browsing.
 * Drop-in replacement for a plain URL input on any admin form.
 */
export function ImagePicker({
  id,
  label,
  value,
  onChange,
  hint,
  previewClass = 'h-24 w-24 rounded-xl object-cover',
}: {
  id?: string
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
  previewClass?: string
}) {
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const doUpload = useUploadImage()

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      onChange(await doUpload(file))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative shrink-0">
            <img src={value} alt="preview" className={previewClass} />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <ImageIcon className="h-6 w-6 text-slate-300" />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/… or https://…"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
              Upload
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setLibraryOpen(true)}
            >
              <Library className="mr-1.5 h-4 w-4" />
              Browse library
            </Button>
          </div>
          {hint && <p className="text-xs text-slate-400">{hint}</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void handleFile(f)
          e.target.value = ''
        }}
      />
      <MediaLibraryDialog open={libraryOpen} onOpenChange={setLibraryOpen} onSelect={onChange} />
    </div>
  )
}
