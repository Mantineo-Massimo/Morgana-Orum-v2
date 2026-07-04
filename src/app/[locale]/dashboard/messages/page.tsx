import { getNotifications } from "@/app/actions/notifications"
import prisma from "@/lib/prisma"
import { Bell, Calendar, FileText, ChevronRight, Info, Clock } from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function MessagesPage({ params: { locale } }: { params: { locale: string } }) {
    const notifications = await getNotifications()
    
    // Fetch active/upcoming countdowns (deadlines)
    const now = new Date()
    const deadlines = await prisma.deadlineCountdown.findMany({
        where: {
            visible: true,
            id: { not: "system-init" },
            date: { gte: now }
        },
        orderBy: { createdAt: "desc" }
    })

    const t = await getTranslations("Dashboard")

    // Merge notifications and deadlines into a single timeline sorted by createdAt desc
    const timelineItems = [
        ...notifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            titleEn: n.titleEn,
            message: n.message,
            messageEn: n.messageEn,
            type: n.type, // "Notizia" | "Evento"
            link: n.link,
            createdAt: n.createdAt
        })),
        ...deadlines.map((d: any) => ({
            id: d.id,
            title: d.title,
            titleEn: d.titleEn,
            message: d.description,
            messageEn: d.descriptionEn,
            type: "Scadenza",
            link: `/${locale}/guide`,
            createdAt: d.createdAt,
            expirationDate: d.date
        }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1.5">{t("messages_title")}</h1>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                    {locale === "en" 
                        ? "Stay updated on the latest news, events, and academic deadlines."
                        : "Rimani aggiornato su tutte le ultime novità, eventi e scadenze accademiche."}
                </p>
            </div>

            {timelineItems.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                    <div className="size-16 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Bell className="size-8 text-zinc-350" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{t("no_messages")}</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto text-sm leading-relaxed">
                        {t("no_messages_desc")}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {timelineItems.map((notif: any) => {
                        const isEvent = notif.type === "Evento"
                        const isNews = notif.type === "Notizia"
                        const isDeadline = notif.type === "Scadenza"

                        const formattedDate = new Date(notif.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'it-IT', { day: 'numeric', month: 'long' })
                        
                        const formattedExpDate = notif.expirationDate
                            ? new Date(notif.expirationDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'it-IT', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Europe/Rome'
                            })
                            : null

                        return (
                            <div
                                key={notif.id}
                                className="group bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-[0_8px_24px_rgb(0,0,0,0.01)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.03)] transition-all duration-300 border-l-4"
                                style={{ borderLeftColor: isEvent ? "#dc2626" : (isNews ? "#1e40af" : (isDeadline ? "#d97706" : "#71717a")) }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "size-10 rounded-xl flex items-center justify-center shrink-0 border",
                                        isEvent ? "bg-red-50 border-red-100 text-red-650" : 
                                        isNews ? "bg-blue-50 border-blue-100 text-blue-700" :
                                        isDeadline ? "bg-amber-50 border-amber-100 text-amber-700" : 
                                        "bg-slate-50 border-slate-200 text-zinc-500"
                                    )}>
                                        {isEvent ? <Calendar className="size-5" /> : 
                                         isNews ? <FileText className="size-5" /> : 
                                         isDeadline ? <Clock className="size-5" /> : 
                                         <Info className="size-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                                {isEvent ? t("stats_events") : 
                                                 isNews ? t("sidebar_messages") : 
                                                 isDeadline ? (locale === 'en' ? 'Deadline' : 'Scadenza') : 
                                                 notif.type} • {formattedDate}
                                            </p>
                                        </div>
                                        <h3 className="font-extrabold text-slate-850 text-lg mb-1 group-hover:text-red-600 transition-colors uppercase tracking-tight leading-snug">
                                            {(locale === 'en' && notif.titleEn) ? notif.titleEn : notif.title}
                                        </h3>
                                        
                                        {isDeadline && formattedExpDate && (
                                            <p className="text-amber-700 text-xs font-bold mb-2 flex items-center gap-1.5">
                                                <Clock className="size-3.5" />
                                                <span>{locale === 'en' ? 'Expires on:' : 'Scade il:'} {formattedExpDate}</span>
                                            </p>
                                        )}

                                        <p className="text-zinc-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                            {(locale === 'en' && notif.messageEn) ? notif.messageEn : notif.message}
                                        </p>
                                        {notif.link && (
                                            <Link
                                                href={notif.link}
                                                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900 mt-4 hover:gap-2.5 transition-all group/link"
                                            >
                                                {isDeadline 
                                                    ? (locale === 'en' ? 'Go to details' : 'Vai ai dettagli')
                                                    : t("discover_more")}
                                                <ChevronRight className="size-3.5" />
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
