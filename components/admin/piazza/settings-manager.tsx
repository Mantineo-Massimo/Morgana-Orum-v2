"use client"

import { useState } from "react"
import { Settings, Save, Calendar, Eye, EyeOff } from "lucide-react"
import { updatePiazzaSettings } from "@/app/actions/piazza"
import { cn } from "@/lib/utils"

interface SettingsManagerProps {
    settings: {
        year: string
        eventDate: Date | null | string
        countdownVisible: boolean
    }
}

export function SettingsManager({ settings: initialSettings }: SettingsManagerProps) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        year: initialSettings.year,
        eventDate: initialSettings.eventDate ? new Date(initialSettings.eventDate).toISOString().slice(0, 16) : '',
        countdownVisible: initialSettings.countdownVisible
    })

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await updatePiazzaSettings({
                year: form.year,
                eventDate: form.eventDate ? new Date(form.eventDate) : undefined,
                countdownVisible: form.countdownVisible
            })
            if (result.success) {
                alert("Impostazioni aggiornate con successo")
                window.location.reload()
            } else {
                alert(result.error)
            }
        } catch (error) {
            alert("Errore nell'aggiornamento")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Settings className="size-5 text-[#f9a620]" /> Configurazione Evento
            </h3>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-[#f9a620]"></span>
                                Anno dell&apos;Evento
                            </label>
                            <input
                                value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                placeholder="Es: 2026"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none font-bold bg-zinc-50/50"
                            />
                            <p className="text-[10px] text-zinc-400 italic">L&apos;anno appare neI titoli delle pagine.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                                <Calendar className="size-3 text-[#f9a620]" />
                                Data Inizio (Countdown)
                            </label>
                            <input
                                type="datetime-local"
                                value={form.eventDate}
                                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none font-bold bg-zinc-50/50"
                            />
                            <p className="text-[10px] text-zinc-400 italic">Target per il timer del countdown.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {form.countdownVisible ? <Eye className="size-4 text-[#f9a620]" /> : <EyeOff className="size-4 text-zinc-400" />}
                                    <p className="font-bold text-sm text-zinc-900 uppercase tracking-tight">Status Countdown</p>
                                </div>
                                <button
                                    onClick={() => setForm({ ...form, countdownVisible: !form.countdownVisible })}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-all relative",
                                        form.countdownVisible ? "bg-[#f9a620]" : "bg-zinc-300"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-0.5 size-5 bg-white rounded-full shadow-sm transition-all",
                                        form.countdownVisible ? "left-6.5" : "left-0.5"
                                    )} />
                                </button>
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                                Se attivo, il banner del conto alla rovescia sarà visibile nelle homepage di Morgana, ORUM e dei sottolivelli del network.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-[#0f172a] text-[#f9a620] rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg active:scale-[0.98]"
                    >
                        <Save className="size-5" />
                        {loading ? "Salvataggio..." : "Salva Configurazione"}
                    </button>
                </div>
            </div>
        </div>
    )
}
