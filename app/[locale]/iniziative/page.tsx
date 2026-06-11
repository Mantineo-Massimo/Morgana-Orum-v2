"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { 
    GraduationCap, 
    BookOpen, 
    Globe, 
    Bus, 
    Laptop, 
    Compass, 
    Wallet, 
    Trophy, 
    HeartHandshake, 
    MessageSquare,
    HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default function IniziativePage() {
    const t = useTranslations("IniziativePage")

    const areas = [
        {
            title: t("didattica_title"),
            desc: t("didattica_desc"),
            tag: t("didattica_tag"),
            icon: GraduationCap,
            iconColor: "text-red-600",
            iconBg: "bg-red-50 border-red-100",
            glowColor: "group-hover:shadow-red-500/10"
        },
        {
            title: t("aule_title"),
            desc: t("aule_desc"),
            tag: t("aule_tag"),
            icon: BookOpen,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-50 border-amber-100",
            glowColor: "group-hover:shadow-amber-500/10"
        },
        {
            title: t("internazionalizzazione_title"),
            desc: t("internazionalizzazione_desc"),
            tag: t("internazionalizzazione_tag"),
            icon: Globe,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50 border-blue-100",
            glowColor: "group-hover:shadow-blue-500/10"
        },
        {
            title: t("trasporti_title"),
            desc: t("trasporti_desc"),
            tag: t("trasporti_tag"),
            icon: Bus,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-50 border-emerald-100",
            glowColor: "group-hover:shadow-emerald-500/10"
        },
        {
            title: t("digitalizzazione_title"),
            desc: t("digitalizzazione_desc"),
            tag: t("digitalizzazione_tag"),
            icon: Laptop,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50 border-purple-100",
            glowColor: "group-hover:shadow-purple-500/10"
        },
        {
            title: t("orientamento_title"),
            desc: t("orientamento_desc"),
            tag: t("orientamento_tag"),
            icon: Compass,
            iconColor: "text-cyan-600",
            iconBg: "bg-cyan-50 border-cyan-100",
            glowColor: "group-hover:shadow-cyan-500/10"
        },
        {
            title: t("diritto_title"),
            desc: t("diritto_desc"),
            tag: t("diritto_tag"),
            icon: Wallet,
            iconColor: "text-indigo-600",
            iconBg: "bg-indigo-50 border-indigo-100",
            glowColor: "group-hover:shadow-indigo-500/10"
        },
        {
            title: t("attivita_title"),
            desc: t("attivita_desc"),
            tag: t("attivita_tag"),
            icon: Trophy,
            iconColor: "text-orange-600",
            iconBg: "bg-orange-50 border-orange-100",
            glowColor: "group-hover:shadow-orange-500/10"
        },
        {
            title: t("salute_title"),
            desc: t("salute_desc"),
            tag: t("salute_tag"),
            icon: HeartHandshake,
            iconColor: "text-rose-600",
            iconBg: "bg-rose-50 border-rose-100",
            glowColor: "group-hover:shadow-rose-500/10"
        }
    ]

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="size-20 bg-zinc-900/5 text-zinc-900 rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3 border border-zinc-900/10">
                        <HelpCircle className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-zinc-500 italic mb-6">
                        {t("subtitle")}
                    </p>
                    <p className="text-zinc-600 leading-relaxed max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </div>

                {/* Areas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {areas.map((area, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className={cn(
                                "bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden",
                                area.glowColor
                            )}
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.02] rounded-full translate-x-10 -translate-y-10 group-hover:scale-125 transition-transform duration-500" />
                            
                            <div>
                                <div className={cn("size-14 rounded-2xl flex items-center justify-center mb-6 border font-bold shadow-sm transition-transform duration-500 group-hover:scale-105", area.iconBg)}>
                                    <area.icon className={cn("size-7", area.iconColor)} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-zinc-900 transition-colors font-serif leading-tight">
                                    {area.title}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium">
                                    {area.desc}
                                </p>
                            </div>
                            <div className="border-t border-zinc-100 pt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                <span>{area.tag}</span>
                                <span className={cn("transition-transform duration-300 group-hover:translate-x-1 font-bold", area.iconColor)}>→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA Box */}
                <div className="mt-20 bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
                    <div className="relative z-10 flex-1 text-center lg:text-left space-y-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                            <MessageSquare className="size-3 text-red-400" />
                            <span>Contatto Diretto</span>
                        </span>
                        <h3 className="text-2xl md:text-4xl font-serif font-black uppercase tracking-tight leading-none">
                            {t("cta_title")}
                        </h3>
                        <p className="text-white/60 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
                            {t("cta_desc")}
                        </p>
                    </div>
                    <a
                        href="/contact"
                        className="relative z-10 inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-zinc-900 font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl hover:scale-105 hover:bg-zinc-50 transition-all shrink-0 w-full sm:w-auto"
                    >
                        {t("cta_button")}
                    </a>
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>
                </div>
            </div>
        </div>
    )
}
