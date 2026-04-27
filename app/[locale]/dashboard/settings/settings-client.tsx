"use client"

import { useState, useTransition } from "react"
import { Shield, Trash2, Download, CheckCircle2, Loader2, AlertTriangle } from "lucide-react"
import { updateUserConsents, deleteOwnAccount, exportUserData } from "@/app/actions/users"
import { cn } from "@/lib/utils"

import { useTranslations } from "next-intl"

export default function SettingsClient({ initialUser }: { initialUser: any }) {
    const t = useTranslations("Settings")
    const [orumConsent, setOrumConsent] = useState(initialUser.consenso_marketing_orum)
    const [morganaConsent, setMorganaConsent] = useState(initialUser.consenso_marketing_morgana)
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleUpdateConsents = async () => {
        startTransition(async () => {
            const res = await updateUserConsents({ orum: orumConsent, morgana: morganaConsent })
            if (res.success) {
                setMessage({ type: 'success', text: t("success") })
                setTimeout(() => setMessage(null), 3000)
            } else {
                setMessage({ type: 'error', text: t("error") })
            }
        })
    }

    const handleExport = async () => {
        const data = await exportUserData()
        if (data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `data_export_${initialUser.matricola}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }
    }

    const handleDeleteAccount = async () => {
        if (confirm("ATTENZIONE: Sei sicuro di voler eliminare definitivamente il tuo account? Questa azione è irreversibile e perderai tutti i tuoi dati, prenotazioni e crediti.")) {
            const res = await deleteOwnAccount()
            if (res.success) {
                window.location.href = "/"
            } else {
                alert("Errore durante l'eliminazione dell'account.")
            }
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-foreground">{t("title")}</h1>
                <p className="text-zinc-500 mt-2">{t("desc")}</p>
            </div>

            {message && (
                <div className={cn(
                    "p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
                    message.type === 'success' ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                )}>
                    {message.type === 'success' && <CheckCircle2 className="size-5" />}
                    <span className="text-sm font-bold">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Privacy & Marketing */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 md:p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
                                <Shield className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-foreground">{t("privacy_title")}</h2>
                                <p className="text-xs text-zinc-400 font-medium tracking-wider uppercase">{t("gdpr_badge")}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 group hover:bg-white hover:shadow-md transition-all">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-zinc-900 text-lg">{t("orum_mktg")}</h3>
                                    <p className="text-xs text-zinc-500 max-w-sm">
                                        {t("orum_mktg_desc")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setOrumConsent(!orumConsent)}
                                    className={cn(
                                        "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                        orumConsent ? "bg-zinc-900" : "bg-zinc-200"
                                    )}
                                >
                                    <span className={cn(
                                        "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                        orumConsent ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-3xl border border-zinc-100 group hover:bg-white hover:shadow-md transition-all">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-zinc-900 text-lg">{t("morgana_mktg")}</h3>
                                    <p className="text-xs text-zinc-500 max-w-sm">
                                        {t("morgana_mktg_desc")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setMorganaConsent(!morganaConsent)}
                                    className={cn(
                                        "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                        morganaConsent ? "bg-zinc-900" : "bg-zinc-200"
                                    )}
                                >
                                    <span className={cn(
                                        "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                        morganaConsent ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleUpdateConsents}
                                    disabled={isPending}
                                    className="w-full md:w-auto px-10 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-2"
                                >
                                    {isPending ? <Loader2 className="size-4 animate-spin" /> : t("save_prefs")}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Personal Data Info */}
                    <div className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-3 text-center md:text-left">
                                <h3 className="text-2xl font-serif font-black italic tracking-tight">{t("data_safe_title")}</h3>
                                <p className="text-white/60 text-sm max-w-md font-medium leading-relaxed">
                                    {t("data_safe_desc")}
                                </p>
                            </div>
                            <button
                                onClick={handleExport}
                                className="px-8 py-4 bg-white text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-100 transition-all flex items-center gap-3 shrink-0"
                            >
                                <Download className="size-4" />
                                {t("export_button")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-red-100 p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                                <Trash2 className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-foreground">{t("danger_zone")}</h2>
                                <p className="text-xs text-red-400 font-bold tracking-wider uppercase">{t("danger_desc")}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-red-50/50 rounded-3xl border border-red-50">
                                <div className="flex items-start gap-3 text-red-700 mb-6">
                                    <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold leading-relaxed">
                                        {t("delete_warning")}
                                    </p>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full py-4 bg-white text-red-600 border border-red-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all"
                                >
                                    {t("delete_button")}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 rounded-[2.5rem] p-8 border border-zinc-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">{t("info_title")}</h4>
                        <div className="space-y-3 text-xs text-zinc-500 font-medium">
                            <div className="flex justify-between py-2 border-b border-zinc-100">
                                <span>{t("info_matricola")}</span>
                                <span className="font-bold text-zinc-900">{initialUser.matricola}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-zinc-100">
                                <span>{t("info_member_since")}</span>
                                <span className="font-bold text-zinc-900">{initialUser.memberSince}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-zinc-100">
                                <span>{t("info_status")}</span>
                                <span className="text-green-600 font-bold">{t("status_verified")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
