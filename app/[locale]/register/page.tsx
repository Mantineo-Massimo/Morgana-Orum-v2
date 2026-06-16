
"use client"

import { useState } from "react"
import { useRouter, Link } from "@/i18n/routing"
import { registerUser } from "@/app/actions/auth"
import { ArrowRight, Loader2 } from "lucide-react"
import { departmentsData } from "@/lib/departments"

export const dynamic = "force-dynamic"

import { useTranslations } from "next-intl"

export default function Page() {
    const tPrivacy = useTranslations("Privacy")
    const tAuth = useTranslations("Auth")
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
    const [error, setError] = useState("")
    const [selectedDept, setSelectedDept] = useState("")

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        if (password !== confirmPassword) {
            setError(tAuth("passwords_mismatch"))
            setIsLoading(false)
            return
        }

        // Hidden field or default for association
        formData.append("association", "MORGANA_ORUM")

        const result = await registerUser(formData)

        if (result.success) {
            setIsRegistered(true)
        } else {
            setError(result.error || tAuth("something_wrong"))
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-4 md:p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-zinc-100 my-10">
                {isRegistered ? (
                    <div className="text-center space-y-6 py-6 animate-in fade-in duration-500">
                        <div className="size-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                            <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Registrazione Inviata</h1>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                {tAuth("register_success_verify")}
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="block w-full py-4 bg-[#18182e] hover:bg-black text-white font-bold rounded-xl transition-all text-center"
                        >
                            {tAuth("login_btn")}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">{tAuth("register_title")}</h1>
                            <p className="text-xs md:text-sm text-zinc-500 mt-1 uppercase font-bold tracking-widest">{tAuth("register_subtitle")}</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("name_label")}</label>
                                    <input name="name" type="text" required placeholder="Mario" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("surname_label")}</label>
                                    <input name="surname" type="text" required placeholder="Rossi" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("birthdate_label")}</label>
                                <input name="birthDate" type="date" required className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("email_label_register")}</label>
                                <input name="email" type="email" required placeholder="mario.rossi@studenti.unime.it" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("password_label")}</label>
                                <input name="password" type="password" required placeholder="••••••••" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("confirm_password_label")}</label>
                                <input name="confirmPassword" type="password" required placeholder="••••••••" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("matricola_label")}</label>
                                    <input name="matricola" type="text" required placeholder="123456" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("fuorisede_label")}</label>
                                    <select name="isFuorisede" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm">
                                        <option value="no">{tAuth("fuorisede_no")}</option>
                                        <option value="yes">{tAuth("fuorisede_yes")}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("department_label")}</label>
                                <select
                                    name="department"
                                    required
                                    className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                >
                                    <option value="">{tAuth("department_select")}</option>
                                    {Object.keys(departmentsData).map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">{tAuth("course_label")}</label>
                                <select
                                    name="degreeCourse"
                                    required
                                    disabled={!selectedDept}
                                    className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm disabled:opacity-50"
                                >
                                    <option value="">{tAuth("course_select")}</option>
                                    {(() => {
                                        const courses = selectedDept ? departmentsData[selectedDept] : []
                                        const triennali = courses.filter(c => c.includes("(L-") || c.includes("(L/"))
                                        const magistrali = courses.filter(c => c.includes("(LM-"))
                                        const altri = courses.filter(c => !c.includes("(L-") && !c.includes("(L/") && !c.includes("(LM-"))

                                        return (
                                            <>
                                                {triennali.length > 0 && (
                                                    <optgroup label={tAuth("triennali")}>
                                                        {triennali.map(course => (
                                                            <option key={course} value={course}>{course}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                                {magistrali.length > 0 && (
                                                    <optgroup label={tAuth("magistrali")}>
                                                        {magistrali.map(course => (
                                                            <option key={course} value={course}>{course}</option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                                {altri.length > 0 && (
                                                    <optgroup label={tAuth("altri")}>
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



                            <div className="space-y-4 pt-2">
                                            <label className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-colors">
                                                <input type="checkbox" required name="accettazione_termini_condivisi" value="yes" className="mt-1 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                                                <p className="text-[11px] text-zinc-600 leading-snug">
                                                    {tPrivacy("accept_privacy_start")}<Link href="/privacy" className="underline font-bold text-foreground">{tPrivacy("privacy_policy")}</Link>{tPrivacy("accept_privacy_end")}
                                                </p>
                                            </label>

                                            <label className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-colors">
                                                <input type="checkbox" name="consenso_marketing_morgana" value="yes" className="mt-1 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                                                <span className="text-[11px] text-zinc-600 leading-snug">
                                                    {tPrivacy("consent_morgana")}
                                                </span>
                                            </label>

                                            <label className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-colors">
                                                <input type="checkbox" name="consenso_marketing_orum" value="yes" className="mt-1 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                                                <span className="text-[11px] text-zinc-600 leading-snug">
                                                    {tPrivacy("consent_orum")}
                                                </span>
                                            </label>
                                        </div>

                            {error && <p className="text-sm text-red-500 font-bold text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-[#18182e] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin size-5" /> : <>{tAuth("create_account_btn")} <ArrowRight className="size-5" /></>}
                            </button>
                        </form>

                        <p className="text-center text-xs text-zinc-400 mt-6">
                            {tAuth("has_account")} <Link href={`/login`} className="underline hover:text-foreground">{tAuth("login_btn")}</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
