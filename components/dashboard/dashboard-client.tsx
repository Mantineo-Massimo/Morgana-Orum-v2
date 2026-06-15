"use client"

import { motion } from "framer-motion"
import { Calendar, Ticket, MessageSquare, ShieldCheck, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface DashboardClientProps {
    userData: any
}

"use client"

import { Calendar, Ticket, MessageSquare, ShieldCheck, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface DashboardClientProps {
    userData: any
}

export function DashboardClient({ userData }: DashboardClientProps) {
    const t = useTranslations("Dashboard")

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-850 tracking-tight mb-1 leading-tight">{t("overview")}</h1>
                    <p className="text-sm sm:text-base text-zinc-500 font-medium">{t("welcome")}</p>
                </div>
                {userData.role !== "USER" && (
                    <Link
                        href={`/admin`}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                    >
                        <ShieldCheck className="size-4" /> {t("admin_panel")}
                    </Link>
                )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Messages Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between min-h-[150px]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-all duration-300">
                            <MessageSquare className="size-5" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">Status</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("messages")}</p>
                        <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">0</p>
                    </div>
                </div>

                {/* Followed Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between min-h-[150px]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500 border border-violet-500/20 group-hover:scale-110 transition-all duration-300">
                            <Ticket className="size-5" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">Attività</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("followed")}</p>
                        <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">{userData.stats.attendedCount}</p>
                    </div>
                </div>

                {/* Booked Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between min-h-[150px]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                            <Calendar className="size-5" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">Eventi</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("booked")}</p>
                        <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">{userData.stats.eventCount}</p>
                    </div>
                </div>
            </div>

            {/* Main Sections Columns */}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
                {/* LEFT COLUMN: UNIFIED MEMBER PASS & OFFERS */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[400px]">
                        {/* Member Header (Card design) */}
                        <div className="p-8 text-white relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-950">
                            {/* Decorative Pattern & Glows */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full -mr-10 -mt-10 blur-2xl animate-pulse"></div>
                            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-violet-500/10 rounded-full blur-xl"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-2">
                                        <div className="relative size-7 md:size-8">
                                            <Image src="/assets/morgana.webp" alt="Morgana" fill className="object-contain filter brightness-110" sizes="32px" />
                                        </div>
                                        <div className="w-px h-6 bg-white/20"></div>
                                        <div className="relative size-7 md:size-8">
                                            <Image src="/assets/orum.webp" alt="O.R.U.M." fill className="object-contain filter brightness-110" sizes="32px" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Status</p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="font-bold text-xs uppercase tracking-tight text-green-400">Attivo</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black tracking-tight mb-1">{userData.name} {userData.surname}</h3>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/60 text-[10px] sm:text-xs font-mono tracking-wider">
                                        <span>#{userData.matricola}</span>
                                        <span className="text-white/20">•</span>
                                        <span className="font-sans text-[10px] sm:text-xs uppercase font-bold tracking-normal italic w-full sm:w-auto">
                                            {t("member_since", { date: userData.memberSince })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advantages Section */}
                        <div className="p-8 flex-1 flex flex-col justify-between border-x border-b border-slate-200/60 rounded-b-3xl">
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <span className="p-1 rounded-lg bg-indigo-55 bg-indigo-50 border border-indigo-100 text-indigo-600"><CheckCircle className="size-4" /></span>
                                    {t("exclusive_benefits")}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed text-justify font-medium">
                                    {t("benefits_desc")}
                                </p>
                            </div>

                            <Link href={`/dashboard/offers`} className="w-full mt-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2 group">
                                {t("discover_offers")}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: NEXT EVENT */}
                <div className="h-full">
                    {userData.nextEvent ? (
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative overflow-hidden h-full flex flex-col justify-between min-h-[400px] group">
                            {/* Glowing line top */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 to-indigo-500" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>

                            <div className="relative z-10 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-6">
                                        {t("next_event")}
                                    </span>

                                    <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">{userData.nextEvent.title}</h3>
                                    <p className="text-zinc-500 mb-8 text-sm leading-relaxed font-medium">{t("next_event_desc")}</p>

                                    <div className="flex flex-col gap-3 mb-8">
                                        <div className="flex items-center gap-3 text-sm text-zinc-600">
                                            <Calendar className="size-4 text-zinc-400" />
                                            <span className="font-semibold">{userData.nextEvent.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/events/${userData.nextEvent.id}`}
                                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                                >
                                    {t("view_details")} <CheckCircle className="size-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-8 border border-slate-200/60 border-dashed shadow-sm relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[400px] text-center">
                            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                <Calendar className="size-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{t("no_events")}</h3>
                            <p className="text-zinc-500 mb-8 text-sm max-w-[280px] font-medium leading-relaxed">{t("no_events_desc")}</p>

                            <Link
                                href={`/events`}
                                className="px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2"
                            >
                                {t("discover_events")}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
