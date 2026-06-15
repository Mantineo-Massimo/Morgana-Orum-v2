"use client"

import { useState, useMemo } from "react"
import { Search, Book, HelpCircle, X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AcademicDictionaryProps {
    locale: string
}

interface DictionaryTerm {
    term: string
    termEn: string
    category: "carriera" | "esami" | "tasse" | "organizzazione" | "internazionale"
    definition: string
    definitionEn: string
}

const DICTIONARY_DATA: DictionaryTerm[] = [
    // 1. Ammissione e Avvio della Carriera
    {
        term: "Immatricolazione",
        termEn: "First-Time Enrollment",
        category: "carriera",
        definition: "La procedura amministrativa con cui ci si iscrive formalmente all'Università per la prima volta, ottenendo il numero di matricola dopo il pagamento della prima rata.",
        definitionEn: "The administrative procedure to formally enroll at the University for the first time, generating a student ID number after paying the first fee installment."
    },
    {
        term: "Iscrizione",
        termEn: "Re-enrollment",
        category: "carriera",
        definition: "L'atto di rinnovare la propria frequenza per gli anni successivi al primo, mediante il pagamento delle tasse annuali.",
        definitionEn: "The act of renewing enrollment for academic years following the first, completed by paying the annual tuition fees."
    },
    {
        term: "TOLC (Test Online CISIA)",
        termEn: "TOLC (CISIA Online Test)",
        category: "carriera",
        definition: "Il test standardizzato utilizzato per l'accesso ai corsi di laurea. Può essere selettivo (per i corsi a numero programmato) o orientativo (per i corsi a libero accesso).",
        definitionEn: "A standardized test used for entry to degree programs. It can be competitive (for restricted-access courses) or evaluative (for open-access courses)."
    },
    {
        term: "OFA (Obblighi Formativi Aggiuntivi)",
        termEn: "OFA (Additional Educational Obligations)",
        category: "carriera",
        definition: "Debiti formativi assegnati alle matricole che non raggiungono il punteggio minimo nelle sezioni matematiche/logiche del test d'ingresso. Vanno colmati entro il primo anno, solitamente superando un apposito esame o un pre-corso.",
        definitionEn: "Academic deficits assigned to freshmen who do not meet the minimum entry test score. They must be resolved during the first year, usually by passing a designated exam or pre-course."
    },
    {
        term: "Pre-corsi",
        termEn: "Pre-courses",
        category: "carriera",
        definition: "Cicli di lezioni intensive organizzati nelle settimane precedenti l'inizio ufficiale dei corsi (spesso focalizzati sulla Matematica di base) per allineare le competenze delle matricole.",
        definitionEn: "Intensive lecture series organized in the weeks preceding the official start of classes (often focused on basic Math) to align freshmen's skills."
    },
    {
        term: "Passaggio di Corso",
        termEn: "Program Change",
        category: "carriera",
        definition: "Il trasferimento dello studente da un corso di laurea a un altro all'interno dello stesso Ateneo (UniMe).",
        definitionEn: "The transfer of a student from one degree program to another within the same University (UniMe)."
    },
    {
        term: "Trasferimento",
        termEn: "Transfer",
        category: "carriera",
        definition: "Il cambio di Ateneo, sia in entrata (da un'altra università a UniMe) sia in uscita.",
        definitionEn: "Switching universities, either incoming (from another institution to UniMe) or outgoing."
    },
    {
        term: "Convalida / Riconoscimento Carriera",
        termEn: "Career Recognition / Credit Approval",
        category: "carriera",
        definition: "La procedura con cui il Consiglio di Corso di Laurea riconosce come validi i CFU già acquisiti in una precedente carriera (es. per rinuncia, decadenza o passaggio di corso).",
        definitionEn: "The process through which the Degree Course Council approves academic credits (CFUs) earned in a previous career or studies (e.g. following withdrawal, expiry, or program change)."
    },
    {
        term: "Manifesto degli Studi di Immatricolazione",
        termEn: "Enrollment Study Manifesto",
        category: "carriera",
        definition: "Il documento annuale che descrive le regole di accesso, il piano degli studi complessivo, le scadenze e le modalità di immatricolazione dell'Ateneo.",
        definitionEn: "The annual document outlining the entry rules, study plan, deadlines, and registration procedures of the University."
    },

    // 2. Didattica, Esami e Lezioni
    {
        term: "Appello Straordinario",
        termEn: "Extraordinary Exam Call",
        category: "esami",
        definition: "Sessioni d'esame riservate esclusivamente a specifiche categorie di studenti, come i fuori corso, i laureandi, gli studenti lavoratori, i genitori o gli studenti atleti.",
        definitionEn: "Special exam dates reserved for specific categories of students, such as working, overtime, or pregnant students, and elite student-athletes."
    },
    {
        term: "Attività Formativa",
        termEn: "Educational Activity",
        category: "esami",
        definition: "Qualsiasi attività che consenta allo studente di acquisire CFU (lezioni, laboratori, seminari, tirocini).",
        definitionEn: "Any educational activity that allows students to earn credits (CFUs), such as lectures, labs, seminars, and internships."
    },
    {
        term: "Calendario Didattico",
        termEn: "Academic Calendar",
        category: "esami",
        definition: "Il documento ufficiale che stabilisce le date di inizio e fine delle lezioni, dei periodi di vacanza e delle sessioni d'esame per l'intero anno accademico.",
        definitionEn: "The official university calendar setting the start/end dates of lectures, holidays, and exam sessions for the academic year."
    },
    {
        term: "Cattedra",
        termEn: "Chair / Class Division",
        category: "esami",
        definition: "Il ruolo ufficiale del docente titolare di un insegnamento. Spesso indica anche la suddivisione degli studenti in base alla lettera del cognome (es. Cattedra A-L, Cattedra M-Z).",
        definitionEn: "The official role of the head professor. Often indicates student division according to surname initials (e.g., Chair A-L, Chair M-Z)."
    },
    {
        term: "Co-tutore",
        termEn: "Co-advisor / Co-tutor",
        category: "esami",
        definition: "Un secondo relatore, interno o esterno all'Ateneo (es. un tutor aziendale), che segue lo studente nello svolgimento della tesi o del tirocinio.",
        definitionEn: "A second thesis advisor, either internal or external to the University (e.g. an industry tutor), assisting the student during the thesis or internship."
    },
    {
        term: "Esonero (o Prova Intermedia)",
        termEn: "Midterm Exam / Exemption",
        category: "esami",
        definition: "Una prova scritta o orale svolta a metà del periodo di lezione. Se superata, permette di \"alleggerire\" il programma d'esame per l'appello finale.",
        definitionEn: "A written or oral test taken mid-semester. Passing it typically reduces the syllabus required for the final exam."
    },
    {
        term: "Frequenza Obbligatoria",
        termEn: "Compulsory Attendance",
        category: "esami",
        definition: "Il vincolo previsto da alcuni regolamenti didattici che impone di frequentare una percentuale minima di ore di lezione (es. 70%) per poter accedere all'esame.",
        definitionEn: "The requirement to attend a minimum percentage of class hours (e.g. 70%) to be eligible to sit for the exam."
    },
    {
        term: "Insegnamento",
        termEn: "Course / Course Unit",
        category: "esami",
        definition: "Il singolo corso o materia di studio (es. Programmazione I) tenuto da uno o più professori.",
        definitionEn: "A single subject or course unit (e.g., Programming I) taught by one or more professors."
    },
    {
        term: "Modulo",
        termEn: "Module",
        category: "esami",
        definition: "Una parte autonoma di un insegnamento più ampio (chiamato Corso Integrato), che prevede un voto o una valutazione parziale.",
        definitionEn: "An autonomous part of a larger integrated course, carrying its own partial grade or evaluation."
    },
    {
        term: "Monografico",
        termEn: "Special Topic Course",
        category: "esami",
        definition: "Una parte del corso d'esame dedicata all'approfondimento specifico di un singolo tema, autore o argomento specialistico.",
        definitionEn: "A specialized part of a course dedicated to in-depth study of a specific topic, author, or research field."
    },
    {
        term: "Pre-appello",
        termEn: "Pre-exam Call",
        category: "esami",
        definition: "Un appello d'esame organizzato dai docenti subito dopo la fine delle lezioni, prima dell'inizio ufficiale della sessione ordinaria, riservato agli studenti frequentanti.",
        definitionEn: "An early exam call scheduled by professors right after classes end, before the official session starts, reserved for active attendees."
    },
    {
        term: "Proclamazione",
        termEn: "Graduation Ceremony / Proclamation",
        category: "esami",
        definition: "La cerimonia ufficiale durante la quale viene comunicato il voto finale di laurea e viene conferito legalmente il titolo di Dottore.",
        definitionEn: "The official ceremony where the final graduation mark is announced, legally awarding the status of Doctor."
    },
    {
        term: "Propedeuticità",
        termEn: "Prerequisites (Propedeuticità)",
        category: "esami",
        definition: "L'ordine logico e vincolante stabilito dal Regolamento Didattico per sostenere gli esami (non si può fare l'esame B se non si è superato l'esame A).",
        definitionEn: "Academic rule requiring you to pass specific foundational courses before taking more advanced ones (you cannot take exam B unless you have passed exam A)."
    },
    {
        term: "Relatore",
        termEn: "Thesis Advisor",
        category: "esami",
        definition: "Il docente che guida e supervisiona lo studente nella stesura della tesi di laurea.",
        definitionEn: "The faculty member who guides and supervises the student during the preparation and writing of the graduation thesis."
    },
    {
        term: "Rinuncia agli Studi",
        termEn: "University Withdrawal",
        category: "esami",
        definition: "L'atto formale e irrevocabile con cui uno studente decide di interrompere definitivamente la propria carriera universitaria.",
        definitionEn: "The formal and irrevocable decision to permanently withdraw from the university and terminate student status."
    },
    {
        term: "Salto d'Appello",
        termEn: "Exam Skip Penalty",
        category: "esami",
        definition: "Una sanzione o una regola applicata da alcuni docenti per cui lo studente bocciato a un appello non può presentarsi a quello immediatamente successivo nella stessa sessione.",
        definitionEn: "A policy where a student who fails an exam is barred from registering for the subsequent call within the same session."
    },
    {
        term: "Sessione di Laurea",
        termEn: "Graduation Session",
        category: "esami",
        definition: "Il periodo dell'anno (solitamente estiva, autunnale, straordinaria) in cui si svolgono le discussioni delle tesi e le proclamazioni dei laureandi.",
        definitionEn: "The scheduled periods of the year (usually summer, autumn, and extraordinary) dedicated to thesis defenses and graduations."
    },
    {
        term: "Silenzio Assenso",
        termEn: "Implicit Grade Acceptance",
        category: "esami",
        definition: "Regola amministrativa secondo cui la mancata risposta o il mancato rifiuto di un voto d'esame online entro un tot di giorni (solitamente 3 o 5 su Esse3) equivale all'accettazione automatica dello stesso.",
        definitionEn: "Administrative rule where failure to reject a grade online within a specific window (usually 3 or 5 days on Esse3) implies automatic acceptance."
    },
    {
        term: "Tirocinio Curriculare",
        termEn: "Curricular Internship",
        category: "esami",
        definition: "Un periodo di attività pratica/lavorativa obbligatoria svolto presso aziende, enti esterni o laboratori universitari, finalizzato all'acquisizione di CFU previsti dal piano di studi.",
        definitionEn: "A mandatory period of practical training in companies, external entities, or labs, necessary to obtain credit points (CFUs) for graduation."
    },
    {
        term: "Tutorato",
        termEn: "Student Tutoring",
        category: "esami",
        definition: "Servizio di supporto didattico e personale offerto da studenti degli anni magistrali o dottorandi (tutor) per aiutare gli studenti in difficoltà con materie critiche o con l'orientamento.",
        definitionEn: "A support service where senior or PhD students help undergraduates with difficult courses and academic guidance."
    },
    {
        term: "CFU (Credito Formativo Universitario)",
        termEn: "CFU (ECTS Credits)",
        category: "esami",
        definition: "Unità di misura del carico di studio richiesto ad uno studente. 1 CFU equivale normalmente a 25 ore di lavoro complessivo tra lezioni frontali, studio individuale ed esercitazioni.",
        definitionEn: "University Credit (equivalent to ECTS). It measures the study workload. 1 CFU normally equals 25 hours of work, including lectures and self-study."
    },

    // 3. Amministrazione, Tasse e Piattaforme UniMe
    {
        term: "Esse3",
        termEn: "Esse3 Portal",
        category: "tasse",
        definition: "Il sistema informativo di gestione della segreteria studenti di UniMe. Gestisce pagamenti, prenotazioni esami, carriera, libretto e domande di laurea.",
        definitionEn: "The central student portal for UniMe, handling registrations, exam bookings, tuition fee payments, and transcripts."
    },
    {
        term: "GAIA",
        termEn: "GAIA Chatbot",
        category: "tasse",
        definition: "L'assistente virtuale/chatbot basato su intelligenza artificiale integrato nei sistemi di UniMe per rispondere alle domande frequenti degli studenti.",
        definitionEn: "The AI-powered virtual assistant/chatbot integrated into UniMe portals to provide answers to common student inquiries."
    },
    {
        term: "Identità Digitale (o Credenziali Unime)",
        termEn: "Digital Identity (UniMe Credentials)",
        category: "tasse",
        definition: "L'account personale (solitamente nome.cognome@studenti.unime.it) che permette l'accesso a tutti i servizi digitali dell'Ateneo (Wi-Fi, Esse3, Microsoft Teams, casella email).",
        definitionEn: "Your personal student email account that grants access to all digital university services (Wi-Fi, Esse3, Microsoft Teams, email inbox)."
    },
    {
        term: "Moodle (o Piattaforma E-Learning)",
        termEn: "Moodle E-Learning",
        category: "tasse",
        definition: "L'ambiente web dove i docenti caricano il materiale didattico, le dispense, le slide delle lezioni e comunicano gli avvisi per il corso.",
        definitionEn: "The digital learning platform where professors upload lecture slides, reading materials, course notices, and assignments."
    },
    {
        term: "Avviso di Pagamento (pagoPA)",
        termEn: "pagoPA Payment Notice",
        category: "tasse",
        definition: "Il sistema elettronico obbligatorio con cui si pagano le tasse universitarie, i contributi o i bolli amministrativi a UniMe.",
        definitionEn: "The mandatory electronic system used to pay tuition fees, administrative stamps, and other university costs."
    },
    {
        term: "No Tax Area",
        termEn: "No Tax Area",
        category: "tasse",
        definition: "La soglia di valore ISEE-U sotto la quale lo studente è totalmente esonerato dal pagamento del contributo onnicomprensivo annuale, pagando solo la tassa regionale e il bollo.",
        definitionEn: "The ISEE-U income limit below which students are completely exempt from the annual comprehensive contribution, paying only regional taxes and stamp duty."
    },
    {
        term: "Contributo Onnicomprensivo",
        termEn: "Comprehensive Contribution",
        category: "tasse",
        definition: "La quota principale delle tasse universitarie, calcolata in maniera progressiva in base all'ISEE-U e al merito (CFU acquisiti).",
        definitionEn: "The main portion of tuition fees, calculated progressively based on the student's ISEE-U brackets and merit (CFUs)."
    },
    {
        term: "Tassa Regionale",
        termEn: "Regional Tax",
        category: "tasse",
        definition: "La quota fissa destinata all'ERSU per la gestione dei servizi per il diritto allo studio, obbligatoria per tutti gli studenti.",
        definitionEn: "A fixed fee designated for the regional student services agency (ERSU), compulsory for all enrolled students."
    },
    {
        term: "Mora",
        termEn: "Late Fee (Mora)",
        category: "tasse",
        definition: "La sanzione pecuniaria applicata allo studente in caso di ritardo nel pagamento delle rate delle tasse rispetto alle scadenze ufficiali.",
        definitionEn: "An extra penalty fee applied to tuition payments if they are made after the official deadline."
    },
    {
        term: "Segreteria Studenti",
        termEn: "Student Administration Office",
        category: "tasse",
        definition: "L'ufficio amministrativo centrale o di polo (es. Polo Papardo) incaricato della gestione burocratica delle carriere degli studenti.",
        definitionEn: "The central administrative office in charge of registration, transcripts, transfers, and official student documents."
    },
    {
        term: "Segreteria Didattica",
        termEn: "Educational Department Office",
        category: "tasse",
        definition: "L'ufficio interno al Dipartimento che si occupa della gestione degli orari delle lezioni, delle aule, dei calendari d'esame e del supporto diretto ai docenti del corso.",
        definitionEn: "The department office dealing with lecture schedules, classroom bookings, exam dates, and support for faculty members."
    },

    // 4. Struttura dell'Ateneo e Rappresentanza Studentesca
    {
        term: "Ateneo",
        termEn: "University (Ateneo)",
        category: "organizzazione",
        definition: "L'insieme di tutte le strutture, facoltà, dipartimenti e uffici che costituiscono l'Università nel suo complesso.",
        definitionEn: "The entire organization, facilities, faculties, departments, and offices comprising the University."
    },
    {
        term: "Rettore",
        termEn: "Rector",
        category: "organizzazione",
        definition: "La massima autorità accademica dell'Università, che presiede gli organi di governo (Senato Accademico e CdA) e rappresenta legalmente l'Ateneo.",
        definitionEn: "The highest academic authority representing the University, presiding over the Academic Senate and Board of Directors."
    },
    {
        term: "Direttore di Dipartimento",
        termEn: "Department Director",
        category: "organizzazione",
        definition: "Il docente eletto alla guida di un singolo Dipartimento (es. MIFT). Gestisce la ricerca, la spesa e il coordinamento del personale del dipartimento.",
        definitionEn: "The professor elected to head a single department (e.g. MIFT), managing research, budget, and departmental personnel."
    },
    {
        term: "Coordinatore del Corso di Laurea",
        termEn: "Degree Course Coordinator",
        category: "organizzazione",
        definition: "Il docente responsabile del funzionamento didattico di uno specifico corso (es. il CdL in Informatica). Gestisce le modifiche del piano di studi e le problematiche degli studenti di quel corso.",
        definitionEn: "The professor responsible for the pedagogical management of a specific degree program (e.g., Computer Science), handling study plan adjustments."
    },
    {
        term: "Polo Universitario",
        termEn: "University Campus / Polo",
        category: "organizzazione",
        definition: "La dislocazione territoriale delle strutture di UniMe. I principali sono Polo Centrale, Polo Annunziata, Polo Papardo, e Polo Policlinico.",
        definitionEn: "The territorial divisions of UniMe campuses. The main ones are Polo Centrale, Polo Annunziata, Polo Papardo, and Polo Policlinico."
    },
    {
        term: "Consiglio di Corso di Laurea (CdL)",
        termEn: "Degree Program Board (CdL)",
        category: "organizzazione",
        definition: "Organo collegiale composto da docenti e rappresentanti degli studenti del singolo corso. Approva i piani di studio individuali e monitora la didattica.",
        definitionEn: "A board of professors and student representatives of a specific course, approving individual study plans and monitoring classes."
    },
    {
        term: "Consiglio di Dipartimento",
        termEn: "Department Board",
        category: "organizzazione",
        definition: "Organo che pianifica l'offerta formativa complessiva del dipartimento, approva i bandi di tutorato e gestisce i laboratori scientifici. Include una quota di rappresentanti degli studenti.",
        definitionEn: "The governing body planning the department's educational catalog, approving tutor programs, and including student representatives."
    },
    {
        term: "Consulta degli Studenti",
        termEn: "Student Student Council",
        category: "organizzazione",
        definition: "L'organo istituzionale centralizzato composto dai rappresentanti eletti di tutti i dipartimenti. Formula proposte al Senato e al CdA su tasse, servizi e borse di studio.",
        definitionEn: "The centralized institutional body composed of elected student representatives, proposing policies on fees, student services, and scholarships."
    },
    {
        term: "Commissione Paritetica Docenti-Studenti (CPDS)",
        termEn: "Joint Faculty-Student Committee (CPDS)",
        category: "organizzazione",
        definition: "Un organo di controllo paritario (stesso numero di docenti e studenti) istituito a livello di Dipartimento. Monitora l'offerta formativa, la qualità della didattica e l'efficacia dei servizi, redigendo una relazione annuale.",
        definitionEn: "A departmental monitoring body with equal numbers of teachers and students checking course quality, teaching efficiency, and services."
    },
    {
        term: "Elettorato Attivo e Passivo",
        termEn: "Active and Passive Suffrage",
        category: "organizzazione",
        definition: "L'elettorato attivo è il diritto dello studente di votare per i propri rappresentanti; l'elettorato passivo è il diritto dello studente di candidarsi per essere eletto negli organi collegiali.",
        definitionEn: "Active suffrage is the right of a student to vote for representatives; passive suffrage is the right to run for election and be elected to boards."
    },

    // 5. Internazionalizzazione e Post-Laurea
    {
        term: "Erasmus+ Studio",
        termEn: "Erasmus+ Study",
        category: "internazionale",
        definition: "Programma di mobilità internazionale che permette di trascorrere un periodo (da 3 a 12 mesi) presso un'università europea partner, sostenendo esami riconosciuti poi nella propria carriera.",
        definitionEn: "International mobility program allowing students to study abroad (3 to 12 months) at a partner university and transfer credits."
    },
    {
        term: "Erasmus+ Traineeship",
        termEn: "Erasmus+ Internship",
        category: "internazionale",
        definition: "Programma europeo per lo svolgimento di tirocini formativi all'estero presso aziende, enti o istituti di ricerca.",
        definitionEn: "EU program designed for carrying out internships/work placements abroad in international companies or research institutions."
    },
    {
        term: "Learning Agreement (LA)",
        termEn: "Learning Agreement (LA)",
        category: "internazionale",
        definition: "Il contratto di studio ufficiale firmato prima della partenza per l'Erasmus, in cui si concordano gli esami da fare all'estero e le corrispettive materie da convalidare in Italia.",
        definitionEn: "The official study plan contract signed before starting Erasmus, detailing courses taken abroad and Italian equivalents."
    },
    {
        term: "Laurea Magistrale",
        termEn: "Master's Degree (Laurea Magistrale)",
        category: "internazionale",
        definition: "Il corso di studi di secondo livello, della durata di 2 anni (120 CFU), a cui si accede dopo la laurea triennale.",
        definitionEn: "A second-cycle degree course lasting 2 years (120 CFUs) accessible after obtaining a Bachelor's degree."
    },
    {
        term: "Master (di I e II livello)",
        termEn: "Professional Master (1st & 2nd level)",
        category: "internazionale",
        definition: "Corsi di perfezionamento scientifico e alta formazione permanente, successivi rispettivamente alla laurea triennale o magistrale. Non vanno confusi con la laurea magistrale.",
        definitionEn: "Postgraduate specialization programs following Bachelor's or Master's degrees, distinct from standard degree programs."
    },
    {
        term: "Dottorato di Ricerca (Ph.D.)",
        termEn: "PhD / Doctoral Program",
        category: "internazionale",
        definition: "Il terzo e massimo livello di istruzione universitaria, orientato alla formazione di ricercatori professionisti, della durata minima di 3 anni.",
        definitionEn: "The third and highest level of university education, focused on professional research training, lasting at least 3 years."
    },
    {
        term: "Almalaurea",
        termEn: "Almalaurea Consortium",
        category: "internazionale",
        definition: "Consorzio interuniversitario a cui UniMe aderisce. Raccoglie i profili e i CV dei laureandi per facilitare l'incontro tra domanda e offerta di lavoro e monitora la condizione occupazionale dei laureati.",
        definitionEn: "An Italian interuniversity database collecting graduates' CVs to match job demand and study employment statistics."
    }
]

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Dizionario Accademico delle Matricole",
        subtitle: "Trova il significato di tutti i termini burocratici e accademici dell'Università degli Studi di Messina.",
        searchPlaceholder: "Cerca un termine (es: CFU, Appello, Esse3...)",
        allCategories: "Tutte le categorie",
        cat_carriera: "Ammissione & Carriera",
        cat_esami: "Didattica & Esami",
        cat_tasse: "Tasse & Segreterie",
        cat_organizzazione: "Ateneo & Organi",
        cat_internazionale: "Internazionale & Post-Laurea",
        noResults: "Nessun termine trovato corrispondente a",
        clearSearch: "Cancella ricerca",
        termCount: "termini trovati"
    },
    en: {
        title: "Freshmen Academic Dictionary",
        subtitle: "Find the meaning of all bureaucratic and academic terms used at the University of Messina.",
        searchPlaceholder: "Search for a term (e.g., CFU, Exam Call, Esse3...)",
        allCategories: "All categories",
        cat_carriera: "Admission & Career",
        cat_esami: "Lectures & Exams",
        cat_tasse: "Fees & Admin",
        cat_organizzazione: "University & Reps",
        cat_internazionale: "International & Post-Grad",
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
            <div className="space-y-4">
                {/* Search Bar (Full Width) */}
                <div className="relative w-full">
                    <Search className="absolute left-4 top-3.5 size-5 text-zinc-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a] text-sm font-semibold transition-all shadow-sm"
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

                {/* Category Selector (Scrollable Row) */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                            selectedCategory === "all"
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                                : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        )}
                    >
                        {t.allCategories}
                    </button>
                    {["carriera", "esami", "tasse", "organizzazione", "internazionale"].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0",
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
                                className="p-6 rounded-3xl bg-white border border-zinc-200/60 shadow-sm hover:shadow-lg hover:border-zinc-400 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-0.5"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider",
                                            item.category === "carriera" && "bg-blue-50 text-blue-600",
                                            item.category === "esami" && "bg-emerald-50 text-emerald-600",
                                            item.category === "tasse" && "bg-amber-50 text-amber-600",
                                            item.category === "organizzazione" && "bg-purple-50 text-purple-600",
                                            item.category === "internazionale" && "bg-rose-50 text-[#c9041a]"
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
