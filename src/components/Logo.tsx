export default function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
      <rect width="44" height="44" rx="10" fill="#1D4ED8" />
      {/* Stylised bridge span */}
      <path
        d="M9 30c4.5-8.5 8.5-12 13-12s8.5 3.5 13 12"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M9 30v4M17.5 24.4V34M26.5 24.4V34M35 30v4" stroke="#93C5FD" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="22" cy="12.5" r="2.6" fill="#34D399" />
    </svg>
  )
}
