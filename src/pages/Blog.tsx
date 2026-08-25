import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarDays, ArrowRight } from "lucide-react";

export default function Blog() {
  const posts = trpc.marketingPublic.posts.useQuery();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <div className="max-w-2xl">
        <Badge variant="secondary" className="mb-3">Blog</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Insights from Ticky Global</h1>
        <p className="mt-3 text-slate-600">
          Practical guidance on building remote teams, hiring in the Philippines, and getting more from your Ticker.
        </p>
      </div>

      {posts.isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
      ) : (posts.data ?? []).length === 0 ? (
        <p className="mt-12 rounded-xl border border-dashed p-10 text-center text-slate-500">
          Articles are on the way — check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(posts.data ?? []).map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group">
              <Card className="h-full overflow-hidden transition group-hover:border-blue-300 group-hover:shadow-md">
                {p.coverImage && (
                  <img src={p.coverImage} alt="" className="h-40 w-full object-cover" />
                )}
                <CardContent className="p-5">
                  {p.publishedAt && (
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                  <h2 className="mt-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-blue-700">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.excerpt}</p>}
                  <p className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-700">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
