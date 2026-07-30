import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, ArrowRight, KeyRound, Building2, Users, ChevronDown } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/roles', label: 'Roles & Pricing' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
]

function PortalDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
          <KeyRound className="h-4 w-4" />
          Portal Login
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl p-2">
        <DropdownMenuLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Sign in to your portal
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-3 focus:bg-blue-50">
          <Link to="/admin">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-slate-900">Admin / Office</p>
              <p className="text-xs text-slate-500">Ticky team dashboard</p>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-3 focus:bg-emerald-50">
          <Link to="/client-portal">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Users className="h-4.5 w-4.5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-slate-900">Client Portal</p>
              <p className="text-xs text-slate-500">For Ticky clients — coming soon</p>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src="/images/logo-full.png" alt="Ticky Global" className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <PortalDropdown />
          <Button asChild className="rounded-full bg-blue-700 px-5 font-semibold hover:bg-blue-800">
            <Link to="/contact">
              Book a Discovery Call
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-base font-medium ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <p className="mt-5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Portal Login
              </p>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                <Building2 className="h-5 w-5 text-blue-700" />
                Admin / Office
              </Link>
              <Link
                to="/client-portal"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                <Users className="h-5 w-5 text-emerald-600" />
                Client Portal
              </Link>

              <Button asChild className="mt-4 rounded-full bg-blue-700 font-semibold hover:bg-blue-800">
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Book a Discovery Call
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
