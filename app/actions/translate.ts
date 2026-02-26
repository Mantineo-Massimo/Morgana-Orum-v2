"use server"

/**
 * Translates text from Italian to English using a public translation API.
 * This is a basic implementation. For production, consider using Google Cloud Translation,
 * DeepL, or an LLM API (Gemini/OpenAI).
 */
/**
 * Translates text from Italian to English using a public translation API.
 * Handles long texts by splitting them into chunks to respect API limits.
 */
export async function translateText(text: string): Promise<{ success: boolean; translation?: string; error?: string }> {
    if (!text || text.trim() === "") {
        return { success: true, translation: "" }
    }

    try {
        const MAX_CHUNK_LENGTH = 450 // Staying under 500 limit for MyMemory
        const chunks = splitTextIntoChunks(text, MAX_CHUNK_LENGTH)
        const translatedChunks: string[] = []

        for (const chunk of chunks) {
            // Using MyMemory API (free tier, limited)
            // https://mymemory.translated.net/doc/spec.php
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=it|en`
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                if (errorData.responseStatus === 403) {
                    throw new Error("Limite di traduzione giornaliero raggiunto. Riprova domani o usa una chiave API.")
                }
                throw new Error(errorData.responseDetails || "Errore del servizio di traduzione")
            }

            const data = await response.json()

            if (data.responseData && data.responseData.translatedText) {
                translatedChunks.push(data.responseData.translatedText)
            } else {
                // If one chunk fails, we return what we have so far but with an error flag
                return {
                    success: false,
                    translation: translatedChunks.join(" "),
                    error: "Una parte del testo non è stata tradotta correttamente."
                }
            }

            // Subtle delay to avoid rate limiting if many chunks
            if (chunks.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 200))
            }
        }

        return {
            success: true,
            translation: translatedChunks.join(" ")
        }
    } catch (error) {
        console.error("Translation error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Errore durante la traduzione"
        }
    }
}

/**
 * Splits string into chunks of max length without breaking words where possible.
 */
function splitTextIntoChunks(text: string, maxLength: number): string[] {
    const chunks: string[] = []
    let currentPos = 0

    while (currentPos < text.length) {
        let chunkEnd = currentPos + maxLength

        if (chunkEnd < text.length) {
            // Try to find the last space, newline or punctuation to avoid breaking words
            const lastSpace = text.lastIndexOf(" ", chunkEnd)
            const lastNewline = text.lastIndexOf("\n", chunkEnd)
            const splitPoint = Math.max(lastSpace, lastNewline)

            if (splitPoint > currentPos) {
                chunkEnd = splitPoint
            }
        } else {
            chunkEnd = text.length
        }

        chunks.push(text.slice(currentPos, chunkEnd).trim())
        currentPos = chunkEnd
    }

    return chunks.filter(c => c.length > 0)
}
