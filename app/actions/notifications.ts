"use server"

import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { sendEmail } from "@/lib/mail"
import { getNewsletterTemplate } from "@/lib/email-templates"

type NotificationType = "Notizia" | "Evento"

export async function sendPublicationNotification(
    item: { id: string | number, title: string, description: string | null, association: Association },
    type: NotificationType
) {
    try {
        const subscribers = await prisma.user.findMany({
            where: { newsletter: true },
            select: { email: true, name: true }
        })

        if (subscribers.length === 0) return

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://morganaorum.vercel.app"
        const brand = (item.association === Association.MORGANA_ORUM) ? "morgana" : "orum"

        const path = type === "Notizia" ? "news" : "events"
        const url = `${baseUrl}/network/${brand}/${path}/${item.id}`

        // Save to DB (Dashboard Messages)
        await prisma.notification.create({
            data: {
                title: `Nuov${type === "Notizia" ? "a" : "o"} ${type}: ${item.title}`,
                message: item.description || "",
                type: type,
                link: url
            }
        })

        console.log(`Sending ${type} notifications to ${subscribers.length} subscribers...`)

        // Send emails asynchronously (non-blocking)
        Promise.allSettled(subscribers.map(sub =>
            sendEmail({
                to: sub.email,
                subject: `Nuov${type === "Notizia" ? "a" : "o"} ${type}: ${item.title}`,
                html: getNewsletterTemplate(sub.name, item.title, item.description || "", url, type, brand),
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
