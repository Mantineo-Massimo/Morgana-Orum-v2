import prisma from "@/lib/prisma"
import { Users, Building2, Calendar, Newspaper, ArrowUpRight, Plus, Activity, Clock, Sparkles } from "lucide-react"
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
        { label: "Utenti Totali", value: statsData.stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", trend: "Iscritti alla piattaforma" },
        { label: "Rappresentanti", value: statsData.stats.representatives, icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: "Rappresentanti attivi" },
        { label: "Eventi Creati", value: statsData.stats.events, icon: Calendar, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", trend: "In programmazione" },
        { label: "Notizie Pubblicate", value: statsData.stats.news, icon: Newspaper, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", trend: "Articoli nel blog" },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Premium Header / Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#18182e] via-[#0d0d17] to-[#18182e] p-8 text-white shadow-xl border border-[#c9041a]/30">
                {/* Background grids and blurs */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,4,26,0.15),transparent_50%)]" />
                <div className="absolute -right-10 -top-10 size-64 bg-[#c9041a]/10 rounded-full blur-3xl" />
                <div className="absolute -left-10 -bottom-10 size-64 bg-[#18182e]/10 rounded-full blur-2xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9041a]/20 border border-[#c9041a]/30 text-xs font-semibold text-red-200">
                            <Sparkles className="size-3.5 animate-spin" style={{ animationDuration: '3s' }} /> Area Amministrativa
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                            Bentornato, {userData?.user.name || 'Admin'} 👋
                        </h1>
                        <p className="text-zinc-300/80 text-sm max-w-md font-medium">
                            Gestisci i contenuti, monitora le attività degli utenti e controlla lo stato della piattaforma da un&apos;unica console centralizzata.
                        </p>
                    </div>
 
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/admin/events/new"
                            className="flex items-center gap-2 px-5 py-3 bg-white text-[#c9041a] rounded-2xl text-xs font-bold hover:bg-zinc-100 transition-all hover:scale-[1.02] shadow-lg active:scale-[0.98]"
                        >
                            <Plus className="size-4 text-[#c9041a]" /> NUOVO EVENTO
                        </Link>
                        <Link
                            href="/admin/news/new"
                            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-2xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Plus className="size-4" /> NUOVA NOTIZIA
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-slate-300/80 transition-all duration-300 group flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} group-hover:scale-110 transition-all duration-300`}>
                                <stat.icon className="size-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">Live</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-800 mt-1 tabular-nums">{stat.value.toLocaleString('it-IT')}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <Activity className="size-3.5 text-slate-400" />
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* Feeds Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Recent Events Feed */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-red-50 text-[#c9041a]"><Calendar className="size-4" /></span>
                                Ultimi Eventi
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">Gli ultimi eventi aggiunti alla piattaforma</p>
                        </div>
                        <Link href="/admin/events" className="text-xs font-bold text-[#c9041a] hover:text-[#b10317] transition-colors bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-xl">Vedi tutti</Link>
                    </div>

                    <div className="space-y-4">
                        {statsData.recentEvents.map((event) => (
                            <div key={event.id} className="group p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100/50 hover:border-slate-200/60 transition-all duration-300 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-[#c9041a] bg-red-50 border border-red-100/50 px-2 py-0.5 rounded-full w-fit uppercase tracking-widest">{event.category}</span>
                                    <span className="text-sm font-bold text-slate-700 mt-2">{event.title}</span>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-white border border-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {new Date(event.date).toLocaleDateString('it-IT')}
                                    </span>
                                    <span className="p-1.5 rounded-lg bg-white border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <ArrowUpRight className="size-3.5 text-slate-600" />
                                    </span>
                                </div>
                            </div>
                        ))}
                        {statsData.recentEvents.length === 0 && (
                            <p className="py-8 text-center text-slate-400 italic text-sm">Nessun evento recente.</p>
                        )}
                    </div>
                </div>

                {/* Recent News Feed */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-600"><Newspaper className="size-4" /></span>
                                Ultime Notizie
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">Le notizie pubblicate recentemente</p>
                        </div>
                        <Link href="/admin/news" className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-xl">Vedi tutte</Link>
                    </div>

                    <div className="space-y-4">
                        {statsData.recentNews.map((news) => (
                            <div key={news.id} className="group p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100/50 hover:border-slate-200/60 transition-all duration-300 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100/50 border border-amber-200/20 px-2 py-0.5 rounded-full w-fit uppercase tracking-widest">{news.category}</span>
                                    <span className="text-sm font-bold text-slate-700 mt-2">{news.title}</span>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-white border border-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {new Date(news.createdAt).toLocaleDateString('it-IT')}
                                    </span>
                                    <span className="p-1.5 rounded-lg bg-white border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <ArrowUpRight className="size-3.5 text-slate-600" />
                                    </span>
                                </div>
                            </div>
                        ))}
                        {statsData.recentNews.length === 0 && (
                            <p className="py-8 text-center text-slate-400 italic text-sm">Nessuna notizia recente.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Tips / Analytics Promo */}
            <div className="bg-gradient-to-r from-[#18182e] to-[#0d0d17] p-8 rounded-3xl text-white relative overflow-hidden group border border-[#c9041a]/25 shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c9041a]/20 border border-[#c9041a]/30 text-[10px] font-bold text-red-200 uppercase tracking-widest">Analytics</div>
                        <h3 className="text-lg font-black tracking-tight text-white mt-1">Dashboard Analytics Avanzata</h3>
                        <p className="text-zinc-450 text-zinc-350 text-zinc-400 text-xs max-w-md font-medium">
                            Monitora in tempo reale le visite, i click e l&apos;engagement dei tuoi utenti con il nuovo sistema di tracciamento integrato.
                        </p>
                    </div>
                    <Link
                        href="/admin/analytics"
                        className="px-6 py-3 bg-white text-[#18182e] rounded-2xl font-bold text-xs hover:bg-slate-100 active:scale-95 transition-all shadow-xl whitespace-nowrap tracking-wider"
                    >
                        VAI ALLE ANALYTICS 📈
                    </Link>
                </div>

                {/* Decoration */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-[#c9041a]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <Activity className="absolute left-[-20px] bottom-[-20px] size-48 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
        </div>
    )
}
