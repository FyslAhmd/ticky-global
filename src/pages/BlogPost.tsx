import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { renderMarkdown } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CalendarDays } from "lucide-react";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = trpc.marketingPublic.post.useQuery({ slug });

  if (post.isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
  }
  const p = post.data;
  if (!p) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Article not found</h1>
        <p className="mt-2 text-slate-600">This article may have been moved or unpublished.</p>
        <Link to="/blog"><Button variant="outline" className="mt-6"><ArrowLeft className="mr-2 h-4 w-4" /> Back to blog</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <Link to="/blog" className="flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{p.title}</h1>
      {p.publishedAt && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarDays className="h-4 w-4" />
          {new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}
      {p.coverImage && <img src={p.coverImage} alt="" className="mt-8 w-full rounded-2xl object-cover" />}
      <article
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }}
      />
    </div>
  );
}
