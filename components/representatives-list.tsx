"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Mail, Phone, Instagram } from "lucide-react"
import { cn } from "@/lib/utils"

export function RepresentativesList({ departments }: { departments: any[] }) {
    return (
        <div className="space-y-6">
            {departments.map((dept, idx) => (
                <DepartmentCard key={idx} dept={dept} />
            ))}
        </div>
    )
}

function DepartmentCard({ dept }: { dept: any }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-zinc-50 transition-colors text-left"
            >
                <div>
                    <h3 className="text-lg font-bold text-zinc-900">{dept.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                        {dept.groups.reduce((acc: any, curr: any) => acc + curr.members.length, 0)} Eletti
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
                <div className="p-6 pt-0 border-t border-zinc-50">
                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        {dept.groups.map((group: any, idx: number) => (
                            <div key={idx} className="bg-zinc-50/50 rounded-xl p-5 border border-zinc-100/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-8 relative opacity-90">
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
                                    <h4 className={cn(
                                        "font-bold text-lg",
                                        "text-zinc-900"
                                    )}>{group.listName === "AZIONE" ? "Azione Universitaria" : group.listName}</h4>
                                </div>
                                <ul className="space-y-3">
                                    {group.members.map((member: any, memIdx: number) => (
                                        <li key={memIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-100 transition-all">
                                            <span className="text-sm font-medium text-zinc-800">{member.name}</span>

                                            <div className="flex gap-2">
                                                {member.email && (
                                                    <a href={`mailto:${member.email}`} className="size-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-blue-600 hover:border-blue-200 transition-colors" title="Invia Email">
                                                        <Mail className="size-4" />
                                                    </a>
                                                )}
                                                {member.phone && (
                                                    <a href={`tel:${member.phone}`} className="size-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-green-600 hover:border-green-200 transition-colors" title="Chiama">
                                                        <Phone className="size-4" />
                                                    </a>
                                                )}
                                                {member.instagram && (
                                                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="size-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-pink-600 hover:border-pink-200 transition-colors" title="Instagram">
                                                        <Instagram className="size-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
