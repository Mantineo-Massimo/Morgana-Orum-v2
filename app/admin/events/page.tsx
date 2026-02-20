import { getAllEvents } from "@/app/actions/events"
import Link from "next/link"
import { Plus, Calendar, MapPin, Pencil, Trash2 } from "lucide-react"
import { deleteEvent } from "@/app/actions/events"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminEventsPage() {
    const events = await getAllEvents()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Eventi</h1>
                    <p className="text-zinc-500 text-sm mt-1">Gestisci gli eventi dell&apos;associazione.</p>
                </div>
                <Link
                    href={`/${"morgana"}/admin/events/new`}
                    className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors"
                >
                    <Plus className="size-4" /> Nuovo Evento
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-zinc-100 text-center text-zinc-400">
                    <Calendar className="size-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Nessun evento presente.</p>
                    <p className="text-sm mt-2">Crea il primo evento per iniziare.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-100 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Evento</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 hidden md:table-cell">Luogo</th>
                                <th className="px-6 py-4 hidden md:table-cell">Categoria</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-zinc-900 text-sm">{event.title}</p>
                                            {event.cfuValue && (
                                                <p className="text-xs text-green-600 font-medium mt-0.5">
                                                    {event.cfuValue} CFU {event.cfuType === 'SENATO' ? '(Ateneo)' : '(Dipartimento)'}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="size-3.5 text-zinc-400" />
                                            {new Date(event.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600 hidden md:table-cell">
                                        <div className="flex items-center gap-1.5 max-w-48 truncate">
                                            <MapPin className="size-3.5 text-zinc-400 shrink-0" />
                                            {event.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-zinc-100 text-zinc-600">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Link
                                                href={`/${"morgana"}/admin/events/${event.id}/edit`}
                                                className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                                            >
                                                <Pencil className="size-4" />
                                            </Link>
                                            <form action={async () => {
                                                "use server"
                                                await deleteEvent(event.id)
                                            }}>
                                                <button type="submit" className="p-2 rounded-lg hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors">
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
