import { Link } from 'react-router'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center">
              <img src="/images/logo-full-white.png" alt="Ticky Global" className="h-12 w-auto" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Highly trained, western-standard office professionals from the Philippines — for at
              least 50% less than a native western hire. Part-time and full-time, across sales,
              telesales, administration, marketing and more.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/roles" className="hover:text-white">Our Roles</Link></li>
              <li><Link to="/sectors" className="hover:text-white">Sectors</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
              <li><Link to="/reviews" className="hover:text-white">Client Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-white">Book a Discovery Call</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Get in touch</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" /> hello@tickyglobal.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" /> +44 (0)20 7946 0820
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" /> London · Manila
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Ticky Global Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
