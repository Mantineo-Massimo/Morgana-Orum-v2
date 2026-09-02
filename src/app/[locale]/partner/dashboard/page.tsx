import { getPartnerAnalytics, getPartnerSession } from "@/app/actions/partner"
import { redirect } from "next/navigation"
import { Users, Calendar, TrendingUp, Clock, Store, ShieldCheck, Tag } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/routing"

export const dynamic = "force-dynamic"

export default async function PartnerDashboardPage() {
    const session = await getPartnerSession()
    if (!session) {
        redirect("/partner/login")
    }

    const res = await getPartnerAnalytics()
    if (!res.success || !res.analytics) {
        return (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                <p className="text-red-600 font-bold">Impossibile caricare le statistiche.</p>
            </div>
        )
    }

    const { analytics } = res

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    {analytics.conventionLogo ? (
                        <div className="relative size-16 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm shrink-0">
                            <Image
                                src={analytics.conventionLogo}
                                alt={analytics.conventionName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="size-16 rounded-2xl bg-[#18182e] text-white flex items-center justify-center font-bold text-xl shrink-0">
                            <Store className="size-8 text-amber-400" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                                {analytics.conventionCategory}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            {analytics.conventionName}
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">
                            Resoconto e statistiche sull&apos;afflusso di studenti convenzionati.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        href="/partner/scanner"
                        className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                    >
                        <ShieldCheck className="size-4" />
                        Avvia Scanner
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scansioni Oggi</span>
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Clock className="size-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{analytics.todayScans}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Studenti verificati oggi</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Questa Settimana</span>
                        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                            <Calendar className="size-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{analytics.weekScans}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Negli ultimi 7 giorni</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Questo Mese</span>
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <TrendingUp className="size-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{analytics.monthScans}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Nel mese corrente</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Totale Storico</span>
                        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                            <Users className="size-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{analytics.totalScans}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Visite totali dall&apos;attivazione</p>
                </div>
            </div>

            {/* Last 7 Days Visual Breakdown */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Afflusso Ultimi 7 Giorni</h3>
                    <p className="text-xs text-slate-500 font-medium">Distribuzione giornaliera delle scansioni di tessere sul tuo esercizio.</p>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-4 border-b border-slate-100 pb-4">
                    {analytics.last7Days.map((item, idx) => {
                        const maxCount = Math.max(...analytics.last7Days.map(d => d.count), 1)
                        const heightPct = Math.max((item.count / maxCount) * 100, 8)

                        return (
                            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                                <span className="text-xs font-bold text-slate-700 group-hover:text-red-600 transition-colors">
                                    {item.count}
                                </span>
                                <div className="w-full max-w-[36px] bg-slate-100 group-hover:bg-red-500/20 rounded-xl overflow-hidden flex items-end h-full transition-colors">
                                    <div
                                        style={{ height: `${heightPct}%` }}
                                        className="w-full bg-[#18182e] group-hover:bg-red-600 rounded-t-xl transition-all duration-500"
                                    />
                                </div>
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
                                    {item.day}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Recent Scans Table */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Ultimi Studenti Verificati</h3>
                        <p className="text-xs text-slate-500 font-medium">Registro cronologico degli accessi.</p>
                    </div>
                </div>

                {analytics.recentScans.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 italic text-sm">
                        Nessuna scansione registrata finora.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold">
                                    <th className="pb-3 px-2">Studente</th>
                                    <th className="pb-3 px-2">Matricola</th>
                                    <th className="pb-3 px-2">Associazione</th>
                                    <th className="pb-3 px-2 text-right">Data e Ora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                {analytics.recentScans.map((scan: any) => (
                                    <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3.5 px-2 font-bold text-slate-900">
                                            {scan.user.name} {scan.user.surname}
                                        </td>
                                        <td className="py-3.5 px-2 font-mono text-slate-500">
                                            #{scan.user.matricola}
                                        </td>
                                        <td className="py-3.5 px-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-extrabold uppercase">
                                                {scan.user.association}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-2 text-right text-slate-400">
                                            {new Date(scan.createdAt).toLocaleString("it-IT", {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
