import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight } from "lucide-react"
import { getPlatformStats } from "@/app/actions/analytics"

export default async function AnalyticsPage() {
    const stats = await getPlatformStats()

    if (!stats) {
        return <div className="p-8 text-center text-zinc-500 italic">Caricamento statistiche fallito...</div>
    }

    const statCards = [
        {
            label: "Utenti Totali",
            value: stats.totalUsers.toLocaleString('it-IT'),
            change: "+12%",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Eventi Pubblicati",
            value: stats.totalEvents.toLocaleString('it-IT'),
            change: "+5%",
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            label: "Prenotazioni Totali",
            value: stats.totalRegistrations.toLocaleString('it-IT'),
            change: "+18%",
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            label: "Engagement Rate",
            value: `${stats.engagementRate}%`,
            change: "+2.4%",
            icon: BarChart3,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Analytics</h1>
                <p className="text-zinc-500 text-sm mt-1 font-medium italic">Monitoraggio real-time delle performance della piattaforma.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="size-6" />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                <ArrowUpRight className="size-3" /> {stat.change}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                        <p className="text-2xl font-black text-foreground mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Placeholder for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm h-80 flex flex-col items-center justify-center text-center group hover:border-zinc-200 transition-colors">
                    <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                        <BarChart3 className="size-8 text-zinc-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Crescita Utenti</h3>
                    <p className="text-sm text-zinc-500 max-w-xs mt-1">L'andamento delle nuove iscrizioni negli ultimi 30 giorni. <br /> <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 italic">Presto Disponibile</span></p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm h-80 flex flex-col items-center justify-center text-center group hover:border-zinc-200 transition-colors">
                    <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-50 transition-colors">
                        <BarChart3 className="size-8 text-zinc-300 group-hover:text-purple-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Distribuzione Eventi</h3>
                    <p className="text-sm text-zinc-500 max-w-xs mt-1">Analisi della tipologia di eventi più popolari per categoria. <br /> <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 italic">Presto Disponibile</span></p>
                </div>
            </div>

            {/* Extra Info Box */}
            <div className="bg-zinc-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="text-2xl font-black tracking-tight">Hai bisogno di report avanzati?</h2>
                    <p className="text-zinc-400 mt-2 max-w-md">Stiamo implementando l'integrazione con Google Analytics 4 e report PDF scaricabili per ogni evento.</p>
                </div>
                <div className="absolute right-0 top-0 opacity-10 blur-2xl flex gap-4 -rotate-12 translate-x-12 translate-y-[-20%]">
                    <div className="w-32 h-64 bg-red-500 rounded-full" />
                    <div className="w-32 h-64 bg-blue-500 rounded-full" />
                </div>
            </div>
        </div>
    )
}
