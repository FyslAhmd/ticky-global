import { Link } from 'react-router'
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin, Twitter, Music2 } from 'lucide-react'
import { trpc } from '@/providers/trpc'

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
  linkedin: Linkedin,
  x: Twitter,
}

export default function Footer() {
  const socials = trpc.marketingPublic.socials.useQuery()
  const links = socials.data ?? []
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
            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {links.map((s) => {
                  const Icon = socialIcons[s.platform] ?? Music2
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label || s.platform}
                      title={s.label || s.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-blue-500 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/roles" className="hover:text-white">Our Roles</Link></li>
              <li><Link to="/sectors" className="hover:text-white">Sectors</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
              <li><Link to="/reviews" className="hover:text-white">Client Reviews</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
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
                <Phone className="h-4 w-4 text-blue-400" /> UK: 0808 175 3413
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>
                  <span className="font-semibold text-slate-200">UK Office</span> — Chetwynd
                  Grove, Bangor Road, Cross Lanes, Wrexham, United Kingdom
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>
                  <span className="font-semibold text-slate-200">US Office</span> — 8 The
                  Green, Suite A, Dover, Delaware 19901, United States
                </span>
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
