import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { getAllEvents, getEventCategories, getEventCategoriesWithIds } from "@/app/actions/events"
import Link from "next/link"
import { Plus, Calendar } from "lucide-react"
import EventsAdminClient from "./events-admin-client"

export const dynamic = "force-dynamic"

export default async function AdminEventsPage() {
    const { cookies } = await import("next/headers")
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const [events, categories, categoriesWithIds] = await Promise.all([
        getAllEvents(),
        getEventCategories(),
        getEventCategoriesWithIds()
    ])

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Eventi</h1>
                    <p className="text-zinc-500 text-sm mt-1 font-medium italic">Gestione completa delle prenotazioni e partecipazione.</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all hover:shadow-lg hover:shadow-zinc-900/10 active:scale-95 whitespace-nowrap"
                >
                    <Plus className="size-4" /> Nuovo Evento
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 border border-zinc-100 text-center shadow-sm">
                    <div className="size-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="size-10 text-zinc-300" />
                    </div>
                    <p className="text-xl font-bold text-foreground">Nessun evento presente.</p>
                    <p className="text-zinc-500 mt-2 max-w-xs mx-auto">Crea il primo evento per iniziare a raccogliere adesioni.</p>
                </div>
            ) : (
                <EventsAdminClient
                    initialEvents={events}
                    categories={categories}
                    categoriesWithIds={categoriesWithIds}
                    userRole={user?.role}
                    userAssociation={user?.association}
                />
            )}
        </div>
    )
}
