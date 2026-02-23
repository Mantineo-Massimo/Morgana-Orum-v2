import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, Newspaper, Users2, Eye, MousePointer2 } from "lucide-react"
import { getPlatformStats } from "@/app/actions/analytics"

export default async function AnalyticsPage() {
    const stats = await getPlatformStats()

    if (!stats) {
        return <div className="p-8 text-center text-zinc-500 italic">Caricamento statistiche fallito...</div>
    }

    const mainStats = [
        {
            label: "Utenti Totali",
            value: stats.totalUsers.toLocaleString('it-IT'),
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Eventi Pubblicati",
            value: stats.totalEvents.toLocaleString('it-IT'),
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            label: "Notizie Pubblicate",
            value: stats.totalNews.toLocaleString('it-IT'),
            icon: Newspaper,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            label: "Rappresentanti",
            value: stats.totalReps.toLocaleString('it-IT'),
            icon: Users2,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
    ]

    const trafficStats = [
        { label: "Visite Sito", value: (stats.visitsCount || 0).toLocaleString('it-IT'), change: "Reali", icon: Eye },
        { label: "Click Totali", value: (stats.clicksCount || 0).toLocaleString('it-IT'), change: "Reali", icon: MousePointer2 },
        { label: "Engagement Rate", value: `${stats.engagementRate}%`, change: "Reali", icon: BarChart3 },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Analytics Sito</h1>
                    <p className="text-zinc-500 text-sm mt-1 font-medium italic">Panoramica completa delle performance e dei contenuti della piattaforma.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                        <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                        Google Analytics 4 & Sistema Interno Attivi
                    </div>
                </div>
            </div>

            {/* Content Stats */}
            <section className="space-y-4">
                <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] px-1">Statistiche Contenuti</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {mainStats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="size-6" />
                            </div>
                            <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                            <p className="text-2xl font-black text-foreground mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Real Internal Traffic Stats */}
            <section className="space-y-4">
                <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] px-1">Engagement & Traffico (Dati Interni)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {trafficStats.map((stat, i) => (
                        <div key={i} className="bg-zinc-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                    <p className="text-2xl font-black">{stat.value}</p>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-white/10 text-zinc-300">
                                    {stat.change}
                                </div>
                            </div>
                            <stat.icon className="absolute right-[-10px] bottom-[-10px] size-24 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Events */}
                <section className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <TrendingUp className="size-5 text-green-600" />
                            Eventi più Popolari
                        </h3>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">In base agli iscritti</span>
                    </div>
                    <div className="space-y-4">
                        {stats.topEvents.map((event, i) => (
                            <div key={event.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                                <span className="text-sm font-bold text-zinc-400 w-6">#{i + 1}</span>
                                <span className="flex-1 text-sm font-bold text-foreground truncate px-2">{event.title}</span>
                                <span className="text-xs font-black bg-white px-3 py-1.5 rounded-xl border border-zinc-200 shadow-sm text-zinc-600 shrink-0">
                                    {event.count} Iscritti
                                </span>
                            </div>
                        ))}
                        {stats.topEvents.length === 0 && (
                            <p className="text-center py-8 text-zinc-400 italic text-sm">Nessun dato disponibile.</p>
                        )}
                    </div>
                </section>

                {/* Dashboard Status */}
                <section className="bg-blue-600 p-8 rounded-3xl text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="p-3 bg-white/10 rounded-2xl w-fit mb-6">
                            <BarChart3 className="size-8" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">Monitoraggio Interno Attivo</h3>
                        <p className="text-blue-100 text-sm max-w-xs md:max-w-md">
                            Il sistema sta ora registrando in tempo reale ogni visita al sito e ogni click effettuato dagli utenti per fornirti dati certi senza dipendere da Google.
                        </p>
                    </div>
                    <div className="mt-8 relative z-10 flex items-center gap-4">
                        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full border border-white/10">
                            Stato: Operativo
                        </div>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                </section>
            </div>
        </div>
    )
}
