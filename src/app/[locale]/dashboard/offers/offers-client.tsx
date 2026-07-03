"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, ExternalLink, Facebook, Instagram, Globe, Tag, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface Convention {
    id: string
    name: string
    category: string
    social?: string | null
    logo?: string | null
    website?: string | null
    location: string
    discounts: string[]
}

export default function OffersClient({ initialData }: { initialData: Convention[] }) {
    const t = useTranslations("Dashboard")
    const [search, setSearch] = useState("")
    const [selectedLocation, setSelectedLocation] = useState<string>("Tutte")
    const [selectedCategory, setSelectedCategory] = useState<string>("Tutte")
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const locations = ["Tutte", "Messina", "Melilli"]

    const categories = useMemo(() => {
        const cats = new Set(initialData.map(c => c.category))
        return ["Tutte", ...Array.from(cats).sort()]
    }, [initialData])

    const filteredData = useMemo(() => {
        return initialData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.category.toLowerCase().includes(search.toLowerCase())
            const matchesLocation = selectedLocation === "Tutte" || item.location === selectedLocation
            const matchesCategory = selectedCategory === "Tutte" || item.category === selectedCategory
            return matchesSearch && matchesLocation && matchesCategory
        })
    }, [initialData, search, selectedLocation, selectedCategory])

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filters Section */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-450" />
                        <input
                            type="text"
                            placeholder={t("offers_search_placeholder")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/85 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all outline-none text-sm font-semibold text-slate-850"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 outline-none text-sm font-semibold text-slate-800 transition-all"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            {locations.map(loc => <option key={loc} value={loc}>{loc === "Tutte" ? t("offers_all") : loc}</option>)}
                        </select>
                        <select
                            className="px-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 outline-none text-sm font-semibold text-slate-800 transition-all"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat === "Tutte" ? t("offers_all") : cat}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid of Results */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-zinc-400">
                        <Search className="size-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold">{t("offers_no_results")}</p>
                    </div>
                ) : (
                    filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 overflow-hidden flex flex-col group"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between gap-4 mb-5">
                                    <div className="relative size-20 rounded-2xl border border-slate-150 overflow-hidden bg-white shadow-sm shrink-0">
                                        {item.logo ? (
                                            <Image
                                                src={item.logo}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                                quality={100}
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                                <Globe className="size-8 text-zinc-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-750 text-[10px] font-black uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                            <MapPin className="size-3 text-zinc-400" /> {item.location}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-extrabold text-slate-850 mb-1 group-hover:text-red-600 transition-colors tracking-tight leading-snug">{item.name}</h3>

                                {item.discounts.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <button
                                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                            className="flex items-center justify-between w-full text-left p-3.5 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200/60 hover:bg-slate-100 hover:border-slate-350 transition-all font-extrabold text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Tag className="size-4 text-red-600" />
                                                <span className="font-extrabold text-xs uppercase tracking-wider">{t("offers_view_discounts")}</span>
                                            </div>
                                            {expandedId === item.id ? <ChevronUp className="size-4 text-zinc-450" /> : <ChevronDown className="size-4 text-zinc-450" />}
                                        </button>

                                        {expandedId === item.id && (
                                            <div className="animate-in fade-in slide-in-from-top-2 p-4.5 space-y-2.5 border-l-2 border-red-500 ml-2.5 bg-slate-50/50 rounded-r-2xl">
                                                {item.discounts.map((discount, idx) => (
                                                    <div key={idx} className="flex gap-2 items-start text-sm text-slate-700">
                                                        <div className="size-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                                        <p className="font-semibold leading-relaxed">{discount}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                                {item.social?.includes("facebook") && (
                                    <a href={item.social} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border border-slate-200/60 hover:border-slate-250 hover:bg-slate-50 rounded-xl text-zinc-450 hover:text-blue-600 transition-all shadow-sm">
                                        <Facebook className="size-4" />
                                    </a>
                                )}
                                {item.social?.includes("instagram") && (
                                    <a href={item.social} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border border-slate-200/60 hover:border-slate-250 hover:bg-slate-50 rounded-xl text-zinc-450 hover:text-pink-600 transition-all shadow-sm">
                                        <Instagram className="size-4" />
                                    </a>
                                )}
                                {item.website && (
                                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border border-slate-200/60 hover:border-slate-250 hover:bg-slate-50 rounded-xl text-zinc-450 hover:text-slate-900 transition-all shadow-sm ml-auto">
                                        <Globe className="size-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
