"use server"

import { sendEmail } from "@/lib/mail"

export async function sendSupportMessage(formData: {
    name: string
    email: string
    subject: string
    message: string
}) {
    try {
        const result = await sendEmail({
            to: "associazionemorgana@gmail.com",
            subject: `[SUPPORTO] ${formData.subject} - da ${formData.name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
                    <h2 style="color: #111;">Nuova richiesta di assistenza</h2>
                    <p><strong>Nome:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Oggetto:</strong> ${formData.subject}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="white-space: pre-line;"><strong>Messaggio:</strong><br />${formData.message}</p>
                </div>
            `,
            brand: "morgana"
        })

        if (!result.success) {
            throw new Error(result.error)
        }

        return { success: true }
    } catch (error) {
        console.error("Support email error:", error)
        return { success: false, error: "Si è verificato un errore durante l'invio del messaggio. Riprova più tardi." }
    }
}
