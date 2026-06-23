"use client"

import { useState } from "react"
import { Calculator, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Euro, HelpCircle, Info, RefreshCw, Sparkles, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaxCalculatorProps {
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Simulatore Contribuzione Studentesca 2025/26",
        subtitle: "Calcola in pochi passaggi la tua fascia contributiva, l'importo delle tasse (COA), le agevolazioni a cui hai diritto e le scadenze dei pagamenti.",
        step1: "ISEE-U & Carriera",
        step2: "Esoneri & Agevolazioni",
        step3: "Pagamento",
        step4: "Risultato",
        iseeLabel: "Reddito ISEE-U (in Euro)",
        iseeHelp: "Inserisci l'ISEE per le prestazioni agevolate per il diritto allo studio. Se non lo presenti, inserisci un valore superiore a 60000 €.",
        carrieraLabel: "Condizione di Iscrizione e Merito",
        carrieraRegular: "Regolarità Iscrizione + Merito",
        carrieraRegularDesc: "Studenti in corso con requisiti di CFU minimi previsti.",
        carrieraMerit: "Solo Merito",
        carrieraMeritDesc: "Studenti con requisiti di merito ma fuori corso.",
        carrieraOther: "Altri Casi",
        carrieraOtherDesc: "Studenti senza requisiti di merito o regolarità (fuori corso senza merito).",
        next: "Continua",
        back: "Indietro",
        reset: "Ricalcola",
        exemptionsLabel: "Esoneri Totali (COA = 0 €)",
        exemptionsDesc: "Seleziona se rientri in una di queste categorie ad esonero totale dal Contributo Onnicomprensivo:",
        reductionsLabel: "Riduzioni Speciali sul COA",
        reductionsDesc: "Seleziona eventuali riduzioni applicabili (verrà applicata la più favorevole, non sono cumulabili):",
        paymentLabel: "Opzione di Pagamento",
        paymentSingle: "Pagamento in un'unica soluzione (Sconto 20%)",
        paymentSingleDesc: "Paga l'intero importo in una sola volta per beneficiare di una riduzione del 20% sul COA netto.",
        paymentInstallments: "Pagamento rateizzato in 3 tranche",
        paymentInstallmentsDesc: "Suddividi il pagamento del COA in tre rate nel corso dell'anno accademico senza sconti.",
        resultTitle: "Riepilogo Simulazione Tasse 2025/26",
        fasciaLabel: "Fascia contributiva",
        baseCoaLabel: "COA Base (Contributo Annuo)",
        appliedExemption: "Esonero totale applicato",
        appliedReduction: "Agevolazione applicata",
        singleSolutionDiscount: "Sconto Unica Soluzione (-20%)",
        regionalTax: "Tassa Regionale + Imposta di Bollo",
        totalToPay: "Totale da corrispondere",
        timelineTitle: "Scadenziario dei Pagamenti",
        deadlineDisclaimer: "Attenzione: in caso di ritardato pagamento delle singole rate, verrà applicata una mora di € 14,00. La scelta del pagamento non è modificabile in corso d'anno."
    },
    en: {
        title: "University Tuition Fees Simulator 2025/26",
        subtitle: "Calculate your tax bracket, annual contribution (COA), eligible exemptions, and payment deadlines in a few steps.",
        step1: "ISEE-U & Career",
        step2: "Exemptions & Benefits",
        step3: "Payment",
        step4: "Result",
        iseeLabel: "ISEE-U Income (in Euros)",
        iseeHelp: "Enter your ISEE for university benefits. If you do not present it, enter a value above € 60,000.",
        carrieraLabel: "Enrollment & Merit Condition",
        carrieraRegular: "Regular Enrollment + Merit",
        carrieraRegularDesc: "On-time students meeting the minimum credit requirements.",
        carrieraMerit: "Merit Only",
        carrieraMeritDesc: "Students meeting merit criteria but enrolled past the regular duration.",
        carrieraOther: "Other Cases",
        carrieraOtherDesc: "Students without merit or regularity requirements.",
        next: "Next",
        back: "Back",
        reset: "Recalculate",
        exemptionsLabel: "Total Exemptions (COA = 0 €)",
        exemptionsDesc: "Select if you belong to one of these categories eligible for a 100% discount on the COA:",
        reductionsLabel: "Special COA Reductions",
        reductionsDesc: "Select any applicable reductions (the most favorable one will be applied, they are not cumulative):",
        paymentLabel: "Payment Option",
        paymentSingle: "Single solution payment (20% discount)",
        paymentSingleDesc: "Pay the entire amount at once to benefit from a 20% reduction on the net COA.",
        paymentInstallments: "Installment plan (3 installments)",
        paymentInstallmentsDesc: "Split the COA payment into three rates throughout the academic year without discounts.",
        resultTitle: "Tuition Fees Simulation Summary 2025/26",
        fasciaLabel: "Income bracket",
        baseCoaLabel: "Base COA (Annual Contribution)",
        appliedExemption: "Total exemption applied",
        appliedReduction: "Reduction applied",
        singleSolutionDiscount: "Single Solution Discount (-20%)",
        regionalTax: "Regional Tax + Stamp Duty",
        totalToPay: "Total to pay",
        timelineTitle: "Payment Schedule",
        deadlineDisclaimer: "Please note: in case of late payment of individual installments, a fine of € 14.00 will be applied. The payment choice cannot be changed during the year."
    }
}

export function TaxCalculator({ locale }: TaxCalculatorProps) {
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it
    const [step, setStep] = useState(1)

    // Form States
    const [isee, setIsee] = useState<number>(0)
    const [carriera, setCarriera] = useState<"REGULAR_MERIT" | "MERIT_ONLY" | "OTHER">("REGULAR_MERIT")
    
    // Exemptions Checkboxes
    const [esoneri, setEsoneri] = useState({
        violenza: false,
        centista: false,
        atleta: false,
        disabile: false,
        vittimaMafia: false,
        detenuto: false,
        trasferimento: false,
        internazionale: false
    })

    // Reductions Checkboxes
    const [riduzioni, setRiduzioni] = useState({
        nucleo: false,
        partTime: false,
        dipendente: false,
        figlioDipendente: false,
        covid: false,
        militari: false
    })

    const [paymentOption, setPaymentOption] = useState<"SINGLE" | "INSTALLMENTS">("SINGLE")

    // Formulas calculation based on PDF
    const calculateTaxes = () => {
        let fascia = "I"
        if (isee <= 24000) fascia = "I"
        else if (isee <= 26000) fascia = "II"
        else if (isee <= 28000) fascia = "III"
        else if (isee <= 30000) fascia = "IV"
        else if (isee <= 50000) fascia = "V"
        else if (isee <= 60000) fascia = "VI"
        else fascia = "VII"

        let baseCoa = 0
        let formulaDesc = ""

        if (carriera === "REGULAR_MERIT") {
            if (isee <= 28000) {
                baseCoa = 0
                formulaDesc = "NO TAX AREA"
            } else if (isee <= 30000) {
                baseCoa = 0.05 * (isee - 22000)
                // Riduzione MUR 10%
                baseCoa = baseCoa * 0.9
                formulaDesc = "0.05 * (ISEE - 22.000 €) con riduzione 10% MUR"
            } else if (isee <= 60000) {
                baseCoa = 0.062 * (isee - 30000) + 400
                formulaDesc = "0.062 * (ISEE - 30.000 €) + 400 €"
            } else {
                baseCoa = 2650
                formulaDesc = "Contributo fisso Fascia VII"
            }
        } else if (carriera === "MERIT_ONLY") {
            if (isee <= 24000) {
                baseCoa = 200
                formulaDesc = "Importo fisso per merito"
            } else if (isee <= 26000) {
                baseCoa = 0.064 * (isee - 22000)
                if (baseCoa < 200.01) baseCoa = 200.01
                formulaDesc = "0.064 * (ISEE - 22.000 €), min 200.01 €"
            } else if (isee <= 30000) {
                baseCoa = 0.064 * (isee - 22000)
                formulaDesc = "0.064 * (ISEE - 22.000 €)"
            } else if (isee <= 60000) {
                baseCoa = 0.065 * (isee - 30000) + 512
                formulaDesc = "0.065 * (ISEE - 30.000 €) + 512 €"
            } else {
                baseCoa = 2750
                formulaDesc = "Contributo fisso Solo Merito"
            }
        } else { // OTHER
            if (isee <= 24000) {
                baseCoa = 275
                formulaDesc = "Importo fisso"
            } else if (isee <= 26000) {
                const meritVal = Math.max(200.01, 0.064 * (isee - 22000))
                baseCoa = meritVal + 175
                formulaDesc = "Merito corrispondente + 175 €"
            } else if (isee <= 30000) {
                const meritVal = 0.064 * (isee - 22000)
                baseCoa = meritVal + 175
                formulaDesc = "Merito corrispondente + 175 €"
            } else if (isee <= 60000) {
                const meritVal = 0.065 * (isee - 30000) + 512
                baseCoa = meritVal + 175
                formulaDesc = "Merito corrispondente + 175 €"
            } else {
                baseCoa = 2850
                formulaDesc = "Contributo fisso Altri Casi"
            }
        }

        // Apply Exemptions (100% reduction on COA)
        const hasExemption = 
            esoneri.violenza || 
            esoneri.centista || 
            esoneri.atleta || 
            esoneri.disabile || 
            esoneri.vittimaMafia || 
            esoneri.detenuto || 
            esoneri.trasferimento

        let discountPercentage = 0
        let discountName = ""

        if (hasExemption) {
            discountPercentage = 100
            if (esoneri.violenza) discountName = "Donne vittime di violenza"
            else if (esoneri.centista) discountName = "Immatricolati Centisti 2025"
            else if (esoneri.atleta) discountName = "Studenti Atleti"
            else if (esoneri.disabile) discountName = "Invalidità/Disabilità/Ciechi"
            else if (esoneri.vittimaMafia) discountName = "Vittime di criminalità/mafia"
            else if (esoneri.detenuto) discountName = "Studenti detenuti"
            else if (esoneri.trasferimento) discountName = "Trasferimento in ingresso"
        } else {
            // Apply Reductions (non-cumulative, select maximum)
            const activeReductions = []
            if (riduzioni.nucleo) activeReductions.push({ pct: 15, name: "Stesso nucleo familiare iscritto (-15%)" })
            if (riduzioni.partTime) activeReductions.push({ pct: 40, name: "Iscrizione Tempo Parziale (-40%)" })
            if (riduzioni.dipendente) activeReductions.push({ pct: 40, name: "Dipendente Ateneo/Unilav (-40%)" })
            if (riduzioni.figlioDipendente) activeReductions.push({ pct: 25, name: "Figlio dipendente PTA/Unilav (-25%)" })
            if (riduzioni.covid) activeReductions.push({ pct: 50, name: "Figlio deceduti causa Covid (-50%)" })
            if (riduzioni.militari) activeReductions.push({ pct: 15, name: "Figlio militari Sicilia/Calabria (-15%)" })

            if (activeReductions.length > 0) {
                activeReductions.sort((a, b) => b.pct - a.pct)
                discountPercentage = activeReductions[0].pct
                discountName = activeReductions[0].name
            }
        }

        let netCoa = baseCoa * (1 - discountPercentage / 100)

        // Flat quote check (ad esclusione di quote FLAT per lo sconto del 20%)
        // If they select Single Solution payment, apply 20% discount on the net COA, except if COA is FLAT (Fascia I/II/III under regular or fixed minimum flat values <= 275)
        const isFlat = netCoa <= 275 && netCoa > 0
        let singleSolutionDiscount = 0

        if (paymentOption === "SINGLE" && netCoa > 0) {
            if (!isFlat) {
                singleSolutionDiscount = netCoa * 0.2
                netCoa = netCoa * 0.8
            }
        }

        // Tassa Regionale + Bollo (Standard 156 €)
        // Disabled students are often exempt from regional tax, let's keep it 0 if disabile is checked
        const regionalFees = esoneri.disabile ? 0 : 156

        const total = netCoa + regionalFees

        return {
            fascia,
            baseCoa: Math.round(baseCoa * 100) / 100,
            netCoa: Math.round(netCoa * 100) / 100,
            discountPercentage,
            discountName,
            isFlat,
            singleSolutionDiscount: Math.round(singleSolutionDiscount * 100) / 100,
            regionalFees,
            total: Math.round(total * 100) / 100,
            formulaDesc
        }
    }

    const res = calculateTaxes()

    const handleNext = () => setStep(s => s + 1)
    const handleBack = () => setStep(s => s - 1)
    const handleReset = () => {
        setIsee(0)
        setCarriera("REGULAR_MERIT")
        setEsoneri({
            violenza: false,
            centista: false,
            atleta: false,
            disabile: false,
            vittimaMafia: false,
            detenuto: false,
            trasferimento: false,
            internazionale: false
        })
        setRiduzioni({
            nucleo: false,
            partTime: false,
            dipendente: false,
            figlioDipendente: false,
            covid: false,
            militari: false
        })
        setPaymentOption("SINGLE")
        setStep(1)
    }

    return (
        <div className="w-full max-w-full overflow-hidden bg-zinc-50/50 rounded-[2rem] border border-zinc-200/50 p-4 md:p-8 space-y-8 shadow-inner">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200/60">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-200">
                        <Calculator className="size-6" />
                    </div>
                    <div>
                        <h3 className="font-serif font-black text-xl text-zinc-900 uppercase tracking-tight">{t.title}</h3>
                        <p className="text-xs text-zinc-500 font-medium">{t.subtitle}</p>
                    </div>
                </div>
                {/* Step Indicators */}
                <div className="flex items-center gap-1.5 self-start md:self-auto">
                    {[1, 2, 3, 4].map(idx => (
                        <div
                            key={idx}
                            className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                step === idx ? "w-8 bg-[#c12830]" : "w-2 bg-zinc-200"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Step 1: ISEE-U and Carriera */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                            <Euro className="size-4 text-zinc-400" />
                            {t.iseeLabel}
                        </label>
                        <input
                            type="number"
                            value={isee || ""}
                            onChange={e => setIsee(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full max-w-md px-4 py-3 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold text-lg"
                            placeholder="Es: 21500"
                        />
                        <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                            <Info className="size-3.5" /> {t.iseeHelp}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 block">
                            {t.carrieraLabel}
                        </label>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { id: "REGULAR_MERIT", label: t.carrieraRegular, desc: t.carrieraRegularDesc },
                                { id: "MERIT_ONLY", label: t.carrieraMerit, desc: t.carrieraMeritDesc },
                                { id: "OTHER", label: t.carrieraOther, desc: t.carrieraOtherDesc }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setCarriera(item.id as any)}
                                    className={cn(
                                        "p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200",
                                        carriera === item.id 
                                            ? "bg-white border-zinc-900 shadow-md ring-2 ring-zinc-900/5"
                                            : "bg-white border-zinc-200/80 hover:border-zinc-300"
                                    )}
                                >
                                    <h4 className="font-bold text-zinc-900 text-sm mb-1">{item.label}</h4>
                                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-8 py-3.5 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
                        >
                            {t.next} <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Exemptions & Reductions */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800">{t.exemptionsLabel}</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">{t.exemptionsDesc}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3.5">
                            {[
                                { id: "violenza", label: "Donne vittime di violenza di genere" },
                                { id: "centista", label: "Immatricolandi Centisti/Lode nel 2025" },
                                { id: "atleta", label: "Studenti-Atleti d'Élite" },
                                { id: "disabile", label: "Invalidità civile (>= 66%), Ciechi o Orfani" },
                                { id: "vittimaMafia", label: "Figli di vittime di mafia/criminalità/dovere" },
                                { id: "detenuto", label: "Studenti detenuti o internati" },
                                { id: "trasferimento", label: "Trasferimenti in ingresso da altro Ateneo" },
                                { id: "internazionale", label: "Studente Internazionale (tassa per Paese di provenienza)" }
                            ].map(item => (
                                <label
                                    key={item.id}
                                    className={cn(
                                        "flex items-start gap-3 p-4 rounded-xl border cursor-pointer bg-white transition-all",
                                        (esoneri as any)[item.id] ? "border-zinc-800 shadow-sm" : "border-zinc-200 hover:bg-zinc-50"
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={(esoneri as any)[item.id]}
                                        onChange={e => setEsoneri({ ...esoneri, [item.id]: e.target.checked })}
                                        className="mt-1 rounded text-zinc-900 focus:ring-zinc-900"
                                    />
                                    <span className="text-xs font-semibold text-zinc-700 leading-normal">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-200/50">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800">{t.reductionsLabel}</h4>
                            <p className="text-xs text-zinc-400 mt-0.5">{t.reductionsDesc}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3.5">
                            {[
                                { id: "nucleo", label: "Stesso nucleo familiare iscritto (-15% COA)" },
                                { id: "partTime", label: "Iscritti a tempo parziale / Part-Time (-40% COA)" },
                                { id: "dipendente", label: "Dipendenti Ateneo o Unilav SCpA (-40% COA)" },
                                { id: "figlioDipendente", label: "Figli dipendenti PTA Ateneo o Unilav (-25% COA)" },
                                { id: "covid", label: "Figli deceduti causa Covid-19 (-50% COA)" },
                                { id: "militari", label: "Figli militari FA/Polizia in Sicilia/Calabria (-15% COA)" }
                            ].map(item => (
                                <label
                                    key={item.id}
                                    className={cn(
                                        "flex items-start gap-3 p-4 rounded-xl border cursor-pointer bg-white transition-all",
                                        (riduzioni as any)[item.id] ? "border-zinc-800 shadow-sm" : "border-zinc-200 hover:bg-zinc-50"
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        checked={(riduzioni as any)[item.id]}
                                        onChange={e => setRiduzioni({ ...riduzioni, [item.id]: e.target.checked })}
                                        className="mt-1 rounded text-zinc-900 focus:ring-zinc-900"
                                    />
                                    <span className="text-xs font-semibold text-zinc-700 leading-normal">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 border border-zinc-200 hover:bg-zinc-100 text-zinc-500 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <ChevronLeft className="size-4" /> {t.back}
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-8 py-3.5 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
                        >
                            {t.next} <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Payment Options */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 block">
                            {t.paymentLabel}
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { id: "SINGLE", label: t.paymentSingle, desc: t.paymentSingleDesc, hasPromo: true },
                                { id: "INSTALLMENTS", label: t.paymentInstallments, desc: t.paymentInstallmentsDesc, hasPromo: false }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setPaymentOption(item.id as any)}
                                    className={cn(
                                        "p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-200 relative overflow-hidden",
                                        paymentOption === item.id 
                                            ? "bg-white border-zinc-900 shadow-md ring-2 ring-zinc-900/5"
                                            : "bg-white border-zinc-200/80 hover:border-zinc-300"
                                    )}
                                >
                                    {item.hasPromo && (
                                        <span className="absolute top-0 right-0 bg-[#c12830] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                                            <Sparkles className="size-2.5" /> -20% Sconto
                                        </span>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-zinc-900 text-sm mb-2 mt-1">{item.label}</h4>
                                        <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 border border-zinc-200 hover:bg-zinc-100 text-zinc-500 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <ChevronLeft className="size-4" /> {t.back}
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-8 py-3.5 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
                        >
                            {t.next} <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Result summary & scadenze */}
            {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Simulation Results Card */}
                        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-3xl border border-zinc-200 shadow-xl space-y-6">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-[#c12830]">{t.resultTitle}</h4>
                                <h2 className="text-3xl font-serif font-black text-zinc-950 mt-1">
                                    € {res.total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                                </h2>
                            </div>

                            <div className="space-y-3.5 text-xs font-semibold text-zinc-500">
                                <div className="flex justify-between py-2 border-b border-zinc-100">
                                    <span>{t.fasciaLabel}</span>
                                    <span className="font-bold text-zinc-900">Fascia {res.fascia}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-zinc-100">
                                    <span>{t.baseCoaLabel}</span>
                                    <span className="font-mono text-zinc-900">€ {res.baseCoa.toFixed(2)}</span>
                                </div>
                                
                                {res.discountPercentage > 0 && (
                                    <div className="flex justify-between py-2 border-b border-zinc-100 text-emerald-600 bg-emerald-50/50 px-3 rounded-lg">
                                        <span className="flex items-center gap-1.5">
                                            <Tag className="size-3.5" />
                                            {res.discountPercentage === 100 ? t.appliedExemption : t.appliedReduction}
                                        </span>
                                        <span className="font-bold font-mono">-{res.discountPercentage}% ({res.discountName})</span>
                                    </div>
                                )}

                                {res.singleSolutionDiscount > 0 && (
                                    <div className="flex justify-between py-2 border-b border-zinc-100 text-emerald-600 bg-emerald-50/50 px-3 rounded-lg">
                                        <span className="flex items-center gap-1.5">
                                            <Sparkles className="size-3.5" />
                                            {t.singleSolutionDiscount}
                                        </span>
                                        <span className="font-bold font-mono">-€ {res.singleSolutionDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                {paymentOption === "SINGLE" && res.netCoa > 0 && res.isFlat && (
                                    <div className="flex items-center gap-1.5 p-2 bg-amber-50 text-amber-700 rounded-lg text-[10px] leading-relaxed">
                                        <Info className="size-3.5 shrink-0" />
                                        <span>Nota: Lo sconto del 20% non si applica sulle quote fisse minime (Quote FLAT).</span>
                                    </div>
                                )}

                                <div className="flex justify-between py-2 border-b border-zinc-100">
                                    <span>{t.regionalTax}</span>
                                    <span className="font-mono text-zinc-900">€ {res.regionalFees.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between pt-3 text-sm font-bold text-zinc-900">
                                    <span>{t.totalToPay}</span>
                                    <span className="text-lg font-mono text-[#c12830]">€ {res.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Deadlines Timeline */}
                        <div className="lg:col-span-6 space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                                <Calendar className="size-4 text-zinc-500" />
                                {t.timelineTitle}
                            </h4>

                            <div className="relative border-l border-zinc-200 pl-6 space-y-8 ml-3 py-2">
                                {paymentOption === "SINGLE" ? (
                                    <>
                                        {/* Single solution milestones */}
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 bg-zinc-900 text-white rounded-full p-1.5 shadow-sm">
                                                <CheckCircle2 className="size-3.5" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Scadenza Iscrizione</h5>
                                                <p className="text-[10px] text-zinc-400 font-bold mt-0.5">31 DICEMBRE 2025</p>
                                                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                                    Presentazione della domanda di iscrizione/immatricolazione su Esse3.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 bg-[#c12830] text-white rounded-full p-1.5 shadow-sm">
                                                <Euro className="size-3.5" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Pagamento Rata Unica</h5>
                                                <p className="text-[10px] text-[#c12830] font-bold mt-0.5">30 GENNAIO 2026</p>
                                                <p className="text-xs text-zinc-900 font-bold mt-1">
                                                    Importo: € {res.total.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                                    Include il COA scontato del 20% (ove applicabile), la tassa regionale (€ 140) e il bollo (€ 16).
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Installments milestones */}
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 bg-zinc-950 text-white rounded-full p-1.5 shadow-sm">
                                                <CheckCircle2 className="size-3.5" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Immatricolazione & Iscrizione</h5>
                                                <p className="text-[10px] text-zinc-400 font-bold mt-0.5">31 DICEMBRE 2025</p>
                                                <p className="text-xs text-zinc-900 font-bold mt-1">
                                                    Importo: € {res.regionalFees.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                                    Versamento della tassa regionale per il diritto allo studio (€ 140,00) e imposta di bollo (€ 16,00).
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 bg-zinc-700 text-white rounded-full p-1.5 shadow-sm">
                                                <Euro className="size-3.5" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Prima Rata COA (Esse3 - 2/4)</h5>
                                                <p className="text-[10px] text-zinc-500 font-bold mt-0.5">30 GENNAIO 2026</p>
                                                <p className="text-xs text-zinc-900 font-bold mt-1">
                                                    Importo: € {(res.netCoa / 3).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                                    Prima tranche corrispondente a un terzo del contributo onnicomprensivo annuo dovuto.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 bg-zinc-700 text-white rounded-full p-1.5 shadow-sm">
                                                <Euro className="size-3.5" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Seconda Rata COA (Esse3 - 3/4)</h5>
                                                <p className="text-[10px] text-zinc-500 font-bold mt-0.5">31 MARZO 2026</p>
                                                <p className="text-xs text-zinc-900 font-bold mt-1">
                                                    Importo: € {(res.netCoa / 3).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                                    Seconda tranche corrispondente a un terzo del contributo onnicomprensivo annuo dovuto.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 bg-zinc-700 text-white rounded-full p-1.5 shadow-sm">
                                                <Euro className="size-3.5" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Terza Rata COA (Esse3 - 4/4)</h5>
                                                <p className="text-[10px] text-zinc-500 font-bold mt-0.5">30 GIUGNO 2026</p>
                                                <p className="text-xs text-zinc-900 font-bold mt-1">
                                                    Importo: € {(res.netCoa / 3).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                                    Terza e ultima rata di completamento del contributo onnicomprensivo dovuto.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <p className="text-[10px] text-zinc-400 italic leading-relaxed pt-2">
                                * {t.deadlineDisclaimer}
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-200/50 flex justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 border border-zinc-200 hover:bg-zinc-100 text-zinc-500 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <ChevronLeft className="size-4" /> {t.back}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-3 bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                        >
                            <RefreshCw className="size-3.5 animate-spin-hover" /> {t.reset}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
