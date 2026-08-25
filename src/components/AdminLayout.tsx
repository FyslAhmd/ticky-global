import { useEffect, useState } from 'react'
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
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
  Menu,
  UsersRound,
  UserCog,
  Share2,
  Newspaper,
} from 'lucide-react'

export const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, group: 'Overview' },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox, group: 'Sales' },
  { to: '/admin/crm', label: 'CRM & Contacts', icon: UsersRound, group: 'Sales' },
  { to: '/admin/clients', label: 'Clients', icon: UserCog, group: 'Sales' },
  { to: '/admin/socials', label: 'Socials', icon: Share2, group: 'Marketing' },
  { to: '/admin/blog', label: 'Blog', icon: Newspaper, group: 'Marketing' },
  { to: '/admin/reviews', label: 'Reviews', icon: Star, group: 'Content' },
  { to: '/admin/pages', label: 'Pages', icon: FileText, group: 'Content' },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, group: 'Overview' },
  { to: '/admin/users', label: 'Users & Access', icon: UsersRound, group: 'Settings', adminOnly: true },
]

const groups = ['Overview', 'Sales', 'Marketing', 'Content', 'Settings']

function NavItems({ onNavigate, isAdmin }: { onNavigate?: () => void; isAdmin: boolean }) {
  return (
    <>
      {groups.map((group) => {
        const items = adminNav.filter((i) => i.group === group && (!i.adminOnly || isAdmin))
        if (items.length === 0) return null
        return (
          <div key={group} className="mb-1">
            <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {group}
            </p>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
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
          </div>
        )
      })}
    </>
  )
}

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

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

  const initials = (user.name ?? 'T G')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const userMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-800/60">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-700 text-xs font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user.name ?? 'Team member'}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email ?? user.role}</p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem className="text-xs text-slate-500" disabled>
          Signed in as {user.email ?? user.name}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-slate-950 text-slate-300 lg:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-5">
          <img src="/images/logo-full-white.png" alt="Ticky Global" className="h-9 w-auto" />
          <span className="ml-2 rounded-md bg-blue-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Admin
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <NavItems isAdmin={user.role === 'admin'} />
        </nav>

        <div className="border-t border-slate-800 p-3">
          <Link
            to="/"
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white"
          >
            <ExternalLink className="h-4.5 w-4.5" />
            View public site
          </Link>
          {userMenu}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-4 lg:hidden">
        <div className="flex items-center">
          <img src="/images/logo-full-white.png" alt="Ticky Global" className="h-8 w-auto" />
          <span className="ml-2 rounded-md bg-blue-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
            Admin
          </span>
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open admin menu"
              className="text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex w-72 flex-col overflow-hidden border-slate-800 bg-slate-950 p-0 text-slate-300"
          >
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <div className="flex h-14 items-center border-b border-slate-800 px-5">
              <img src="/images/logo-full-white.png" alt="Ticky Global" className="h-8 w-auto" />
              <span className="ml-2 rounded-md bg-blue-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Admin
              </span>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 pb-4">
              <NavItems onNavigate={() => setMenuOpen(false)} isAdmin={user.role === 'admin'} />
            </nav>
            <div className="border-t border-slate-800 p-3">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white"
              >
                <ExternalLink className="h-4.5 w-4.5" />
                View public site
              </Link>
              {userMenu}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main */}
      <main className="w-full min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}

export function AdminHeader({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-8">
      <div className="min-w-0">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
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
