"use client"

import { useState } from "react"
import { partnerLoginAction } from "@/app/actions/partner"
import { useRouter } from "@/i18n/routing"
import { Store, Lock, Mail, Loader2, ArrowRight } from "lucide-react"

export default function PartnerLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await partnerLoginAction(email, password)
            if (res.success) {
                router.push("/partner/scanner")
                router.refresh()
            } else {
                setError(res.error || "Impossibile accedere.")
            }
        } catch (err) {
            setError("Si è verificato un errore imprevisto.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto my-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
                <div className="text-center space-y-2">
                    <div className="size-16 bg-[#18182e] text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[#18182e]/20 mb-4">
                        <Store className="size-8 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portale Attività Convenzionate</h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Accedi con le credenziali fornite da Morgana & O.R.U.M. per scannerizzare le tessere e verificare gli sconti degli studenti.
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-in fade-in">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                            Email Attività
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="partner@negozio.it"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-6 rounded-xl bg-[#18182e] hover:bg-[#252545] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="size-5 animate-spin text-white" />
                        ) : (
                            <>
                                Accedi al Portale
                                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-[11px] text-slate-400 font-medium">
                        Problemi di accesso? Contatta il supporto studenti delle associazioni.
                    </p>
                </div>
            </div>
        </div>
    )
}
