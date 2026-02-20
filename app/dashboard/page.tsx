"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { QrCode, Calendar, Clock, CheckCircle, Loader2, Award, Ticket, Bell, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUserDashboardData } from "@/app/actions/users"
import Image from "next/image"
import Link from "next/link"

import { ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export default function DashboardPage() {

    const isMorgana = true

    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState<any>(null)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
        async function loadData() {
            setLoading(true)
            const data = await getUserDashboardData()
            if (data) {
                // Calculate total CFU (assuming cfuValue is a string like "1" or "0.5")
                const totalCfu = data.events
                    .filter((e: any) => e.status === "CFU Convalidati")
                    .reduce((acc: number, curr: any) => acc + (parseFloat(curr.points) || 0), 0)

                // Find next event (first one with date >= today in the real world, 
                // but since data.events is already transformed, we just take the first one if we assume it's sorted or just relevant)
                // For simplicity, let's take the first "In attesa" event as the "Next" one.
                const nextEvent = data.events.find((e: any) => e.status === "In attesa")

                setUserData({
                    ...data.user,
                    events: data.events,
                    stats: {
                        totalCfu,
                        eventCount: data.events.length,
                        attendedCount: data.events.filter((e: any) => e.status !== "In attesa").length
                    },
                    nextEvent
                })
            }
            setLoading(false)
        }
        loadData()
    }, [])

    if (!hasMounted || loading) return null

    if (!userData) return null

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2 leading-tight">Panoramica</h1>
                    <p className="text-zinc-500">Benvenuto nella tua area riservata.</p>
                </div>
                {userData.role === "ADMIN" && (
                    <Link
                        href={`/admin`}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-zinc-200 bg-zinc-900 text-white hover:bg-zinc-800 flex items-center gap-2"
                    >
                        <ShieldCheck className="size-4" /> Pannello Admin
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="size-5 text-blue-500" />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Messaggi</span>
                    </div>
                    <p className="text-3xl font-black text-zinc-900">0</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Ticket className="size-5 text-zinc-900" />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Eventi Seguiti</span>
                    </div>
                    <p className="text-3xl font-black text-zinc-900">{userData.stats.attendedCount}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="size-5 text-zinc-900" />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Prenotazioni</span>
                    </div>
                    <p className="text-3xl font-black text-zinc-900">{userData.stats.eventCount}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Bell className="size-5 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Notifiche</span>
                    </div>
                    <p className="text-3xl font-black text-zinc-900">1</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">

                {/* LEFT COLUMN: UNIFIED MEMBER PASS & OFFERS */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
                        {/* Member Header (Card-like but integrated) */}
                        <div className={cn(
                            "p-8 text-white relative overflow-hidden",
                            isMorgana
                                ? "bg-gradient-to-br from-[#8a1c22] to-[#c12830]"
                                : "bg-gradient-to-br from-[#0f0f1d] to-[#18182e]"
                        )}>
                            {/* Decorative Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="bg-white/90 p-2 rounded-xl shadow-lg flex items-center gap-3">
                                        <div className="relative size-8 md:size-10">
                                            <Image src="/assets/morgana.png" alt="Insieme" fill className="object-contain" sizes="40px" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">Status Socio</p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="font-bold text-xs uppercase tracking-tighter">Attivo</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight mb-1">{userData.name} {userData.surname}</h3>
                                    <div className="flex items-center gap-4 text-white/70 text-sm font-mono tracking-widest">
                                        <span>#{userData.matricola}</span>
                                        <span className="text-white/30">•</span>
                                        <span className="font-sans text-xs uppercase font-bold tracking-normal italic">Membro dal {userData.memberSince}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advantages Section (Integrated) */}
                        <div className="p-8 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                    <span className="text-xl">🎁</span> Vantaggi Esclusivi
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                                    In quanto membro dell&apos;associazione {isMorgana ? "Morgana" : "O.R.U.M."}, hai accesso a convenzioni speciali con attività locali, librerie e servizi universitari.
                                </p>
                            </div>

                            <Link href={`/dashboard/offers`} className={cn(
                                "w-full py-3.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-2 group",
                                isMorgana
                                    ? "border-orange-100 text-orange-600 hover:bg-orange-50 hover:border-orange-200"
                                    : "border-blue-100 text-blue-900 hover:bg-blue-50 hover:border-blue-200"
                            )}>
                                Scopri Tutte le Offerte 🚀
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: NEXT EVENT */}
                <div className="h-full">
                    {userData.nextEvent ? (
                        <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center min-h-[400px]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>

                            <div className="relative z-10 text-center lg:text-left">
                                <span className={cn(
                                    "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6",
                                    isMorgana ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-800"
                                )}>
                                    Prossimo Evento Prenotato
                                </span>

                                <h3 className="text-2xl font-bold text-zinc-900 mb-2 leading-tight">{userData.nextEvent.title}</h3>
                                <p className="text-zinc-500 mb-8 text-sm leading-relaxed">Ti sei prenotato per questo evento. Ricorda di presentarti per la convalida dei CFU.</p>

                                <div className="flex flex-col gap-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-zinc-600 justify-center lg:justify-start">
                                        <Calendar className="size-4 text-zinc-400" />
                                        <span className="font-medium">{userData.nextEvent.date}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/events/${userData.nextEvent.id}`}
                                    className={cn(
                                        "w-full py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-zinc-100 hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2",
                                        isMorgana
                                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:brightness-110"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:brightness-110"
                                    )}
                                >
                                    Vedi Dettagli Prova <CheckCircle className="size-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 border border-zinc-200 border-dashed shadow-sm relative overflow-hidden h-full flex flex-col items-center justify-center min-h-[400px] text-center">
                            <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="size-8 text-zinc-200" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Nessun evento prenotato</h3>
                            <p className="text-zinc-500 mb-8 text-sm max-w-[280px]">Non hai ancora prenotazioni attive. Scopri i prossimi eventi e assicurati un posto!</p>

                            <Link
                                href={`/events`}
                                className={cn(
                                    "px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border-2",
                                    isMorgana
                                        ? "border-orange-100 text-orange-600 hover:bg-orange-50"
                                        : "border-blue-100 text-blue-900 hover:bg-blue-50"
                                )}
                            >
                                Scopri Eventi
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
