"use client"

import { useState, useEffect, useMemo } from "react"
import { Calendar, Clock, AlertTriangle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { registerDeadlineAlert } from "@/app/actions/notifications"

interface SessionsCountdownProps {
    locale: string
}

interface CountdownItem {
    id: string
    title: string
    titleEn: string
    category: "burocrazia" | "sessione"
    date: Date
    description: string
    descriptionEn: string
}

// Target dates set relative to the active simulated time (June 2026)
const COUNTDOWN_ITEMS: CountdownItem[] = [
    {
        id: "ersu",
        title: "Domanda Borsa di Studio ERSU 2026/27",
        titleEn: "ERSU Scholarship Application 2026/27",
        category: "burocrazia",
        date: new Date("2026-08-31T23:59:59"),
        description: "Scadenza ultima per la presentazione della domanda di borsa di studio ed esonero tasse ERSU sul portale dedicato.",
        descriptionEn: "Final deadline to submit the ERSU scholarship and tuition fee waiver application on the official portal."
    },
    {
        id: "sessione-autunno",
        title: "Sessione d'Esami Autunnale",
        titleEn: "Autumn Exam Session",
        category: "sessione",
        date: new Date("2026-09-01T09:00:00"),
        description: "Inizio ufficiale degli appelli d'esame per la sessione autunnale dell'A.A. 2025/26.",
        descriptionEn: "Official start of exam calls for the Autumn session of the Academic Year 2025/26."
    },
    {
        id: "piano-studi",
        title: "Compilazione Piano di Studi 2026/27",
        titleEn: "Study Plan Submission 2026/27",
        category: "burocrazia",
        date: new Date("2026-11-15T23:59:59"),
        description: "Finestra per la compilazione e modifica online del piano di studi per l'A.A. 2026/27 su Esse3.",
        descriptionEn: "Timeline for submitting and editing your online study plan for A.Y. 2026/27 on the Esse3 portal."
    },
    {
        id: "immatricolazione",
        title: "Scadenza Immatricolazioni & Iscrizioni 2026/27",
        titleEn: "Enrollment & Registration Deadline 2026/27",
        category: "burocrazia",
        date: new Date("2026-12-31T23:59:59"),
        description: "Termine ultimo per completare l'immatricolazione o l'iscrizione ad anni successivi senza mora.",
        descriptionEn: "Deadline to complete enrollment or re-enrollment for subsequent years without incurring late fees."
    },
    {
        id: "sessione-inverno",
        title: "Sessione d'Esami Invernale 2026/27",
        titleEn: "Winter Exam Session 2026/27",
        category: "sessione",
        date: new Date("2027-01-15T09:00:00"),
        description: "Inizio ufficiale della sessione d'esami ordinaria invernale per l'A.A. 2026/27.",
        descriptionEn: "Official start of the winter ordinary exam session for the Academic Year 2026/27."
    }
]

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Scadenziario & Countdown",
        subtitle: "Tieni d'occhio i giorni rimanenti per le sessioni d'esame ufficiali e le scadenze burocratiche di UniMe.",
        allCategories: "Tutti gli eventi",
        cat_burocrazia: "Scadenze Burocratiche",
        cat_sessione: "Sessioni d'Esame",
        days: "gg",
        hours: "ore",
        minutes: "min",
        seconds: "sec",
        expired: "Scaduto",
        dueSoon: "Scade a breve!",
        deadlineLabel: "Scadenza:",
        noItems: "Nessun evento attivo trovato.",
        notifyMe: "Avvisami",
        emailPlaceholder: "Inserisci la tua email...",
        submit: "Invia",
        alertActive: "Promemoria impostato! Controlla la tua email."
    },
    en: {
        title: "Deadlines & Countdowns",
        subtitle: "Keep track of the remaining time for official exam sessions and important UniMe deadlines.",
        allCategories: "All events",
        cat_burocrazia: "Administrative Deadlines",
        cat_sessione: "Exam Sessions",
        days: "d",
        hours: "h",
        minutes: "m",
        seconds: "s",
        expired: "Expired",
        dueSoon: "Due soon!",
        deadlineLabel: "Deadline:",
        noItems: "No active events found.",
        notifyMe: "Notify Me",
        emailPlaceholder: "Enter your email...",
        submit: "Submit",
        alertActive: "Reminder set! Check your email."
    }
}

export function SessionsCountdown({ locale }: SessionsCountdownProps) {
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it
    const [currentTime, setCurrentTime] = useState<number>(Date.now())
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    // Alert Registration States
    const [activeFormId, setActiveFormId] = useState<string | null>(null)
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set())
    const [error, setError] = useState("")

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const filteredItems = useMemo(() => {
        return COUNTDOWN_ITEMS.filter(item => {
            return selectedCategory === "all" || item.category === selectedCategory
        }).sort((a, b) => a.date.getTime() - b.date.getTime())
    }, [selectedCategory])

    return (
        <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-200/50 p-6 md:p-8 space-y-6 shadow-inner">
            {/* Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-zinc-200/60">
                <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-200">
                    <Clock className="size-6" />
                </div>
                <div>
                    <h3 className="font-serif font-black text-xl text-zinc-900 uppercase tracking-tight">{t.title}</h3>
                    <p className="text-xs text-zinc-500 font-medium">{t.subtitle}</p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={cn(
                        "px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                        selectedCategory === "all"
                            ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                            : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    )}
                >
                    {t.allCategories}
                </button>
                {["burocrazia", "sessione"].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                            selectedCategory === cat
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                                : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        )}
                    >
                        {t[`cat_${cat}`]}
                    </button>
                ))}
            </div>

            {/* Countdown Cards List */}
            {filteredItems.length > 0 ? (
                <div className="space-y-4">
                    {filteredItems.map(item => {
                        const titleText = locale === "en" ? item.titleEn : item.title
                        const descText = locale === "en" ? item.descriptionEn : item.description
                        
                        const timeDifference = item.date.getTime() - currentTime
                        const isExpired = timeDifference <= 0

                        // Calculate remaining pieces
                        const d = isExpired ? 0 : Math.floor(timeDifference / (1000 * 60 * 60 * 24))
                        const h = isExpired ? 0 : Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
                        const m = isExpired ? 0 : Math.floor((timeDifference / 1000 / 60) % 60)
                        const s = isExpired ? 0 : Math.floor((timeDifference / 1000) % 60)

                        const isClose = !isExpired && d < 15

                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    "p-5 rounded-3xl border bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-300 shadow-sm",
                                    isClose ? "border-amber-300/80 shadow-md ring-1 ring-amber-300/20" : "border-zinc-200/80"
                                )}
                            >
                                <div className="space-y-2 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider",
                                            item.category === "burocrazia" ? "bg-[#18182e]/5 text-[#18182e]" : "bg-[#c9041a]/5 text-[#c9041a]"
                                        )}>
                                            {t[`cat_${item.category}`]}
                                        </span>
                                        {isClose && (
                                            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-md text-[9px] font-black uppercase tracking-wider animate-pulse">
                                                <AlertTriangle className="size-3" />
                                                {t.dueSoon}
                                            </span>
                                        )}
                                        {isExpired && (
                                            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                <CheckCircle2 className="size-3" />
                                                {t.expired}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-serif font-black text-base md:text-lg text-zinc-900 tracking-tight">
                                        {titleText}
                                    </h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
                                        {descText}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="size-3.5" />
                                            <span>{t.deadlineLabel}</span>
                                            <span className="text-zinc-600 font-mono">
                                                {item.date.toLocaleDateString("it-IT", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Alert / Avvisami Button Section */}
                                    {!isExpired && (
                                        <div className="pt-3 border-t border-zinc-100/60 mt-3">
                                            {registeredIds.has(item.id) ? (
                                                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-wider bg-emerald-50/80 px-3 py-1.5 rounded-lg w-fit border border-emerald-200">
                                                    <CheckCircle2 className="size-3.5" />
                                                    <span>{t.alertActive}</span>
                                                </div>
                                            ) : activeFormId === item.id ? (
                                                <form
                                                    onSubmit={async (e) => {
                                                        e.preventDefault()
                                                        setLoading(true)
                                                        setError("")
                                                        try {
                                                            const res = await registerDeadlineAlert({
                                                                email,
                                                                deadlineTitle: titleText,
                                                                deadlineDate: item.date.toLocaleDateString("it-IT", {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                }),
                                                                locale
                                                            })
                                                            if (res.success) {
                                                                setRegisteredIds(prev => {
                                                                    const next = new Set(prev)
                                                                    next.add(item.id)
                                                                    return next
                                                                })
                                                                setActiveFormId(null)
                                                                setEmail("")
                                                            } else {
                                                                setError(res.error || "Errore.")
                                                            }
                                                        } catch (err) {
                                                            setError("Impossibile registrarsi.")
                                                        } finally {
                                                            setLoading(false)
                                                        }
                                                    }}
                                                    className="flex flex-col sm:flex-row gap-2 max-w-md items-stretch sm:items-center mt-2"
                                                >
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        placeholder={t.emailPlaceholder}
                                                        required
                                                        disabled={loading}
                                                        className="px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a] text-xs font-semibold bg-white flex-1"
                                                    />
                                                    <div className="flex gap-2 shrink-0">
                                                        <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                                                        >
                                                            {loading ? "..." : t.submit}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveFormId(null)
                                                                setError("")
                                                            }}
                                                            className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-bold rounded-xl transition-all"
                                                        >
                                                            <X className="size-4" />
                                                        </button>
                                                    </div>
                                                    {error && <p className="text-[10px] text-[#c9041a] font-bold sm:ml-2 mt-1 sm:mt-0">{error}</p>}
                                                </form>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setActiveFormId(item.id)
                                                        setEmail("")
                                                        setError("")
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all group"
                                                >
                                                    <Clock className="size-3.5 text-zinc-400 group-hover:text-zinc-600" />
                                                    <span>{t.notifyMe}</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Clock Layout */}
                                <div className="flex items-center gap-2 self-start lg:self-center">
                                    {[
                                        { label: t.days, val: d },
                                        { label: t.hours, val: h },
                                        { label: t.minutes, val: m },
                                        { label: t.seconds, val: s }
                                    ].map((blk, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "size-14 rounded-2xl flex flex-col items-center justify-center border transition-all",
                                                isExpired
                                                    ? "bg-zinc-50 border-zinc-200 text-zinc-300"
                                                    : isClose
                                                    ? "bg-amber-50 border-amber-200 text-amber-900"
                                                    : "bg-zinc-900 border-zinc-900 text-white"
                                            )}
                                        >
                                            <span className="text-lg font-black leading-none font-mono">
                                                {String(blk.val).padStart(2, "0")}
                                            </span>
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-wider mt-0.5",
                                                isExpired ? "text-zinc-300" : isClose ? "text-amber-600" : "text-[#c9041a]"
                                            )}>
                                                {blk.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="py-12 bg-white rounded-2xl border border-zinc-200/50 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <Calendar className="size-12 text-zinc-300" />
                    <p className="text-sm font-bold text-zinc-500">{t.noItems}</p>
                </div>
            )}
        </div>
    )
}
