"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown, ChevronUp, Search, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { motion, AnimatePresence } from "framer-motion"

export const dynamic = "force-dynamic"

type FaqItem = {
    question: string
    answer: string
    category: "generale" | "account" | "didattica" | "convenzioni"
}

const FAQ_ITEMS: FaqItem[] = [
    {
        category: "generale",
        question: "Come posso iscrivermi alle associazioni Morgana e O.R.U.M.?",
        answer: "L'iscrizione è gratuita ed è aperta a tutti gli studenti dell'Università di Messina. Puoi registrarti direttamente su questo portale cliccando su 'Area Riservata' in alto a destra, completando i tuoi dati e creando un account."
    },
    {
        category: "convenzioni",
        question: "Come posso usufruire delle convenzioni per gli studenti?",
        answer: "Per usufruire delle convenzioni attive nelle attività locali e nei negozi convenzionati di Messina e Melilli, ti basterà mostrare la tua tessera digitale dell'associazione (che trovi all'interno della tua area riservata della dashboard) al momento del pagamento."
    },
    {
        category: "didattica",
        question: "Chi posso contattare se ho un problema con un esame o un professore?",
        answer: "Puoi contattare i nostri Rappresentanti degli Studenti eletti nel tuo dipartimento. Trovi i loro nomi, recapiti ed email visitando la pagina 'Rappresentanti' all'interno del menu 'Servizi'."
    },
    {
        category: "account",
        question: "Ho dimenticato la password per accedere alla dashboard, come posso fare?",
        answer: "Nella pagina di login, clicca sul link 'Password dimenticata?'. Inserisci il tuo indirizzo email registrato e ti invieremo le istruzioni e un link sicuro per reimpostare la tua password."
    },
    {
        category: "generale",
        question: "Posso candidarmi come rappresentante degli studenti?",
        answer: "Certamente! Le elezioni studentesche si tengono periodicamente. Se vuoi impegnarti attivamente nella rappresentanza e far sentire la voce degli studenti, contattaci su Instagram o via email per conoscere il nostro gruppo e le nostre attività."
    },
    {
        category: "didattica",
        question: "Cosa sono i CFU e come funzionano i seminari?",
        answer: "I CFU (Crediti Formativi Universitari) misurano il carico di lavoro dello studente. Le associazioni Morgana e O.R.U.M. organizzano regolarmente seminari e conferenze accreditate dall'Ateneo che permettono di acquisire CFU a scelta libera o per attività extra."
    },
    {
        category: "didattica",
        question: "Come funziona il riconoscimento dei crediti formativi (CFU) per i seminari?",
        answer: "Una volta completato il seminario o l'evento accreditato, l'associazione rilascerà un attestato di partecipazione. Dovrai presentare questo attestato alla segreteria del tuo dipartimento o caricarlo sul portale Esse3 secondo le modalità previste dal tuo corso di studi per registrare i CFU liberi."
    },
    {
        category: "didattica",
        question: "Cos'è la compilazione dei piani di studio e quando si effettua?",
        answer: "Il piano di studio elenca tutti gli esami che intendi sostenere. Si compila solitamente online su Esse3 in finestre temporali specifiche (in genere tra ottobre e dicembre). Per ricevere supporto o in caso di anomalie con gli esami a scelta, contatta pure i nostri rappresentanti."
    },
    {
        category: "didattica",
        question: "Come posso richiedere il prolungamento delle sessioni di esame o appelli straordinari?",
        answer: "Gli appelli straordinari sono riservati a specifiche categorie (fuoricorso, lavoratori, atleti, part-time, o genitori). I nostri rappresentanti in Consiglio di Dipartimento lavorano costantemente per richiedere finestre straordinarie o facilitare la calendarizzazione degli appelli."
    },
    {
        category: "convenzioni",
        question: "Quali sono le attività commerciali convenzionate a Messina?",
        answer: "Abbiamo stipulato convenzioni con numerose attività locali, tra cui librerie, copisterie, bar, pizzerie, palestre e centri medici. Trovi l'elenco completo e costantemente aggiornato nella pagina 'Convenzioni' sul nostro sito."
    },
    {
        category: "generale",
        question: "Qual è la differenza tra l'Associazione Morgana e l'Associazione O.R.U.M.?",
        answer: "Morgana e O.R.U.M. sono due associazioni studentesche storiche e indipendenti dell'Università di Messina. Pur mantenendo le proprie identità, collaborano stabilmente in regime di sinergia su progetti di ampio respiro (come Piazza dell'Arte o il Cineforum) e condividono questo portale per semplificare l'erogazione dei servizi agli studenti."
    },
    {
        category: "generale",
        question: "Dove si trovano le sedi delle associazioni?",
        answer: "L'hub principale e sede fisica di ritrovo si trova a Messina in Via Sant'Elia 11. Inoltre, i nostri membri e referenti sono presenti quotidianamente all'interno delle aule studio e nei corridoi di tutti i poli dell'Ateneo (Polo Centrale, Papardo, Annunziata, Policlinico)."
    },
    {
        category: "account",
        question: "Come posso cancellare il mio account dal portale?",
        answer: "Puoi richiedere la cancellazione definitiva del tuo profilo e di tutti i dati personali associati inviando una semplice richiesta email a segreteria@morganaorum.it. La richiesta verrà presa in carico entro 48 ore."
    }
]

export default function FAQPage() {
    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState<string>("Tutte")
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const categories = ["Tutte", "Generale", "Didattica", "Convenzioni", "Account"]

    const filteredFaqs = FAQ_ITEMS.filter((item) => {
        const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase()) || 
            item.answer.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = activeCategory === "Tutte" || item.category === activeCategory.toLowerCase()
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="size-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <HelpCircle className="size-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground">
                        Domande Frequenti
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic">
                        Trova risposte rapide a tutte le domande comuni sull&apos;università, le iscrizioni, la rappresentanza e i servizi dedicati.
                    </p>

                    {/* Search bar */}
                    <div className="relative max-w-xl mx-auto mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cerca tra le domande..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setOpenIndex(null)
                            }}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-white focus:ring-2 focus:ring-zinc-900/5 transition-all outline-none text-sm shadow-sm"
                        />
                    </div>

                    {/* Category Switcher */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => {
                                    setActiveCategory(c)
                                    setOpenIndex(null)
                                }}
                                className={cn(
                                    "px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all",
                                    activeCategory === c
                                        ? "bg-zinc-900 text-white shadow-md"
                                        : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ Accordion Grid */}
                <div className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-20 text-zinc-400 bg-white rounded-3xl border border-zinc-100">
                            <Search className="size-12 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">Nessuna domanda trovata per la tua ricerca.</p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, index) => {
                            const isOpen = openIndex === index
                            return (
                                <div
                                    key={index}
                                    className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full flex items-center justify-between text-left p-6 outline-none"
                                    >
                                        <span className="font-bold text-zinc-900 pr-4">{faq.question}</span>
                                        {isOpen ? <ChevronUp className="size-5 text-zinc-400" /> : <ChevronDown className="size-5 text-zinc-400" />}
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden bg-zinc-50 border-t border-zinc-100"
                                            >
                                                <div className="p-6 text-sm text-zinc-600 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Footer Info Box */}
                <div className="mt-16 bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative z-10 flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-serif font-black mb-2 uppercase">Hai altre domande?</h3>
                        <p className="text-white/60 text-sm">
                            Il nostro team è sempre a disposizione per aiutarti a risolvere qualsiasi dubbio universitario.
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-900 font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shrink-0"
                    >
                        <Info className="size-4" /> Contattaci Subito
                    </Link>
                    {/* Glow background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                </div>
            </div>
        </div>
    )
}
