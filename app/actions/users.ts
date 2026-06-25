"use server"

import prisma from "@/lib/prisma"
import { Association, Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"


export async function getUserDashboardData(email?: string) {
    try {
        let userEmail = email

        // If no email provided, try getting from cookie
        if (!userEmail) {
            const { cookies } = await import("next/headers")
            userEmail = cookies().get("session_email")?.value
        }

        if (!userEmail) return null

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
                registrations: {
                    include: {
                        event: true
                    }
                }
            }
        })

        if (!user) return null

        // Transform for frontend
        const events = user.registrations.map(reg => ({
            id: reg.event.id,
            title: reg.event.title,
            date: reg.event.date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: reg.status === "REGISTERED" ? "In attesa" :
                reg.status === "ATTENDED" ? "Partecipato" : "CFU Convalidati",
            points: reg.event.cfuValue
        }))

        return {
            user: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                matricola: user.matricola,
                department: user.department,
                degreeCourse: user.degreeCourse,
                isFuorisede: user.isFuorisede,
                birthDate: user.birthDate.toISOString().split('T')[0],
                association: user.association,
                qrToken: user.qrToken,
                role: user.role,
                memberSince: user.createdAt.getFullYear(),
                consenso_marketing_orum: user.consenso_marketing_orum,
                consenso_marketing_morgana: user.consenso_marketing_morgana,
                accettazione_termini_condivisi: user.accettazione_termini_condivisi
            },
            events
        }

    } catch (error) {
        console.error("Error fetching dashboard data:", error)
        return null
    }
}

export async function getAllUsers() {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return null

        const currentUser = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
            throw new Error("Unauthorized")
        }

        return await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                role: true,
                association: true,
                matricola: true,
                createdAt: true,
                birthDate: true,
                department: true,
                degreeCourse: true,
                isFuorisede: true,
                newsletter: true,
                consenso_marketing_orum: true,
                consenso_marketing_morgana: true,
                accettazione_termini_condivisi: true
            }
        })
    } catch (error) {
        console.error("Error fetching all users:", error)
        return null
    }
}

export async function updateUserConsents(data: { orum: boolean, morgana: boolean }) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return { success: false, error: "Unauthorized" }

        await prisma.user.update({
            where: { email: userEmail },
            data: {
                consenso_marketing_orum: data.orum,
                consenso_marketing_morgana: data.morgana,
                newsletter: data.orum || data.morgana
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error updating consents:", error)
        return { success: false, error: "Failed to update consents" }
    }
}

export async function deleteOwnAccount() {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return { success: false, error: "Unauthorized" }

        await prisma.user.delete({
            where: { email: userEmail }
        })

        // Clear cookies
        const cookieStore = cookies()
        cookieStore.delete("session_email")
        cookieStore.delete("user_role")

        return { success: true }
    } catch (error) {
        console.error("Error deleting account:", error)
        return { success: false, error: "Failed to delete account" }
    }
}

export async function exportUserData() {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return null

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
                registrations: {
                    include: {
                        event: true
                    }
                }
            }
        })

        if (!user) return null

        return {
            personal_data: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                birthDate: user.birthDate,
                matricola: user.matricola,
                department: user.department,
                degreeCourse: user.degreeCourse,
                isFuorisede: user.isFuorisede,
            },
            consents: {
                marketing_orum: user.consenso_marketing_orum,
                marketing_morgana: user.consenso_marketing_morgana,
                privacy_accepted: user.accettazione_termini_condivisi,
                createdAt: user.createdAt
            },
            registrations: user.registrations.map(r => ({
                event: r.event.title,
                date: r.event.date,
                status: r.status
            }))
        }
    } catch (error) {
        console.error("Error exporting data:", error)
        return null
    }
}

export async function updateUserRole(
    userId: number,
    newRole: "USER" | "ADMIN_NETWORK" | "ADMIN_MORGANA" | "SUPER_ADMIN",
    association?: Association
) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return { success: false, error: "Unauthorized" }

        const currentUser = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
            return { success: false, error: "Unauthorized" }
        }

        // Enforce strict constraints:
        let finalAssociation = association

        if (newRole === "SUPER_ADMIN" || newRole === "ADMIN_MORGANA" || newRole === "ADMIN_NETWORK") {
            // These roles MUST be Morgana/Orum
            finalAssociation = "MORGANA_ORUM"
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                role: newRole,
                ...(finalAssociation && { association: finalAssociation })
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error updating user role:", error)
        return { success: false, error: "Failed to update role" }
    }
}

export async function deleteUser(userId: number) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return { success: false, error: "Unauthorized" }

        const currentUser = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.user.delete({
            where: { id: userId }
        })

        return { success: true }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, error: "Failed to delete user" }
    }
}

const adminCreateUserSchema = z.object({
    name: z.string().min(1, "Nome obbligatorio"),
    surname: z.string().min(1, "Cognome obbligatorio"),
    email: z.string().email("Email non valida"),
    password: z.string().min(8, "La password deve essere di almeno 8 caratteri"),
    birthDate: z.string().min(1, "Data di nascita obbligatoria"),
    matricola: z.string().min(1, "Matricola obbligatoria"),
    department: z.string().min(1, "Dipartimento obbligatorio"),
    degreeCourse: z.string().min(1, "Corso di laurea obbligatorio"),
    isFuorisede: z.boolean().optional().default(false),
    newsletter: z.boolean().optional().default(false),
    consenso_marketing_orum: z.boolean().optional().default(false),
    consenso_marketing_morgana: z.boolean().optional().default(false),
    accettazione_termini_condivisi: z.boolean().optional().default(false),
    role: z.nativeEnum(Role),
    association: z.nativeEnum(Association),
})

export async function adminCreateUser(data: z.infer<typeof adminCreateUserSchema>) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return { success: false, error: "Unauthorized" }

        const currentUser = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
            return { success: false, error: "Unauthorized" }
        }

        // Validate input — throws ZodError if invalid
        const validData = adminCreateUserSchema.parse(data)

        const hashedPassword = await bcrypt.hash(validData.password, 10)

        const newUser = await prisma.user.create({
            data: {
                name: validData.name,
                surname: validData.surname,
                email: validData.email,
                password: hashedPassword,
                birthDate: new Date(validData.birthDate),
                matricola: validData.matricola,
                department: validData.department,
                degreeCourse: validData.degreeCourse,
                isFuorisede: validData.isFuorisede,
                newsletter: validData.newsletter,
                consenso_marketing_orum: validData.consenso_marketing_orum,
                consenso_marketing_morgana: validData.consenso_marketing_morgana,
                accettazione_termini_condivisi: validData.accettazione_termini_condivisi,
                role: validData.role,
                association: validData.association,
            }
        })

        return { success: true, user: newUser }
    } catch (error: any) {
        console.error("Error creating user:", error)
        if (error.code === 'P2002') {
            return { success: false, error: "Email o Matricola già in uso." }
        }
        if (error.name === 'ZodError') {
            return { success: false, error: error.errors[0]?.message || "Dati non validi." }
        }
        return { success: false, error: "Creazione fallita" }
    }
}

export async function adminUpdateUser(userId: number, data: any) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return { success: false, error: "Unauthorized" }

        const currentUser = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
            return { success: false, error: "Unauthorized" }
        }

        const updateData: any = {
            name: data.name,
            surname: data.surname,
            email: data.email,
            birthDate: new Date(data.birthDate),
            matricola: data.matricola,
            department: data.department,
            degreeCourse: data.degreeCourse,
            isFuorisede: data.isFuorisede,
            newsletter: data.newsletter,
            consenso_marketing_orum: data.consenso_marketing_orum,
            consenso_marketing_morgana: data.consenso_marketing_morgana,
            accettazione_termini_condivisi: data.accettazione_termini_condivisi,
            role: data.role as Role,
            association: data.association as Association,
        }

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10)
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: updateData
        })

        return { success: true, user: updated }
    } catch (error: any) {
        console.error("Error updating user:", error)
        if (error.code === 'P2002') {
            return { success: false, error: "Email o Matricola già in uso." }
        }
        return { success: false, error: "Aggiornamento fallito" }
    }
}

export async function updateOwnProfile(data: {
    name: string
    surname: string
    email: string
    matricola: string
    birthDate?: string | Date
    department?: string
    degreeCourse?: string
    isFuorisede?: boolean
    password?: string
}) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return { success: false, error: "Unauthorized" }

        const updateData: any = {
            name: data.name,
            surname: data.surname,
            email: data.email,
            matricola: data.matricola,
            department: data.department,
            degreeCourse: data.degreeCourse,
            isFuorisede: data.isFuorisede,
        }

        if (data.birthDate) {
            updateData.birthDate = new Date(data.birthDate)
        }

        if (data.password && data.password.trim() !== "") {
            updateData.password = await bcrypt.hash(data.password, 10)
        }

        await prisma.user.update({
            where: { email: userEmail },
            data: updateData
        })

        // If email was changed, update session cookie
        if (data.email !== userEmail) {
            cookies().set("session_email", data.email, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7 // 1 week
            })
        }

        return { success: true }
    } catch (error: any) {
        console.error("Error updating own profile:", error)
        if (error.code === 'P2002') {
            return { success: false, error: "Email o Matricola già in uso." }
        }
        return { success: false, error: "Impossibile aggiornare i dati profilo." }
    }
}
