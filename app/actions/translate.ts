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
/**
 * Translates text from Italian to English using a public translation API.
 * Handles long texts by splitting them into chunks to respect API limits.
 * Preserves HTML tags by protecting them during the translation process.
 */
export async function translateText(text: string): Promise<{ success: boolean; translation?: string; error?: string }> {
    if (!text || text.trim() === "") {
        return { success: true, translation: "" }
    }

    try {
        // Step 1: Protect HTML tags
        const { protectedText, tagsMap } = protectTags(text)

        const MAX_CHUNK_LENGTH = 450 // Staying under 500 limit for MyMemory
        const chunks = splitTextIntoChunks(protectedText, MAX_CHUNK_LENGTH)
        const translatedChunks: string[] = []

        for (const chunk of chunks) {
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
                return {
                    success: false,
                    translation: restoreTags(translatedChunks.join(" "), tagsMap),
                    error: "Una parte del testo non è stata tradotta correttamente."
                }
            }

            if (chunks.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 200))
            }
        }

        const fullTranslation = translatedChunks.join(" ")

        // Step 2: Restore HTML tags
        const restoredTranslation = restoreTags(fullTranslation, tagsMap)

        return {
            success: true,
            translation: restoredTranslation
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
 * Protects HTML tags by replacing them with unique placeholders.
 * This prevents the translation API from mangling or removing them.
 */
function protectTags(text: string): { protectedText: string; tagsMap: Map<string, string> } {
    const tagsMap = new Map<string, string>()
    let counter = 0

    // Match HTML tags: <tag>, </tag>, <tag />
    const protectedText = text.replace(/<[^>]+>/g, (match) => {
        const placeholder = `[[#${counter}#]]`
        tagsMap.set(placeholder, match)
        counter++
        return placeholder
    })

    return { protectedText, tagsMap }
}

/**
 * Restores HTML tags from placeholders.
 * Handles potential spaces added by translation APIs around placeholders.
 */
function restoreTags(text: string, tagsMap: Map<string, string>): string {
    let restoredText = text

    tagsMap.forEach((originalTag, placeholder) => {
        // Use a fuzzy regex to find the placeholder because translators often add spaces:
        // [[ # 0 # ]] instead of [[#0#]]
        const parts = placeholder.replace(/\[\[|\]\]/g, '').split('#')
        const escapedId = parts[1]
        const fuzzyRegex = new RegExp(`\\[\\s*\\[\\s*#\\s*${escapedId}\\s*#\\s*\\]\\s*\\]`, 'g')

        restoredText = restoredText.replace(fuzzyRegex, originalTag)
    })

    return restoredText
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
