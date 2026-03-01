import { getPiazzaArtists, getPiazzaProgram, getPiazzaMedia, getPiazzaSettings } from "@/app/actions/piazza"
import { Users, Calendar, Video, Settings, Activity, Clock } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function PiazzaAdminPage() {
    const [artists, program, media, settings] = await Promise.all([
        getPiazzaArtists(),
        getPiazzaProgram(),
        getPiazzaMedia(),
        getPiazzaSettings()
    ])

    const stats = [
        { label: "Artisti", count: artists.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50", href: "/piazza-admin/artists" },
        { label: "Programma", count: program.length, icon: Calendar, color: "text-amber-500", bg: "bg-amber-50", href: "/piazza-admin/program" },
        { label: "Contenuti Media", count: media.length, icon: Video, color: "text-emerald-500", bg: "bg-emerald-50", href: "/piazza-admin/media" },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0f172a] p-10 rounded-[3rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-[#f9a620]/20 text-[#f9a620] text-[10px] font-black uppercase tracking-widest border border-[#f9a620]/30 animate-pulse">
                            Live Dashboard
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif font-black text-white uppercase tracking-tighter leading-none">
                        Piazza <br /> <span className="text-[#f9a620]">dell&apos;Arte {settings.year}</span>
                    </h2>
                    <p className="text-zinc-500 font-medium uppercase tracking-[0.3em] text-[10px] mt-6 flex items-center gap-2">
                        <Activity className="size-4" /> Centro di Gestione Integrata
                    </p>
                </div>

                <div className="relative z-10 flex flex-col items-end gap-2">
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right">
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Status Evento</p>
                        <p className="text-white font-bold flex items-center gap-2 justify-end">
                            <Clock className="size-4 text-[#f9a620]" />
                            {settings.eventDate ? new Date(settings.eventDate).toLocaleDateString() : "Data non impostata"}
                        </p>
                    </div>
                </div>

                {/* Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#f9a620]/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-all hover:bg-[#f9a620]/20"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="group bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="size-6" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-zinc-900 group-hover:scale-110 transition-transform">
                                {stat.count.toString().padStart(2, '0')}
                            </span>
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">
                            {stat.label}
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-[#f9a620] opacity-0 group-hover:opacity-100 transition-opacity">
                            Gestisci sezione →
                        </div>
                    </Link>
                ))}
            </div>

            {/* Event Summary / Quick Status */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 text-white shadow-2xl relative overflow-hidden group">
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
                        <Settings className="size-5 text-[#f9a620]" /> Stato Globale
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-sm text-zinc-400 font-medium">Anno Evento</span>
                            <span className="font-black text-[#f9a620] text-lg">{settings.year}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-sm text-zinc-400 font-medium">Countdown</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${settings.countdownVisible ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}`}>
                                {settings.countdownVisible ? "Attivo" : "Nascosto"}
                            </span>
                        </div>
                    </div>
                    <Link href="/piazza-admin/settings" className="mt-8 block w-full py-4 bg-white text-zinc-900 rounded-2xl text-center font-black uppercase tracking-widest text-xs hover:bg-[#f9a620] hover:text-[#0f172a] transition-all">
                        Configura Parametri
                    </Link>
                    <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Settings className="size-32" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm flex flex-col justify-center text-center">
                    <div className="size-20 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-6 transform rotate-3 group-hover:rotate-0 transition-transform">
                        <Activity className="size-10 text-zinc-300" />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-zinc-900 uppercase tracking-tighter mb-4">
                        Pronto per il <span className="text-[#f9a620]">Live?</span>
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto mb-8 font-medium">
                        Coordina gli artisti e carica i media aggiornati per garantire la migliore esperienza durante la Piazza dell&apos;Arte.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/network/piazzadellarte" target="_blank" className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl text-center font-black uppercase tracking-widest text-[9px] hover:bg-zinc-200 transition-all">
                            Visualizza Sito
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
