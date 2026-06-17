"use server"

import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { sendEmail } from "@/lib/mail"
import { getNewsletterTemplate } from "@/lib/email-templates"

type NotificationType = "Notizia" | "Evento"

export async function sendPublicationNotification(
    item: { 
        id: string | number
        title: string
        titleEn?: string | null
        description: string | null
        descriptionEn?: string | null
        associations: Association[] 
    },
    type: NotificationType
) {
    try {
        const subscribers = await prisma.user.findMany({
            where: { newsletter: true },
            select: { email: true, name: true }
        })

        if (subscribers.length === 0) return

        const { headers } = await import("next/headers")
        const referer = headers().get("referer")
        const locale = (referer?.includes("/en/") || referer?.endsWith("/en")) ? "en" : "it"
        const isEn = locale === "en"

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.morganaorum.it"
        const primaryAssoc = item.associations[0] || Association.MORGANA_ORUM
        const brand = (primaryAssoc === Association.MORGANA_ORUM) ? "morgana" : "orum"

        const path = type === "Notizia" ? "news" : "events"
        const url = `${baseUrl}/${locale}/${path}/${item.id}`

        // Save to DB (Dashboard Messages)
        await prisma.notification.create({
            data: {
                title: `Nuov${type === "Notizia" ? "a" : "o"} ${type}: ${item.title}`,
                titleEn: `New ${type === "Notizia" ? "News" : "Event"}: ${item.titleEn || item.title}`,
                message: item.description || "",
                messageEn: item.descriptionEn || item.description || "",
                type: type,
                link: url
            }
        })

        console.log(`Sending ${type} notifications to ${subscribers.length} subscribers...`)

        const subject = isEn 
            ? `New ${type === "Notizia" ? "News" : "Event"}: ${item.titleEn || item.title}` 
            : `Nuov${type === "Notizia" ? "a" : "o"} ${type}: ${item.title}`

        const displayTitle = isEn ? (item.titleEn || item.title) : item.title
        const displayDesc = isEn ? (item.descriptionEn || item.description || "") : (item.description || "")

        // Send emails asynchronously (non-blocking)
        Promise.allSettled(subscribers.map(sub =>
            sendEmail({
                to: sub.email,
                subject: subject,
                html: getNewsletterTemplate(sub.name, displayTitle, displayDesc, url, type, brand, locale),
                brand: brand as "morgana" | "orum"
            })
        )).catch(err => console.error(`Async newsletter error (${type}):`, err))

    } catch (error) {
        console.error(`Failed to send notification for ${type}:`, error)
    }
}

export async function getNotifications() {
    try {
        return await prisma.notification.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        })
    } catch (error) {
        console.error("Failed to fetch notifications:", error)
        return []
    }
}

export async function registerDeadlineAlert({
    email,
    deadlineId,
    locale
}: {
    email: string
    deadlineId: string
    locale: string
}) {
    if (!email || !email.includes("@")) {
        return { success: false, error: locale === "en" ? "Invalid email address." : "Email non valida." }
    }

    try {
        const countdown = await prisma.deadlineCountdown.findUnique({
            where: { id: deadlineId }
        })

        if (!countdown) {
            return { success: false, error: locale === "en" ? "Deadline not found." : "Scadenza non trovata." }
        }

        // Check if alert already exists
        const existingAlert = await prisma.deadlineAlert.findUnique({
            where: {
                email_countdownId: {
                    email,
                    countdownId: deadlineId
                }
            }
        })

        if (existingAlert) {
            return { success: false, error: locale === "en" ? "Alert already registered for this deadline." : "Ti sei già registrato per questa scadenza." }
        }

        // Register alert in DB
        await prisma.deadlineAlert.create({
            data: {
                email,
                countdownId: deadlineId,
                locale
            }
        })

        const { getDeadlineAlertTemplate } = await import("@/lib/email-templates")
        const { sendEmail } = await import("@/lib/mail")

        const formattedDate = countdown.date.toLocaleDateString(locale === "en" ? "en-US" : "it-IT", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Rome"
        })

        const deadlineTitle = locale === "en" ? (countdown.titleEn || countdown.title) : countdown.title

        // Send confirmation email
        const res = await sendEmail({
            to: email,
            subject: locale === "en" 
                ? `UniMe Deadline Alert: ${deadlineTitle}` 
                : `Promemoria Scadenza UniMe: ${deadlineTitle}`,
            html: getDeadlineAlertTemplate(deadlineTitle, formattedDate, locale),
            brand: "joint"
        })

        if (!res.success) {
            return { success: false, error: res.error || (locale === "en" ? "Failed to send email." : "Impossibile inviare l'email.") }
        }

        return { success: true }
    } catch (err) {
        console.error("Failed to register deadline alert:", err)
        return { success: false, error: err instanceof Error ? err.message : String(err) }
    }
}
