"use client"

import { useState, useTransition } from "react"
import { Shield, Trash2, Download, CheckCircle2, Loader2, AlertTriangle, User } from "lucide-react"
import { updateUserConsents, deleteOwnAccount, exportUserData, updateOwnProfile } from "@/app/actions/users"
import { cn } from "@/lib/utils"
import { departmentsData } from "@/lib/departments"
import { useTranslations } from "next-intl"

export default function SettingsClient({ initialUser }: { initialUser: any }) {
    const t = useTranslations("Settings")
    
    // Consent states
    const [orumConsent, setOrumConsent] = useState(initialUser.consenso_marketing_orum)
    const [morganaConsent, setMorganaConsent] = useState(initialUser.consenso_marketing_morgana)
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Profile states
    const [name, setName] = useState(initialUser.name || "")
    const [surname, setSurname] = useState(initialUser.surname || "")
    const [email, setEmail] = useState(initialUser.email || "")
    const [matricola, setMatricola] = useState(initialUser.matricola || "")
    const [birthDate, setBirthDate] = useState(initialUser.birthDate || "")
    const [department, setDepartment] = useState(initialUser.department || "")
    const [degreeCourse, setDegreeCourse] = useState(initialUser.degreeCourse || "")
    const [isFuorisede, setIsFuorisede] = useState(initialUser.isFuorisede ? "yes" : "no")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isProfilePending, startProfileTransition] = useTransition()
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileMessage(null)

        if (password && password !== confirmPassword) {
            setProfileMessage({ type: 'error', text: "Le password non corrispondono." })
            return
        }

        startProfileTransition(async () => {
            const res = await updateOwnProfile({
                name,
                surname,
                email,
                matricola,
                birthDate,
                department,
                degreeCourse,
                isFuorisede: isFuorisede === "yes",
                password: password || undefined
            })

            if (res.success) {
                setProfileMessage({ type: 'success', text: t("profile_success") })
                setPassword("")
                setConfirmPassword("")
                setTimeout(() => setProfileMessage(null), 3000)
            } else {
                setProfileMessage({ type: 'error', text: res.error || t("profile_error") })
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
        if (confirm(t("delete_confirm"))) {
            const res = await deleteOwnAccount()
            if (res.success) {
                window.location.href = "/"
            } else {
                alert(t("delete_error"))
            }
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">{t("title")}</h1>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">{t("desc")}</p>
            </div>

            {message && (
                <div className={cn(
                    "p-4.5 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm font-bold text-sm",
                    message.type === 'success' ? "bg-green-50 border-green-200/50 text-green-700" : "bg-red-50 border-red-200/50 text-red-700"
                )}>
                    {message.type === 'success' && <CheckCircle2 className="size-5 shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Edit & Privacy & Marketing */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Details Edit Form */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 rounded-2xl bg-gradient-to-tr from-[#c9041a] to-[#18182e] text-white flex items-center justify-center shadow-md">
                                <User className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-foreground tracking-tight">{t("profile_title")}</h2>
                                <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">{t("profile_desc")}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">{t("profile_name")}</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">{t("profile_surname")}</label>
                                    <input
                                        type="text"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        required
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">{t("profile_email")}</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">{t("profile_birthdate")}</label>
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        required
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Matricola</label>
                                    <input
                                        type="text"
                                        value={matricola}
                                        onChange={(e) => setMatricola(e.target.value)}
                                        required
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">{t("profile_fuorisede")}</label>
                                    <select
                                        value={isFuorisede}
                                        onChange={(e) => setIsFuorisede(e.target.value)}
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    >
                                        <option value="no">No, Residente</option>
                                        <option value="yes">Sì, Fuorisede</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">{t("profile_department")}</label>
                                    <select
                                        value={department}
                                        onChange={(e) => {
                                            setDepartment(e.target.value)
                                            setDegreeCourse("") // Reset course
                                        }}
                                        required
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    >
                                        <option value="">Seleziona Dipartimento...</option>
                                        {Object.keys(departmentsData).map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">{t("profile_degree")}</label>
                                    <select
                                        value={degreeCourse}
                                        onChange={(e) => setDegreeCourse(e.target.value)}
                                        required
                                        disabled={!department}
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all disabled:opacity-50"
                                    >
                                        <option value="">Seleziona Corso...</option>
                                        {(() => {
                                            const courses = department ? departmentsData[department] : []
                                            const triennali = courses.filter(c => c.includes("(L-") || c.includes("(L/"))
                                            const magistrali = courses.filter(c => c.includes("(LM-"))
                                            const altri = courses.filter(c => !c.includes("(L-") && !c.includes("(L/") && !c.includes("(LM-"))

                                            return (
                                                <>
                                                    {triennali.length > 0 && (
                                                        <optgroup label="--- TRIENNALI ---">
                                                            {triennali.map(course => (
                                                                <option key={course} value={course}>{course}</option>
                                                            ))}
                                                        </optgroup>
                                                    )}
                                                    {magistrali.length > 0 && (
                                                        <optgroup label="--- MAGISTRALI ---">
                                                            {magistrali.map(course => (
                                                                <option key={course} value={course}>{course}</option>
                                                            ))}
                                                        </optgroup>
                                                    )}
                                                    {altri.length > 0 && (
                                                        <optgroup label="--- ALTRI (Ciclo Unico / Master) ---">
                                                            {altri.map(course => (
                                                                <option key={course} value={course}>{course}</option>
                                                            ))}
                                                        </optgroup>
                                                    )}
                                                </>
                                            )
                                        })()}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">{t("profile_password")}</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Conferma Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full p-4 rounded-xl border border-slate-150 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#c9041a]/20 focus:border-[#c9041a] text-sm font-semibold transition-all"
                                    />
                                </div>
                            </div>

                            {profileMessage && (
                                <div className={cn(
                                    "p-4.5 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm font-bold text-sm",
                                    profileMessage.type === 'success' ? "bg-green-50 border-green-200/50 text-green-700" : "bg-red-50 border-red-200/50 text-red-700"
                                )}>
                                    {profileMessage.type === 'success' && <CheckCircle2 className="size-5 shrink-0" />}
                                    <span>{profileMessage.text}</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isProfilePending}
                                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#c9041a] to-[#18182e] hover:from-[#b10317] hover:to-[#121223] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                                >
                                    {isProfilePending ? <Loader2 className="size-4 animate-spin" /> : t("profile_save")}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Privacy & Marketing */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 rounded-2xl bg-gradient-to-tr from-[#c9041a] to-[#18182e] text-white flex items-center justify-center shadow-md">
                                <Shield className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-foreground tracking-tight">{t("privacy_title")}</h2>
                                <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">{t("gdpr_badge")}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-150 group hover:bg-white hover:shadow-md transition-all duration-300">
                                <div className="space-y-1">
                                    <h3 className="font-extrabold text-zinc-850 text-base sm:text-lg tracking-tight">{t("orum_mktg")}</h3>
                                    <p className="text-xs text-zinc-500 max-w-sm font-medium">
                                        {t("orum_mktg_desc")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setOrumConsent(!orumConsent)}
                                    className={cn(
                                        "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner",
                                        orumConsent ? "bg-[#c9041a]" : "bg-[#18182e]"
                                    )}
                                >
                                    <span className={cn(
                                        "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                        orumConsent ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-150 group hover:bg-white hover:shadow-md transition-all duration-300">
                                <div className="space-y-1">
                                    <h3 className="font-extrabold text-zinc-850 text-base sm:text-lg tracking-tight">{t("morgana_mktg")}</h3>
                                    <p className="text-xs text-zinc-500 max-w-sm font-medium">
                                        {t("morgana_mktg_desc")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setMorganaConsent(!morganaConsent)}
                                    className={cn(
                                        "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner",
                                        morganaConsent ? "bg-[#c9041a]" : "bg-[#18182e]"
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
                                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#c9041a] to-[#18182e] hover:from-[#b10317] hover:to-[#121223] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                                >
                                    {isPending ? <Loader2 className="size-4 animate-spin" /> : t("save_prefs")}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Personal Data Info */}
                    <div className="bg-gradient-to-br from-[#18182e] via-[#0d0d17] to-[#18182e] rounded-[2rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden group border border-slate-800">
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
                                className="px-8 py-4 bg-white text-[#18182e] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-50 transition-all flex items-center gap-3 shrink-0 shadow-lg hover:shadow-xl active:scale-95 border border-white/10"
                            >
                                <Download className="size-4 text-[#18182e]" />
                                <span className="text-[#18182e] font-bold">{t("export_button")}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] border border-red-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 rounded-2xl bg-red-50 text-[#c9041a] flex items-center justify-center border border-red-100 shadow-sm">
                                <Trash2 className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-foreground tracking-tight">{t("danger_zone")}</h2>
                                <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase mt-0.5">{t("danger_desc")}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-red-50/40 rounded-2xl border border-red-100">
                                <div className="flex items-start gap-3 text-red-700 mb-6">
                                    <AlertTriangle className="size-5 shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold leading-relaxed">
                                        {t("delete_warning")}
                                    </p>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full py-4 bg-white text-[#c9041a] border border-red-100 hover:border-red-200 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#c9041a] hover:text-white transition-all shadow-sm active:scale-95"
                                >
                                    {t("delete_button")}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
