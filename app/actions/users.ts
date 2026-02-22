"use server"

import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"


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
