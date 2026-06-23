"use client"

import { useState, useEffect, useMemo } from "react"
import { COUNTDOWN_ITEMS } from "./sessions-countdown"
import { Link } from "@/i18n/routing"
import { ArrowRight, Bell, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function NextDeadlineWidget({ locale, initialItems }: { locale: string, initialItems?: any[] }) {
    const isEn = locale === "en"
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

    const items = initialItems !== undefined && initialItems !== null ? initialItems : COUNTDOWN_ITEMS;

    // Find first upcoming deadline
    const nextItem = useMemo(() => {
        const now = new Date().getTime()
        const upcoming = items
            .filter(item => new Date(item.date).getTime() > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        return upcoming[0] || null
    }, [items])

    useEffect(() => {
        if (!nextItem) return

        const targetTime = new Date(nextItem.date).getTime()

        const updateTimer = () => {
            const now = new Date().getTime()
            const diff = targetTime - now

            if (diff <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 })
                return
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24))
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const s = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeLeft({ d, h, m, s })
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [nextItem])

    if (!nextItem) {
        return null
    }

    const title = isEn ? nextItem.titleEn : nextItem.title
    const desc = isEn ? nextItem.descriptionEn : nextItem.description

    return (
        <section className="w-full bg-[#18182e] text-white py-6 border-b border-zinc-800 shadow-md">
            <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Info block */}
                <div className="flex gap-4 items-start flex-1">
                    <div className="size-10 rounded-xl bg-[#c12830] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#c12830]/25 animate-pulse mt-1">
                        <Bell className="size-5" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700/50">
                                {isEn ? "Next Deadline" : "Prossima Scadenza"}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold font-mono">
                                📅 {new Date(nextItem.date).toLocaleDateString(locale === "en" ? "en-US" : "it-IT", { day: "numeric", month: "long", timeZone: "Europe/Rome" })}
                            </span>
                        </div>
                        {/* p instead of h4 to avoid heading order CLS/accessibility warning */}
                        <p className="text-base font-serif font-black tracking-tight text-white uppercase leading-snug">
                            {title}
                        </p>
                        <p className="text-xs text-zinc-400 leading-normal max-w-xl">
                            {desc}
                        </p>
                    </div>
                </div>

                {/* Countdown display — fixed dimensions prevent CLS while timer loads */}
                <div className="flex items-center gap-4 shrink-0 flex-wrap justify-center">
                    {timeLeft ? (
                        <div className="flex gap-2">
                            {[
                                { label: isEn ? "days" : "gg", val: timeLeft.d },
                                { label: isEn ? "hours" : "ore", val: timeLeft.h },
                                { label: isEn ? "min" : "min", val: timeLeft.m },
                                { label: isEn ? "sec" : "sec", val: timeLeft.s }
                            ].map((time, idx) => (
                                <div key={idx} className="flex flex-col items-center min-w-[50px] p-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-inner">
                                    <span className="text-lg font-black font-mono tracking-tight text-[#c12830] tabular-nums">
                                        {time.val.toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-[8px] font-black uppercase tracking-wider text-zinc-400">
                                        {time.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Fixed size placeholder matching the 4-box countdown dimensions */
                        <div className="flex gap-2 items-center justify-center" style={{ height: "58px", width: "228px" }}>
                            <Loader2 className="size-5 animate-spin text-zinc-400" />
                        </div>
                    )}

                    <Link
                        href="/guide"
                        className="px-4 py-3 bg-[#c12830] hover:bg-[#c12830]/90 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md shadow-[#c12830]/20 group"
                    >
                        {isEn ? "View Guides" : "Vedi Guide"} 
                        <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </section>
    )
}
