"use client"

import { useState } from "react"
import { Building2, Landmark, User, Users } from "lucide-react"
import { getRoleIcon, CentralSectionIcon, DepartmentSectionIcon } from "@/lib/role-icons"
import { cn } from "@/lib/utils"
// import { getRepresentatives } from "@/app/actions/representatives" // Don't import server action here directly if passing data as props
import { RepresentativesList } from "@/components/representatives-list"
import { RepresentativeModal } from "@/components/representative-modal"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

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
    nationalBodies: any[]
    centralBodies: any[]
    departments: any[]
}

export default function RepresentativesClient({ nationalBodies, centralBodies, departments }: RepresentativesClientProps) {
    const [selectedRep, setSelectedRep] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleRepClick = (rep: any) => {
        setSelectedRep(rep)
        setIsModalOpen(true)
    }

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

    return (
        <div className="min-h-screen bg-zinc-50 py-20 animate-in fade-in duration-500">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest mb-4">Biennio 2025-2027</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 font-serif">I Nostri Rappresentanti</h1>
                    <p className="text-lg text-zinc-600 leading-relaxed">
                        Conosci gli studenti eletti che lavorano ogni giorno negli organi collegiali per difendere i tuoi diritti e migliorare l&apos;ateneo.
                    </p>
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
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 max-w-5xl mx-auto"
                >
                    {[
                        { title: "Voti Raggiunti", value: 7202, icon: Landmark, color: "blue", suffix: "" },
                        { title: "Totale Eletti", value: grandTotal, icon: Users, color: "indigo", suffix: "" },
                        { title: "Organi Centrali", value: totalCentral, icon: CentralSectionIcon, color: "purple", suffix: "" },
                        { title: "Dipartimenti Presenti", value: uniqueDeptCount, icon: Building2, color: "amber", suffix: " su 12" }
                    ].map((stat, i) => {
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
                                <div className={`size-12 rounded-full bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="size-6 relative z-10" />
                                </div>
                                <p className="text-3xl font-black text-zinc-900 mb-1">
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
                            <h2 className="text-2xl font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-3">
                                <Landmark className="size-6 text-zinc-400" /> Organi Nazionali
                            </h2>
                            <div className="h-px bg-zinc-200 flex-1"></div>
                        </div>

                        <div className={cn(
                            "grid gap-8",
                            nationalBodies.length === 1 ? "max-w-3xl mx-auto" : "lg:grid-cols-2"
                        )}>
                            {nationalBodies.map((body, idx) => (
                                <div key={idx} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                        {(() => { const Icon = getRoleIcon(body.name); return <Icon className="size-5 text-zinc-400" /> })()}
                                        {body.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center gap-4 mt-auto flex-grow">
                                        {body.groups.flatMap((group: any) =>
                                            group.members.map((member: any, memIdx: number) => (
                                                <motion.button
                                                    key={`${group.listName}-${memIdx}`}
                                                    onClick={() => handleRepClick(member)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center gap-4 bg-zinc-50 rounded-xl p-4 border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all w-full sm:w-[calc(50%-0.5rem)] text-left"
                                                >
                                                    {/* Photo */}
                                                    <div className="size-20 rounded-full bg-white border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                        {member.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={member.image} alt={member.name} className="size-full object-cover" />
                                                        ) : (
                                                            <User className="size-8 text-zinc-300" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <h4 className="font-bold text-zinc-900 text-lg mb-1 leading-tight break-words group-hover:text-blue-600 transition-colors">{member.name}</h4>
                                                        <p className="text-sm text-zinc-500 font-medium leading-tight">
                                                            {group.listName === "AZIONE" ? "Azione Universitaria" : group.listName}
                                                        </p>
                                                    </div>

                                                    {/* Logo */}
                                                    <div className="shrink-0 size-12 relative opacity-90 flex items-center justify-center">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={
                                                                group.listName === "MORGANA" ? "/assets/morgana.png" :
                                                                    group.listName === "O.R.U.M." ? "/assets/orum.png" :
                                                                        "/assets/azione.png"
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
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-zinc-200 flex-1"></div>
                        <h2 className="text-2xl font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-3">
                            <CentralSectionIcon className="size-6 text-zinc-400" /> Organi Centrali
                        </h2>
                        <div className="h-px bg-zinc-200 flex-1"></div>
                    </div>

                    {/* Top Row: SA, CdA, ERSU, CSASU */}
                    {(() => {
                        const topBodies = centralBodies.filter(b => !b.name.startsWith("CdS") && !b.name.startsWith("SIR"))
                        const bottomBodies = centralBodies.filter(b => b.name.startsWith("CdS") || b.name.startsWith("SIR"))
                        return (
                            <>
                                <div className={cn(
                                    "grid gap-4 mb-8",
                                    topBodies.length <= 2 ? "lg:grid-cols-2" :
                                        topBodies.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
                                )}>
                                    {topBodies.map((body, idx) => (
                                        <div key={idx} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 flex flex-col h-full">
                                            <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                                {(() => { const Icon = getRoleIcon(body.name); return <Icon className="size-5 text-zinc-400 shrink-0" /> })()}
                                                <span className="truncate">{body.name}</span>
                                            </h3>
                                            <div className="flex flex-col gap-4 mt-auto flex-grow">
                                                {body.groups.flatMap((group: any) =>
                                                    group.members.map((member: any, memIdx: number) => (
                                                        <motion.button
                                                            key={`${group.listName}-${memIdx}`}
                                                            onClick={() => handleRepClick(member)}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="flex items-center gap-4 bg-zinc-50 rounded-xl p-4 border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all w-full text-left"
                                                        >
                                                            <div className="size-20 rounded-full bg-white border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                                {member.image ? (
                                                                    // eslint-disable-next-line @next/next/no-img-element
                                                                    <img src={member.image} alt={member.name} className="size-full object-cover" />
                                                                ) : (
                                                                    <User className="size-8 text-zinc-300" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                                <h4 className="font-bold text-zinc-900 text-lg mb-1 leading-tight break-words">{member.name}</h4>
                                                                <p className="text-sm text-zinc-500 font-medium leading-tight">
                                                                    {group.listName === "AZIONE" ? "Azione Universitaria" : group.listName}
                                                                </p>
                                                            </div>
                                                            <div className="shrink-0 size-12 relative opacity-90 flex items-center justify-center">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={
                                                                        group.listName === "MORGANA" ? "/assets/morgana.png" :
                                                                            group.listName === "O.R.U.M." ? "/assets/orum.png" :
                                                                                "/assets/azione.png"
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

                                {/* Bottom Row: Consiglio degli Studenti */}
                                {bottomBodies.length > 0 && (
                                    <div className={cn(
                                        "grid gap-8",
                                        bottomBodies.length === 1 ? "max-w-full" : "lg:grid-cols-2"
                                    )}>
                                        {bottomBodies.map((body, idx) => (
                                            <div key={idx} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col h-full">
                                                <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                                    {(() => { const Icon = getRoleIcon(body.name); return <Icon className="size-5 text-zinc-400" /> })()}
                                                    {body.name}
                                                </h3>
                                                <div className="flex flex-wrap items-center justify-center gap-4 mt-auto flex-grow">
                                                    {body.groups.flatMap((group: any) =>
                                                        group.members.map((member: any, memIdx: number) => (
                                                            <motion.button
                                                                key={`${group.listName}-${memIdx}`}
                                                                onClick={() => handleRepClick(member)}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="flex items-center gap-4 bg-zinc-50 rounded-xl p-4 border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all w-full sm:w-[calc(50%-0.5rem)] text-left"
                                                            >
                                                                <div className="size-20 rounded-full bg-white border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                                    {member.image ? (
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img src={member.image} alt={member.name} className="size-full object-cover" />
                                                                    ) : (
                                                                        <User className="size-8 text-zinc-300" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                                    <h4 className="font-bold text-zinc-900 text-lg mb-1 leading-tight break-words">{member.name}</h4>
                                                                    <p className="text-sm text-zinc-500 font-medium leading-tight">
                                                                        {group.listName === "AZIONE" ? "Azione Universitaria" : group.listName}
                                                                    </p>
                                                                </div>
                                                                <div className="shrink-0 size-12 relative opacity-90 flex items-center justify-center">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={
                                                                            group.listName === "MORGANA" ? "/assets/morgana.png" :
                                                                                group.listName === "O.R.U.M." ? "/assets/orum.png" :
                                                                                    "/assets/azione.png"
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
                                )}
                            </>
                        )
                    })()}
                </section>

                {/* Department Councils Section */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-zinc-200 flex-1"></div>
                        <h2 className="text-2xl font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-3">
                            <DepartmentSectionIcon className="size-6 text-zinc-400" /> Consigli di Dipartimento
                        </h2>
                        <div className="h-px bg-zinc-200 flex-1"></div>
                    </div>

                    <div className="space-y-6">
                        <RepresentativesList departments={departments} />
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
