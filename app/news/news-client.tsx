"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ChevronRight, Filter, Newspaper, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsClientProps {
    initialNews: any[]
    categories: string[]
}

export default function NewsClient({ initialNews, categories }: NewsClientProps) {
    const [activeCategory, setActiveCategory] = useState("Tutte")
    const [searchQuery, setSearchQuery] = useState("")

    const allCategories = ["Tutte", ...categories]

    const filteredNews = initialNews.filter(item => {
        const itemCategories = item.category ? item.category.split(",").map((c: string) => c.trim()) : []
        const matchesCategory = activeCategory === "Tutte" || itemCategories.includes(activeCategory)
        const matchesSearch = !searchQuery ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen bg-zinc-50 py-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="container mx-auto px-6 mb-12">
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                    Blog & Notizie
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-4">
                    Ultime Novità
                </h1>
                <p className="text-xl text-zinc-600 font-medium italic">
                    Sempre dalla parte dello studente.
                </p>
            </div>

            {/* Search + Filters */}
            <div className="container mx-auto px-6 mb-12 space-y-4">
                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cerca notizie..."
                        className="w-full pl-11 pr-10 py-3 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    <Filter className="size-5 text-zinc-400 mr-1 shrink-0" />
                    {allCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                                activeCategory === cat
                                    ? "bg-primary text-white shadow-md shadow-red-900/20"
                                    : "bg-white text-muted-foreground hover:bg-zinc-100 border border-zinc-200"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count */}
            {(searchQuery || activeCategory !== "Tutte") && (
                <div className="container mx-auto px-6 mb-4">
                    <p className="text-sm text-zinc-500">
                        {filteredNews.length} {filteredNews.length === 1 ? "risultato" : "risultati"}
                        {searchQuery && <> per &ldquo;<span className="font-bold text-zinc-700">{searchQuery}</span>&rdquo;</>}
                        {activeCategory !== "Tutte" && <> in <span className="font-bold text-zinc-700">{activeCategory}</span></>}
                    </p>
                </div>
            )}

            {/* News Grid */}
            <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredNews.map((item) => (
                        <NewsCard key={item.id} item={item} />
                    ))}
                </AnimatePresence>
            </div>

            {filteredNews.length === 0 && (
                <div className="container mx-auto px-6 mt-12">
                    <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100">
                        <Newspaper className="size-12 text-zinc-300 mx-auto mb-4" />
                        <p className="text-zinc-500 text-lg">Nessuna notizia trovata.</p>
                        {(searchQuery || activeCategory !== "Tutte") && (
                            <button
                                onClick={() => { setSearchQuery(""); setActiveCategory("Tutte") }}
                                className="mt-3 text-sm font-bold text-zinc-500 hover:text-foreground transition-colors"
                            >
                                Resetta filtri
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function NewsCard({ item }: { item: any }) {
    const tags = item.tags ? item.tags.split(",").map((t: string) => t.trim()) : []
    const formattedDate = new Date(item.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })

    // Tema neutro per tutto il portale unificato
    const assocBadge = (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 items-end">
            {item.category ? item.category.split(",").map((cat: string) => (
                <span key={cat.trim()} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white shadow-sm border border-red-400/50">
                    {cat.trim()}
                </span>
            )) : (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white shadow-sm border border-red-400/50">
                    Notizia
                </span>
            )}
        </div>
    );
    const themeColorText = "text-primary hover:text-red-700";
    const themeGradient = "from-primary";


    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-zinc-200/50 hover:shadow-2xl transition-all hover:-translate-y-1 border border-zinc-100 flex flex-col h-full"
        >
            {/* Image - clickable */}
            <Link href={`/news/${item.id}`} className="relative h-48 bg-zinc-100 overflow-hidden block cursor-pointer">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Newspaper className="size-16 text-zinc-200" />
                    </div>
                )}
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-t", themeGradient)} />
                {assocBadge}
            </Link>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">

                    <div className="flex items-center text-zinc-400 text-xs">
                        <Calendar className="size-3 mr-1" />
                        {formattedDate}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                </h3>

                <p className="text-zinc-600 text-sm mb-6 line-clamp-3">
                    {item.description}
                </p>



                <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex gap-2">
                        {tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-xs text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <Link href={`/news/${item.id}`} className={cn("flex items-center text-sm font-bold transition-transform group-hover:translate-x-1", themeColorText)}>
                        Leggi <ChevronRight className="size-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
