import { getNotifications } from "@/app/actions/notifications"
import { Bell, Calendar, FileText, ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function MessagesPage() {
    const notifications = await getNotifications()

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-foreground">I tuoi Messaggi</h1>
                <p className="text-zinc-500 mt-2">Rimani aggiornato su tutte le ultime novità e gli eventi pubblicati.</p>
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center shadow-sm">
                    <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="size-8 text-zinc-300" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Nessun messaggio</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto mt-2">
                        Non hai ancora ricevuto notifiche. Ti avviseremo qui quando pubblicheremo nuovi contenuti.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {notifications.map((notif: any) => {
                        const isEvent = notif.type === "Evento"
                        const isNews = notif.type === "Notizia"

                        return (
                            <div
                                key={notif.id}
                                className="group bg-white rounded-2xl border border-zinc-100 p-5 shadow-sm hover:shadow-md transition-all border-l-4"
                                style={{ borderLeftColor: isEvent ? "#c12830" : (isNews ? "#18182e" : "#71717a") }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "size-10 rounded-xl flex items-center justify-center shrink-0",
                                        isEvent ? "bg-red-50 text-red-600" : (isNews ? "bg-blue-50 text-blue-900" : "bg-zinc-50 text-zinc-600")
                                    )}>
                                        {isEvent ? <Calendar className="size-5" /> : (isNews ? <FileText className="size-5" /> : <Info className="size-5" />)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                {notif.type} • {new Date(notif.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
                                            </p>
                                        </div>
                                        <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                                            {notif.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                        {notif.link && (
                                            <Link
                                                href={notif.link}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-zinc-900 mt-4 hover:gap-2 transition-all group/link"
                                            >
                                                SCOPRI DI PIÙ
                                                <ChevronRight className="size-3" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
