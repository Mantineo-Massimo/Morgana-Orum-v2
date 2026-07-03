"use server"

import prisma from "@/lib/prisma"
import itMessages from "../../messages/it.json"
import enMessages from "../../messages/en.json"

// Type definition for static page catalog
interface StaticPageDefinition {
    id: string
    url: string
    title: { it: string; en: string }
    desc: { it: string; en: string }
    translationKeys?: string[]
    keywords?: { it: string[]; en: string[] }
}

const STATIC_PAGES: StaticPageDefinition[] = [
    {
        id: "about",
        url: "/about",
        title: { it: "Chi Siamo", en: "About Us" },
        desc: {
            it: "La nostra storia, la presentazione delle associazioni Morgana e O.R.U.M. e la partnership strategica.",
            en: "Our history, the presentation of Morgana and O.R.U.M. associations, and the strategic partnership."
        },
        translationKeys: ["AboutPage"]
    },
    {
        id: "organigramma",
        url: "/organigramma",
        title: { it: "Organigramma", en: "Organization Chart" },
        desc: {
            it: "La struttura organizzativa interna, i coordinatori delle aree e i responsabili d'ateneo.",
            en: "Internal organizational structure, area coordinators, and university heads."
        },
        translationKeys: ["Navigation.organigramma_desc", "Navigation.organigramma"]
    },
    {
        id: "gruppi",
        url: "/gruppi",
        title: { it: "Gruppi WhatsApp", en: "WhatsApp Groups" },
        desc: {
            it: "I canali e i gruppi WhatsApp ufficiali per i corsi accademici e la community studentesca.",
            en: "Official WhatsApp channels and groups for academic courses and student community."
        },
        keywords: {
            it: ["whatsapp", "gruppi", "corsi", "laurea", "dipartimenti", "community", "canale", "contattaci"],
            en: ["whatsapp", "groups", "courses", "degree", "departments", "community", "channel", "contact"]
        }
    },
    {
        id: "guide",
        url: "/guide",
        title: { it: "Guide e Servizi", en: "Guides & Services" },
        desc: {
            it: "Guide utili su tasse, borse di studio ERSU, trasporti, simulatori di voto e dizionario accademico.",
            en: "Useful guides on tuition fees, ERSU scholarships, transport, grade simulator, and academic dictionary."
        },
        translationKeys: ["Navigation.guides_desc", "Navigation.guides"],
        keywords: {
            it: ["guida", "guide", "tasse", "calcolatore", "ersu", "borse di studio", "merito", "dizionario", "simulatore", "voto", "media", "trasporti", "mappa", "servizi", "didattica", "statuto"],
            en: ["guide", "guides", "fees", "calculator", "ersu", "scholarships", "merit", "dictionary", "simulator", "grade", "average", "transport", "map", "services", "education", "statute"]
        }
    },
    {
        id: "convenzioni",
        url: "/convenzioni",
        title: { it: "Convenzioni Studentesche", en: "Student Conventions" },
        desc: {
            it: "Sconti e agevolazioni commerciali per gli associati presso negozi, palestre e librerie.",
            en: "Discounts and benefits for members at shops, gyms, and bookstores."
        },
        keywords: {
            it: ["convenzioni", "sconti", "agevolazioni", "tessera", "negozi", "palestre", "librerie", "messina", "melilli"],
            en: ["conventions", "discounts", "benefits", "card", "shops", "gyms", "bookstores", "messina", "melilli"]
        }
    },
    {
        id: "iniziative",
        url: "/iniziative",
        title: { it: "Le Nostre Iniziative", en: "Our Initiatives" },
        desc: {
            it: "I grandi progetti: Cineforum, Piazza dell'Arte, La Notte dei Regali, tornei sportivi e conferenze.",
            en: "Major projects: Cineforum, Piazza dell'Arte, Night of Gifts, sports tournaments, and conferences."
        },
        translationKeys: ["IniziativePage"]
    },
    {
        id: "media-kit",
        url: "/media-kit",
        title: { it: "Media Kit", en: "Media Kit" },
        desc: {
            it: "Loghi e asset grafici ufficiali delle associazioni Morgana, O.R.U.M. e delle altre sigle del network.",
            en: "Official logos and assets of Morgana, O.R.U.M. and other network brands."
        },
        translationKeys: ["MediaKitPage"]
    },
    {
        id: "contact",
        url: "/contact",
        title: { it: "Contatti", en: "Contact Us" },
        desc: {
            it: "Scrivici un messaggio per chiarimenti, segnalazioni o collaborazioni con i rappresentanti.",
            en: "Write us a message for clarifications, reports, or collaborations with representatives."
        },
        keywords: {
            it: ["contatti", "scrivici", "email", "messaggio", "sede", "indirizzo", "segnalazione", "collaborazione", "messina"],
            en: ["contacts", "contact", "write us", "email", "message", "office", "address", "report", "collaboration", "messina"]
        }
    },
    {
        id: "faq",
        url: "/faq",
        title: { it: "FAQ - Domande Frequenti", en: "FAQ - Frequently Asked Questions" },
        desc: {
            it: "Risposte rapide su tasse, CFU, iscrizioni agli eventi e problematiche della vita universitaria.",
            en: "Quick answers on fees, CFU, event registration, and university life issues."
        },
        keywords: {
            it: ["faq", "domande", "risposte", "cfu", "rinnovo", "tessera", "iscrizione", "disdetta", "problemi", "esami"],
            en: ["faq", "questions", "answers", "cfu", "renewal", "card", "registration", "cancellation", "problems", "exams"]
        }
    },
    {
        id: "privacy",
        url: "/privacy",
        title: { it: "Privacy Policy", en: "Privacy Policy" },
        desc: {
            it: "Informativa sul trattamento dei dati personali raccolti sul portale ex Regolamento UE 2016/679.",
            en: "Information on the processing of personal data collected on the portal ex EU Regulation 2016/679."
        },
        translationKeys: ["Privacy"]
    },
    {
        id: "cookie",
        url: "/cookie",
        title: { it: "Cookie Policy", en: "Cookie Policy" },
        desc: {
            it: "Informativa sull'uso dei cookie tecnici e analitici per il corretto funzionamento del sito.",
            en: "Information on the use of technical and analytical cookies for proper site functioning."
        },
        translationKeys: ["Cookie"]
    },
    {
        id: "terms",
        url: "/terms",
        title: { it: "Termini e Condizioni", en: "Terms & Conditions" },
        desc: {
            it: "Le condizioni generali che regolano l'uso del portale e la partecipazione alle nostre attività.",
            en: "General conditions governing the use of the portal and participation in our activities."
        },
        translationKeys: ["Terms"]
    },
    {
        id: "social",
        url: "/social",
        title: { it: "Canali Social", en: "Social Channels" },
        desc: {
            it: "Tutti i profili e le community social ufficiali di Morgana e O.R.U.M. (Instagram, TikTok, YouTube).",
            en: "All official social profiles and communities of Morgana and O.R.U.M. (Instagram, TikTok, YouTube)."
        },
        translationKeys: ["SocialPage"]
    }
]

// Helper function to recursively search for a string inside a JSON value
function searchInJson(value: any, query: string): boolean {
    if (typeof value === "string") {
        return value.toLowerCase().includes(query.toLowerCase())
    }
    if (typeof value === "object" && value !== null) {
        return Object.values(value).some(val => searchInJson(val, query))
    }
    return false
}

// Helper function to resolve dot-notated paths in objects
function getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

export async function globalSearch(query: string) {
    if (!query || query.length < 2) return { news: [], events: [], representatives: [], pages: [] }

    const lowerQuery = query.toLowerCase()

    // 1. Search database items
    const [news, events, representatives] = await Promise.all([
        prisma.news.findMany({
            where: {
                published: true,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 5
        }),
        prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { location: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 5
        }),
        prisma.representative.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { role: { contains: query, mode: 'insensitive' } },
                    { department: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 5
        })
    ])

    // 2. Search static pages
    let showOrganigramma = true
    try {
        const config = await prisma.organigrammaConfig.findUnique({
            where: { id: "config" }
        })
        if (config && !config.visible) {
            showOrganigramma = false
        }
    } catch {}

    const matchingPages: any[] = []
    const activePages = STATIC_PAGES.filter(p => p.id !== "organigramma" || showOrganigramma)

    for (const page of activePages) {
        let isMatch = false

        // Check title and desc
        if (
            page.title.it.toLowerCase().includes(lowerQuery) ||
            page.title.en.toLowerCase().includes(lowerQuery) ||
            page.desc.it.toLowerCase().includes(lowerQuery) ||
            page.desc.en.toLowerCase().includes(lowerQuery)
        ) {
            isMatch = true
        }

        // Check keywords
        if (!isMatch && page.keywords) {
            const hasKeywordIt = page.keywords.it.some(k => k.toLowerCase().includes(lowerQuery))
            const hasKeywordEn = page.keywords.en.some(k => k.toLowerCase().includes(lowerQuery))
            if (hasKeywordIt || hasKeywordEn) {
                isMatch = true
            }
        }

        // Check translation files for translationKeys content
        if (!isMatch && page.translationKeys) {
            for (const key of page.translationKeys) {
                const itVal = getValueByPath(itMessages, key)
                const enVal = getValueByPath(enMessages, key)

                if (searchInJson(itVal, query) || searchInJson(enVal, query)) {
                    isMatch = true
                    break
                }
            }
        }

        if (isMatch) {
            matchingPages.push({
                id: page.id,
                url: page.url,
                // We return both languages, client will select based on locale
                titleIt: page.title.it,
                titleEn: page.title.en,
                descIt: page.desc.it,
                descEn: page.desc.en
            })
        }
    }

    return { 
        news, 
        events, 
        representatives, 
        pages: matchingPages.slice(0, 5) 
    }
}
