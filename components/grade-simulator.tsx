"use client"

import { useState, useMemo, useEffect } from "react"
import { Calculator, Plus, Trash2, BookOpen, Sparkles, GraduationCap, Info, HelpCircle, Save, Cloud, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { saveGradeSimulation, getGradeSimulation } from "@/app/actions/simulation"

interface GradeSimulatorProps {
    locale: string
    isLoggedIn?: boolean
}

interface Exam {
    id: string
    name: string
    grade: number | "30L"
    cfu: number
    isPassedOnly: boolean // True if it's a pass/fail (idoneità) that doesn't count towards GPA
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Simulatore Media & Voto di Laurea",
        subtitle: "Calcola la tua media ponderata e aritmetica, visualizza la progressione dei CFU e stima il tuo voto di partenza per la laurea.",
        targetLabel: "Target CFU Laurea",
        triennale: "Triennale (180 CFU)",
        magistrale: "Magistrale (120 CFU)",
        personalizzato: "Personalizzato",
        customTargetHelp: "Inserisci CFU target:",
        addExamTitle: "Aggiungi Insegnamento / Esame",
        examNamePlaceholder: "Es: Programmazione I (opzionale)",
        gradeLabel: "Voto",
        cfuLabel: "CFU",
        isPassedOnlyLabel: "Solo Idoneità (no media)",
        addBtn: "Aggiungi Esame",
        lodeBonusLabel: "Valuta 30 e Lode come 31",
        thesisBonusLabel: "Punti Tesi previsti (0-8)",
        averagesTitle: "Riepilogo Aritmetico & Ponderato",
        weightedAvg: "Media Ponderata",
        arithmeticAvg: "Media Aritmetica",
        cfuAcquired: "CFU Acquisiti",
        startingMarkLabel: "Voto di Partenza Laurea",
        projectedMarkLabel: "Voto Finale Stimato",
        tableTitle: "Libretto Esami Simulato",
        noExams: "Nessun esame inserito nella simulazione. Aggiungine uno qui sopra per iniziare!",
        lodeNote: "Nota: le idoneità approvate aumentano i CFU ma sono escluse dal calcolo della media.",
        delete: "Elimina",
        saveBtn: "Salva nel Cloud",
        saving: "Salvataggio...",
        saveSuccess: "Simulazione salvata!",
        saveError: "Errore durante il salvataggio",
        loadError: "Impossibile caricare la simulazione",
        notLoggedInAlert: "Accedi al tuo account per salvare la tua simulazione online!",
        loggedInAlert: "I tuoi voti sono sincronizzati con il tuo account."
    },
    en: {
        title: "GPA & Graduation Grade Simulator",
        subtitle: "Calculate your weighted and arithmetic GPA, track your completed ECTS/CFU, and estimate your starting graduation mark.",
        targetLabel: "Graduation ECTS/CFU Target",
        triennale: "Bachelor's (180 ECTS)",
        magistrale: "Master's (120 ECTS)",
        personalizzato: "Custom",
        customTargetHelp: "Enter target ECTS:",
        addExamTitle: "Add Subject / Exam",
        examNamePlaceholder: "e.g., Computer Programming (optional)",
        gradeLabel: "Grade",
        cfuLabel: "CFU / ECTS",
        isPassedOnlyLabel: "Pass/Fail only (no GPA impact)",
        addBtn: "Add Exam",
        lodeBonusLabel: "Count 30 cum Laude as 31",
        thesisBonusLabel: "Expected Thesis Points (0-8)",
        averagesTitle: "GPA Summary Details",
        weightedAvg: "Weighted GPA",
        arithmeticAvg: "Arithmetic GPA",
        cfuAcquired: "ECTS Earned",
        startingMarkLabel: "Starting Graduation Mark",
        projectedMarkLabel: "Projected Final Grade",
        tableTitle: "Simulated Transcripts",
        noExams: "No exams added yet. Add one above to start simulating your grades!",
        lodeNote: "Note: Pass/Fail courses count towards ECTS but are excluded from average GPA calculations.",
        delete: "Delete",
        saveBtn: "Save to Cloud",
        saving: "Saving...",
        saveSuccess: "Simulation saved!",
        saveError: "Failed to save simulation",
        loadError: "Failed to load simulation",
        notLoggedInAlert: "Log in to save your grades and GPA online!",
        loggedInAlert: "Your grades are synced with your account."
    }
}

export function GradeSimulator({ locale, isLoggedIn = false }: GradeSimulatorProps) {
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    // Target presets
    const [targetType, setTargetType] = useState<"180" | "120" | "custom">("180")
    const [customTarget, setCustomTarget] = useState<number>(180)

    const targetCfus = useMemo(() => {
        if (targetType === "180") return 180
        if (targetType === "120") return 120
        return customTarget
    }, [targetType, customTarget])

    // Exam lists state
    const [exams, setExams] = useState<Exam[]>([])

    // New Exam Form
    const [name, setName] = useState("")
    const [grade, setGrade] = useState<number | "30L">(26)
    const [cfu, setCfu] = useState<number>(6)
    const [isPassedOnly, setIsPassedOnly] = useState(false)

    // Extras
    const [lodeAs31, setLodeAs31] = useState(false)
    const [thesisPoints, setThesisPoints] = useState<number>(5)

    // Loading & Saving state
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState("")
    const [saveStatus, setSaveStatus] = useState<null | "success" | "error">(null)

    // Load simulation from DB on mount
    useEffect(() => {
        if (isLoggedIn) {
            const loadData = async () => {
                setIsLoadingData(true)
                try {
                    const res = await getGradeSimulation()
                    if (res.success && res.simulation) {
                        const sim = res.simulation
                        setExams(sim.exams || [])
                        setTargetType(sim.targetType as any || "180")
                        if (sim.targetType === "custom") {
                            setCustomTarget(sim.targetCfu || 180)
                        }
                        setLodeAs31(sim.lodeAs31 || false)
                        setThesisPoints(sim.thesisPoints || 5)
                    }
                } catch (err) {
                    console.error("Failed to load simulation data", err)
                } finally {
                    setIsLoadingData(false)
                }
            }
            loadData()
        }
    }, [isLoggedIn])

    // Save simulation to DB
    const handleSaveSimulation = async () => {
        if (!isLoggedIn) return
        setIsSaving(true)
        setSaveMessage("")
        setSaveStatus(null)
        try {
            const res = await saveGradeSimulation({
                exams,
                targetCfu: targetCfus,
                targetType,
                lodeAs31,
                thesisPoints
            })
            if (res.success) {
                setSaveStatus("success")
                setSaveMessage(t.saveSuccess)
                setTimeout(() => {
                    setSaveMessage("")
                    setSaveStatus(null)
                }, 3000)
            } else {
                setSaveStatus("error")
                setSaveMessage(res.error || t.saveError)
            }
        } catch (err: any) {
            setSaveStatus("error")
            setSaveMessage(err.message || t.saveError)
        } finally {
            setIsSaving(false)
        }
    }

    // Handlers
    const handleAddExam = (e: React.FormEvent) => {
        e.preventDefault()
        const newExam: Exam = {
            id: Date.now().toString(),
            name: name.trim() || `Esame #${exams.length + 1}`,
            grade: isPassedOnly ? 30 : grade, // Grade doesn't matter for idoneità, but we pass a fallback
            cfu,
            isPassedOnly
        }
        setExams(prev => [...prev, newExam])
        setName("")
        setIsPassedOnly(false)
    }

    const handleDeleteExam = (id: string) => {
        setExams(prev => prev.filter(ex => ex.id !== id))
    }

    // Calculations
    const calculations = useMemo(() => {
        let totalCfuWithGrade = 0
        let totalCfuAcquired = 0
        let weightedGradeSum = 0
        let arithmeticGradeSum = 0
        let gradedExamsCount = 0

        exams.forEach(ex => {
            totalCfuAcquired += ex.cfu
            if (!ex.isPassedOnly) {
                totalCfuWithGrade += ex.cfu
                gradedExamsCount++
                
                let numericGrade = 0
                if (ex.grade === "30L") {
                    numericGrade = lodeAs31 ? 31 : 30
                } else {
                    numericGrade = ex.grade
                }

                weightedGradeSum += numericGrade * ex.cfu
                arithmeticGradeSum += numericGrade
            }
        })

        const weightedAvg = totalCfuWithGrade > 0 ? (weightedGradeSum / totalCfuWithGrade) : 0
        const arithmeticAvg = gradedExamsCount > 0 ? (arithmeticGradeSum / gradedExamsCount) : 0
        const startingMark = weightedAvg * 11 / 3
        const finalMark = Math.min(110, startingMark + thesisPoints)

        return {
            weightedAvg: Math.round(weightedAvg * 100) / 100,
            arithmeticAvg: Math.round(arithmeticAvg * 100) / 100,
            totalCfuAcquired,
            startingMark: Math.round(startingMark * 100) / 100,
            finalMark: Math.round(finalMark * 100) / 100
        }
    }, [exams, lodeAs31, thesisPoints])

    if (isLoadingData) {
        return (
            <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-200/50 p-12 flex flex-col items-center justify-center space-y-4 text-zinc-500 shadow-inner min-h-[400px]">
                <Loader2 className="size-8 animate-spin text-zinc-900" />
                <p className="text-xs font-bold uppercase tracking-wider">{locale === "en" ? "Loading simulated data..." : "Caricamento simulazione..."}</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-full overflow-hidden bg-zinc-50/50 rounded-[2rem] border border-zinc-200/50 p-4 md:p-8 space-y-8 shadow-inner text-zinc-950">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200/60">
                <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-200">
                        <GraduationCap className="size-6" />
                    </div>
                    <div>
                        <h3 className="font-serif font-black text-xl text-zinc-900 uppercase tracking-tight">{t.title}</h3>
                        <p className="text-xs text-zinc-500 font-medium">{t.subtitle}</p>
                    </div>
                </div>

                {/* Cloud Sync Status / Save Button */}
                <div className="flex items-center gap-3 self-end md:self-center">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            {saveMessage && (
                                <span className={cn(
                                    "text-xs font-bold flex items-center gap-1",
                                    saveStatus === "success" ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {saveStatus === "success" ? <Check className="size-4" /> : <Info className="size-4" />}
                                    {saveMessage}
                                </span>
                            )}
                            <button
                                onClick={handleSaveSimulation}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-75"
                            >
                                {isSaving ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    <Cloud className="size-3.5" />
                                )}
                                {isSaving ? t.saving : t.saveBtn}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-[10px] font-bold text-amber-700 max-w-xs md:max-w-sm leading-relaxed shadow-sm">
                            <Info className="size-3.5 shrink-0" />
                            <span>{t.notLoggedInAlert}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Target Selectors */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/60 shadow-sm space-y-4">
                <div>
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-500 block mb-2">
                        {t.targetLabel}
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                        {[
                            { id: "180", label: t.triennale },
                            { id: "120", label: t.magistrale },
                            { id: "custom", label: t.personalizzato }
                        ].map(preset => (
                            <button
                                key={preset.id}
                                onClick={() => setTargetType(preset.id as any)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                                    targetType === preset.id
                                        ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                                )}
                            >
                                {preset.label}
                            </button>
                        ))}
                        {targetType === "custom" && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400 font-bold">{t.customTargetHelp}</span>
                                <input
                                    type="number"
                                    value={customTarget || ""}
                                    onChange={e => setCustomTarget(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="w-20 px-3 py-1.5 rounded-lg border border-zinc-200 outline-none text-xs font-bold"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* CFU Progress Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-zinc-500">
                        <span>Progresso Laurea</span>
                        <span className="font-mono text-zinc-900">
                            {calculations.totalCfuAcquired} / {targetCfus} CFU ({Math.round(Math.min(100, (calculations.totalCfuAcquired / targetCfus) * 100)) || 0}%)
                        </span>
                    </div>
                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/40 relative">
                        <div
                            className="h-full bg-gradient-to-r from-[#18182e] to-[#c12830] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (calculations.totalCfuAcquired / targetCfus) * 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Dashboard grid stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: t.weightedAvg, val: calculations.weightedAvg.toFixed(2), icon: BookOpen, color: "text-blue-600 bg-blue-50 border-blue-100" },
                    { label: t.arithmeticAvg, val: calculations.arithmeticAvg.toFixed(2), icon: Calculator, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                    { label: t.startingMarkLabel, val: `${calculations.startingMark.toFixed(2)}/110`, icon: GraduationCap, color: "text-[#18182e] bg-[#18182e]/5 border-[#18182e]/10" },
                    { label: t.projectedMarkLabel, val: `${calculations.finalMark.toFixed(2)}/110`, icon: Sparkles, color: "text-[#c12830] bg-[#c12830]/5 border-[#c12830]/10" }
                ].map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                        <div key={idx} className={cn("p-5 rounded-2xl border flex flex-col justify-between bg-white shadow-sm", stat.color.split(" ")[2])}>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{stat.label}</span>
                                <div className={cn("p-1.5 rounded-lg shrink-0", stat.color.split(" ")[0], stat.color.split(" ")[1])}>
                                    <Icon className="size-4" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif font-black text-zinc-900 mt-4 tracking-tight tabular-nums">
                                {stat.val}
                            </h3>
                        </div>
                    )
                })}
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Form to Add Exam */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-zinc-200/60 shadow-sm space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-100">
                        {t.addExamTitle}
                    </h4>
                    <form onSubmit={handleAddExam} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-600">{locale === "en" ? "Course Name" : "Nome Insegnamento"}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder={t.examNamePlaceholder}
                                className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none text-xs font-semibold focus:border-zinc-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-zinc-600">{t.gradeLabel}</label>
                                <select
                                    value={grade}
                                    disabled={isPassedOnly}
                                    onChange={e => {
                                        const v = e.target.value
                                        setGrade(v === "30L" ? "30L" : parseInt(v))
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none text-xs font-bold bg-white disabled:bg-zinc-50 disabled:text-zinc-400"
                                >
                                    {[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                    <option value="30L">30 e Lode</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-zinc-600">{t.cfuLabel}</label>
                                <input
                                    type="number"
                                    value={cfu || ""}
                                    onChange={e => setCfu(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 outline-none text-xs font-bold"
                                />
                            </div>
                        </div>

                        {/* Pass Only Toggle */}
                        <label className="flex items-center gap-2 p-2.5 bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-200/40 rounded-xl cursor-pointer transition-all">
                            <input
                                type="checkbox"
                                checked={isPassedOnly}
                                onChange={e => setIsPassedOnly(e.target.checked)}
                                className="rounded text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                            />
                            <span className="text-xs font-semibold text-zinc-700 leading-normal">{t.isPassedOnlyLabel}</span>
                        </label>

                        <button
                            type="submit"
                            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            <Plus className="size-4" /> {t.addBtn}
                        </button>
                    </form>
                </div>

                {/* Table of Simulated Exams */}
                <div className="lg:col-span-8 space-y-4">
                    {/* Simulator Configuration Toggles */}
                    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-200/60 shadow-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={lodeAs31}
                                onChange={e => setLodeAs31(e.target.checked)}
                                className="rounded text-[#c12830] focus:ring-[#c12830] border-zinc-300"
                            />
                            <span className="text-xs font-bold text-zinc-700">{t.lodeBonusLabel}</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-700">{t.thesisBonusLabel}</span>
                            <input
                                type="number"
                                min="0"
                                max="8"
                                value={thesisPoints || 0}
                                onChange={e => setThesisPoints(Math.min(8, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-14 px-2 py-1 rounded-lg border border-zinc-200 outline-none text-xs font-bold text-center"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500">
                                {t.tableTitle}
                            </h4>
                        </div>
                        {exams.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                            <th className="px-5 py-3">{locale === "en" ? "Course / Insegnamento" : "Corso / Materia"}</th>
                                            <th className="px-5 py-3 text-center">{t.cfuLabel}</th>
                                            <th className="px-5 py-3 text-center">{t.gradeLabel}</th>
                                            <th className="px-5 py-3 text-center">{locale === "en" ? "Type" : "Tipo"}</th>
                                            <th className="px-5 py-3 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
                                        {exams.map(ex => (
                                            <tr key={ex.id} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="px-5 py-3.5 font-bold text-zinc-950">{ex.name}</td>
                                                <td className="px-5 py-3.5 text-center font-mono">{ex.cfu}</td>
                                                <td className="px-5 py-3.5 text-center font-mono font-bold">
                                                    {ex.isPassedOnly ? "-" : ex.grade === "30L" ? "30 e Lode" : ex.grade}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-black",
                                                        ex.isPassedOnly ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                                                    )}>
                                                        {ex.isPassedOnly ? "Idoneità" : "Esame"}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <button
                                                        onClick={() => handleDeleteExam(ex.id)}
                                                        className="p-1 rounded text-zinc-400 hover:text-[#c12830] hover:bg-rose-50 transition-all"
                                                        title={t.delete}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-zinc-400 italic text-xs leading-relaxed">
                                {t.noExams}
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-zinc-400 italic flex items-center gap-1.5 px-1">
                        <Info className="size-3.5 shrink-0" />
                        {t.lodeNote}
                    </p>
                </div>
            </div>
        </div>
    )
}
