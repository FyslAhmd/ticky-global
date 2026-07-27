import { Star } from 'lucide-react'

export default function Stars({ rating = 5, className = 'h-4 w-4' }: { rating?: number; className?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${className} ${
            i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}
