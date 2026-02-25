import { getNewsById } from "@/app/actions/news"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Tag, Newspaper } from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
    const article = await getNewsById(params.id)

    if (!article) {
        notFound()
    }

    const themeBg = "bg-zinc-100"
    const themeText = "text-zinc-600"
    const themeAccent = "bg-[#18182e]/50"
    const themeLink = "text-foreground"


    const tags = article.tags ? article.tags.split(",").map(t => t.trim()) : []
    const formattedDate = new Date(article.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <div className="min-h-screen bg-zinc-50 pt-24 pb-20 animate-in fade-in duration-700">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Back Button */}
                <Link
                    href={`/news`}
                    className="group inline-flex items-center gap-2 text-zinc-500 hover:text-foreground transition-colors mb-12"
                >
                    <div className="size-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-50 transition-colors">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">Torna alle notizie</span>
                </Link>

                <article>
                    {/* Header Section */}
                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            {article.category.split(",").map((cat: string) => (
                                <span key={cat.trim()} className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg text-white",
                                    themeAccent
                                )}>
                                    {cat.trim()}
                                </span>
                            ))}
                            <div className="flex items-center text-zinc-400 text-sm font-medium">
                                <Calendar className="size-4 mr-2" />
                                {formattedDate}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-8 leading-[1.1] tracking-tight">
                            {article.title}
                        </h1>

                        {article.description && (
                            <p className="text-xl md:text-2xl text-zinc-600 font-medium italic border-l-4 border-zinc-200 pl-6 py-2 leading-relaxed">
                                {article.description}
                            </p>
                        )}
                    </header>

                    {/* Featured Image */}
                    {article.image && (
                        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden mb-16 shadow-2xl shadow-zinc-200 ring-1 ring-zinc-200">
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Article Body */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-12">
                            {article.content ? (
                                <div className="bg-white rounded-[2rem] border border-zinc-100 p-8 md:p-16 shadow-sm">
                                    <div className="prose prose-zinc prose-lg md:prose-xl max-w-none text-foreground leading-relaxed whitespace-pre-line font-medium">
                                        {article.content}
                                    </div>

                                    {/* Tags Footer */}
                                    {tags.length > 0 && (
                                        <div className="mt-16 pt-8 border-t border-zinc-100">
                                            <div className="flex items-center gap-3">
                                                <Tag className="size-4 text-zinc-400" />
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map(tag => (
                                                        <span key={tag} className="text-xs font-bold text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 uppercase tracking-wider">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-zinc-100/50 rounded-[2rem] border-2 border-dashed border-zinc-200">
                                    <Newspaper className="size-12 text-zinc-300 mx-auto mb-4" />
                                    <p className="text-zinc-500 font-medium">Nessun contenuto aggiuntivo per questo articolo.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="mt-20 pt-10 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <Link
                            href="/news"
                            className={cn(
                                "group flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-transform hover:-translate-x-1",
                                themeLink
                            )}
                        >
                            <ArrowLeft className="size-4" />
                            <span>Tutte le notizie</span>
                        </Link>

                        <div className="text-sm font-medium text-zinc-400">
                            © {new Date().getFullYear()} Morgana & O.R.U.M.
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
