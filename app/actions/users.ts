"use server"

import prisma from "@/lib/prisma"
import { Association, Role } from "@prisma/client"
import bcrypt from "bcryptjs"


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
                matricola: user.matricola,
                association: user.association,
                qrToken: user.qrToken,
                role: user.role,
                memberSince: user.createdAt.getFullYear()
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
                createdAt: true
            }
        })
    } catch (error) {
        console.error("Error fetching all users:", error)
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

        if (newRole === "SUPER_ADMIN" || newRole === "ADMIN_MORGANA") {
            // These roles MUST be Morgana/Orum
            finalAssociation = "MORGANA_ORUM"
        } else if (newRole === "ADMIN_NETWORK") {
            // Admin Network CANNOT be Morgana/Orum
            const userToUpdate = await prisma.user.findUnique({ where: { id: userId } })
            const currentAssoc = association || userToUpdate?.association

            if (currentAssoc === "MORGANA_ORUM") {
                finalAssociation = "UNIMHEALTH" // Default to first valid network
            }
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

export async function adminCreateUser(data: any) {
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

        const hashedPassword = await bcrypt.hash(data.password || "Password123!", 10)

        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: hashedPassword,
                birthDate: new Date(data.birthDate),
                matricola: data.matricola,
                department: data.department,
                degreeCourse: data.degreeCourse,
                isFuorisede: data.isFuorisede || false,
                newsletter: data.newsletter || false,
                role: data.role as Role,
                association: data.association as Association,
            }
        })

        return { success: true, user: newUser }
    } catch (error: any) {
        console.error("Error creating user:", error)
        if (error.code === 'P2002') {
            return { success: false, error: "Email o Matricola già in uso." }
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
