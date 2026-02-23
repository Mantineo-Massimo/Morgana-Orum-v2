import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight } from "lucide-react"

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Analytics</h1>
                <p className="text-zinc-500 text-sm mt-1 font-medium italic">Monitoraggio delle performance e statistiche della piattaforma.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Utenti Totali", value: "1,284", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Eventi Approvati", value: "42", change: "+5%", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Prenotazioni Mensili", value: "856", change: "+18%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Engagement Rate", value: "64%", change: "+2.4%", icon: BarChart3, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
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
                <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm h-80 flex flex-col items-center justify-center text-center">
                    <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="size-8 text-zinc-300" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Crescita Utenti</h3>
                    <p className="text-sm text-zinc-500 max-w-xs mt-1">Grafico visuale della crescita degli utenti nel tempo. (In fase di sviluppo)</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm h-80 flex flex-col items-center justify-center text-center">
                    <div className="size-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="size-8 text-zinc-300" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Distribuzione Eventi</h3>
                    <p className="text-sm text-zinc-500 max-w-xs mt-1">Analisi della tipologia di eventi più popolari. (In fase di sviluppo)</p>
                </div>
            </div>
        </div>
    )
}
