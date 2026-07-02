"use server"

import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/mail"
import { BRANDS, getNewsletterSubscriptionTemplate } from "@/lib/email-templates"

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get("email") as string
    const brand = (formData.get("brand") as string) || "morgana"
    const locale = (formData.get("locale") as string) || "it"

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
            subject: locale === "en" ? "Newsletter Subscription Confirmed" : "Conferma Iscrizione Newsletter",
            brand: brand === "orum" ? "orum" : "morgana",
            html: getNewsletterSubscriptionTemplate(brand, locale),
        })

        return { success: true }
    } catch (error) {
        console.error("Newsletter subscription error:", error)
        return { success: false, error: "Si è verificato un errore. Riprova più tardi." }
    }
}
