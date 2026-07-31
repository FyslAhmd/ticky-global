import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Phone,
  Briefcase,
  ClipboardList,
  Megaphone,
  Headset,
  Calculator as CalcIcon,
  UserCog,
  Share2,
  ArrowRight,
} from 'lucide-react'
import { roles } from '@/data/content'

const iconMap: Record<string, React.ElementType> = {
  telesales: Phone,
  'sales-exec': Briefcase,
  admin: ClipboardList,
  marketing: Megaphone,
  'customer-service': Headset,
  bookkeeper: CalcIcon,
  ea: UserCog,
  social: Share2,
}

export default function RolesPreview() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Roles & functions
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              One partner for every office function
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From your first telesales caller to a full back-office team — every Ticky
              professional is pre-vetted, skills-tested and trained to western business standards.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full font-semibold">
            <Link to="/roles">
              View all roles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role, i) => {
            const Icon = iconMap[role.id] ?? Briefcase
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
              >
                <Link to="/roles" className="block h-full">
                  <Card className="group h-full rounded-2xl border-slate-200 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        {role.popular && (
                          <Badge className="rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <h3 className="mt-4 text-base font-bold text-slate-900">{role.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                        {role.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
