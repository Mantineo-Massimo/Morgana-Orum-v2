"use client"

import { useState, useMemo } from "react"
import { Search, Book, HelpCircle, X, ChevronRight, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface AcademicDictionaryProps {
    locale: string
}

interface DictionaryTerm {
    term: string
    termEn: string
    category: "carriera" | "esami" | "organizzazione" | "tasse"
    definition: string
    definitionEn: string
}

const DICTIONARY_DATA: DictionaryTerm[] = [
    {
        term: "AD (Attività Didattica) / Insegnamento",
        termEn: "AD / Course Unit",
        category: "esami",
        definition: "Il singolo corso o materia di studio (es. Analisi Matematica, Istituzioni di Diritto Privato) tenuto da uno o più professori.",
        definitionEn: "A single subject or course unit (e.g., Calculus, Private Law) taught by one or more professors."
    },
    {
        term: "Appello",
        termEn: "Exam Call",
        category: "esami",
        definition: "Data o periodo stabilito per lo svolgimento di un esame di profitto. Solitamente ci sono più appelli all'interno di una sessione ordinaria.",
        definitionEn: "Scheduled date or period for taking a course exam. There are typically multiple calls within each exam session."
    },
    {
        term: "Appello Straordinario",
        termEn: "Extraordinary Exam Call",
        category: "esami",
        definition: "Sessione d'esame riservata a specifiche categorie di studenti (es. fuori corso, studenti lavoratori, atleti, part-time, genitori) al di fuori delle sessioni ordinarie.",
        definitionEn: "Special exam session reserved for specific categories of students (e.g. working students, overtime students, athletes, part-time) outside standard periods."
    },
    {
        term: "Badge",
        termEn: "Student Card",
        category: "organizzazione",
        definition: "Tesserino identificativo dello studente, utile per accedere alle biblioteche, mense, aule studio e altri servizi dell'Ateneo.",
        definitionEn: "Identification card for students, used to access libraries, student canteens, study rooms, and other university services."
    },
    {
        term: "CFU (Credito Formativo Universitario)",
        termEn: "CFU (ECTS Credits)",
        category: "carriera",
        definition: "Unità di misura del carico di studio richiesto ad uno studente. 1 CFU equivale normalmente a 25 ore di lavoro complessivo tra lezioni frontali, studio individuale ed esercitazioni.",
        definitionEn: "University Credit (equivalent to ECTS). It measures the study workload. 1 CFU normally equals 25 hours of work, including lectures and self-study."
    },
    {
        term: "Dipartimento",
        termEn: "Department",
        category: "organizzazione",
        definition: "Struttura organizzativa dell'Ateneo che raggruppa i docenti di materie affini e gestisce la didattica (i corsi di studio) e la ricerca scientifica.",
        definitionEn: "Organization unit of the University grouping faculty members of similar fields that manages degree programs and scientific research."
    },
    {
        term: "Esse3",
        termEn: "Esse3 Portal",
        category: "carriera",
        definition: "Il portale web e sistema di segreteria online per la gestione della carriera dello studente: iscrizioni, pagamento tasse, prenotazione esami e consultazione libretto.",
        definitionEn: "The online student administration portal used to manage your academic career: enrollment, tuition fees, exam registration, and transcript records."
    },
    {
        term: "Fuori Corso",
        termEn: "Overtime Student (Fuori Corso)",
        category: "carriera",
        definition: "Status dello studente che non è riuscito a superare tutti gli esami o a laurearsi entro il numero di anni standard previsti dal proprio corso di studio.",
        definitionEn: "Status of a student who has not completed all exams or graduated within the standard duration of their degree course."
    },
    {
        term: "Immatricolazione",
        termEn: "First-Time Enrollment",
        category: "carriera",
        definition: "La prima iscrizione assoluta all'università, che assegna ufficialmente il numero di matricola dello studente.",
        definitionEn: "The very first registration at the university, which generates your unique student identification number (matricola)."
    },
    {
        term: "Iscrizione",
        termEn: "Re-enrollment",
        category: "carriera",
        definition: "Il rinnovo annuale dell'iscrizione agli anni successivi al primo, formalizzato con il pagamento della prima rata delle tasse.",
        definitionEn: "The annual renewal of registration for years after the first, completed by paying the first installment of yearly tuition fees."
    },
    {
        term: "Libretto Universitario",
        termEn: "Student Transcript",
        category: "carriera",
        definition: "Registro digitale (disponibile su Esse3) in cui vengono annotati tutti gli esami superati, i relativi CFU e la data di superamento.",
        definitionEn: "Digital record (available on Esse3) showing all exams passed, corresponding credits (CFUs), and dates."
    },
    {
        term: "Mora",
        termEn: "Late Fee (Mora)",
        category: "tasse",
        definition: "Maggiorazione economica applicata al pagamento delle tasse universitarie in caso di superamento delle scadenze prefissate.",
        definitionEn: "An extra penalty fee applied to tuition payments if they are made after the official deadline."
    },
    {
        term: "Piano di Studi",
        termEn: "Study Plan",
        category: "carriera",
        definition: "Elenco delle attività formative e degli esami che lo studente intende sostenere durante la sua carriera per raggiungere i CFU necessari alla laurea.",
        definitionEn: "The list of courses and exams a student plans to complete during their studies to gain the credits required for graduation."
    },
    {
        term: "Propedeuticità",
        termEn: "Prerequisites (Propedeuticità)",
        category: "esami",
        definition: "Vincolo didattico che impone il superamento di determinati esami fondamentali prima di poterne sostenere altri successivi o più avanzati.",
        definitionEn: "Academic rule requiring you to pass specific foundational courses before taking more advanced ones."
    },
    {
        term: "Rettore",
        termEn: "Rector",
        category: "organizzazione",
        definition: "La massima autorità accademica dell'Università, che presiede gli organi di governo (Senato Accademico e CdA) e rappresenta legalmente l'Ateneo.",
        definitionEn: "The highest academic authority of the University, head of the institution who presides over governing boards and represents the University."
    },
    {
        term: "Semestre",
        termEn: "Semester",
        category: "organizzazione",
        definition: "Ognuna delle due parti in cui è suddiviso l'anno accademico per lo svolgimento delle lezioni (solitamente primo semestre: ottobre-gennaio, secondo semestre: marzo-giugno).",
        definitionEn: "One of the two periods into which the academic year is divided for classes (usually 1st semester: Oct-Jan, 2nd semester: Mar-Jun)."
    },
    {
        term: "Sessione",
        termEn: "Exam Session",
        category: "esami",
        definition: "Periodo dell'anno accademico interamente dedicato agli esami di profitto, durante il quale le lezioni vengono sospese (es. sessione invernale, estiva, autunnale).",
        definitionEn: "Specific periods of the academic year dedicated to exams during which regular classes are suspended (e.g., Winter, Summer, or Autumn Session)."
    },
    {
        term: "Sessione di Laurea",
        termEn: "Graduation Session",
        category: "esami",
        definition: "Periodo dedicato alla discussione della tesi davanti a una commissione per il conseguimento del titolo finale di Laurea.",
        definitionEn: "Period dedicated to the presentation and defense of the thesis before a commission to obtain the final degree."
    },
    {
        term: "Tutor",
        termEn: "Tutor",
        category: "organizzazione",
        definition: "Docente o studente senior che offre supporto e orientamento nel percorso universitario, aiutando a risolvere dubbi organizzativi o didattici.",
        definitionEn: "A professor or senior student assigned to guide and support students through their academic path, helping resolve practical or study doubts."
    },
    {
        term: "Verbalizzazione",
        termEn: "Grade Registration (Verbalizzazione)",
        category: "esami",
        definition: "Registrazione ufficiale e definitiva dell'esame superato e del relativo voto sul libretto digitale dello studente, firmata digitalmente dal docente verbalizzante.",
        definitionEn: "The official and final digital recording of a passed exam grade in your student transcript, signed digitally by the professor."
    }
]

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Dizionario Accademico delle Matricole",
        subtitle: "Trova il significato di tutti i termini burocratici e accademici dell'Università degli Studi di Messina.",
        searchPlaceholder: "Cerca un termine (es: CFU, Appello, Esse3...)",
        allCategories: "Tutte le categorie",
        cat_carriera: "Carriera Studenti",
        cat_esami: "Esami & Lezioni",
        cat_organizzazione: "Organizzazione",
        cat_tasse: "Tasse & Scadenze",
        noResults: "Nessun termine trovato corrispondente a",
        clearSearch: "Cancella ricerca",
        termCount: "termini trovati"
    },
    en: {
        title: "Freshmen Academic Dictionary",
        subtitle: "Find the meaning of all bureaucratic and academic terms used at the University of Messina.",
        searchPlaceholder: "Search for a term (e.g., CFU, Exam Call, Esse3...)",
        allCategories: "All categories",
        cat_carriera: "Student Career",
        cat_esami: "Exams & Lectures",
        cat_organizzazione: "Organization",
        cat_tasse: "Fees & Deadlines",
        noResults: "No terms found matching",
        clearSearch: "Clear search",
        termCount: "terms found"
    }
}

export function AcademicDictionary({ locale }: AcademicDictionaryProps) {
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedLetter, setSelectedLetter] = useState<string>("all")

    // Filter logic
    const filteredTerms = useMemo(() => {
        return DICTIONARY_DATA.filter(item => {
            const termText = locale === "en" ? item.termEn : item.term
            const definitionText = locale === "en" ? item.definitionEn : item.definition
            const matchesSearch = 
                termText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                definitionText.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

            // Get first letter of the term in current locale
            const firstLetter = termText.charAt(0).toUpperCase()
            const matchesLetter = selectedLetter === "all" || firstLetter === selectedLetter

            return matchesSearch && matchesCategory && matchesLetter
        }).sort((a, b) => {
            const aText = locale === "en" ? a.termEn : a.term
            const bText = locale === "en" ? b.termEn : b.term
            return aText.localeCompare(bText)
        })
    }, [searchQuery, selectedCategory, selectedLetter, locale])

    // Get list of available starting letters in the dictionary
    const alphabet = useMemo(() => {
        const letters = new Set<string>()
        DICTIONARY_DATA.forEach(item => {
            const termText = locale === "en" ? item.termEn : item.term
            letters.add(termText.charAt(0).toUpperCase())
        })
        return Array.from(letters).sort()
    }, [locale])

    return (
        <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-200/50 p-6 md:p-8 space-y-6 shadow-inner">
            {/* Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-zinc-200/60">
                <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-200">
                    <Book className="size-6" />
                </div>
                <div>
                    <h3 className="font-serif font-black text-xl text-zinc-900 uppercase tracking-tight">{t.title}</h3>
                    <p className="text-xs text-zinc-500 font-medium">{t.subtitle}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 size-5 text-zinc-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="w-full pl-12 pr-10 py-3 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a] text-sm font-semibold transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600"
                        >
                            <X className="size-5" />
                        </button>
                    )}
                </div>

                {/* Category Selector */}
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                            selectedCategory === "all"
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                                : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        )}
                    >
                        {t.allCategories}
                    </button>
                    {["carriera", "esami", "organizzazione", "tasse"].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                                selectedCategory === cat
                                    ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                            )}
                        >
                            {t[`cat_${cat}`]}
                        </button>
                    ))}
                </div>
            </div>

            {/* A-Z Letter Filter */}
            <div className="flex flex-wrap gap-1.5 items-center py-2 border-y border-zinc-200/50">
                <button
                    onClick={() => setSelectedLetter("all")}
                    className={cn(
                        "size-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all border",
                        selectedLetter === "all"
                            ? "bg-[#c9041a] border-[#c9041a] text-white shadow-sm"
                            : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                    )}
                >
                    All
                </button>
                {alphabet.map(letter => (
                    <button
                        key={letter}
                        onClick={() => setSelectedLetter(letter)}
                        className={cn(
                            "size-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all border",
                            selectedLetter === letter
                                ? "bg-[#c9041a] border-[#c9041a] text-white shadow-sm"
                                : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                        )}
                    >
                        {letter}
                    </button>
                ))}
            </div>

            {/* Term Count */}
            <div className="text-right text-[10px] font-black uppercase tracking-wider text-zinc-400">
                {filteredTerms.length} {t.termCount}
            </div>

            {/* Terms Grid/List */}
            {filteredTerms.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {filteredTerms.map((item, index) => {
                        const termName = locale === "en" ? item.termEn : item.term
                        const termDesc = locale === "en" ? item.definitionEn : item.definition
                        
                        return (
                            <div
                                key={index}
                                className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider",
                                            item.category === "carriera" && "bg-blue-50 text-blue-600",
                                            item.category === "esami" && "bg-emerald-50 text-emerald-600",
                                            item.category === "organizzazione" && "bg-purple-50 text-purple-600",
                                            item.category === "tasse" && "bg-amber-50 text-amber-600"
                                        )}>
                                            {t[`cat_${item.category}`]}
                                        </span>
                                    </div>
                                    <h4 className="font-serif font-black text-base text-zinc-900 tracking-tight flex items-center gap-1.5">
                                        <ChevronRight className="size-4 text-[#c9041a] shrink-0" />
                                        {termName}
                                    </h4>
                                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                        {termDesc}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="py-12 bg-white rounded-2xl border border-zinc-200/50 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <HelpCircle className="size-12 text-zinc-300" />
                    <div>
                        <p className="text-sm font-bold text-zinc-800">
                            {t.noResults} <span className="text-[#c9041a] font-mono">&ldquo;{searchQuery || selectedLetter}&rdquo;</span>
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                            Prova a cercare un&apos;altra parola o azzera i filtri di ricerca.
                        </p>
                    </div>
                    {(searchQuery || selectedCategory !== "all" || selectedLetter !== "all") && (
                        <button
                            onClick={() => {
                                setSearchQuery("")
                                setSelectedCategory("all")
                                setSelectedLetter("all")
                            }}
                            className="px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all"
                        >
                            {t.clearSearch}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
