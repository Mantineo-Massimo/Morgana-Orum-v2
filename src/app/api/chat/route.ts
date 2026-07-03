import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Interface for client-sent messages
interface ChatMessage {
    role: "user" | "assistant"
    content: string
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json() as { messages: ChatMessage[] }
        
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Messaggi non validi o mancanti" }, { status: 400 })
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is missing in environment variables.")
            return NextResponse.json({ 
                error: "Servizio di intelligenza artificiale non configurato. Imposta la variabile GEMINI_API_KEY." 
            }, { status: 500 })
        }

        // 1. Fetch live database data to serve as contextual knowledge (RAG-like prompt injection)
        const [reps, services, groups, guides, events] = await Promise.all([
            prisma.representative.findMany({
                orderBy: { name: "asc" }
            }),
            prisma.serviceCategory.findMany({
                include: { items: { orderBy: { order: "asc" } } },
                orderBy: { order: "asc" }
            }),
            prisma.whatsAppGroup.findMany({
                orderBy: { order: "asc" }
            }),
            prisma.guide.findMany({
                include: { steps: { orderBy: { order: "asc" } } },
                orderBy: { order: "asc" }
            }),
            prisma.event.findMany({
                where: { 
                    published: true,
                    date: { gte: new Date() } 
                },
                orderBy: { date: "asc" }
            })
        ])

        // Helper functions to format database enums into human-readable strings
        const formatAssociation = (assoc: string) => {
            switch (assoc) {
                case "MORGANA_ORUM":
                    return "Morgana & O.R.U.M."
                case "PIAZZA_DELLARTE":
                    return "Piazza dell'Arte"
                default:
                    return assoc
            }
        }

        const formatGroupCategory = (cat: string) => {
            switch (cat) {
                case "ACADEMIC":
                    return "Accademico / Corso di Studi"
                case "COMMUNITY":
                    return "Community / Gruppo di Interesse"
                case "SANITARY_VET":
                    return "Sanitaria e Veterinaria"
                default:
                    return cat
            }
        }

        // 2. Format database objects into concise Markdown sections
        const repsText = reps.map(r => 
            `- ${r.name}: Ruolo "${r.role || "Rappresentante"}" (${r.category}), Mandato/Biennio: ${r.term}, Associazione: ${formatAssociation(r.association)}, Email: ${r.email || "Non indicata"}, Instagram: ${r.instagram || "Non indicato"}${r.roleDescription ? ` (Descrizione ruolo: ${r.roleDescription})` : ""}`
        ).join("\n")

        const servicesText = services.map(c => 
            `### Categoria: ${c.title} (EN: ${c.titleEn || "N/A"})\n` + 
            c.items.map(i => `  - **${i.name}**: ${i.description} | Link: ${i.href || "Non disponibile"}`).join("\n")
        ).join("\n\n")

        const groupsText = groups.map(g => 
            `- **${g.name}** (EN: ${g.nameEn || g.name}): Categoria "${formatGroupCategory(g.category)}", Dipartimento: "${g.department || "Generale"}", Link di invito: ${g.link}`
        ).join("\n")

        const guidesText = guides.map(g => 
            `### Guida: ${g.title} (EN: ${g.titleEn || "N/A"})\n${g.description}\n` + 
            g.steps.map(s => `  - Step ${s.order + 1}. **${s.title}**: ${s.description}`).join("\n")
        ).join("\n\n")

        const eventsText = events.length > 0
            ? events.map(e => 
                `- **${e.title}**: in data ${e.date.toLocaleDateString("it-IT")} presso ${e.location}. CFU: ${e.cfuValue || "Non previsti"}. Descrizione: ${e.description}`
              ).join("\n")
            : "Nessun evento futuro in programma al momento."

        // 3. Assemble the System Prompt with guidelines and context data
        const systemPrompt = `
Sei IArmone, l'assistente virtuale ufficiale del portale delle associazioni studentesche Morgana e O.R.U.M. all'Università degli Studi di Messina (UniMe).
Il tuo scopo è rispondere in modo chiaro, preciso e amichevole a domande degli studenti riguardanti i servizi accademici, i rappresentanti eletti, le guide burocratiche per matricole e studenti, i gruppi WhatsApp del network, gli eventi in programma, e info generali sulla vita universitaria (tasse, borse di studio ERSU, mense, esse3).

Rispondi sempre nella lingua utilizzata dall'utente (Italiano o Inglese).

Ecco i dati reali del database del portale e i link istituzionali di riferimento:

=========================================
1. RAPPRESENTANTI DEGLI STUDENTI ELETTI
${repsText}

=========================================
2. SERVIZI ACCADEMICI ED AGEVOLAZIONI (SBA, ERSU, Tasse, Wifi, ecc.)
${servicesText}

=========================================
3. GRUPPI WHATSAPP DELLE COMMUNITY E DEI CORSI
${groupsText}

=========================================
4. GUIDE BUROCRATICHE E PROCEDURALI
${guidesText}

=========================================
5. PROSSIMI EVENTI ORGANIZZATI
${eventsText}

=========================================
6. LINK E SITI ISTITUZIONALI DI RIFERIMENTO (UniMe & ERSU)
- **Sito Ufficiale Università degli Studi di Messina (UniMe)**: https://www.unime.it
- **Portale Studenti ESSE3 (Iscrizioni, Carriera, Prenotazione Esami)**: https://unime.esse3.cineca.it
- **Sito Ufficiale ERSU Messina (Borse di studio, Alloggi, Mense, Tasse regionali)**: http://www.ersu.me.it (oppure https://www.ersumessina.it)
- **Segreterie Studenti UniMe (Contatti e orari)**: https://www.unime.it/servizi-agli-studenti/segreterie-studenti
=========================================

REGOLE COMPORTAMENTALI CRITICHE:
1. Per info specifiche sul network (gruppi WhatsApp interni, eventi e guide del portale, contatti dei nostri rappresentanti), usa ESCLUSIVAMENTE i dati reali forniti sopra. Non inventare o allucinare questi dettagli.
2. Per info generali sull'Università degli Studi di Messina (UniMe) o sull'ERSU (es. funzionamento delle borse di studio, tasse universitarie ed esenzioni ISEE, orari e funzionamento delle mense/alloggi ERSU, date accademiche e procedure su ESSE3), usa le tue conoscenze pre-addestrate per dare risposte utili ed indirizza gli studenti ai rispettivi siti istituzionali ufficiali ([UniMe](https://www.unime.it), [ESSE3](https://unime.esse3.cineca.it) o [ERSU Messina](http://www.ersu.me.it)).
3. Rispondi usando un tono giovanile, educato, caloroso ed utile.
4. Se l'utente ti chiede informazioni su argomenti del tutto estranei all'università (es. programmazione, sport esterni, meteo, ricette di cucina, politica generale), rispondi spiegando che sei un assistente universitario e puoi rispondere solo a domande su UniMe, ERSU e sulle associazioni Morgana e O.R.U.M.
5. Se l'utente ti fa una domanda a cui non sai rispondere basandoti sui dati reali o sulle tue conoscenze, rispondi con questa indicazione:
   "Mi dispiace, non ho questa informazione specifica nel mio database. Puoi inviare un messaggio diretto alla nostra segreteria compilando il modulo di contatto integrato cliccando sul pulsante 'Contatta la Segreteria' qui in alto o in basso."
6. Usa sempre la formattazione Markdown per rendere la risposta leggibile (grassetto, elenchi puntati, blocchi di testo). Rendi tutti i link (WhatsApp, siti UniMe/ERSU) direttamente cliccabili nel testo usando la sintassi standard [Testo](url).
`

        // 4. Map client messages format to Gemini API expected contents schema
        // Gemini expects 'user' or 'model' roles
        const formattedContents = messages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }))

        // 5. Call Gemini API using native fetch
        const modelName = "gemini-2.5-flash-lite"
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: formattedContents,
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    generationConfig: {
                        temperature: 0.3, // Low temperature for factual compliance
                        maxOutputTokens: 1000
                    }
                })
            }
        )

        if (!response.ok) {
            const errBody = await response.text()
            console.error("❌ Gemini API request failed:", errBody)
            return NextResponse.json({ 
                error: `Errore Gemini API: ${errBody}` 
            }, { status: 502 })
        }

        const data = await response.json() as {
            candidates?: {
                content?: {
                    parts?: { text: string }[]
                }
            }[]
        }

        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
        if (!textResponse) {
            return NextResponse.json({ error: "Risposta vuota da parte dell'intelligenza artificiale." }, { status: 502 })
        }

        return NextResponse.json({ response: textResponse })

    } catch (error) {
        console.error("❌ Chat API error:", error)
        return NextResponse.json({ 
            error: `Errore del server: ${error instanceof Error ? error.message : String(error)}` 
        }, { status: 500 })
    }
}
