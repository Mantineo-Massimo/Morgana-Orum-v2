"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Association } from "@prisma/client"
import { ASSOCIATIONS } from "@/lib/associations"
import { Calendar, MapPin, Pencil, Trash2, Copy, Download, Loader2, Search, Filter, ArrowUpDown, ArrowUp, Tag, X, Plus } from "lucide-react"
import Link from "next/link"
import { deleteEvent, duplicateEvent, getEventRegistrations, getAllAdminEvents, createEventCategory, deleteEventCategory } from "@/app/actions/events"
import { cn } from "@/lib/utils"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface EventsAdminClientProps {
    initialEvents: any[]
    categories: string[]
    categoriesWithIds: any[]
    userRole?: string
    userAssociation?: Association
}

export default function EventsAdminClient({
    initialEvents,
    categories,
    categoriesWithIds,
    userRole,
    userAssociation
}: EventsAdminClientProps) {
    const router = useRouter()
    const [events, setEvents] = useState(initialEvents)
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [associationFilter, setAssociationFilter] = useState<Association | "">("")
    const [isPending, startTransition] = useTransition()
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | null } | null>(null)
    const [newCategory, setNewCategory] = useState("")
    const [filterCategory, setFilterCategory] = useState("")

    const requestSort = (key: string) => {
        let direction: 'asc' | null = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = null
        }
        setSortConfig(direction ? { key, direction } : null)
    }

    useEffect(() => {
        startTransition(async () => {
            const res = await getAllAdminEvents({
                query: search,
                status: statusFilter === "all" ? undefined : statusFilter,
                association: (associationFilter as Association) || undefined
            })
            setEvents(res)
        })
    }, [search, statusFilter, associationFilter])

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCategory.trim()) return
        startTransition(async () => {
            await createEventCategory(newCategory.trim())
            setNewCategory("")
            router.refresh()
        })
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Sei sicuro di voler eliminare questa categoria?")) return
        startTransition(async () => {
            await deleteEventCategory(id)
            router.refresh()
        })
    }

    const handleDuplicate = async (eventId: number) => {
        if (!confirm("Sei sicuro di voler duplicare questo evento?")) return

        setIsActionLoading(eventId)
        try {
            const res = await duplicateEvent(eventId)
            if (res.success) {
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

            const drawPageContent = (docInstance: any, titleOverride?: string) => {
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

                docInstance.setFontSize(8)
                docInstance.setFont("helvetica", "normal")
                docInstance.setTextColor(120)
                docInstance.text("Via Sant'Elia, 11 - 98122 Messina (ME)", pageWidth / 2, 32, { align: "center" })
                docInstance.text("associazionemorgana@gmail.com  -  orum_unime@gmail.com", pageWidth / 2, 36, { align: "center" })

                docInstance.setFontSize(10)
                docInstance.setTextColor(100)
                const dateStr = new Date(event.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
                docInstance.text(`Data: ${dateStr} - Luogo: ${event.location}`, pageWidth / 2, 62, { align: "center" })

                const str = "Pagina " + docInstance.getNumberOfPages()
                docInstance.setFontSize(8)
                docInstance.text(str, pageWidth / 2, docInstance.internal.pageSize.height - 10, { align: "center" })
            }

            const tableRows = (attendees || []).map((a, index) => [
                index + 1,
                a.name,
                a.surname,
                a.matricola,
                ""
            ])

            autoTable(doc, {
                startY: 75,
                head: [["N°", "Nome", "Cognome", "Matricola", "Firma"]],
                body: tableRows,
                theme: "grid",
                headStyles: { fillColor: [40, 40, 40], textColor: 255, fontStyle: "bold" },
                columnStyles: {
                    0: { cellWidth: 10 },
                    4: { cellWidth: 60 }
                },
                styles: { fontSize: 9, cellPadding: 4 },
                didDrawPage: (data: any) => {
                    drawPageContent(doc, `ELENCO PRENOTATI: ${event.title}`)
                }
            })

            for (let i = 0; i < 3; i++) {
                doc.addPage()
                const startRow = attendees.length + (i * 15) + 1
                const emptyRows = Array.from({ length: 15 }).map((_, idx) => [startRow + idx, "", "", "", ""])

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
                    styles: { fontSize: 9, minCellHeight: 12 },
                    didDrawPage: (data: any) => {
                        drawPageContent(doc, `ELENCO NON PRENOTATI: ${event.title}`)
                    }
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

    const sortedEvents = (Array.isArray(events) ? [...events] : []).filter(item => {
        const matchesCategory = !filterCategory || item.category === filterCategory
        const matchesAssociation = !associationFilter || (Array.isArray(item.associations) && item.associations.includes(associationFilter))
        return matchesCategory && matchesAssociation
    }).sort((a, b) => {
        if (!sortConfig) return 0
        const { key, direction } = sortConfig
        if (direction === 'asc') {
            const valA = (a[key as keyof any] || "").toString().toLowerCase()
            const valB = (b[key as keyof any] || "").toString().toLowerCase()
            return valA.localeCompare(valB)
        }
        return 0
    })

    return (
        <div className="space-y-6">
            {/* Gestione Categorie */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Tag className="size-4 text-zinc-400" /> Categorie Eventi
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {categoriesWithIds.map((cat: any) => (
                        <div key={cat.id} className="flex items-center gap-1 bg-zinc-100 rounded-full pl-4 pr-1 py-1.5">
                            <span className="text-sm font-medium text-zinc-700">{cat.name}</span>
                            <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                disabled={isPending}
                                className="p-1 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                title="Elimina categoria"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                    {categoriesWithIds.length === 0 && (
                        <p className="text-sm text-zinc-400 italic">Nessuna categoria. Creane una!</p>
                    )}
                </div>
                <form onSubmit={handleCreateCategory} className="flex gap-2">
                    <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nuova categoria evento..."
                        className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                    <button
                        type="submit"
                        disabled={isPending || !newCategory.trim()}
                        className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        <Plus className="size-4" /> Aggiungi
                    </button>
                </form>
            </div>

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

                <div className="relative shrink-0 w-full sm:w-auto">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full sm:w-auto pl-10 pr-8 py-2 bg-zinc-50 border-none rounded-xl text-sm font-medium text-zinc-700 focus:ring-2 focus:ring-zinc-900/10 appearance-none cursor-pointer"
                    >
                        <option value="">Tutte le categorie</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="relative shrink-0 w-full sm:w-auto">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <select
                        value={associationFilter}
                        onChange={(e) => setAssociationFilter(e.target.value as any)}
                        className="w-full sm:w-auto pl-10 pr-8 py-2 bg-zinc-50 border-none rounded-xl text-sm font-medium text-zinc-700 focus:ring-2 focus:ring-zinc-900/10 appearance-none cursor-pointer"
                    >
                        <option value="">Tutte le zone</option>
                        {ASSOCIATIONS.map(assoc => (
                            <option key={assoc.id} value={assoc.id}>{assoc.name}</option>
                        ))}
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
                            <th
                                className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors group"
                                onClick={() => requestSort('title')}
                            >
                                <div className="flex items-center gap-2">
                                    Evento {sortConfig?.key === 'title' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />}
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors group"
                                onClick={() => requestSort('date')}
                            >
                                <div className="flex items-center gap-2">
                                    Data {sortConfig?.key === 'date' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />}
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 hidden md:table-cell cursor-pointer hover:text-foreground transition-colors group"
                                onClick={() => requestSort('location')}
                            >
                                <div className="flex items-center gap-2">
                                    Luogo {sortConfig?.key === 'location' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />}
                                </div>
                            </th>
                            <th className="px-6 py-4 hidden md:table-cell">Categoria</th>
                            <th className="px-6 py-4 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {sortedEvents.map((event) => (
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
                                        {(userRole !== "ADMIN_NETWORK" || (event.associations && userAssociation && event.associations.includes(userAssociation))) ? (
                                            <>
                                                <button
                                                    onClick={() => handleExport(event)}
                                                    disabled={isActionLoading === event.id}
                                                    className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all"
                                                    title="Esporta Iscritti (CSV)"
                                                >
                                                    <Download className="size-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDuplicate(event.id)}
                                                    disabled={isActionLoading === event.id}
                                                    className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-orange-600 hover:border-orange-100 hover:bg-orange-50 transition-all"
                                                    title="Duplica Evento"
                                                >
                                                    <Copy className="size-4" />
                                                </button>

                                                <Link
                                                    href={`/admin/events/${event.id}/edit`}
                                                    className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-foreground hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                                                    title="Modifica"
                                                >
                                                    <Pencil className="size-4" />
                                                </Link>

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
                                            </>
                                        ) : (
                                            <span className="text-xs font-bold text-zinc-400 italic bg-zinc-100 px-3 py-1.5 rounded-xl">Solo lettura</span>
                                        )}
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
