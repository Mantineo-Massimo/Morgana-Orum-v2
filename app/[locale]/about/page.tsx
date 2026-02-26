"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Calendar, Mic2, HeartHandshake, Briefcase, GraduationCap, Gavel, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export const dynamic = "force-dynamic"

export default function AboutPage() {
    const t = useTranslations("AboutPage")
    const [activeTab, setActiveTab] = useState<"morgana" | "orum">("morgana")

    // Brand Colors
    const isMorgana = activeTab === "morgana"
    const brandColor = isMorgana ? "text-[#c12830]" : "text-[#18182e]"
    const bgBrandColor = isMorgana ? "bg-[#c12830]" : "bg-[#18182e]"
    const gradient = isMorgana ? "from-red-500/10 to-transparent" : "from-blue-900/10 to-transparent"

    // Content Data (Localized)
    const content = {
        morgana: {
            identity: t("morgana_identity"),
            story: t("morgana_story"),
            activities: [
                {
                    title: t("morgana_activity_1_title"),
                    desc: t("morgana_activity_1_desc"),
                    icon: Users
                },
                {
                    title: t("morgana_activity_2_title"),
                    desc: t("morgana_activity_2_desc"),
                    icon: Mic2
                },
                {
                    title: t("morgana_activity_3_title"),
                    desc: t("morgana_activity_3_desc"),
                    icon: HeartHandshake
                }
            ],
            commitment: t("morgana_commitment")
        },
        orum: {
            identity: t("orum_identity"),
            story: t("orum_story"),
            activities: [
                {
                    title: t("orum_activity_1_title"),
                    desc: t("orum_activity_1_desc"),
                    icon: Gavel
                },
                {
                    title: t("orum_activity_2_title"),
                    desc: t("orum_activity_2_desc"),
                    icon: GraduationCap
                },
                {
                    title: t("orum_activity_3_title"),
                    desc: t("orum_activity_3_desc"),
                    icon: Briefcase
                }
            ],
            commitment: t("orum_commitment")
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* 1. Common Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-zinc-50 overflow-hidden">
                <div className="container mx-auto text-center max-w-4xl relative z-10">
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground">
                        {t("title")}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic">
                        {t("subtitle")}
                    </p>
                    <p className="text-lg md:text-xl text-zinc-600 leading-relaxed text-balance">
                        {t("description")}
                    </p>
                </div>
            </section>

            {/* 2. Brand Switcher (Tabs) */}
            <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 shadow-sm">
                <div className="container mx-auto flex justify-center gap-4">
                    <button
                        onClick={() => setActiveTab("morgana")}
                        className={cn(
                            "px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300",
                            activeTab === "morgana"
                                ? "bg-[#c12830] text-white shadow-lg shadow-red-500/30 scale-105"
                                : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                        )}
                    >
                        Morgana
                    </button>
                    <button
                        onClick={() => setActiveTab("orum")}
                        className={cn(
                            "px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300",
                            activeTab === "orum"
                                ? "bg-[#18182e] text-white shadow-lg shadow-blue-900/30 scale-105"
                                : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                        )}
                    >
                        Orum
                    </button>
                </div>
            </div>

            {/* 3. Content Section (Animated) */}
            <div className={cn("transition-colors duration-700 bg-gradient-to-b", gradient)}>
                <div className="container mx-auto py-20 px-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-5xl mx-auto"
                        >
                            {/* Identity Header */}
                            <div className="text-center mb-16">
                                <span className={cn("font-serif text-3xl md:text-5xl font-bold block mb-2", brandColor)}>
                                    {activeTab === "morgana" ? "Associazione Morgana" : "Associazione Orum"}
                                </span>
                                <span className="text-zinc-500 font-medium uppercase tracking-[0.2em]">
                                    {content[activeTab].identity}
                                </span>
                            </div>

                            {/* Story */}
                            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-foreground">{t("history_title")}</h3>
                                    <p className="text-lg text-zinc-600 leading-relaxed">
                                        {content[activeTab].story}
                                    </p>
                                    <blockquote className={cn("pl-4 border-l-4 font-serif italic text-xl", isMorgana ? "border-[#c12830] text-red-900/60" : "border-[#18182e] text-blue-900/60")}>
                                        &quot;{content[activeTab].commitment}&quot;
                                    </blockquote>
                                </div>
                                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
                                    <Image
                                        src={`/assets/${activeTab === 'morgana' ? 'morgana' : 'orum'}.png`}
                                        alt="Brand Story"
                                        fill
                                        className="object-contain p-12 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Activities */}
                            <div className="grid md:grid-cols-3 gap-8">
                                {content[activeTab].activities.map((item, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50 hover:shadow-2xl transition-all hover:-translate-y-1 border border-zinc-100">
                                        <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center mb-6 text-white", bgBrandColor)}>
                                            <item.icon className="size-6" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-3 text-foreground">{item.title}</h4>
                                        <p className="text-zinc-600 leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* 4. Counters Section (Animated) */}
            <Counters t={t} />

            {/* 5. Join the Team Section */}
            <section className="py-24 bg-[#18182e] text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <Image src="/assets/slides/1.jpg" fill className="object-cover grayscale" alt="" sizes="100vw" />
                </div>
                <div className={cn("absolute inset-0 mix-blend-multiply opacity-20", isMorgana ? "bg-[#c12830]" : "bg-[#18182e]")}></div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-serif font-black mb-6 uppercase tracking-tight">
                            {t("join_team_title")}
                        </h2>
                        <p className="text-xl text-white/80 mb-12 leading-relaxed">
                            {activeTab === "morgana"
                                ? t("join_team_morgana")
                                : t("join_team_orum")}
                        </p>
                        <a
                            href={activeTab === "morgana" ? "https://www.instagram.com/associazione.morgana" : "https://www.instagram.com/orum_unime"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-white text-zinc-900 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 group shadow-2xl text-sm md:text-base"
                        >
                            {t("contact_instagram")} <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

function Counters({ t }: { t: any }) {
    return (
        <section className="py-20 bg-zinc-800 text-white">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <CounterItem number="110+" label={t("counter_reps")} icon={Users} delay={0} />
                <CounterItem number="12.000+" label={t("counter_students")} icon={HeartHandshake} delay={0.2} />
                <CounterItem number="100+" label={t("counter_events")} icon={Calendar} delay={0.4} />
            </div>
        </section>
    )
}

function CounterItem({ number, label, icon: Icon, delay }: { number: string, label: string, icon: any, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="flex flex-col items-center"
        >
            <Icon className="size-8 mb-4 opacity-50" />
            <span className="text-5xl md:text-6xl font-black font-serif mb-2 tracking-tight">
                {number}
            </span>
            <span className="text-sm uppercase tracking-widest font-bold opacity-70">
                {label}
            </span>
        </motion.div>
    )
}
