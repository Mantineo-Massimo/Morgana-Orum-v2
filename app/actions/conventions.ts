"use server"

import prisma from "@/lib/prisma"

async function checkSuperAdminPermission() {
    const { cookies } = await import("next/headers")
    const userEmail = cookies().get("session_email")?.value
    if (!userEmail) return false

    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    return user?.role === "SUPER_ADMIN"
}

export async function getConventions(location?: string) {
    try {
        const conventions = await prisma.convention.findMany({
            where: location ? { location } : {},
            orderBy: { name: 'asc' }
        })
        return conventions
    } catch (error) {
        console.error("Error fetching conventions:", error)
        return []
    }
}

export async function getConventionById(id: string) {
    try {
        const convention = await prisma.convention.findUnique({
            where: { id }
        })
        return convention
    } catch (error) {
        console.error("Error fetching convention by id:", error)
        return null
    }
}

export async function createConvention(data: {
    name: string
    category: string
    social?: string
    logo?: string
    website?: string
    location: string
    discounts: string[]
}) {
    if (!(await checkSuperAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const convention = await prisma.convention.create({
            data
        })
        return { success: true, convention }
    } catch (error) {
        console.error("Error creating convention:", error)
        return { success: false, error: "Errore durante la creazione della convenzione" }
    }
}

export async function updateConvention(id: string, data: {
    name: string
    category: string
    social?: string
    logo?: string
    website?: string
    location: string
    discounts: string[]
}) {
    if (!(await checkSuperAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const convention = await prisma.convention.update({
            where: { id },
            data
        })
        return { success: true, convention }
    } catch (error) {
        console.error("Error updating convention:", error)
        return { success: false, error: "Errore durante l'aggiornamento della convenzione" }
    }
}

export async function deleteConvention(id: string) {
    if (!(await checkSuperAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        await prisma.convention.delete({
            where: { id }
        })
        return { success: true }
    } catch (error) {
        console.error("Error deleting convention:", error)
        return { success: false, error: "Errore durante l'eliminazione della convenzione" }
    }
}
