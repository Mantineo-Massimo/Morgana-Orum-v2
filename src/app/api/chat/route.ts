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

        // 2. Format database objects into concise Markdown sections
        const repsText = reps.map(r => 
            `- ${r.name}: Ruolo "${r.role || "Rappresentante"}" (${r.category}), Mandato/Biennio: ${r.term}, Associazione: ${r.association}, Email: ${r.email || "Non indicata"}, Instagram: ${r.instagram || "Non indicato"}${r.roleDescription ? ` (Descrizione ruolo: ${r.roleDescription})` : ""}`
        ).join("\n")

        const servicesText = services.map(c => 
            `### Categoria: ${c.title} (EN: ${c.titleEn || "N/A"})\n` + 
            c.items.map(i => `  - **${i.name}**: ${i.description} | Link: ${i.href || "Non disponibile"}`).join("\n")
        ).join("\n\n")

        const groupsText = groups.map(g => 
            `- **${g.name}** (EN: ${g.nameEn || g.name}): Categoria "${g.category}", Dipartimento: "${g.department || "Generale"}", Link di invito: ${g.link}`
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
Sei MorganaOrumBot, l'assistente virtuale ufficiale del portale delle associazioni studentesche Morgana e O.R.U.M. all'Università degli Studi di Messina (UniMe).
Il tuo scopo è rispondere in modo chiaro, preciso e amichevole a domande degli studenti riguardanti i servizi accademici, i rappresentanti eletti, le guide burocratiche per matricole e studenti, i gruppi WhatsApp del network e gli eventi in programma.

Rispondi sempre nella lingua utilizzata dall'utente (Italiano o Inglese).

Ecco i dati reali, aggiornati e attendibili presi direttamente dal database del portale:

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

REGOLE COMPORTAMENTALI CRITICHE:
1. Basati esclusivamente sui dati reali forniti sopra per dare risposte specifiche. Non inventare link o email.
2. Rispondi usando un tono giovanile, educato, caloroso ed utile.
3. Se l'utente ti chiede informazioni su argomenti diversi (es. programmazione, sport esterni, meteo, compiti a casa, codice, ricette, politica generale), rispondi gentilmente spiegando che sei programmato solo per assistere sulla vita universitaria di UniMe e sulle attività delle associazioni Morgana e O.R.U.M.
4. Se l'utente ti fa una domanda a cui non puoi rispondere basandoti sui dati sopra, oppure se esprime frustrazione, o se chiede di contattare un umano o la segreteria, rispondi testualmente con questa esatta indicazione:
   "Mi dispiace, non ho questa informazione nel mio database. Puoi inviare un messaggio diretto alla nostra segreteria compilando il modulo di contatto integrato cliccando sul pulsante 'Contatta la Segreteria' qui in alto o in basso."
5. Usa sempre la formattazione Markdown per rendere la risposta leggibile (grassetto, elenchi puntati, blocchi di testo). Rendi i link WhatsApp o i link dei servizi direttamente cliccabili nel testo usando la sintassi standard [Testo](url).
`

        // 4. Map client messages format to Gemini API expected contents schema
        // Gemini expects 'user' or 'model' roles
        const formattedContents = messages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }))

        // 5. Call Gemini API using native fetch
        const modelName = "gemini-1.5-flash"
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
