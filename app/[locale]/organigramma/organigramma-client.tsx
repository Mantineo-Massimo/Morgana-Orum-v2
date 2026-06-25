"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Mail, MapPin, BookOpen, Phone, Instagram, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { getRoleIcon } from "@/lib/role-icons"
import { sanitizeHtml } from "@/lib/sanitize"

interface OrganigrammaClientProps {
    initialMembers: any[]
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Organigramma",
        subtitle: "La struttura organizzativa interna, i coordinatori delle aree e i responsabili d'ateneo delle nostre associazioni.",
        tabAree: "Aree dell'Associazione",
        tabDipartimenti: "Responsabili d'Ateneo",
        coordinators: "Coordinatori",
        responsibles: "Responsabili",
        departments: "Responsabili di Dipartimento",
        filterDepartment: "Filtra per Dipartimento",
        allDepartments: "Tutti i Dipartimenti",
        noMembers: "Nessun rappresentante trovato per questo dipartimento."
    },
    en: {
        title: "Organization Chart",
        subtitle: "The internal organizational structure, area coordinators, and university managers of our associations.",
        tabAree: "Association Areas",
        tabDipartimenti: "University Managers",
        coordinators: "Coordinators",
        responsibles: "Managers",
        departments: "Department Managers",
        filterDepartment: "Filter by Department",
        allDepartments: "All Departments",
        noMembers: "No representatives found for this department."
    }
}

const DEPARTMENTS = [
    "Dipartimento Civiltà Antiche e Moderne (DICAM)",
    "Dipartimento di Economia",
    "Dipartimento di Giurisprudenza",
    "Dipartimento di Ingegneria",
    "Dipartimento Medicina Clinica e Sperimentale (DIMED)",
    "Dipartimento Patologia Umana dell'Adulto e dell'Età Evolutiva",
    "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)",
    "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)",
    "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)",
    "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)",
    "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)",
    "Dipartimento Scienze Veterinarie (VET)"
]


export function OrganigrammaClient({ initialMembers, locale }: OrganigrammaClientProps) {
    const [activeTab, setActiveTab] = useState<"aree" | "ateneo">("aree")
    const [selectedDept, setSelectedDept] = useState<string>("all")
    const [selectedMember, setSelectedMember] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const isAree = activeTab === "aree"
    
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    // Helper to extract structure from database members
    const getRole = (m: any) => (locale === "en" && m.roleEn) ? m.roleEn : m.role

    const handleMemberClick = (member: any) => {
        setSelectedMember(member)
        setIsModalOpen(true)
    }

    // Filter Aree dell'Associazione (Tab 1)
    const coordinators = initialMembers
        .filter(m => m.section === "COORDINATOR")
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const responsibles = initialMembers
        .filter(m => m.section === "RESPONSIBLE")
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    // Filter Responsabili d'Ateneo (Tab 2)
    const departments = initialMembers
        .filter(m => m.section === "DEPARTMENT" && (selectedDept === "all" || m.role === selectedDept))
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const brandColor = "text-[#18182e]"

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="size-20 bg-indigo-500/10 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <Users className="size-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground">
                        {t.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic">
                        {t.subtitle}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 max-w-xl mx-auto">
                    <button
                        onClick={() => setActiveTab("aree")}
                        className={cn(
                            "w-full px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border",
                            isAree
                                ? "bg-gradient-to-r from-[#c12830] to-[#18182e] text-white shadow-lg shadow-red-500/20 scale-105 border-transparent"
                                : "bg-white text-zinc-400 border-zinc-200 hover:bg-zinc-50"
                        )}
                    >
                        {t.tabAree}
                    </button>
                    <button
                        onClick={() => setActiveTab("ateneo")}
                        className={cn(
                            "w-full px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border",
                            !isAree
                                ? "bg-gradient-to-r from-[#c12830] to-[#18182e] text-white shadow-lg shadow-red-500/20 scale-105 border-transparent"
                                : "bg-white text-zinc-400 border-zinc-200 hover:bg-zinc-50"
                        )}
                    >
                        {t.tabDipartimenti}
                    </button>
                </div>

                {/* Structure Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-16"
                    >
                        {isAree ? (
                            <div className="space-y-16 w-full">
                                {/* 1. Coordinators Section */}
                                {coordinators.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 justify-center">
                                            <Award className={cn("size-6", brandColor)} />
                                            <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                                {t.coordinators}
                                            </h2>
                                        </div>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto py-4 justify-items-center">
                                            {coordinators.map((m) => (
                                                <motion.button
                                                    key={m.id}
                                                    onClick={() => handleMemberClick(m)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-zinc-150/60 hover:border-zinc-300 hover:shadow-md transition-all w-full max-w-[400px] text-left group shadow-sm relative"
                                                >
                                                    {/* Photo */}
                                                    <div className="size-16 md:size-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                        {m.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={m.image} alt={m.name} className="size-full object-cover" />
                                                        ) : (
                                                            <User className="size-8 text-zinc-300" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <h4 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                                                            {m.name.split(' ').map((part: string, i: number) => (
                                                                <span key={i} className="block">{part}</span>
                                                            ))}
                                                        </h4>
                                                        <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest leading-normal">
                                                            {getRole(m)}
                                                        </p>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Responsibles Section */}
                                {responsibles.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 justify-center">
                                            <Award className={cn("size-6", brandColor)} />
                                            <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                                {t.responsibles}
                                            </h2>
                                        </div>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto py-4 justify-items-center">
                                            {responsibles.map((m) => (
                                                <motion.button
                                                    key={m.id}
                                                    onClick={() => handleMemberClick(m)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-zinc-150/60 hover:border-zinc-300 hover:shadow-md transition-all w-full max-w-[400px] text-left group shadow-sm relative"
                                                >
                                                    {/* Photo */}
                                                    <div className="size-16 md:size-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                        {m.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={m.image} alt={m.name} className="size-full object-cover" />
                                                        ) : (
                                                            <User className="size-8 text-zinc-300" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <h4 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                                                            {m.name.split(' ').map((part: string, i: number) => (
                                                                <span key={i} className="block">{part}</span>
                                                            ))}
                                                        </h4>
                                                        <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest leading-normal">
                                                            {getRole(m)}
                                                        </p>
                                                    </div>


                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-12 w-full">
                                {/* Department selector */}
                                <div className="max-w-md mx-auto bg-white p-6 rounded-[2rem] border border-zinc-250/50 shadow-sm flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">{t.filterDepartment}</label>
                                    <select
                                        value={selectedDept}
                                        onChange={e => setSelectedDept(e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/50 rounded-2xl outline-none font-bold text-xs uppercase tracking-wider text-zinc-800 cursor-pointer"
                                    >
                                        <option value="all">{t.allDepartments}</option>
                                        {DEPARTMENTS.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 3. Departments Section */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 justify-center">
                                        <BookOpen className={cn("size-6", brandColor)} />
                                        <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                            {t.departments}
                                        </h2>
                                    </div>
                                    {departments.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto py-4 justify-items-center">
                                            {departments.map((m) => (
                                                <motion.button
                                                    key={m.id}
                                                    onClick={() => handleMemberClick(m)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-zinc-150/60 hover:border-zinc-300 hover:shadow-md transition-all w-full max-w-[400px] text-left group shadow-sm relative"
                                                >
                                                    {/* Photo */}
                                                    <div className="size-16 md:size-20 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                        {m.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={m.image} alt={m.name} className="size-full object-cover" />
                                                        ) : (
                                                            <User className="size-8 text-zinc-300" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                        <h4 className="font-bold text-foreground text-sm md:text-base mb-1 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                                                            {m.name.split(' ').map((part: string, i: number) => (
                                                                <span key={i} className="block">{part}</span>
                                                            ))}
                                                        </h4>
                                                        <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest leading-normal">
                                                            {getRole(m)}
                                                        </p>
                                                    </div>


                                                </motion.button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-white rounded-3xl border border-zinc-150/60 max-w-2xl mx-auto p-8 shadow-sm">
                                            <p className="text-sm font-bold text-zinc-450 italic">{t.noMembers}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modal Detail Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[95vw] md:w-full max-w-[95vw] md:max-w-4xl bg-white p-0 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-2xl">
                    {selectedMember && (
                        <div className="flex flex-col md:flex-row">
                            {/* Left Side - Image & Basic Info */}
                            <div className="w-full md:w-2/5 bg-zinc-50 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 relative">
                                {/* Logo in background opacity */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={
                                            selectedMember.association === "MORGANA" ? "/assets/morgana.webp" : "/assets/orum.webp"
                                        }
                                        alt={selectedMember.association}
                                        className="w-4/5 object-contain grayscale"
                                    />
                                </div>

                                <div className="size-32 md:size-48 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden mb-4 md:mb-6 relative z-10">
                                    {selectedMember.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={selectedMember.image} alt={selectedMember.name} className="size-full object-cover" />
                                    ) : (
                                        <User className="size-16 md:size-20 text-zinc-300 m-auto mt-8 md:mt-12" />
                                    )}
                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-center text-foreground leading-tight mb-2 relative z-10">{selectedMember.name}</h2>
                                <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-zinc-200 rounded-full text-[10px] md:text-xs font-bold text-zinc-600 mb-4 md:mb-6 relative z-10">
                                    {selectedMember.association === "MORGANA" ? "Associazione Morgana" : "O.R.U.M."}
                                </span>

                                {/* Contact Info - full text */}
                                <div className="flex flex-col gap-2 w-full relative z-10">
                                    {selectedMember.email && (
                                        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 rounded-lg border border-blue-100 text-blue-700 w-full">
                                            <Mail className="size-4 shrink-0" />
                                            <span className="text-sm break-all">{selectedMember.email}</span>
                                        </div>
                                    )}
                                    {selectedMember.phone && (
                                        <div className="flex items-center gap-3 px-4 py-2.5 bg-green-50 rounded-lg border border-green-100 text-green-700 w-full">
                                            <Phone className="size-4 shrink-0" />
                                            <span className="text-sm">{selectedMember.phone}</span>
                                        </div>
                                    )}
                                    {selectedMember.instagram && (
                                        <div className="flex items-center gap-3 px-4 py-2.5 bg-pink-50 rounded-lg border border-pink-100 text-pink-700 w-full">
                                            <Instagram className="size-4 shrink-0" />
                                            <span className="text-sm break-all">{selectedMember.instagram}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side - Details */}
                            <div className="w-full md:w-3/5 p-6 md:p-8">
                                <DialogHeader className="mb-4 md:mb-6 text-left">
                                    <h3 className="text-base md:text-lg font-bold text-foreground flex items-center gap-2">
                                        {(() => { const Icon = getRoleIcon(selectedMember.role || ""); return <Icon className="size-4 md:size-5 text-zinc-400 shrink-0" /> })()}
                                        <span className="line-clamp-2 md:line-clamp-none leading-tight">{getRole(selectedMember)}</span>
                                    </h3>
                                    <p className="text-sm text-zinc-500">
                                        {selectedMember.section === "COORDINATOR" ? "Coordinatore Area" :
                                         selectedMember.section === "RESPONSIBLE" ? "Responsabile Area" :
                                         "Responsabile di Dipartimento"}
                                    </p>
                                </DialogHeader>

                                <div className="space-y-6">
                                    {selectedMember.description && (
                                        <div>
                                            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Chi Sono / Ruolo</h4>
                                            <div
                                                className="prose prose-zinc prose-sm max-w-none text-zinc-600 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedMember.description) }}
                                            />
                                        </div>
                                    )}

                                    {!selectedMember.description && (
                                        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 text-center text-zinc-500 text-sm italic">
                                            Nessuna descrizione aggiuntiva disponibile.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
