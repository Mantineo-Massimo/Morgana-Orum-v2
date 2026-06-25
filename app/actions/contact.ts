"use server"

import { sendEmail } from "@/lib/mail"
import { getContactEmailTemplate } from "@/lib/email-templates"
import { z } from "zod"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { headers } from "next/headers"

const contactSchema = z.object({
    name: z.string().min(1, "Il nome è obbligatorio.").max(100, "Il nome è troppo lungo."),
    email: z.string().email("L'indirizzo email non è valido."),
    subject: z.string().min(1, "L'oggetto è obbligatorio.").max(200, "L'oggetto è troppo lungo."),
    message: z.string().min(10, "Il messaggio deve avere almeno 10 caratteri.").max(3000, "Il messaggio è troppo lungo (max 3000 caratteri)."),
})

export async function submitContactForm(formData: {
    name: string
    email: string
    subject: string
    message: string
}) {
    // Rate limit: 5 contact submissions per IP per 60 minutes
    const ip = getClientIp(headers())
    const { allowed } = await rateLimit("contact", ip, { limit: 5, windowMinutes: 60 })
    if (!allowed) {
        return { success: false, error: "Hai inviato troppi messaggi di recente. Riprova tra un'ora." }
    }

    // Validate and sanitize input
    const result = contactSchema.safeParse(formData)
    if (!result.success) {
        const firstError = result.error.errors[0]?.message
        return { success: false, error: firstError || "Dati non validi." }
    }

    const { name, email, subject, message } = result.data

    try {
        // Send to Associations (both emails)
        await Promise.all([
            sendEmail({
                to: "segreteria@morganaorum.it",
                subject: `[Contatto Sito] ${subject}`,
                html: getContactEmailTemplate(name, email, subject, message),
                brand: "morgana"
            }),
        ])

        return { success: true }
    } catch (error) {
        console.error("Contact form error:", error)
        return { success: false, error: "Si è verificato un errore durante l'invio. Riprova più tardi." }
    }
}
