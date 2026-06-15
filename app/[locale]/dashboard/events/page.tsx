"use client"

import { useState, useEffect } from "react"
import { Calendar, CheckCircle, Clock, Award, ChevronRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUserDashboardData } from "@/app/actions/users"
import { cancelRegistration } from "@/app/actions/events"
import Link from "next/link"
import { useTranslations } from "next-intl"

export const dynamic = "force-dynamic"

export default function DashboardEventsPage() {
    const t = useTranslations("Dashboard")
    const [loading, setLoading] = useState(true)
    const [userEvents, setUserEvents] = useState<any[]>([])

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const data = await getUserDashboardData()
            if (data) {
                setUserEvents(data.events)
            }
            setLoading(false)
        }
        loadData()
    }, [])

    const handleCancel = async (e: React.MouseEvent, eventId: number) => {
        e.preventDefault()
        e.stopPropagation()

        if (!confirm(t("cancel_confirm"))) return

        try {
            const res = await cancelRegistration(eventId)
            if (res.success) {
                setUserEvents(userEvents.filter(ev => ev.id !== eventId))
                alert(t("cancel_success"))
            } else {
                alert(res.message)
            }
        } catch (error) {
            alert(t("cancel_error"))
        }
    }

    if (loading) return null

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1.5">{t("bookings_title")}</h1>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">{t("bookings_desc")}</p>
            </div>

            <div className="grid gap-4">
                {userEvents.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                        <div className="size-16 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Calendar className="size-8 text-zinc-350" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-1">{t("bookings_empty_title")}</h3>
                        <p className="text-zinc-500 mb-6 text-sm max-w-xs mx-auto leading-relaxed">{t("bookings_empty")}</p>
                        <Link
                            href={`/events`}
                            className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-slate-950 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-900 shadow-md transition-all duration-200"
                        >
                            {t("browse_events")}
                        </Link>
                    </div>
                ) : (
                    userEvents.map(event => (
                        <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="group bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-[0_8px_24px_rgb(0,0,0,0.01)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.035)] hover:border-slate-200 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border",
                                        event.status === "CFU Convalidati" ? "bg-green-50 border-green-200/50 text-green-600" :
                                            event.status === "Partecipato" ? "bg-blue-50 border-blue-200/50 text-blue-600" : "bg-slate-50 border-slate-200/50 text-zinc-500"
                                    )}>
                                        {event.status === "CFU Convalidati" ? <Award className="size-6" /> :
                                            event.status === "Partecipato" ? <CheckCircle className="size-6" /> : <Clock className="size-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-850 group-hover:text-violet-650 transition-colors tracking-tight text-base sm:text-lg leading-snug">{event.title}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                                                <Calendar className="size-3.5 text-zinc-400" /> {event.date}
                                            </span>
                                            {event.points && (
                                                <span className="text-[10px] font-black text-slate-700 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                    {event.points} CFU
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "hidden sm:inline-block px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border",
                                        event.status === "CFU Convalidati" ? "bg-green-50 border-green-200 text-green-700" :
                                            event.status === "Partecipato" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-zinc-50 border-zinc-200 text-zinc-650"
                                    )}>
                                        {event.status === "CFU Convalidati" ? t("status_cfu") :
                                         event.status === "Partecipato" ? t("status_attended") : t("status_waiting")}
                                    </span>
                                    {event.status === "In attesa" && (
                                        <button
                                            onClick={(e) => handleCancel(e, event.id)}
                                            className="p-2.5 text-zinc-450 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all duration-200 group/btn"
                                            title="Annulla"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    )}
                                    <ChevronRight className="size-5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
