"use client"

import { useState } from "react"
import { Building2, Landmark, User, Users } from "lucide-react"
import { getRoleIcon, CentralSectionIcon, DepartmentSectionIcon } from "@/lib/role-icons"
import { cn } from "@/lib/utils"
import { RepresentativesList } from "@/components/representatives-list"
import { RepresentativeModal } from "@/components/representative-modal"
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
}

export default function RepresentativesClient({
    allReps = [],
    isSubSite,
    brandColor = "red",
    votesCount
}: RepresentativesClientProps) {
    const t = useTranslations("Representatives")
    const [selectedRep, setSelectedRep] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Calculate unique terms sorted chronologically descending
    const existingTerms = Array.from(new Set(allReps.map(r => r.term))).sort().reverse()
    const [selectedTerm, setSelectedTerm] = useState(existingTerms[0] || "2025-2027")

    const handleRepClick = (rep: any) => {
        setSelectedRep(rep)
        setIsModalOpen(true)
    }

    // Filter representatives by selected biennium
    const filteredReps = allReps.filter((r: any) => r.term === selectedTerm)

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
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground font-serif">{t("title")}</h1>
                        <p className="text-lg text-zinc-600 leading-relaxed mt-4">
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
                                    <div className="flex flex-wrap items-center justify-center gap-4 flex-grow py-4">
                                        {body.groups.flatMap((group: any) =>
                                            group.members.map((member: any, memIdx: number) => (
                                                <motion.button
                                                    key={`${group.listName}-${memIdx}`}
                                                    onClick={() => handleRepClick(member)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center gap-4 bg-white rounded-xl p-4 border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all w-full max-w-sm lg:max-w-none lg:w-[calc(50%-0.5rem)] text-left group shadow-sm relative"
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
                                                        <h4 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                                                            {member.name.split(' ').map((part: string, i: number) => (
                                                                <span key={i} className="block">{part}</span>
                                                            ))}
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
                                                                group.listName === "MORGANA" ? "/assets/morgana.webp" :
                                                                    group.listName === "O.R.U.M." ? "/assets/orum.webp" :
                                                                        "/assets/azione.webp"
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
                            const row1Bodies = centralBodies.filter(b => b.name.startsWith("SA") || b.name.startsWith("ERSU") || b.name.startsWith("CdA"))
                            const row2Bodies = centralBodies.filter(b => b.name.startsWith("CUG"))
                            const row3Bodies = centralBodies.filter(b => b.name.startsWith("CdS") || b.name.startsWith("SIR"))

                             const renderBodyRow = (bodies: any[], columnsClass: string) => (
                                 <div className={cn("grid gap-8 mb-12 w-full", columnsClass)}>
                                     {bodies.map((body, idx) => (
                                         <div key={idx} className="relative flex flex-col w-full min-w-0">
                                             <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 md:p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                                                 <h3 className="text-base md:text-lg font-bold text-foreground mb-4 flex items-center gap-2 border-b border-zinc-50 pb-3">
                                                     {(() => { const Icon = getRoleIcon(body.name); return <Icon className="size-4 md:size-5 text-zinc-400 shrink-0" /> })()}
                                                     <span className="leading-tight uppercase tracking-wide truncate">{body.name}</span>
                                                 </h3>
                                                 <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5 flex-grow w-full py-2">
                                                     {body.groups.flatMap((group: any) =>
                                                         group.members.map((member: any, memIdx: number) => (
                                                             <motion.button
                                                                 key={`${group.listName}-${memIdx}`}
                                                                 onClick={() => handleRepClick(member)}
                                                                 whileHover={{ scale: 1.02 }}
                                                                 whileTap={{ scale: 0.98 }}
                                                                 className={cn(
                                                                     "flex items-center gap-4 bg-white rounded-xl p-4 border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all text-left group shadow-sm relative",
                                                                     (body.name.startsWith("CdS") || body.name.startsWith("SIR")) ? "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]" : "w-full"
                                                                 )}
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
                                                                     <h4 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                                                                         {member.name.split(' ').map((part: string, i: number) => (
                                                                             <span key={i} className="block">{part}</span>
                                                                         ))}
                                                                     </h4>
                                                                     <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest">
                                                                         {group.listName === "AZIONE UNIVERITARIA" || group.listName === "AZIONE" ? "Azione Universitaria" : group.listName}
                                                                     </p>
                                                                 </div>
                                                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 size-8 md:size-9 opacity-40 group-hover:opacity-100 transition-opacity">
                                                                     {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                     <img
                                                                         src={
                                                                             group.listName === "MORGANA" ? "/assets/morgana.webp" :
                                                                                 group.listName === "O.R.U.M." ? "/assets/orum.webp" :
                                                                                     "/assets/azione.webp"
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
                                     {row1Bodies.length > 0 && renderBodyRow(row1Bodies, "grid-cols-1 lg:grid-cols-3")}
                                     {row2Bodies.length > 0 && (
                                         <div className="flex justify-center w-full">
                                             {renderBodyRow(row2Bodies, "grid-cols-1 max-w-2xl w-full")}
                                         </div>
                                     )}
                                     {row3Bodies.length > 0 && renderBodyRow(row3Bodies, "grid-cols-1 lg:grid-cols-2")}
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
