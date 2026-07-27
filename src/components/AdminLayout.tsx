import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { LOGIN_PATH } from '@/const'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  Inbox,
  Star,
  FileText,
  BarChart3,
  ExternalLink,
  LogOut,
  ChevronDown,
  Loader2,
} from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/pages', label: 'Pages', icon: FileText },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) navigate(LOGIN_PATH)
  }, [isLoading, user, navigate])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
      </div>
    )
  }

  const initials = (user.name ?? 'W G')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-slate-300">
        <div className="flex h-16 items-center border-b border-slate-800 px-5">
          <img src="/images/logo-full-white.png" alt="Westbridge Global" className="h-9 w-auto" />
          <span className="ml-2 rounded-md bg-blue-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white"
          >
            <ExternalLink className="h-4.5 w-4.5" />
            View public site
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-800/60">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-700 text-xs font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{user.name ?? 'Team member'}</p>
                  <p className="truncate text-xs text-slate-500">{user.email ?? user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem className="text-xs text-slate-500" disabled>
                Signed in as {user.email ?? user.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export function AdminHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export function AdminLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
    </div>
  )
}

export { Button }
