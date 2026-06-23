"use client"

import { useState, useMemo } from "react"
import { ShieldCheck, HelpCircle, Info, BookOpen, AlertTriangle, CheckCircle2, XCircle, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErsuMeritCheckerProps {
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Verificatore Requisiti ERSU (Borsa di Studio)",
        subtitle: "Verifica se sei in linea con i criteri di merito richiesti dall'ERSU Messina per mantenere la borsa di studio o l'alloggio.",
        courseTypeLabel: "Tipo di Corso",
        triennale: "Laurea Triennale (3 anni)",
        magistrale: "Laurea Magistrale (2 anni)",
        cicloUnico5: "Ciclo Unico (5 anni)",
        cicloUnico6: "Ciclo Unico (6 anni)",
        yearLabel: "Anno di corso per cui richiedi la borsa",
        cfuEarnedLabel: "CFU conseguiti entro il 10 Agosto",
        cfuFirstYearLabel: "CFU conseguiti entro il 30 Novembre",
        disabilityLabel: "Studente con DSA / Disabilità ≥ 66%",
        disabilityHelp: "I requisiti di merito sono ridotti del 40% (richiesto il 60% dei CFU, arrotondato per difetto) ai sensi delle eccezioni regolamentari ERSU Messina.",
        bonusUsedLabel: "CFU di Bonus già utilizzati in passato",
        calculateBtn: "Verifica Requisiti",
        resultsTitle: "Esito della Verifica",
        eligibleStatus: "IDONEO",
        eligibleBonusStatus: "IDONEO CON BONUS",
        notEligibleStatus: "NON IDONEO",
        requiredCfu: "CFU minimi richiesti dal bando",
        cfuEarned: "CFU effettivamente conseguiti",
        bonusRequired: "CFU di bonus da utilizzare",
        bonusAvailable: "Tuo bonus massimo disponibile",
        bonusRemaining: "Bonus rimanente per anni successivi",
        successMsg: "Complimenti! Soddisfi i requisiti di merito per la borsa di studio.",
        bonusSuccessMsg: "Soddisfi i requisiti di merito solo utilizzando i crediti bonus accumulati.",
        failureMsg: "Non soddisfi i requisiti di merito richiesti. Non hai CFU a sufficienza, neanche applicando il bonus.",
        disclaimer: "Nota: Questo strumento fornisce una stima basata sul bando ERSU Messina. L'idoneità ufficiale viene stabilita esclusivamente dall'Ente in fase di istruttoria tramite i dati di Esse3.",
        firstYearNoteTitle: "Nota per gli immatricolati (1° Anno)",
        firstYearNoteDesc: "Per il primo anno l'assegnazione iniziale si basa solo sul reddito (ISEE/ISPE). Il requisito di merito (20 CFU) viene verificato 'ex post' al 30 Novembre per ricevere la seconda rata e non incorrere nella revoca della borsa.",
        noBonusAllowedFirstYear: "Il bonus non può essere utilizzato per i requisiti del primo anno.",
        dsaApplied: "Riduzione DSA/Disabilità (40%) applicata correttamente."
    },
    en: {
        title: "ERSU Scholarship Merit Checker",
        subtitle: "Check if you meet the merit criteria required by ERSU Messina to maintain your scholarship or student housing.",
        courseTypeLabel: "Course Type",
        triennale: "Bachelor's Degree (3 years)",
        magistrale: "Master's Degree (2 years)",
        cicloUnico5: "Single Cycle (5 years)",
        cicloUnico6: "Single Cycle (6 years)",
        yearLabel: "Year of study you are applying for",
        cfuEarnedLabel: "CFUs earned by August 10th",
        cfuFirstYearLabel: "CFUs earned by November 30th",
        disabilityLabel: "Student with DSA / Disability ≥ 66%",
        disabilityHelp: "Merit requirements are reduced by 40% (only 60% of CFUs required, rounded down) under ERSU Messina exceptional regulations.",
        bonusUsedLabel: "Bonus CFUs previously used",
        calculateBtn: "Check Requirements",
        resultsTitle: "Verification Result",
        eligibleStatus: "ELIGIBLE",
        eligibleBonusStatus: "ELIGIBLE WITH BONUS",
        notEligibleStatus: "NOT ELIGIBLE",
        requiredCfu: "Minimum required CFUs",
        cfuEarned: "CFUs earned by you",
        bonusRequired: "Bonus CFUs to consume",
        bonusAvailable: "Your maximum available bonus",
        bonusRemaining: "Remaining bonus for future years",
        successMsg: "Congratulations! You meet the merit requirements for the scholarship.",
        bonusSuccessMsg: "You meet the merit requirements only by consuming your accumulated bonus credits.",
        failureMsg: "You do not meet the merit requirements. You do not have enough CFUs, even when applying the bonus.",
        disclaimer: "Note: This tool provides an estimation based on the ERSU Messina regulations. Official eligibility is determined solely by the institution during verification via Esse3 data.",
        firstYearNoteTitle: "Note for Freshmen (1st Year)",
        firstYearNoteDesc: "For the first year, the initial assignment is based only on income (ISEE/ISPE). The merit requirement (20 CFUs) is verified 'ex post' on November 30th to receive the second installment and avoid scholarship revocation.",
        noBonusAllowedFirstYear: "Bonus credits cannot be used for first year requirements.",
        dsaApplied: "DSA/Disability reduction (40%) applied correctly."
    }
}

export function ErsuMeritChecker({ locale }: ErsuMeritCheckerProps) {
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    const [courseType, setCourseType] = useState<"triennale" | "magistrale" | "cicloUnico5" | "cicloUnico6">("triennale")
    const [year, setYear] = useState<string>("2")
    const [cfu, setCfu] = useState<number>(30)
    const [isDisability, setIsDisability] = useState<boolean>(false)
    const [prevBonusUsed, setPrevBonusUsed] = useState<number>(0)

    // Dynamic course year selections
    const yearsOptions = useMemo(() => {
        switch (courseType) {
            case "triennale":
                return [
                    { val: "1", label: locale === "en" ? "1st Year (Freshmen)" : "1° Anno (Immatricolati)" },
                    { val: "2", label: locale === "en" ? "2nd Year" : "2° Anno" },
                    { val: "3", label: locale === "en" ? "3rd Year" : "3° Anno" },
                    { val: "ultimo_semestre", label: locale === "en" ? "1st Year Out-of-Course (Last Sem.)" : "1° Anno Fuori Corso (Ultimo Semestre)" }
                ]
            case "magistrale":
                return [
                    { val: "1", label: locale === "en" ? "1st Year (Freshmen)" : "1° Anno (Immatricolati)" },
                    { val: "2", label: locale === "en" ? "2nd Year" : "2° Anno" },
                    { val: "ultimo_semestre", label: locale === "en" ? "1st Year Out-of-Course (Last Sem.)" : "1° Anno Fuori Corso (Ultimo Semestre)" }
                ]
            case "cicloUnico5":
                return [
                    { val: "1", label: locale === "en" ? "1st Year (Freshmen)" : "1° Anno (Immatricolati)" },
                    { val: "2", label: locale === "en" ? "2nd Year" : "2° Anno" },
                    { val: "3", label: locale === "en" ? "3rd Year" : "3° Anno" },
                    { val: "4", label: locale === "en" ? "4th Year" : "4° Anno" },
                    { val: "5", label: locale === "en" ? "5th Year" : "5° Anno" },
                    { val: "ultimo_semestre", label: locale === "en" ? "1st Year Out-of-Course (Last Sem.)" : "1° Anno Fuori Corso (Ultimo Semestre)" }
                ]
            case "cicloUnico6":
                return [
                    { val: "1", label: locale === "en" ? "1st Year (Freshmen)" : "1° Anno (Immatricolati)" },
                    { val: "2", label: locale === "en" ? "2nd Year" : "2° Anno" },
                    { val: "3", label: locale === "en" ? "3rd Year" : "3° Anno" },
                    { val: "4", label: locale === "en" ? "4th Year" : "4° Anno" },
                    { val: "5", label: locale === "en" ? "5th Year" : "5° Anno" },
                    { val: "6", label: locale === "en" ? "6th Year" : "6° Anno" },
                    { val: "ultimo_semestre", label: locale === "en" ? "1st Year Out-of-Course (Last Sem.)" : "1° Anno Fuori Corso (Ultimo Semestre)" }
                ]
            default:
                return []
        }
    }, [courseType, locale])

    // Reset year selection on course type change to avoid out of bounds
    const handleCourseChange = (type: any) => {
        setCourseType(type)
        setYear("2") // Default to 2nd year
    }

    // Calculations
    const result = useMemo(() => {
        // 1. Determine base CFU required
        let baseRequired = 0
        if (year === "1") {
            baseRequired = 20 // November 30th
        } else {
            if (courseType === "magistrale") {
                if (year === "2") baseRequired = 30
                if (year === "ultimo_semestre") baseRequired = 80
            } else {
                // Triennale & Ciclo Unico
                if (year === "2") baseRequired = 25
                if (year === "3") baseRequired = 80
                if (year === "4") baseRequired = 135
                if (year === "5") baseRequired = 190
                if (year === "6") baseRequired = 245
                if (year === "ultimo_semestre") {
                    if (courseType === "triennale") baseRequired = 135
                    if (courseType === "cicloUnico5") baseRequired = 245
                    if (courseType === "cicloUnico6") baseRequired = 300
                }
            }
        }

        // 2. Adjust for Disability/DSA
        let finalRequired = baseRequired
        if (isDisability) {
            finalRequired = Math.floor(baseRequired * 0.6)
        }

        // 3. Determine max bonus based on year of study
        let maxBonus = 0
        if (year !== "1") {
            if (courseType === "magistrale") {
                maxBonus = 15 // Master's gets 15 CFU bonus
            } else {
                if (year === "2") maxBonus = 5
                if (year === "3") maxBonus = 12
                // 4th year and subsequent
                if (year === "4" || year === "5" || year === "6" || year === "ultimo_semestre") maxBonus = 15
            }
        }

        // Available bonus
        const availableBonus = Math.max(0, maxBonus - prevBonusUsed)
        const diff = finalRequired - cfu

        let status: "eligible" | "eligible_bonus" | "not_eligible" = "not_eligible"
        let bonusUsed = 0

        if (diff <= 0) {
            status = "eligible"
        } else if (year !== "1" && diff <= availableBonus) {
            status = "eligible_bonus"
            bonusUsed = diff
        } else {
            status = "not_eligible"
        }

        const remainingBonus = Math.max(0, availableBonus - bonusUsed)

        return {
            requiredCfu: finalRequired,
            isDisabilityApplied: isDisability,
            maxBonusAllowed: maxBonus,
            availableBonus,
            bonusUsed,
            remainingBonus,
            status,
            diff
        }
    }, [courseType, year, cfu, isDisability, prevBonusUsed])

    return (
        <div className="w-full max-w-full overflow-hidden bg-zinc-50/50 rounded-[2rem] border border-zinc-200/50 p-4 md:p-8 space-y-8 shadow-inner text-zinc-950">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200/60">
                <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 rounded-2xl bg-[#18182e] text-white flex items-center justify-center shadow-lg shadow-zinc-200">
                        <ShieldCheck className="size-6" />
                    </div>
                    <div>
                        <h3 className="font-serif font-black text-xl text-zinc-900 uppercase tracking-tight">{t.title}</h3>
                        <p className="text-xs text-zinc-500 font-medium">{t.subtitle}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Inputs Column */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200/60 shadow-sm space-y-5">
                    {/* Course Type */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-600">{t.courseTypeLabel}</label>
                        <select
                            value={courseType}
                            onChange={(e) => handleCourseChange(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 outline-none text-xs font-bold bg-white"
                        >
                            <option value="triennale">{t.triennale}</option>
                            <option value="magistrale">{t.magistrale}</option>
                            <option value="cicloUnico5">{t.cicloUnico5}</option>
                            <option value="cicloUnico6">{t.cicloUnico6}</option>
                        </select>
                    </div>

                    {/* Course Year */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-600">{t.yearLabel}</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 outline-none text-xs font-bold bg-white"
                        >
                            {yearsOptions.map((opt) => (
                                <option key={opt.val} value={opt.val}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* CFUs Completed */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-600">
                            {year === "1" ? t.cfuFirstYearLabel : t.cfuEarnedLabel}
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="360"
                            value={cfu || ""}
                            onChange={(e) => setCfu(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 outline-none text-xs font-bold"
                        />
                    </div>

                    {/* DSA / Disability Toggle */}
                    <div className="pt-2">
                        <label className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-200/40 rounded-xl cursor-pointer hover:bg-zinc-100/60 transition-all">
                            <input
                                type="checkbox"
                                checked={isDisability}
                                onChange={(e) => setIsDisability(e.target.checked)}
                                className="mt-0.5 rounded text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                            />
                            <div className="space-y-0.5">
                                <span className="text-xs font-bold text-zinc-700 block">{t.disabilityLabel}</span>
                                <span className="text-[10px] text-zinc-400 leading-normal block">{t.disabilityHelp}</span>
                            </div>
                        </label>
                    </div>

                    {/* Previous Bonus Usage (only if not first year) */}
                    {year !== "1" && (
                        <div className="space-y-1.5 pt-1 border-t border-zinc-100">
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-xs font-bold text-zinc-600">{t.bonusUsedLabel}</label>
                                <span className="text-[10px] text-zinc-400 font-bold">Max 15 CFU</span>
                            </div>
                            <input
                                type="number"
                                min="0"
                                max="15"
                                value={prevBonusUsed || ""}
                                onChange={(e) => setPrevBonusUsed(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 outline-none text-xs font-bold"
                            />
                        </div>
                    )}
                </div>

                {/* Results Column */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Status Box */}
                    <div className={cn(
                        "p-6 rounded-2xl border-2 flex gap-4 items-start shadow-sm transition-all",
                        result.status === "eligible" && "bg-emerald-50/50 border-emerald-500/30 text-emerald-950",
                        result.status === "eligible_bonus" && "bg-amber-50/60 border-amber-500/30 text-amber-950",
                        result.status === "not_eligible" && "bg-rose-50/50 border-rose-500/30 text-rose-950"
                    )}>
                        <div className="shrink-0 mt-0.5">
                            {result.status === "eligible" && <CheckCircle2 className="size-8 text-emerald-600" />}
                            {result.status === "eligible_bonus" && <Award className="size-8 text-amber-600" />}
                            {result.status === "not_eligible" && <XCircle className="size-8 text-rose-600" />}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
                                    {t.resultsTitle}
                                </span>
                                <span className={cn(
                                    "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                    result.status === "eligible" && "bg-emerald-100 text-emerald-800",
                                    result.status === "eligible_bonus" && "bg-amber-100 text-amber-800",
                                    result.status === "not_eligible" && "bg-rose-100 text-rose-800"
                                )}>
                                    {result.status === "eligible" && t.eligibleStatus}
                                    {result.status === "eligible_bonus" && t.eligibleBonusStatus}
                                    {result.status === "not_eligible" && t.notEligibleStatus}
                                </span>
                            </div>
                            <p className="text-sm font-semibold leading-relaxed">
                                {result.status === "eligible" && t.successMsg}
                                {result.status === "eligible_bonus" && t.bonusSuccessMsg}
                                {result.status === "not_eligible" && t.failureMsg}
                            </p>
                        </div>
                    </div>

                    {/* Breakdown details */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/60 shadow-sm space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-100">
                            {locale === "en" ? "CALCULATION DETAILS" : "DETTAGLIO CALCOLO"}
                        </h4>

                        <div className="divide-y divide-zinc-50 text-xs">
                            <div className="flex justify-between py-2.5">
                                <span className="text-zinc-500 font-medium">{t.requiredCfu}</span>
                                <span className="font-bold text-zinc-900 font-mono">{result.requiredCfu} CFU</span>
                            </div>
                            <div className="flex justify-between py-2.5">
                                <span className="text-zinc-500 font-medium">{t.cfuEarned}</span>
                                <span className="font-bold text-zinc-900 font-mono">{cfu} CFU</span>
                            </div>
                            {year !== "1" && (
                                <>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-zinc-500 font-medium">{t.bonusRequired}</span>
                                        <span className={cn(
                                            "font-bold font-mono",
                                            result.bonusUsed > 0 ? "text-amber-600" : "text-zinc-900"
                                        )}>{result.bonusUsed} CFU</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-zinc-500 font-medium">{t.bonusAvailable}</span>
                                        <span className="font-bold text-zinc-900 font-mono">{result.availableBonus} CFU ({locale === "en" ? "of" : "su"} {result.maxBonusAllowed})</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-zinc-500 font-medium">{t.bonusRemaining}</span>
                                        <span className="font-bold text-zinc-900 font-mono text-emerald-600">{result.remainingBonus} CFU</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* DSA / Disability tag */}
                        {isDisability && (
                            <div className="flex items-center gap-1.5 p-2.5 bg-sky-50 border border-sky-100 rounded-xl text-[10px] font-bold text-sky-700">
                                <Info className="size-3.5 shrink-0" />
                                {t.dsaApplied}
                            </div>
                        )}

                        {/* First year reminder */}
                        {year === "1" && (
                            <div className="flex gap-2 p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-[10px] font-semibold text-amber-800 leading-relaxed">
                                <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                                <div>
                                    <strong className="block font-bold mb-0.5">{t.firstYearNoteTitle}</strong>
                                    {t.firstYearNoteDesc}
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-[10px] text-zinc-400 italic flex items-start gap-1.5 leading-relaxed px-1">
                        <Info className="size-3.5 shrink-0 mt-0.5" />
                        {t.disclaimer}
                    </p>
                </div>
            </div>
        </div>
    )
}
