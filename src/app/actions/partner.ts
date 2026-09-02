"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export type PartnerSession = {
    id: string
    name: string
    email: string
    conventionId: string
    conventionName: string
    conventionLogo?: string | null
}

export async function partnerLoginAction(email: string, password: string) {
    try {
        if (!email || !password) {
            return { success: false, error: "Compila tutti i campi." }
        }

        const cleanEmail = email.trim().toLowerCase()
        const partner = await prisma.partnerUser.findUnique({
            where: { email: cleanEmail },
            include: { convention: true }
        })

        if (!partner) {
            return { success: false, error: "Credenziali partner errate o account non trovato." }
        }

        const match = await bcrypt.compare(password, partner.password)
        if (!match) {
            return { success: false, error: "Credenziali partner errate." }
        }

        const cookieStore = cookies()
        cookieStore.set("partner_session_id", partner.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30 // 30 giorni
        })

        return {
            success: true,
            partner: {
                id: partner.id,
                name: partner.name,
                email: partner.email,
                conventionId: partner.conventionId,
                conventionName: partner.convention.name,
                conventionLogo: partner.convention.logo
            }
        }
    } catch (e: any) {
        console.error("Error in partnerLoginAction:", e)
        return { success: false, error: "Errore di connessione. Riprova più tardi." }
    }
}

export async function getPartnerSession(): Promise<PartnerSession | null> {
    try {
        const partnerId = cookies().get("partner_session_id")?.value
        if (!partnerId) return null

        const partner = await prisma.partnerUser.findUnique({
            where: { id: partnerId },
            include: { convention: true }
        })

        if (!partner) return null

        return {
            id: partner.id,
            name: partner.name,
            email: partner.email,
            conventionId: partner.conventionId,
            conventionName: partner.convention.name,
            conventionLogo: partner.convention.logo
        }
    } catch (e) {
        console.error("Error fetching partner session:", e)
        return null
    }
}

export async function partnerLogoutAction() {
    cookies().delete("partner_session_id")
}

export async function verifyStudentQrCode(qrToken: string) {
    try {
        const partnerSession = await getPartnerSession()
        if (!partnerSession) {
            return { success: false, error: "Sessione partner scaduta o non valida." }
        }

        if (!qrToken || typeof qrToken !== "string") {
            return { success: false, error: "Codice QR non valido." }
        }

        const cleanToken = qrToken.trim()

        const user = await prisma.user.findUnique({
            where: { qrToken: cleanToken }
        })

        if (!user) {
            return {
                success: false,
                isValid: false,
                error: "Tessera studente non trovata nel sistema."
            }
        }

        if (!user.emailVerified) {
            return {
                success: false,
                isValid: false,
                error: "Email dello studente non verificata. Tessera inattiva."
            }
        }

        // Registra la scansione
        const scan = await prisma.conventionScan.create({
            data: {
                conventionId: partnerSession.conventionId,
                userId: user.id,
                scannedById: partnerSession.id
            }
        })

        return {
            success: true,
            isValid: true,
            student: {
                name: user.name,
                surname: user.surname,
                matricola: user.matricola,
                department: user.department,
                degreeCourse: user.degreeCourse,
                association: user.association,
                createdAt: user.createdAt
            },
            scanTime: scan.createdAt
        }
    } catch (e: any) {
        console.error("Error verifying QR code:", e)
        return { success: false, error: "Errore durante la verifica della tessera." }
    }
}

export async function getPartnerAnalytics() {
    try {
        const partnerSession = await getPartnerSession()
        if (!partnerSession) {
            return { success: false, error: "Non autorizzato." }
        }

        const convention = await prisma.convention.findUnique({
            where: { id: partnerSession.conventionId },
            include: {
                scans: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                surname: true,
                                matricola: true,
                                association: true
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!convention) {
            return { success: false, error: "Convenzione non trovata." }
        }

        const now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const totalScans = convention.scans.length
        const todayScans = convention.scans.filter(s => new Date(s.createdAt) >= startOfToday).length
        const weekScans = convention.scans.filter(s => new Date(s.createdAt) >= startOfWeek).length
        const monthScans = convention.scans.filter(s => new Date(s.createdAt) >= startOfMonth).length

        // Conteggio per giorno negli ultimi 7 giorni
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (6 - i))
            const dayStr = d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })
            const count = convention.scans.filter(s => {
                const scanDate = new Date(s.createdAt)
                return scanDate.toDateString() === d.toDateString()
            }).length
            return { day: dayStr, count }
        })

        return {
            success: true,
            analytics: {
                totalScans,
                todayScans,
                weekScans,
                monthScans,
                last7Days,
                recentScans: convention.scans.slice(0, 20),
                discounts: convention.discounts,
                conventionName: convention.name,
                conventionCategory: convention.category,
                conventionLogo: convention.logo
            }
        }
    } catch (e: any) {
        console.error("Error fetching partner analytics:", e)
        return { success: false, error: "Errore nel recupero delle statistiche." }
    }
}

export async function updatePartnerDiscounts(discounts: string[]) {
    try {
        const partnerSession = await getPartnerSession()
        if (!partnerSession) {
            return { success: false, error: "Non autorizzato." }
        }

        const cleanDiscounts = discounts.map(d => d.trim()).filter(d => d.length > 0)
        if (cleanDiscounts.length === 0) {
            return { success: false, error: "Inserisci almeno uno sconto valido." }
        }

        await prisma.convention.update({
            where: { id: partnerSession.conventionId },
            data: { discounts: cleanDiscounts }
        })

        return { success: true }
    } catch (e: any) {
        console.error("Error updating partner discounts:", e)
        return { success: false, error: "Errore nell'aggiornamento degli sconti." }
    }
}

// Funzione Admin per creare o aggiornare un account partner
export async function createPartnerAccount(data: {
    email: string
    password?: string
    name: string
    conventionId: string
}) {
    try {
        const { cookies } = await import("next/headers")
        const adminEmail = cookies().get("session_email")?.value
        if (!adminEmail) return { success: false, error: "Non autenticato." }

        const admin = await prisma.user.findUnique({ where: { email: adminEmail } })
        if (admin?.role !== "SUPER_ADMIN") {
            return { success: false, error: "Permesso negato." }
        }

        const cleanEmail = data.email.trim().toLowerCase()

        // Check if partner already exists for this convention
        const existingForConvention = await prisma.partnerUser.findFirst({
            where: { conventionId: data.conventionId }
        })

        // Check email conflict with another convention
        const existingEmailUser = await prisma.partnerUser.findUnique({
            where: { email: cleanEmail }
        })

        if (existingEmailUser && existingEmailUser.conventionId !== data.conventionId) {
            return { success: false, error: "Questa email è già registrata per un'altra convenzione." }
        }

        if (existingForConvention) {
            // Update existing partner
            const updateData: any = {
                email: cleanEmail,
                name: data.name.trim()
            }
            if (data.password && data.password.trim().length > 0) {
                updateData.password = await bcrypt.hash(data.password.trim(), 10)
            }

            const updated = await prisma.partnerUser.update({
                where: { id: existingForConvention.id },
                data: updateData
            })

            return { success: true, isUpdated: true, partner: updated }
        } else {
            // Create new partner
            if (!data.password || data.password.trim().length < 6) {
                return { success: false, error: "La password deve contenere almeno 6 caratteri." }
            }

            const hashedPassword = await bcrypt.hash(data.password.trim(), 10)

            const partner = await prisma.partnerUser.create({
                data: {
                    email: cleanEmail,
                    password: hashedPassword,
                    name: data.name.trim(),
                    conventionId: data.conventionId
                }
            })

            return { success: true, isCreated: true, partner }
        }
    } catch (e: any) {
        console.error("Error creating/updating partner account:", e)
        return { success: false, error: "Errore durante il salvataggio dell'account partner." }
    }
}
