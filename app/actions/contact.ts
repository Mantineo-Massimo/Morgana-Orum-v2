"use server"

import { sendEmail } from "@/lib/mail"
import { getContactEmailTemplate } from "@/lib/email-templates"

export async function submitContactForm(formData: {
    name: string
    email: string
    subject: string
    message: string
}) {
    const { name, email, subject, message } = formData

    if (!name || !email || !subject || !message) {
        return { success: false, error: "Tutti i campi sono obbligatori." }
    }

    try {
        // Send to Associations (both emails)
        await Promise.all([
            sendEmail({
                to: "associazionemorgana@gmail.com",
                subject: `[Contatto Sito] ${subject}`,
                html: getContactEmailTemplate(name, email, subject, message),
                brand: "morgana"
            }),
            sendEmail({
                to: "orum_unime@gmail.com",
                subject: `[Contatto Sito] ${subject}`,
                html: getContactEmailTemplate(name, email, subject, message),
                brand: "orum"
            })
        ])

        return { success: true }
    } catch (error) {
        console.error("Contact form error:", error)
        return { success: false, error: "Si è verificato un errore durante l'invio. Riprova più tardi." }
    }
}
