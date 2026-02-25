"use server"

import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/mail"
import { BRANDS } from "@/lib/email-templates"

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get("email") as string

    if (!email || !email.includes("@")) {
        return { success: false, error: "Indirizzo email non valido." }
    }

    try {
        // Check if already exists
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        })

        if (existing) {
            if (existing.active) {
                return { success: false, error: "Sei già iscritto alla nostra newsletter!" }
            } else {
                // Reactivate
                await prisma.newsletterSubscriber.update({
                    where: { email },
                    data: { active: true },
                })
            }
        } else {
            // Create new
            await prisma.newsletterSubscriber.create({
                data: { email },
            })
        }

        // Send confirmation email via AWS SES
        await sendEmail({
            to: email,
            subject: "Conferma Iscrizione Newsletter - Morgana & O.R.U.M.",
            brand: "morgana",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #c9041a; text-align: center;">Benvenuto nella nostra Newsletter!</h2>
          <p>Ciao,</p>
          <p>Grazie per esserti iscritto alla newsletter delle <strong>Associazioni Universitarie Morgana & O.R.U.M.</strong>.</p>
          <p>Da oggi riceverai aggiornamenti su:</p>
          <ul>
            <li>Eventi e seminari</li>
            <li>Scadenze universitarie importanti</li>
            <li>Nuove convenzioni per gli studenti</li>
            <li>Comunicazioni istituzionali</li>
          </ul>
          <p>Siamo felici di averti con noi!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">
            Se non hai richiesto tu l'iscrizione, puoi ignorare questa email o contattarci per la rimozione.
          </p>
        </div>
      `,
        })

        return { success: true }
    } catch (error) {
        console.error("Newsletter subscription error:", error)
        return { success: false, error: "Si è verificato un errore. Riprova più tardi." }
    }
}
