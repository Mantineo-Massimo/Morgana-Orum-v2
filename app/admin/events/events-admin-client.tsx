"use client"

import { useState, useEffect, useTransition } from "react"
import { Calendar, MapPin, Pencil, Trash2, Copy, Download, Loader2, Search, Filter } from "lucide-react"
import Link from "next/link"
import { deleteEvent, duplicateEvent, getEventRegistrations, getAllAdminEvents } from "@/app/actions/events"
import { cn } from "@/lib/utils"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface EventsAdminClientProps {
    initialEvents: any[]
}

export default function EventsAdminClient({ initialEvents }: EventsAdminClientProps) {
    const [events, setEvents] = useState(initialEvents)
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const res = await getAllAdminEvents({
                query: search,
                status: statusFilter === "all" ? undefined : statusFilter
            })
            setEvents(res)
        })
    }, [search, statusFilter])

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

            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.width

            // --- HELPER PER LOGHI ---
            const loadLogo = (src: string): Promise<string> => {
                return new Promise((resolve) => {
                    const img = new Image()
                    img.src = src
                    img.onload = () => {
                        const canvas = document.createElement("canvas")
                        canvas.width = img.width
                        canvas.height = img.height
                        const ctx = canvas.getContext("2d")
                        ctx?.drawImage(img, 0, 0)
                        resolve(canvas.toDataURL("image/png"))
                    }
                    img.onerror = () => resolve("")
                })
            }

            const logoMorgana = await loadLogo("/assets/morgana.png")
            const logoOrum = await loadLogo("/assets/orum.png")

            const drawHeader = (docInstance: any, titleOverride?: string) => {
                const margin = 15
                const logoSize = 25

                if (logoMorgana) docInstance.addImage(logoMorgana, "PNG", margin, 10, logoSize, logoSize)
                if (logoOrum) docInstance.addImage(logoOrum, "PNG", pageWidth - margin - logoSize, 10, logoSize, logoSize)

                docInstance.setFontSize(10)
                docInstance.setTextColor(100)
                docInstance.text("Associazioni Universitarie", pageWidth / 2, 18, { align: "center" })
                docInstance.setFontSize(14)
                docInstance.setTextColor(0)
                docInstance.setFont("helvetica", "bold")
                docInstance.text("Morgana & O.R.U.M.", pageWidth / 2, 25, { align: "center" })

                docInstance.setDrawColor(200)
                docInstance.line(margin, 40, pageWidth - margin, 40)

                docInstance.setFontSize(18)
                docInstance.text(titleOverride || event.title, pageWidth / 2, 55, { align: "center" })

                docInstance.setFontSize(10)
                docInstance.setFont("helvetica", "normal")
                docInstance.setTextColor(100)
                const dateStr = new Date(event.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
                docInstance.text(`Data: ${dateStr} - Luogo: ${event.location}`, pageWidth / 2, 62, { align: "center" })
            }

            // --- PAGINA 1: ISCRITTI ---
            drawHeader(doc, `ELENCO PRENOTATI: ${event.title}`)

            const tableRows = (attendees || []).map((a, index) => [
                index + 1,
                a.name,
                a.surname,
                a.matricola,
                "" // Firma
            ])

            autoTable(doc, {
                startY: 75,
                head: [["N°", "Nome", "Cognome", "Matricola", "Firma"]],
                body: tableRows,
                theme: "grid",
                headStyles: { fillColor: [40, 40, 40], textColor: 255, fontStyle: "bold" },
                columnStyles: {
                    0: { cellWidth: 10 },
                    4: { cellWidth: 60 } // Spazio largo per firma
                },
                styles: { fontSize: 9, cellPadding: 4 },
                didDrawPage: (data: any) => {
                    // Footer
                    const str = "Pagina " + doc.getNumberOfPages()
                    doc.setFontSize(8)
                    doc.text(str, pageWidth / 2, doc.internal.pageSize.height - 10, { align: "center" })
                }
            })

            // --- PAGINE EXTRA: NON PRENOTATI ---
            for (let i = 0; i < 3; i++) {
                doc.addPage()
                drawHeader(doc, `ELENCO NON PRENOTATI: ${event.title}`)

                const emptyRows = Array.from({ length: 20 }).map((_, idx) => [attendees.length + (i * 20) + idx + 1, "", "", "", ""])

                autoTable(doc, {
                    startY: 75,
                    head: [["N°", "Nome", "Cognome", "Matricola", "Firma"]],
                    body: emptyRows,
                    theme: "grid",
                    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
                    columnStyles: {
                        0: { cellWidth: 10 },
                        1: { cellWidth: 40 },
                        2: { cellWidth: 40 },
                        3: { cellWidth: 30 },
                        4: { cellWidth: 60 }
                    },
                    styles: { fontSize: 9, minCellHeight: 10 }
                })
            }

            doc.save(`appello_${event.title.replace(/\s+/g, '_').toLowerCase()}.pdf`)
        } catch (error) {
            console.error(error)
            alert("Errore durante l'esportazione PDF")
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
        <div className="space-y-6">
            {/* Filtri */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="search"
                        placeholder="Cerca evento..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-zinc-900/10"
                    />
                </div>
                <div className="relative shrink-0 w-full sm:w-auto">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto pl-10 pr-8 py-2 bg-zinc-50 border-none rounded-xl text-sm font-medium text-zinc-700 focus:ring-2 focus:ring-zinc-900/10 appearance-none cursor-pointer"
                    >
                        <option value="all">Tutti gli stati</option>
                        <option value="published">Pubblicati</option>
                        <option value="draft">Bozze</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden relative">
                {isPending && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all duration-300">
                        <Loader2 className="size-6 animate-spin text-zinc-900" />
                    </div>
                )}
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
                                        <p className="font-bold text-foreground text-sm leading-tight flex items-center gap-2">
                                            {event.title}
                                            {!event.published && (
                                                <span className="bg-zinc-100 text-zinc-600 text-[10px] uppercase font-black px-2 py-0.5 rounded border border-zinc-200">
                                                    Bozza
                                                </span>
                                            )}
                                        </p>
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
                {events.length === 0 && !isPending && (
                    <div className="p-8 text-center text-zinc-500 text-sm font-medium">
                        Nessun evento trovato in base ai filtri correnti.
                    </div>
                )}
            </div>
        </div>
    )
}
