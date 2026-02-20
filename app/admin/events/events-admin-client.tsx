"use client"

import { useState } from "react"
import { Calendar, MapPin, Pencil, Trash2, Copy, Download, Loader2 } from "lucide-react"
import Link from "next/link"
import { deleteEvent, duplicateEvent, getEventRegistrations } from "@/app/actions/events"
import { cn } from "@/lib/utils"

interface EventsAdminClientProps {
    initialEvents: any[]
}

export default function EventsAdminClient({ initialEvents }: EventsAdminClientProps) {
    const [events, setEvents] = useState(initialEvents)
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null)

    const handleDuplicate = async (eventId: number) => {
        if (!confirm("Sei sicuro di voler duplicare questo evento?")) return

        setIsActionLoading(eventId)
        try {
            const res = await duplicateEvent(eventId)
            if (res.success) {
                // Ricarichiamo la pagina per vedere il duplicato
                window.location.reload()
            } else {
                alert("Errore durante la duplicazione")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsActionLoading(null)
        }
    }

    const handleExport = async (event: any) => {
        setIsActionLoading(event.id)
        try {
            const attendees = await getEventRegistrations(event.id)
            if (!attendees || attendees.length === 0) {
                alert("Nessun iscritto da esportare.")
                return
            }

            // Generate CSV
            const headers = ["Nome", "Cognome", "Email", "Matricola", "Dipartimento", "Corso di Laurea", "Stato", "Data Iscrizione"]
            const csvRows = attendees.map(a => [
                a.name,
                a.surname,
                a.email,
                a.matricola,
                a.department,
                a.degreeCourse,
                a.status,
                new Date(a.registeredAt).toLocaleString('it-IT')
            ].map(val => `"${val}"`).join(","))

            const csvContent = [headers.join(","), ...csvRows].join("\n")
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.setAttribute("href", url)
            link.setAttribute("download", `iscritti_${event.title.replace(/\s+/g, '_').toLowerCase()}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error(error)
            alert("Errore durante l'esportazione")
        } finally {
            setIsActionLoading(null)
        }
    }

    const handleDelete = async (eventId: number) => {
        if (!confirm("Sei sicuro di voler eliminare questo evento e tutte le sue iscrizioni?")) return

        setIsActionLoading(eventId)
        try {
            const res = await deleteEvent(eventId)
            if (res.success) {
                setEvents(events.filter(e => e.id !== eventId))
            } else {
                alert("Errore durante l'eliminazione")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsActionLoading(null)
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Evento</th>
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4 hidden md:table-cell">Luogo</th>
                        <th className="px-6 py-4 hidden md:table-cell">Categoria</th>
                        <th className="px-6 py-4 text-right">Azioni</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {events.map((event) => (
                        <tr key={event.id} className="hover:bg-zinc-50/50 transition-colors group">
                            <td className="px-6 py-5">
                                <div>
                                    <p className="font-bold text-foreground text-sm leading-tight">{event.title}</p>
                                    {event.cfuValue && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="inline-block size-1.5 rounded-full bg-green-500" />
                                            <p className="text-[11px] text-green-700 font-bold uppercase tracking-tight">
                                                {event.cfuValue} CFU • {event.cfuType === 'SENATO' ? 'Ateneo' : 'Dipartimento'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-sm text-zinc-600 whitespace-nowrap font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                                    {new Date(event.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-sm text-zinc-600 hidden md:table-cell">
                                <div className="flex items-center gap-2 max-w-48 truncate group-hover:text-foreground transition-colors">
                                    <MapPin className="size-4 text-zinc-400 shrink-0" />
                                    {event.location}
                                </div>
                            </td>
                            <td className="px-6 py-5 hidden md:table-cell">
                                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200 group-hover:bg-white transition-colors">
                                    {event.category}
                                </span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-1 justify-end">
                                    {/* Esporta Iscritti */}
                                    <button
                                        onClick={() => handleExport(event)}
                                        disabled={isActionLoading === event.id}
                                        className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all"
                                        title="Esporta Iscritti (CSV)"
                                    >
                                        <Download className="size-4" />
                                    </button>

                                    {/* Duplica Evento */}
                                    <button
                                        onClick={() => handleDuplicate(event.id)}
                                        disabled={isActionLoading === event.id}
                                        className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-orange-600 hover:border-orange-100 hover:bg-orange-50 transition-all"
                                        title="Duplica Evento"
                                    >
                                        <Copy className="size-4" />
                                    </button>

                                    {/* Modifica */}
                                    <Link
                                        href={`/admin/events/${event.id}/edit`}
                                        className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-foreground hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                                        title="Modifica"
                                    >
                                        <Pencil className="size-4" />
                                    </Link>

                                    {/* Elimina */}
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        disabled={isActionLoading === event.id}
                                        className="p-2 rounded-xl border border-zinc-100 text-zinc-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all"
                                        title="Elimina"
                                    >
                                        {isActionLoading === event.id ? (
                                            <Loader2 className="size-4 animate-spin text-zinc-300" />
                                        ) : (
                                            <Trash2 className="size-4" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
