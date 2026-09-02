"use client"

import { useState, useEffect } from "react"
import { getPartnerAnalytics, updatePartnerDiscounts, getPartnerSession } from "@/app/actions/partner"
import { useRouter } from "@/i18n/routing"
import { Tag, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function PartnerDiscountsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [discounts, setDiscounts] = useState<string[]>([])
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    useEffect(() => {
        getPartnerSession().then((session) => {
            if (!session) {
                router.push("/partner/login")
                return
            }
            getPartnerAnalytics().then((res) => {
                if (res.success && res.analytics) {
                    setDiscounts(res.analytics.discounts.length > 0 ? res.analytics.discounts : [""])
                }
                setLoading(false)
            })
        })
    }, [router])

    const handleAddDiscount = () => {
        if (discounts.length < 8) {
            setDiscounts([...discounts, ""])
        }
    }

    const handleRemoveDiscount = (index: number) => {
        const next = discounts.filter((_, i) => i !== index)
        setDiscounts(next.length ? next : [""])
    }

    const handleChangeDiscount = (index: number, val: string) => {
        const next = [...discounts]
        next[index] = val
        setDiscounts(next)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        setSaving(true)

        try {
            const res = await updatePartnerDiscounts(discounts)
            if (res.success) {
                setMessage({ type: "success", text: "Sconti aggiornati con successo! Le modifiche sono ora visibili sul sito." })
            } else {
                setMessage({ type: "error", text: res.error || "Impossibile salvare le modifiche." })
            }
        } catch (err) {
            setMessage({ type: "error", text: "Errore durante il salvataggio." })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="size-10 animate-spin text-[#18182e] mb-4" />
                <p className="text-sm font-bold text-slate-600">Caricamento sconti in corso...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                        Gestione Autonoma Sconti
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    I Tuoi Sconti Convenzionati
                </h1>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Aggiorna qui gli sconti riservati agli studenti tesserati delle associazioni Morgana e O.R.U.M. Le modifiche verranno mostrate subito nella pagina convenzioni del sito web.
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 animate-in fade-in ${
                    message.type === "success" 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                        : "bg-red-50 border-red-200 text-red-800"
                }`}>
                    {message.type === "success" ? <CheckCircle2 className="size-5 text-emerald-600 shrink-0" /> : <AlertCircle className="size-5 text-red-600 shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Discounts Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-800">Elenco Sconti</h2>
                    <button
                        type="button"
                        onClick={handleAddDiscount}
                        disabled={discounts.length >= 8}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <Plus className="size-4" />
                        Aggiungi Sconto
                    </button>
                </div>

                <div className="space-y-3">
                    {discounts.map((discount, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="size-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                #{index + 1}
                            </div>
                            <input
                                type="text"
                                value={discount}
                                onChange={(e) => handleChangeDiscount(index, e.target.value)}
                                placeholder="Es. 15% di sconto su tutti i libri di testo..."
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none"
                            />
                            {discounts.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDiscount(index)}
                                    className="p-3 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="py-3.5 px-8 rounded-2xl bg-[#18182e] hover:bg-[#252545] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        Salva Modifiche Sconti
                    </button>
                </div>
            </form>
        </div>
    )
}
