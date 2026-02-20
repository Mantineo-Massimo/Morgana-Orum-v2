"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, ExternalLink, Facebook, Instagram, Globe, Tag, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cerca attività o categoria..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900/5 transition-all outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="px-4 py-2.5 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white outline-none text-sm font-medium"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                        <select
                            className="px-4 py-2.5 rounded-xl border border-zinc-100 bg-zinc-50 focus:bg-white outline-none text-sm font-medium"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid of Results */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-zinc-400">
                        <Search className="size-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">Nessun risultato trovato per la ricerca.</p>
                    </div>
                ) : (
                    filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="relative size-24 rounded-full border-2 border-zinc-100 overflow-hidden bg-white shadow-sm shrink-0 mx-auto md:mx-0">
                                        {item.logo ? (
                                            <Image
                                                src={item.logo}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="96px"
                                                quality={100}
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                                                <Globe className="size-10 text-zinc-200" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
                                            <MapPin className="size-3" /> {item.location}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-1">{item.name}</h3>

                                {item.discounts.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <button
                                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                            className="flex items-center justify-between w-full text-left p-3 rounded-xl bg-zinc-100 text-foreground hover:bg-zinc-200 transition-colors group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Tag className="size-4" />
                                                <span className="text-sm font-bold">Vedi Sconti</span>
                                            </div>
                                            {expandedId === item.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                                        </button>

                                        {expandedId === item.id && (
                                            <div className="animate-in fade-in slide-in-from-top-2 p-3 space-y-2 border-l-2 border-zinc-200 ml-2">
                                                {item.discounts.map((discount, idx) => (
                                                    <div key={idx} className="flex gap-2 items-start text-sm text-zinc-600">
                                                        <div className="size-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                                                        <p className="font-medium">{discount}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center gap-4">
                                {item.social?.includes("facebook") && (
                                    <a href={item.social} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white rounded-lg text-zinc-400 hover:text-blue-600 transition-all shadow-sm">
                                        <Facebook className="size-4" />
                                    </a>
                                )}
                                {item.social?.includes("instagram") && (
                                    <a href={item.social} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white rounded-lg text-zinc-400 hover:text-pink-600 transition-all shadow-sm">
                                        <Instagram className="size-4" />
                                    </a>
                                )}
                                {item.website && (
                                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white rounded-lg text-zinc-400 hover:text-foreground transition-all shadow-sm ml-auto">
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
