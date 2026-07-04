import { getNewsById } from "@/app/actions/news"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { ArrowLeft, Calendar, Tag, Newspaper, FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { sanitizeHtml } from "@/lib/sanitize"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { id, locale } }: { params: { id: string, locale: string } }): Promise<Metadata> {
    const article = await getNewsById(id, locale)
    if (!article) return {}

    return {
        title: article.title,
        description: article.description || article.content?.substring(0, 160),
        openGraph: {
            title: article.title,
            description: article.description || article.content?.substring(0, 160),
            images: article.image ? [article.image] : [],
            type: "article",
            publishedTime: article.date.toISOString(),
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.description || article.content?.substring(0, 160),
            images: article.image ? [article.image] : [],
        }
    }
}

export default async function NewsDetailPage({ params: { id, locale } }: { params: { id: string, locale: string } }) {
    const article = await getNewsById(id, locale)

    if (!article) {
        notFound()
    }

    const themeBg = "bg-zinc-100"
    const themeText = "text-zinc-600"
    const themeAccent = "bg-[#18182e]"
    const themeLink = "text-foreground"


    const tags = article.tags ? article.tags.split(",").map(t => t.trim()) : []
    const formattedDate = new Date(article.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Rome"
    })

    type AttachmentItem = { name: string; url: string }
    const attachments: AttachmentItem[] = (() => {
        if (!article.attachments) return []
        try {
            const parsed = JSON.parse(article.attachments)
            if (Array.isArray(parsed)) return parsed
        } catch (e) {
            return article.attachments.split(',').map((url: string) => ({
                name: url.split('/').pop() || "Documento",
                url: url.trim()
            })).filter((a: any) => a.url)
        }
        return []
    })()

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
                            {article.content || attachments.length > 0 ? (
                                <div className="bg-white rounded-[2rem] border border-zinc-100 p-8 md:p-16 shadow-sm">
                                    {article.content && (
                                        <div
                                            className="prose prose-zinc prose-lg md:prose-xl max-w-none text-foreground leading-relaxed font-medium"
                                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
                                        />
                                    )}

                                    {/* Attachments Section */}
                                    {attachments.length > 0 && (
                                        <div className={cn("pt-8", article.content && "mt-16 border-t border-zinc-100")}>
                                            <h3 className="text-xl font-bold text-foreground mb-4">Documenti Allegati</h3>
                                            <div className="grid gap-3">
                                                {attachments.map((att, i) => (
                                                    <a
                                                        key={i}
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-4 p-5 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all group"
                                                    >
                                                        <div className="size-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                            <FileText className="size-5 text-zinc-400 group-hover:text-zinc-650" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="block text-sm font-bold text-foreground truncate tracking-tight">{att.name}</span>
                                                            <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{att.url.split('.').pop()?.toUpperCase()} Document</span>
                                                        </div>
                                                        <Download className="size-5 text-zinc-350 group-hover:text-foreground group-hover:translate-y-0.5 transition-all" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

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
