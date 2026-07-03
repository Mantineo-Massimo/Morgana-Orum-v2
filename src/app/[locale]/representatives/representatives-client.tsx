"use client"

import { useState, useMemo } from "react"
import { Building2, Landmark, User, Users, ChevronLeft, ChevronRight, Award, Search, X } from "lucide-react"
import { getRoleIcon, CentralSectionIcon, DepartmentSectionIcon } from "@/lib/role-icons"
import { cn } from "@/lib/utils"
import { RepresentativesList } from "@/components/features/representatives-list"
import { RepresentativeModal } from "@/components/features/representative-modal"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

// Componente Counters animato
function AnimatedCounter({ value, suffix, prefix }: { value: number, suffix?: string, prefix?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    useEffect(() => {
        if (!isInView || !ref.current) return

        let startTime: number | null = null
        const duration = 1500 // 1.5 seconds

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            const easeOutQuart = 1 - Math.pow(1 - progress / duration, 4)

            const current = Math.min(Math.floor(easeOutQuart * value), value)
            if (ref.current) ref.current.textContent = `${prefix || ''}${current.toLocaleString('it-IT')}${suffix || ''}`

            if (progress < duration) {
                requestAnimationFrame(animate)
            } else {
                if (ref.current) ref.current.textContent = `${prefix || ''}${value.toLocaleString('it-IT')}${suffix || ''}`
            }
        }

        requestAnimationFrame(animate)
    }, [value, isInView, suffix, prefix])

    return <span ref={ref}>0{suffix}</span>
}

// Define types for props
interface RepresentativesClientProps {
    allReps: any[]
    isSubSite?: boolean
    brandColor?: string
    votesCount?: number
    bienniumConfigs?: { term: string, visible: boolean }[]
}

export default function RepresentativesClient({
    allReps = [],
    isSubSite,
    brandColor = "red",
    votesCount,
    bienniumConfigs = []
}: RepresentativesClientProps) {
    const t = useTranslations("Representatives")
    const [selectedRep, setSelectedRep] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Calculate unique terms dynamically based on the active bienniums of representatives
    const existingTerms = useMemo(() => {
        const startYears = allReps.map(r => parseInt(r.term.split("-")[0])).filter(y => !isNaN(y))
        if (startYears.length === 0) return []
        const minYear = Math.min(...startYears)
        const maxActiveStartYears = allReps.map(r => {
            const sy = parseInt(r.term.split("-")[0])
            if (isNaN(sy)) return 2025
            const extraYears = Math.floor(((r.mandateYears || 2) - 1) / 2) * 2
            return sy + extraYears
        })
        const maxYear = Math.max(...maxActiveStartYears)
        const terms = []
        for (let y = minYear; y <= maxYear; y += 2) {
            terms.push(`${y}-${y+2}`)
        }
        
        // Filter out terms marked as hidden in configs
        return terms
            .filter(term => {
                const config = bienniumConfigs.find(c => c.term === term)
                return config ? config.visible : true
            })
            .sort()
    }, [allReps, bienniumConfigs])

    const [selectedTerm, setSelectedTerm] = useState(existingTerms[existingTerms.length - 1] || "2025-2027")
    const [windowStartIdx, setWindowStartIdx] = useState(Math.max(0, existingTerms.length - 3))

    // Ensure selectedTerm is always a valid term in existingTerms
    useEffect(() => {
        if (existingTerms.length > 0 && !existingTerms.includes(selectedTerm)) {
            setSelectedTerm(existingTerms[existingTerms.length - 1])
        }
    }, [existingTerms, selectedTerm])

    // Ensure selectedTerm is always inside the visible window of 3 items
    useEffect(() => {
        const termIndex = existingTerms.indexOf(selectedTerm)
        if (termIndex !== -1) {
            if (termIndex < windowStartIdx || termIndex >= windowStartIdx + 3) {
                const newStart = Math.min(
                    Math.max(0, termIndex - 1),
                    Math.max(0, existingTerms.length - 3)
                )
                setWindowStartIdx(newStart)
            }
        }
    }, [selectedTerm, existingTerms, windowStartIdx])

    const handleRepClick = (rep: any) => {
        setSelectedRep(rep)
        setIsModalOpen(true)
    }

    // Filter representatives by selected biennium (overlap check) and search query
    const filteredReps = useMemo(() => {
        const reps = allReps.filter((r: any) => {
            const startYear = parseInt(r.term.split("-")[0])
            const selectedStartYear = parseInt(selectedTerm.split("-")[0])
            if (!isNaN(startYear) && !isNaN(selectedStartYear)) {
                const endYear = startYear + (r.mandateYears || 2)
                return startYear <= selectedStartYear && endYear > selectedStartYear
            }
            return r.term === selectedTerm
        })

        if (!searchQuery.trim()) return reps

        const query = searchQuery.toLowerCase().trim()
        return reps.filter((r: any) => {
            return (
                r.name.toLowerCase().includes(query) ||
                (r.department && r.department.toLowerCase().includes(query)) ||
                (r.role && r.role.toLowerCase().includes(query)) ||
                r.listName.toLowerCase().includes(query)
            )
        })
    }, [allReps, selectedTerm, searchQuery])

    // 1. Central Bodies
    const centralReps = filteredReps.filter((r: any) => r.category === "CENTRAL")
    const centralBodiesMap = new Map<string, any[]>()
    centralReps.forEach((rep: any) => {
        const role = rep.role || "Altro"
        if (!centralBodiesMap.has(role)) {
            centralBodiesMap.set(role, [])
        }
        centralBodiesMap.get(role)?.push(rep)
    })

    const centralBodies = Array.from(centralBodiesMap.entries()).map(([name, members]) => {
        const morganaMembers = members.filter(m => m.listName === "MORGANA")
        const orumMembers = members.filter(m => m.listName === "O.R.U.M.")
        const azioneMembers = members.filter(m => m.listName === "AZIONE UNIVERITARIA")

        const groups = []
        if (morganaMembers.length > 0) groups.push({ listName: "MORGANA", members: morganaMembers })
        if (orumMembers.length > 0) groups.push({ listName: "O.R.U.M.", members: orumMembers })
        if (azioneMembers.length > 0) groups.push({ listName: "AZIONE UNIVERITARIA", members: azioneMembers })

        return { name, groups }
    }).sort((a, b) => a.name.localeCompare(b.name))

    // 2. National Bodies
    const nationalReps = filteredReps.filter((r: any) => r.category === "NATIONAL")
    const nationalBodiesMap = new Map<string, any[]>()
    nationalReps.forEach((rep: any) => {
        const role = rep.role || "Altro"
        if (!nationalBodiesMap.has(role)) {
            nationalBodiesMap.set(role, [])
        }
        nationalBodiesMap.get(role)?.push(rep)
    })

    const nationalBodies = Array.from(nationalBodiesMap.entries()).map(([name, members]) => {
        const morganaMembers = members.filter(m => m.listName === "MORGANA")
        const orumMembers = members.filter(m => m.listName === "O.R.U.M.")
        const azioneMembers = members.filter(m => m.listName === "AZIONE UNIVERITARIA")

        const groups = []
        if (morganaMembers.length > 0) groups.push({ listName: "MORGANA", members: morganaMembers })
        if (orumMembers.length > 0) groups.push({ listName: "O.R.U.M.", members: orumMembers })
        if (azioneMembers.length > 0) groups.push({ listName: "AZIONE UNIVERITARIA", members: azioneMembers })

        return { name, groups }
    }).sort((a, b) => a.name.localeCompare(b.name))

    // 3. Departments
    const deptReps = filteredReps.filter((r: any) => r.category === "DEPARTMENT")
    const departmentsMap = new Map<string, any[]>()
    deptReps.forEach((rep: any) => {
        const dept = rep.department || "Altro"
        if (!departmentsMap.has(dept)) {
            departmentsMap.set(dept, [])
        }
        departmentsMap.get(dept)?.push(rep)
    })

    const departments = Array.from(departmentsMap.entries()).map(([name, members]) => {
        const morganaMembers = members.filter(m => m.listName === "MORGANA")
        const orumMembers = members.filter(m => m.listName === "O.R.U.M.")
        const azioneMembers = members.filter(m => m.listName === "AZIONE UNIVERITARIA")

        const groups = []
        if (morganaMembers.length > 0) groups.push({ listName: "MORGANA", members: morganaMembers })
        if (orumMembers.length > 0) groups.push({ listName: "O.R.U.M.", members: orumMembers })
        if (azioneMembers.length > 0) groups.push({ listName: "AZIONE UNIVERITARIA", members: azioneMembers })

        return { name, groups }
    }).sort((a, b) => a.name.localeCompare(b.name))

    // Calcolo dei totali
    const countMembers = (bodies: any[]) => {
        return bodies.reduce((total, body) => {
            return total + body.groups.reduce((groupTotal: number, group: any) => groupTotal + group.members.length, 0)
        }, 0)
    }

    const totalNational = countMembers(nationalBodies)
    const totalCentral = countMembers(centralBodies)
    const totalDept = countMembers(departments)
    const uniqueDeptCount = departments.length
    const grandTotal = totalNational + totalCentral + totalDept

    const stats = [
        { title: t("stat_votes"), value: votesCount ?? (isSubSite ? 0 : 7202), icon: Landmark, color: brandColor, suffix: "" },
        { title: t("stat_elected"), value: grandTotal, icon: Users, color: brandColor, suffix: "" },
        { title: t("stat_central"), value: totalCentral, icon: CentralSectionIcon, color: brandColor, suffix: "", hideOnSubSite: true },
        { title: t("stat_depts"), value: uniqueDeptCount, icon: Building2, color: brandColor, suffix: t("dept_suffix"), hideOnSubSite: true }
    ].filter(stat => !(isSubSite && stat.hideOnSubSite))

    return (
        <div className="min-h-screen bg-zinc-50 py-20 animate-in fade-in duration-500">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                    <div className="flex justify-center">
                        {existingTerms.length > 3 ? (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setWindowStartIdx(prev => Math.max(0, prev - 1))}
                                    disabled={windowStartIdx === 0}
                                    className="size-8 rounded-full border border-zinc-200/80 bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-800 disabled:opacity-40 disabled:hover:text-zinc-500 hover:shadow-sm transition-all shrink-0"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>

                                <div className="flex items-center gap-1 bg-zinc-100 p-1.5 rounded-full border border-zinc-200/50 shadow-sm max-w-full overflow-hidden relative">
                                    {existingTerms.slice(windowStartIdx, windowStartIdx + 3).map((term) => {
                                        const isActive = term === selectedTerm;
                                        return (
                                            <button
                                                key={term}
                                                onClick={() => setSelectedTerm(term)}
                                                className={cn(
                                                    "relative px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 focus:outline-none whitespace-nowrap",
                                                    isActive
                                                        ? "text-white"
                                                        : "text-zinc-500 hover:text-zinc-800"
                                                )}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeBienniumPill"
                                                        className="absolute inset-0 bg-red-600 rounded-full"
                                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                        style={{ zIndex: 0 }}
                                                    />
                                                )}
                                                <span className="relative z-10">{t("biennium", { term })}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setWindowStartIdx(prev => Math.min(existingTerms.length - 3, prev + 1))}
                                    disabled={windowStartIdx >= existingTerms.length - 3}
                                    className="size-8 rounded-full border border-zinc-200/80 bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-800 disabled:opacity-40 disabled:hover:text-zinc-500 hover:shadow-sm transition-all shrink-0"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 bg-zinc-100 p-1.5 rounded-full border border-zinc-200/50 shadow-sm max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
                                {existingTerms.map((term) => {
                                    const isActive = term === selectedTerm;
                                    return (
                                        <button
                                            key={term}
                                            onClick={() => setSelectedTerm(term)}
                                            className={cn(
                                                "relative px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 focus:outline-none whitespace-nowrap",
                                                isActive
                                                    ? "text-white"
                                                    : "text-zinc-500 hover:text-zinc-800"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeBienniumPill"
                                                    className="absolute inset-0 bg-red-600 rounded-full"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    style={{ zIndex: 0 }}
                                                />
                                            )}
                                            <span className="relative z-10">{t("biennium", { term })}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="size-20 bg-amber-500/10 text-amber-600 rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                            <Award className="size-10" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground">
                            {t("title")}
                        </h1>
                        <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic">
                            {t("subtitle")}
                        </p>
                    </div>
                </div>

                {/* Dashboard / Resoconto Numerico (Animato) */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                    className={cn(
                        "grid gap-4 mb-20 max-w-5xl mx-auto",
                        isSubSite ? "grid-cols-2 max-w-2xl" : "grid-cols-2 md:grid-cols-4"
                    )}
                >
                    {stats.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
                                }}
                                className="bg-white border border-zinc-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                            >
                                <div
                                    className={cn(
                                        "size-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300",
                                        !stat.color.startsWith('#') && `bg-${stat.color}-50 text-${stat.color}-500`
                                    )}
                                    style={{
                                        backgroundColor: stat.color.startsWith('#') ? `${stat.color}15` : undefined,
                                        color: stat.color.startsWith('#') ? stat.color : undefined
                                    }}
                                >
                                    <Icon className="size-6 relative z-10" />
                                </div>
                                <p className="text-3xl font-black text-foreground mb-1">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </p>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.title}</p>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-16 relative px-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cerca per nome, ruolo o dipartimento..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-10 py-3.5 bg-white border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 text-sm font-semibold transition-all shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650"
                            >
                                <X className="size-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {nationalBodies.length === 0 && centralBodies.length === 0 && departments.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-zinc-100 max-w-md mx-auto shadow-sm px-6 animate-in fade-in duration-300">
                        <Search className="size-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-1">Nessun rappresentante trovato</h3>
                        <p className="text-sm text-zinc-400">Prova a inserire una parola chiave diversa o a selezionare un altro biennio.</p>
                    </div>
                )}

                {/* National Bodies Section */}
                {nationalBodies.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-zinc-200 flex-1"></div>
                            <h2 className="text-2xl font-bold text-foreground uppercase tracking-widest flex items-center gap-3">
                                <Landmark className="size-6 text-zinc-400" /> {t("national_bodies")}
                            </h2>
                            <div className="h-px bg-zinc-200 flex-1"></div>
                        </div>

                        <div className={cn(
                            "grid gap-8",
                            nationalBodies.length === 1 ? "max-w-3xl mx-auto" : "lg:grid-cols-2"
                        )}>
                            {nationalBodies.map((body, idx) => (
                                <div key={idx} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                        {(() => { const Icon = getRoleIcon(body.name); return <Icon className="size-5 text-zinc-400" /> })()}
                                        {body.name}
                                    </h3>
                                    <div 
                                        className="grid gap-4 w-full py-4 items-stretch justify-items-center"
                                        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
                                    >
                                        {body.groups.flatMap((group: any) =>
                                            group.members.map((member: any, memIdx: number) => (
                                                <motion.button
                                                    key={`${group.listName}-${memIdx}`}
                                                    onClick={() => handleRepClick(member)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center gap-4 bg-white rounded-xl p-4 border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all w-full max-w-[400px] min-h-[96px] md:min-h-[112px] h-full text-left group shadow-sm relative"
                                                >
                                                    {/* Photo */}
                                                    <div className="size-16 md:size-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                        {member.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={member.image} alt={member.name} className="size-full object-cover" />
                                                        ) : (
                                                            <User className="size-8 text-zinc-300" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center pr-10 md:pr-12">
                                                        <h4 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight line-clamp-2">
                                                            {member.name}
                                                        </h4>
                                                        <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest">
                                                            {group.listName === "AZIONE UNIVERITARIA" ? "Azione Universitaria" : group.listName}
                                                        </p>
                                                    </div>

                                                    {/* Logo */}
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 size-8 md:size-9 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={
                                                                group.listName === "MORGANA" ? "/assets/backgrounds/morgana.webp" :
                                                                    group.listName === "O.R.U.M." ? "/assets/backgrounds/orum.webp" :
                                                                        "/assets/backgrounds/azione.webp"
                                                            }
                                                            alt={group.listName}
                                                            className="size-full object-contain"
                                                        />
                                                    </div>
                                                </motion.button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Central Bodies Section */}
                {centralBodies.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-zinc-200 flex-1"></div>
                            <h2 className="text-2xl font-bold text-foreground uppercase tracking-widest flex items-center gap-3">
                                <CentralSectionIcon className="size-6 text-zinc-400" /> {t("central_bodies")}
                            </h2>
                            <div className="h-px bg-zinc-200 flex-1"></div>
                        </div>

                        {/* Central Bodies Rows */}
                        {(() => {
                            const getBodyByPrefix = (prefix: string) => centralBodies.find(b => b.name.startsWith(prefix))
                            
                            const saBody = getBodyByPrefix("SA")
                            const cdaBody = getBodyByPrefix("CdA")
                            const ersuBody = getBodyByPrefix("ERSU")
                            const csasuBody = getBodyByPrefix("CSASU")
                            const cdsBody = getBodyByPrefix("CdS")
                            const cugBody = getBodyByPrefix("CUG")
                            const sirBody = getBodyByPrefix("SIR")

                            const ersuMemberCount = ersuBody 
                                ? ersuBody.groups.reduce((sum: number, g: any) => sum + g.members.length, 0)
                                : 0

                            let row1Bodies: any[] = []
                            let row2Bodies: any[] = []
                            let row3Bodies: any[] = []
                            let row4Bodies: any[] = []
                            
                            let row1Cols = "grid-cols-1 lg:grid-cols-2"
                            let row2Cols = "grid-cols-1 lg:grid-cols-2"
                            let row3Cols = "grid-cols-1"
                            let row4Cols = "grid-cols-1 lg:grid-cols-2"

                            if (csasuBody) {
                                row1Bodies = [saBody, cdaBody].filter(Boolean)
                                row1Cols = `grid-cols-1 lg:grid-cols-${row1Bodies.length}`
                                
                                row2Bodies = [ersuBody, csasuBody].filter(Boolean)
                                row2Cols = `grid-cols-1 lg:grid-cols-${row2Bodies.length}`
                            } else {
                                if (ersuMemberCount > 1) {
                                    row1Bodies = [saBody, cdaBody].filter(Boolean)
                                    row1Cols = `grid-cols-1 lg:grid-cols-${row1Bodies.length}`
                                    
                                    row2Bodies = [ersuBody].filter(Boolean)
                                    row2Cols = "grid-cols-1"
                                } else {
                                    row1Bodies = [saBody, cdaBody, ersuBody].filter(Boolean)
                                    row1Cols = `grid-cols-1 lg:grid-cols-${row1Bodies.length}`
                                    
                                    row2Bodies = []
                                }
                            }

                            row3Bodies = [cdsBody].filter(Boolean)
                            row4Bodies = [cugBody, sirBody].filter(Boolean)
                            row4Cols = `grid-cols-1 lg:grid-cols-${row4Bodies.length}`

                            const renderedPrefixes = ["SA", "CdA", "ERSU", "CSASU", "CdS", "CUG", "SIR"]
                            const otherBodies = centralBodies.filter(b => 
                                !renderedPrefixes.some(prefix => b.name.startsWith(prefix))
                            )

                             const renderBodyRow = (bodies: any[], columnsClass: string) => (
                                  <div className={cn("grid gap-8 mb-12 w-full", columnsClass)}>
                                      {bodies.map((body, idx) => (
                                          <div key={idx} className="relative flex flex-col w-full min-w-0">
                                              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 md:p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                                                  <h3 className="text-base md:text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b border-zinc-50 pb-3">
                                                      {(() => { const Icon = getRoleIcon(body.name); return <Icon className="size-4 md:size-5 text-zinc-400 shrink-0" /> })()}
                                                      <span className="leading-tight uppercase tracking-wide truncate">{body.name}</span>
                                                  </h3>
                                                  <div 
                                                      className="w-full py-2 grid gap-4 md:gap-5 justify-items-center items-stretch"
                                                      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
                                                  >
                                                      {body.groups.flatMap((group: any) =>
                                                          group.members.map((member: any, memIdx: number) => (
                                                              <motion.button
                                                                  key={`${group.listName}-${memIdx}`}
                                                                  onClick={() => handleRepClick(member)}
                                                                  whileHover={{ scale: 1.02 }}
                                                                  whileTap={{ scale: 0.98 }}
                                                                  className="flex items-center gap-4 bg-white rounded-xl p-4 border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all text-left group shadow-sm relative min-h-[96px] md:min-h-[112px] h-full w-full max-w-[400px]"
                                                              >
                                                                  <div className="size-16 md:size-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                                      {member.image ? (
                                                                          // eslint-disable-next-line @next/next/no-img-element
                                                                          <img src={member.image} alt={member.name} className="size-full object-cover" />
                                                                      ) : (
                                                                          <User className="size-8 text-zinc-300" />
                                                                      )}
                                                                  </div>
                                                                  <div className="flex-1 min-w-0 flex flex-col justify-center pr-10 md:pr-12">
                                                                      <h4 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight line-clamp-2">
                                                                          {member.name}
                                                                      </h4>
                                                                      <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest">
                                                                          {group.listName === "AZIONE UNIVERITARIA" || group.listName === "AZIONE" ? "Azione Universitaria" : group.listName}
                                                                      </p>
                                                                  </div>
                                                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 size-8 md:size-9 opacity-40 group-hover:opacity-100 transition-opacity">
                                                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                     <img
                                                                         src={
                                                                             group.listName === "MORGANA" ? "/assets/backgrounds/morgana.webp" :
                                                                                 group.listName === "O.R.U.M." ? "/assets/backgrounds/orum.webp" :
                                                                                     "/assets/backgrounds/azione.webp"
                                                                         }
                                                                         alt={group.listName}
                                                                         className="size-full object-contain"
                                                                     />
                                                                 </div>
                                                             </motion.button>
                                                         ))
                                                     )}
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                  </div>
                             )
 
                              return (
                                  <div className="space-y-12">
                                      {row1Bodies.length > 0 && renderBodyRow(row1Bodies, row1Cols)}
                                      {row2Bodies.length > 0 && renderBodyRow(row2Bodies, row2Cols)}
                                      {row3Bodies.length > 0 && renderBodyRow(row3Bodies, row3Cols)}
                                      {row4Bodies.length > 0 && renderBodyRow(row4Bodies, row4Cols)}
                                      {otherBodies.length > 0 && renderBodyRow(otherBodies, "grid-cols-1 lg:grid-cols-2")}
                                  </div>
                              )
                        })()}
                    </section>
                )}

                {/* Department Councils Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-zinc-200 flex-1"></div>
                        <h2 className="text-2xl font-bold text-foreground uppercase tracking-widest flex items-center gap-3">
                            <DepartmentSectionIcon className="size-6 text-zinc-400" /> {t("dept_councils")}
                        </h2>
                        <div className="h-px bg-zinc-200 flex-1"></div>
                    </div>

                    <div className="space-y-6">
                        <RepresentativesList
                            departments={departments}
                            onMemberClick={handleRepClick}
                        />
                    </div>
                </section>

            </div>

            <RepresentativeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                representative={selectedRep}
            />
        </div>
    )
}
