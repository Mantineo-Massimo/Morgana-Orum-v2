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
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-8 text-white shadow-xl border border-indigo-950/20">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-3">
                            {t("overview")}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2">
                            {t("welcome_user", { name: userData.name })}
                        </h1>
                        <p className="text-sm md:text-base text-zinc-300 font-medium max-w-xl leading-relaxed">
                            {t("welcome_desc")}
                        </p>
                    </div>
                    {userData.role !== "USER" && (
                        <Link
                            href={`/admin`}
                            className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 bg-white hover:bg-zinc-100 text-slate-955 flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 self-start md:self-center shrink-0 border border-white/20"
                        >
                            <ShieldCheck className="size-4 text-slate-900" /> <span className="text-slate-900 font-bold">{t("admin_panel")}</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Messages Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 group flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/15 group-hover:scale-110 transition-all duration-300 shadow-sm">
                            <MessageSquare className="size-5" />
                        </div>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full">
                            {t("stats_status")}
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("messages")}</p>
                        <p className="text-4xl font-extrabold text-slate-900 mt-1.5 tabular-nums tracking-tight">0</p>
                    </div>
                </div>

                {/* Followed Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 group flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-600 border border-violet-500/15 group-hover:scale-110 transition-all duration-300 shadow-sm">
                            <Ticket className="size-5" />
                        </div>
                        <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest bg-violet-50 border border-violet-100/50 px-2.5 py-1 rounded-full">
                            {t("stats_activity")}
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("followed")}</p>
                        <p className="text-4xl font-extrabold text-slate-900 mt-1.5 tabular-nums tracking-tight">{userData.stats.attendedCount}</p>
                    </div>
                </div>

                {/* Booked Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 group flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 group-hover:scale-110 transition-all duration-300 shadow-sm">
                            <Calendar className="size-5" />
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-full">
                            {t("stats_events")}
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("booked")}</p>
                        <p className="text-4xl font-extrabold text-slate-900 mt-1.5 tabular-nums tracking-tight">{userData.stats.eventCount}</p>
                    </div>
                </div>
            </div>

            {/* Main Sections Columns */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* LEFT COLUMN: UNIFIED MEMBER PASS & OFFERS */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden flex flex-col h-full min-h-[400px]">
                        {/* Member Header (Card design) */}
                        <div className="p-8 text-white relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-b border-indigo-950">
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
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">{t("stats_status")}</p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="font-bold text-xs uppercase tracking-tight text-green-400">{t("status_active")}</span>
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
                        <div className="p-8 flex-1 flex flex-col justify-between border-x border-b border-slate-100/80 rounded-b-[2rem] bg-white">
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <span className="p-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600"><CheckCircle className="size-4" /></span>
                                    {t("exclusive_benefits")}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed text-justify font-medium">
                                    {t("benefits_desc")}
                                </p>
                            </div>

                            <Link href={`/dashboard/offers`} className="w-full mt-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2 group">
                                {t("discover_offers")}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: NEXT EVENT */}
                <div className="h-full">
                    {userData.nextEvent ? (
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden h-full flex flex-col justify-between min-h-[400px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all duration-300 group">
                            {/* Glowing line top */}
                            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-violet-600 to-indigo-600" />
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
                                    className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                                >
                                    {t("view_details")} <CheckCircle className="size-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100/80 border-dashed shadow-sm relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[400px] text-center">
                            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                <Calendar className="size-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{t("no_events")}</h3>
                            <p className="text-zinc-500 mb-8 text-sm max-w-[280px] font-medium leading-relaxed">{t("no_events_desc")}</p>

                            <Link
                                href={`/events`}
                                className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2"
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
