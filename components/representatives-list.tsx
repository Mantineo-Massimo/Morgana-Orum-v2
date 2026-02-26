"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Mail, Phone, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { User } from "lucide-react"

export function RepresentativesList({
    departments,
    onMemberClick
}: {
    departments: any[],
    onMemberClick?: (member: any) => void
}) {
    const t = useTranslations("Representatives")
    return (
        <div className="space-y-8">
            {departments.map((dept, idx) => (
                <DepartmentCard key={idx} dept={dept} onMemberClick={onMemberClick} />
            ))}
        </div>
    )
}

function DepartmentCard({ dept, onMemberClick }: { dept: any, onMemberClick?: (member: any) => void }) {
    const t = useTranslations("Representatives")
    const [isOpen, setIsOpen] = useState(true) // Default open on sub-sites

    return (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 transition-colors text-left border-b border-zinc-50"
            >
                <div>
                    <h3 className="text-xl font-bold text-foreground font-serif uppercase tracking-tight">{dept.name}</h3>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        {dept.groups.reduce((acc: any, curr: any) => acc + curr.members.length, 0)} {t("stat_elected")}
                    </p>
                </div>
                {isOpen ? <ChevronUp className="size-5 text-zinc-400" /> : <ChevronDown className="size-5 text-zinc-400" />}
            </button>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="p-6 bg-zinc-50/30">
                    <div className="space-y-10">
                        {dept.groups.map((group: any, idx: number) => (
                            <div key={idx} className="relative">
                                {/* Group Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px bg-zinc-200 flex-1"></div>
                                    <div className="flex items-center gap-2 px-4">
                                        <div className="size-6 relative opacity-90">
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
                                        <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500">
                                            {group.listName === "AZIONE UNIVERITARIA" ? "Azione Universitaria" : group.listName}
                                        </h4>
                                    </div>
                                    <div className="h-px bg-zinc-200 flex-1"></div>
                                </div>

                                {/* Members Cards Grid - Changed to flex for centering */}
                                <div className="flex flex-wrap justify-center gap-6">
                                    {group.members.map((member: any, memIdx: number) => (
                                        <motion.button
                                            key={memIdx}
                                            onClick={() => onMemberClick?.(member)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-4 bg-white rounded-xl p-4 border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all text-left group w-full max-w-[400px]"
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
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h4 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors truncate">
                                                    {member.name}
                                                </h4>
                                                <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest">
                                                    {member.role || t("rep_label")}
                                                </p>
                                            </div>

                                            {/* Badge List */}
                                            <div className="shrink-0 size-8 relative opacity-40 group-hover:opacity-100 transition-opacity">
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
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
