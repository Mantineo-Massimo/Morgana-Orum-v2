import prisma from "@/lib/prisma"
import { Users, Building2, Calendar, Newspaper, ArrowUpRight, Plus, Activity, Clock } from "lucide-react"
import Link from "next/link"
import { getUserDashboardData } from "@/app/actions/users"

export const dynamic = 'force-dynamic'

async function getAdminDashboardData() {
    const [totalReps, totalUsers, totalEvents, totalNews, recentEvents, recentNews] = await Promise.all([
        prisma.representative.count(),
        prisma.user.count(),
        prisma.event.count(),
        prisma.news.count(),
        prisma.event.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, date: true, category: true }
        }),
        prisma.news.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, createdAt: true, category: true }
        })
    ])

    return {
        stats: {
            representatives: totalReps,
            users: totalUsers,
            events: totalEvents,
            news: totalNews,
        },
        recentEvents,
        recentNews
    }
}

export default async function AdminPage() {
    const [statsData, userData] = await Promise.all([
        getAdminDashboardData(),
        getUserDashboardData()
    ])

    const stats = [
        { label: "Utenti Totali", value: statsData.stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Rappresentanti", value: statsData.stats.representatives, icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Eventi", value: statsData.stats.events, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Notizie", value: statsData.stats.news, icon: Newspaper, color: "text-orange-600", bg: "bg-orange-50" },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">
                        Bentornato, {userData?.user.name || 'Admin'} 👋
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1 font-medium">
                        Ecco cosa sta succedendo sulla piattaforma oggi.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/events/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#18182e]/50 text-white rounded-xl text-sm font-bold hover:bg-[#18182e]/70 transition-all shadow-sm"
                    >
                        <Plus className="size-4" /> Nuovo Evento
                    </Link>
                    <Link
                        href="/admin/news/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-zinc-900 border border-zinc-200 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm"
                    >
                        <Plus className="size-4" /> Nuova Notizia
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="size-6" />
                            </div>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded">Update</span>
                        </div>
                        <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                        <p className="text-3xl font-black text-foreground mt-1">{stat.value.toLocaleString('it-IT')}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Recent Events Feed */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Calendar className="size-5 text-purple-600" />
                            Ultimi Eventi
                        </h3>
                        <Link href="/admin/events" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Vedi tutti</Link>
                    </div>

                    <div className="space-y-4">
                        {statsData.recentEvents.map((event) => (
                            <div key={event.id} className="group p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-all flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-purple-500 uppercase tracking-widest">{event.category}</span>
                                    <span className="text-sm font-bold text-foreground mt-0.5">{event.title}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-zinc-400 block uppercase">{new Date(event.date).toLocaleDateString('it-IT')}</span>
                                    <ArrowUpRight className="size-4 text-zinc-300 group-hover:text-zinc-900 transition-colors ml-auto mt-1" />
                                </div>
                            </div>
                        ))}
                        {statsData.recentEvents.length === 0 && (
                            <p className="py-8 text-center text-zinc-400 italic text-sm">Nessun evento recente.</p>
                        )}
                    </div>
                </div>

                {/* Recent News Feed */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Newspaper className="size-5 text-orange-600" />
                            Ultime Notizie
                        </h3>
                        <Link href="/admin/news" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Vedi tutte</Link>
                    </div>

                    <div className="space-y-4">
                        {statsData.recentNews.map((news) => (
                            <div key={news.id} className="group p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-all flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-orange-500 uppercase tracking-widest">{news.category}</span>
                                    <span className="text-sm font-bold text-foreground mt-0.5">{news.title}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-zinc-400 block uppercase">{new Date(news.createdAt).toLocaleDateString('it-IT')}</span>
                                    <ArrowUpRight className="size-4 text-zinc-300 group-hover:text-zinc-900 transition-colors ml-auto mt-1" />
                                </div>
                            </div>
                        ))}
                        {statsData.recentNews.length === 0 && (
                            <p className="py-8 text-center text-zinc-400 italic text-sm">Nessuna notizia recente.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Tips / Analytics Promo */}
            <div className="bg-[#18182e]/50 p-8 rounded-3xl text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-black">Dashbord Analytics Avanzata</h3>
                        <p className="text-zinc-400 text-sm max-w-md">
                            Monitora in tempo reale le visite, i click e l&apos;engagement dei tuoi utenti con il nuovo sistema di tracciamento integrato.
                        </p>
                    </div>
                    <Link
                        href="/admin/analytics"
                        className="px-6 py-3 bg-white text-zinc-900 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap"
                    >
                        Vai alle Analytics 📈
                    </Link>
                </div>

                {/* Decoration */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-zinc-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                <Activity className="absolute left-[-20px] bottom-[-20px] size-48 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
        </div>
    )
}
