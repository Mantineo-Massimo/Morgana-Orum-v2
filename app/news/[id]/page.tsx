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

    const assoc = article.association?.toLowerCase() || "morgana & orum"
    let themeBg = "bg-purple-50"
    let themeText = "text-purple-600"
    let themeLink = "text-purple-900"

    if (assoc === "morgana") {
        themeBg = "bg-red-50"
        themeText = "text-red-600"
        themeLink = "text-[#c12830]"
    } else if (assoc === "orum" || assoc === "o.r.u.m.") {
        themeBg = "bg-blue-50"
        themeText = "text-blue-600"
        themeLink = "text-[#18182e]"
    }
    const tags = article.tags ? article.tags.split(",").map(t => t.trim()) : []
    const formattedDate = new Date(article.date).toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <div className="min-h-screen bg-zinc-50 py-20 animate-in fade-in duration-500">
            <div className="container mx-auto px-6 max-w-4xl">

                {/* Back Button */}
                <Link
                    href={`/news`}
                    className="text-zinc-500 hover:text-zinc-900 flex items-center gap-2 text-sm font-medium mb-8"
                >
                    <ArrowLeft className="size-4" /> Torna alle notizie
                </Link>

                {/* Article Header */}
                <article>
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full",
                                themeBg, themeText
                            )}>
                                {article.category}
                            </span>
                            <div className="flex items-center text-zinc-400 text-sm">
                                <Calendar className="size-4 mr-1.5" />
                                {formattedDate}
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif font-black text-zinc-900 mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <p className="text-xl text-zinc-600 leading-relaxed">
                            {article.description}
                        </p>
                    </div>

                    {/* Image */}
                    {article.image && (
                        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 bg-zinc-100">
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    {article.content && (
                        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8 md:p-12 mb-10">
                            <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed whitespace-pre-line">
                                {article.content}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex items-center gap-3 mb-10">
                            <Tag className="size-4 text-zinc-400" />
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <span key={tag} className="text-sm text-zinc-500 bg-white border border-zinc-200 px-3 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back button bottom */}
                    <div className="pt-8 border-t border-zinc-200">
                        <Link
                            href={`/news`}
                            className={cn(
                                "inline-flex items-center gap-2 font-bold",
                                themeLink
                            )}
                        >
                            <ArrowLeft className="size-4" /> Tutte le notizie
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    )
}
