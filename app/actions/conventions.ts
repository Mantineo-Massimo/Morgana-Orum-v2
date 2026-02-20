"use server"

import prisma from "@/lib/prisma"

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
