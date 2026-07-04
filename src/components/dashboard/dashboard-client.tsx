"use client"

import { Calendar, Ticket, MessageSquare, ShieldCheck, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

interface DashboardClientProps {
    userData: any
}

export function DashboardClient({ userData }: DashboardClientProps) {
    const t = useTranslations("Dashboard")

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#18182e] via-[#0d0d17] to-[#18182e] p-8 text-white shadow-xl border border-[#c9041a]/30">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#18182e]/20 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#c9041a]/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">
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
                            className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 bg-white hover:bg-zinc-100 text-[#18182e] flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 self-start md:self-center shrink-0 border border-white/20"
                        >
                            <ShieldCheck className="size-4 text-[#18182e]" /> <span className="text-[#18182e] font-bold">{t("admin_panel")}</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Messages Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 group flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#18182e]/5 rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-3.5 rounded-2xl bg-[#18182e]/10 text-[#18182e] border border-[#18182e]/15 group-hover:scale-110 transition-all duration-300 shadow-sm">
                            <MessageSquare className="size-5" />
                        </div>
                        <span className="text-[9px] font-black text-[#18182e] uppercase tracking-widest bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-full">
                            {t("stats_status")}
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("messages")}</p>
                        <p className="text-4xl font-extrabold text-slate-900 mt-1.5 tabular-nums tracking-tight">0</p>
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
                    <div className="bg-white rounded-[2rem] border border-slate-100/80 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col h-full justify-between min-h-[400px]">
                        {/* Member Header (Credit Card Style Badge) */}
                        {(() => {
                            const formattedMatricola = String(userData.matricola || "");

                            return (
                                <div className="relative w-full aspect-[1.586/1] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden text-white shadow-2xl border border-white/10 bg-gradient-to-br from-[#18182e] via-[#0d0d17] to-[#c9041a]/95 p-6 md:p-8 flex flex-col justify-between group select-none">
                                    {/* Decorative Pattern & Glossy Shine */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#18182e]/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                                    <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-[#c9041a]/15 rounded-full blur-2xl"></div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>

                                    {/* Top Row: Logos & Status */}
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-sm flex items-center gap-2 shrink-0">
                                            <div className="relative size-8 md:size-9">
                                                <Image src="/assets/backgrounds/morgana.webp" alt="Morgana" fill className="object-contain filter brightness-110" sizes="36px" />
                                            </div>
                                            <div className="w-px h-6 bg-white/20"></div>
                                            <div className="relative size-8 md:size-9">
                                                <Image src="/assets/backgrounds/orum.webp" alt="O.R.U.M." fill className="object-contain filter brightness-110" sizes="36px" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm shrink-0">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="font-extrabold text-[9px] uppercase tracking-widest text-green-400 leading-none pt-0.5">{t("status_active")}</span>
                                        </div>
                                    </div>

                                    {/* Matricola (Large card number format, centered) */}
                                    <div className="relative z-10 my-auto py-2">
                                        <p className="font-mono tracking-[0.25em] text-xl sm:text-2xl md:text-3xl font-black text-white/95 drop-shadow-sm select-all">
                                            {formattedMatricola}
                                        </p>
                                    </div>

                                    {/* Bottom Row: Cardholder & Date */}
                                    <div className="relative z-10 flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <span className="text-[7px] sm:text-[8px] font-extrabold uppercase tracking-widest text-white/40 block leading-none">CARDHOLDER</span>
                                            <span className="font-black text-xs sm:text-sm uppercase tracking-wide truncate max-w-[180px] block leading-none">{userData.name} {userData.surname}</span>
                                        </div>
                                        <div className="text-right space-y-0.5">
                                            <span className="text-[7px] sm:text-[8px] font-extrabold uppercase tracking-widest text-white/40 block leading-none">MEMBER SINCE</span>
                                            <span className="font-mono text-xs sm:text-sm font-bold block leading-none">{userData.memberSince}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Advantages Section */}
                        <div className="flex-1 flex flex-col justify-between mt-6 md:mt-8">
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <span className="p-1.5 rounded-xl bg-blue-50 border border-blue-100 text-[#18182e]"><CheckCircle className="size-4" /></span>
                                    {t("exclusive_benefits")}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed text-justify font-medium">
                                    {t("benefits_desc")}
                                </p>
                            </div>

                            <Link href={`/dashboard/offers`} className="w-full mt-6 md:mt-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm flex items-center justify-center gap-2 group">
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
                            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#c9041a] to-[#18182e]" />
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
                                    className="w-full py-4 bg-gradient-to-r from-[#c9041a] to-[#18182e] hover:from-[#b10317] hover:to-[#121223] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2"
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
