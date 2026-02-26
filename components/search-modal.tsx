"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X, Newspaper, Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { globalSearch } from "@/app/actions/search"
import { useClickAway } from "react-use"
import { useTranslations, useLocale } from "next-intl"

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const t = useTranslations("Search")
    const locale = useLocale()
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const modalRef = React.useRef(null)

    useClickAway(modalRef, onClose)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onClose() // Toggle or handle elsewhere if needed, but here we assume controlled
            }
            if (e.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", down)
        return () => window.removeEventListener("keydown", down)
    }, [onClose])

    React.useEffect(() => {
        if (!isOpen) {
            setQuery("")
            setResults(null)
            return
        }
    }, [isOpen])

    React.useEffect(() => {
        const handler = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true)
                try {
                    const data = await globalSearch(query)
                    setResults(data)
                } catch (error) {
                    console.error("Search error:", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setResults(null)
            }
        }, 300)

        return () => clearTimeout(handler)
    }, [query])

    if (!isOpen) return null

    const handleSelect = (url: string) => {
        router.push(url)
        onClose()
    }

    const hasResults = results && (results.news?.length > 0 || results.events?.length > 0 || results.representatives?.length > 0)

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-sm bg-black/60 animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200"
            >
                <div className="relative flex items-center p-4 border-b border-zinc-100">
                    <Search className="size-5 text-zinc-400 ml-2" />
                    <input
                        autoFocus
                        placeholder={t("placeholder")}
                        className="flex-1 bg-transparent px-4 py-2 text-lg outline-none placeholder:text-zinc-400 font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    )}
                    <div className="ml-4 px-2 py-1 rounded bg-zinc-100 text-[10px] font-bold text-zinc-400 border border-zinc-200 uppercase tracking-widest hidden sm:block">
                        ESC
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                            <Loader2 className="size-8 animate-spin mb-4 text-primary" />
                            <p className="text-sm font-medium">{t("loading")}</p>
                        </div>
                    )}

                    {!loading && !query && (
                        <div className="py-12 text-center">
                            <Search className="size-12 text-zinc-100 mx-auto mb-4" />
                            <p className="text-zinc-400 font-medium">{t("empty_start")}</p>
                        </div>
                    )}

                    {!loading && query && query.length < 2 && (
                        <p className="py-12 text-center text-zinc-400 text-sm font-medium">{t("too_short")}</p>
                    )}

                    {!loading && query && query.length >= 2 && !hasResults && (
                        <div className="py-12 text-center">
                            <p className="text-zinc-500 font-bold mb-1">{t("no_results_title")}</p>
                            <p className="text-zinc-400 text-sm">{t("no_results_desc")}</p>
                        </div>
                    )}

                    {!loading && hasResults && (
                        <div className="space-y-6">
                            {/* News Section */}
                            {results.news?.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 px-2 flex items-center gap-2">
                                        <Newspaper className="size-3" /> {t("news_label")}
                                    </h3>
                                    <div className="space-y-1">
                                        {results.news.map((item: any) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelect(`/news/${item.id}`)}
                                                className="w-full text-left p-3 rounded-xl hover:bg-zinc-50 flex items-center justify-between group transition-all"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-foreground line-clamp-1">{item.title}</p>
                                                    <p className="text-xs text-zinc-400 line-clamp-1">{item.description || t("read_more")}</p>
                                                </div>
                                                <ArrowRight className="size-4 text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all ml-4 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Events Section */}
                            {results.events?.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 px-2 flex items-center gap-2">
                                        <Calendar className="size-3" /> {t("events_label")}
                                    </h3>
                                    <div className="space-y-1">
                                        {results.events.map((item: any) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelect(`/events/${item.id}`)}
                                                className="w-full text-left p-3 rounded-xl hover:bg-zinc-50 flex items-center justify-between group transition-all"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-foreground line-clamp-1">{item.title}</p>
                                                    <p className="text-xs text-zinc-400 line-clamp-1">{item.location} • {new Date(item.date).toLocaleDateString(locale)}</p>
                                                </div>
                                                <ArrowRight className="size-4 text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all ml-4 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Representatives Section */}
                            {results.representatives?.length > 0 && (
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 px-2 flex items-center gap-2">
                                        <User className="size-3" /> {t("reps_label")}
                                    </h3>
                                    <div className="space-y-1">
                                        {results.representatives.map((item: any) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelect(`/representatives`)}
                                                className="w-full text-left p-3 rounded-xl hover:bg-zinc-50 flex items-center justify-between group transition-all"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-foreground line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-zinc-400 line-clamp-1">{item.role} • {item.department}</p>
                                                </div>
                                                <ArrowRight className="size-4 text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all ml-4 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                            <span className="font-bold">↑↓</span> {t("nav_hint")}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                            <span className="font-bold">Enter</span> {t("select_hint")}
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                        Morgana & O.R.U.M. Search
                    </div>
                </div>
            </div>
        </div>
    )
}
