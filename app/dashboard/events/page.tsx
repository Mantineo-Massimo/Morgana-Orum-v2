"use client"

import { useState, useEffect } from "react"
import { Calendar, CheckCircle, Loader2, Clock, Award, ChevronRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUserDashboardData } from "@/app/actions/users"
import { cancelRegistration } from "@/app/actions/events"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function DashboardEventsPage() {

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

        if (!confirm("Sei sicuro di voler annullare questa prenotazione?")) return

        try {
            const res = await cancelRegistration(eventId)
            if (res.success) {
                setUserEvents(userEvents.filter(ev => ev.id !== eventId))
            } else {
                alert(res.message)
            }
        } catch (error) {
            alert("Errore durante l'annullamento.")
        }
    }

    if (loading) return null

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Prenotazioni</h1>
                <p className="text-zinc-500">Lo storico delle tue partecipazioni e i prossimi appuntamenti.</p>
            </div>

            <div className="grid gap-4">
                {userEvents.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-100 p-12 text-center">
                        <Calendar className="size-12 mx-auto mb-4 text-zinc-200" />
                        <h3 className="text-lg font-bold text-foreground mb-1">Ancora nulla qui</h3>
                        <p className="text-zinc-500 mb-6">Non hai ancora effettuato prenotazioni per i prossimi eventi.</p>
                        <Link
                            href={`/events`}
                            className="inline-flex items-center justify-center px-6 py-2 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
                        >
                            Sfoglia Eventi
                        </Link>
                    </div>
                ) : (
                    userEvents.map(event => (
                        <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="group bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                        event.status === "CFU Convalidati" ? "bg-green-50 text-green-600" :
                                            event.status === "Partecipato" ? "bg-blue-5 text-blue-600" : "bg-zinc-100 text-zinc-600"
                                    )}>
                                        {event.status === "CFU Convalidati" ? <Award className="size-6" /> :
                                            event.status === "Partecipato" ? <CheckCircle className="size-6" /> : <Clock className="size-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h4>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                                                <Calendar className="size-3.5" /> {event.date}
                                            </span>
                                            {event.points && (
                                                <span className="text-xs font-bold text-foreground bg-zinc-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                    {event.points} CFU
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        event.status === "CFU Convalidati" ? "bg-green-100 text-green-700" :
                                            event.status === "Partecipato" ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"
                                    )}>
                                        {event.status}
                                    </span>
                                    {event.status === "In attesa" && (
                                        <button
                                            onClick={(e) => handleCancel(e, event.id)}
                                            className="p-2 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group/btn"
                                            title="Annulla prenotazione"
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
