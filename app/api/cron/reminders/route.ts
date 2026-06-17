import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/mail"
import { getDeadlineReminderEmailTemplate } from "@/lib/email-templates"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    // Basic protection check: only execute if CRON_SECRET matches, if defined
    const authHeader = request.headers.get("authorization")
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const now = new Date()
        
        // Find all active alerts for future deadlines
        const activeAlerts = await prisma.deadlineAlert.findMany({
            where: {
                countdown: {
                    date: { gte: now }
                }
            },
            include: {
                countdown: true
            }
        })

        console.log(`Cron reminders evaluation: found ${activeAlerts.length} active alerts to process.`)
        let sentCount = 0

        for (const alertRecord of activeAlerts) {
            const { countdown, email, locale } = alertRecord
            const targetTime = new Date(countdown.date).getTime()
            const diffMs = targetTime - now.getTime()
            
            // Calculate time intervals in milliseconds
            const ONE_DAY = 24 * 60 * 60 * 1000
            const FIVE_DAYS = 5 * ONE_DAY
            const ONE_WEEK = 7 * ONE_DAY
            const ONE_MONTH = 30 * ONE_DAY

            let shouldSend = false
            let typeKey: "oneDay" | "fiveDays" | "oneWeek" | "oneMonth" | null = null
            let intervalLabel = ""

            // 1. Check for 1-day threshold
            if (diffMs <= ONE_DAY && !alertRecord.sentOneDay) {
                shouldSend = true
                typeKey = "oneDay"
                intervalLabel = locale === "en" ? "tomorrow" : "domani"
            } 
            // 2. Check for 5-days threshold
            else if (diffMs <= FIVE_DAYS && diffMs > ONE_DAY && !alertRecord.sentFiveDays) {
                shouldSend = true
                typeKey = "fiveDays"
                intervalLabel = locale === "en" ? "in 5 days" : "tra 5 giorni"
            }
            // 3. Check for 1-week threshold
            else if (diffMs <= ONE_WEEK && diffMs > FIVE_DAYS && !alertRecord.sentOneWeek) {
                shouldSend = true
                typeKey = "oneWeek"
                intervalLabel = locale === "en" ? "in 1 week" : "tra 1 settimana"
            }
            // 4. Check for 1-month threshold
            else if (diffMs <= ONE_MONTH && diffMs > ONE_WEEK && !alertRecord.sentOneMonth) {
                shouldSend = true
                typeKey = "oneMonth"
                intervalLabel = locale === "en" ? "in 1 month" : "tra 1 mese"
            }

            if (shouldSend && typeKey) {
                const formattedDate = countdown.date.toLocaleDateString(locale === "en" ? "en-US" : "it-IT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Rome"
                })

                const deadlineTitle = locale === "en" ? (countdown.titleEn || countdown.title) : countdown.title
                const subject = locale === "en"
                    ? `UniMe Deadline Reminder: ${deadlineTitle} (${intervalLabel})`
                    : `Promemoria Scadenza UniMe: ${deadlineTitle} (${intervalLabel})`

                const html = getDeadlineReminderEmailTemplate(deadlineTitle, formattedDate, intervalLabel, locale)

                const emailRes = await sendEmail({
                    to: email,
                    subject,
                    html,
                    brand: "joint"
                })

                if (emailRes.success) {
                    sentCount++
                    const updateData: any = {}
                    if (typeKey === "oneDay") updateData.sentOneDay = true
                    if (typeKey === "fiveDays") updateData.sentFiveDays = true
                    if (typeKey === "oneWeek") updateData.sentOneWeek = true
                    if (typeKey === "oneMonth") updateData.sentOneMonth = true

                    await prisma.deadlineAlert.update({
                        where: { id: alertRecord.id },
                        data: updateData
                    })
                }
            }
        }

        return NextResponse.json({ success: true, evaluated: activeAlerts.length, sent: sentCount })
    } catch (err) {
        console.error("Cron reminders error:", err)
        return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 })
    }
}
