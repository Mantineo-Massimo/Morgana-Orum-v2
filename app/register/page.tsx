
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerUser } from "@/app/actions/auth"
import { ArrowRight, Loader2 } from "lucide-react"
import { departmentsData } from "../../lib/departments"

export const dynamic = "force-dynamic"

export default function Page() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [selectedDept, setSelectedDept] = useState("")

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        // Hidden field or default for association
        formData.append("association", "morgana & orum")

        const result = await registerUser(formData)

        if (result.success) {
            router.push(`/${"morgana"}/dashboard`)
        } else {
            setError(result.error || "Qualcosa è andato storto.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100 my-10">
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold text-foreground">Unisciti alla community di Orum e Morgana!</h1>
                    <p className="text-sm text-zinc-500 mt-1">Sempre dalla parte dello studente</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nome</label>
                            <input name="name" type="text" required placeholder="Mario" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Cognome</label>
                            <input name="surname" type="text" required placeholder="Rossi" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Data di Nascita</label>
                        <input name="birthDate" type="date" required className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Email</label>
                        <input name="email" type="email" required placeholder="mario.rossi@studenti.unime.it" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Password</label>
                        <input name="password" type="password" required placeholder="••••••••" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Matricola</label>
                            <input name="matricola" type="text" required placeholder="123456" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Fuorisede?</label>
                            <select name="isFuorisede" className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm">
                                <option value="no">No, Residente</option>
                                <option value="yes">Sì, Fuorisede</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Dipartimento</label>
                        <select
                            name="department"
                            required
                            className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="">Seleziona Dipartimento...</option>
                            {Object.keys(departmentsData).map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Corso di Laurea</label>
                        <select
                            name="degreeCourse"
                            required
                            disabled={!selectedDept}
                            className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm disabled:opacity-50"
                        >
                            <option value="">Seleziona Corso...</option>
                            {(() => {
                                const courses = selectedDept ? departmentsData[selectedDept] : []
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



                    {/* Removed Association Field as requested */}

                    <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                            <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 shrink-0" />
                            <span className="text-[11px] text-zinc-600 leading-snug">
                                Dichiaro di aver letto e compreso l&apos;informativa sulla privacy e accetto il trattamento dei miei dati personali.*
                            </span>
                        </label>
                        <label className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                            <input name="newsletter" value="yes" type="checkbox" className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 shrink-0" />
                            <span className="text-[11px] text-zinc-600 leading-snug">
                                Avvisami sulle nuove convenzioni, feste o scadenze tramite email (Opzionale).
                            </span>
                        </label>
                    </div>

                    {error && <p className="text-sm text-red-500 font-bold text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin size-5" /> : <>Crea Account <ArrowRight className="size-5" /></>}
                    </button>
                </form>

                <p className="text-center text-xs text-zinc-400 mt-6">
                    Hai già un account? <Link href={`/${"morgana"}/login`} className="underline hover:text-foreground">Accedi</Link>
                </p>
            </div>
        </div>
    )
}
