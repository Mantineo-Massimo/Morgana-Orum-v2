"use server"

import prisma from "@/lib/prisma"
import { revalidatePath, unstable_cache } from "next/cache"

// --- ARTISTS ---

const getPiazzaArtistsInternal = async () => {
    try {
        return await prisma.piazzaArtist.findMany({
            orderBy: { order: "asc" }
        })
    } catch (error) {
        console.error("Error fetching Piazza artists:", error)
        return []
    }
}

export const getPiazzaArtists = unstable_cache(
    async () => getPiazzaArtistsInternal(),
    ['piazza-artists-list'],
    { revalidate: 3600, tags: ['piazza'] }
)

export async function createPiazzaArtist(data: {
    name: string,
    role: string,
    category: string,
    bio: string,
    image?: string | null,
    badge?: string | null,
    order?: number
}) {
    try {
        await prisma.piazzaArtist.create({ data })
        revalidatePath("/network/piazzadellarte/artisti")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Create Piazza artist error:", error)
        return { success: false, error: "Errore nella creazione dell'artista." }
    }
}

export async function updatePiazzaArtist(id: string, data: any) {
    try {
        await prisma.piazzaArtist.update({
            where: { id },
            data
        })
        revalidatePath("/network/piazzadellarte/artisti")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Update Piazza artist error:", error)
        return { success: false, error: "Errore nell'aggiornamento dell'artista." }
    }
}

export async function deletePiazzaArtist(id: string) {
    try {
        await prisma.piazzaArtist.delete({ where: { id } })
        revalidatePath("/network/piazzadellarte/artisti")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Delete Piazza artist error:", error)
        return { success: false, error: "Errore nell'eliminazione dell'artista." }
    }
}

// --- PROGRAM ---

const getPiazzaProgramInternal = async () => {
    try {
        return await prisma.piazzaProgramItem.findMany({
            orderBy: [
                { timeSlot: "asc" },
                { order: "asc" }
            ]
        })
    } catch (error) {
        console.error("Error fetching Piazza program:", error)
        return []
    }
}

export const getPiazzaProgram = unstable_cache(
    async () => getPiazzaProgramInternal(),
    ['piazza-program-list'],
    { revalidate: 3600, tags: ['piazza'] }
)

export async function createPiazzaProgramItem(data: {
    title: string,
    description: string,
    timeSlot: string,
    startTime?: string | null,
    endTime?: string | null,
    icon?: string | null,
    order?: number
}) {
    try {
        await prisma.piazzaProgramItem.create({ data })
        revalidatePath("/network/piazzadellarte/programma")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Create Piazza program item error:", error)
        return { success: false, error: "Errore nella creazione dell'attività." }
    }
}

export async function updatePiazzaProgramItem(id: string, data: any) {
    try {
        await prisma.piazzaProgramItem.update({
            where: { id },
            data
        })
        revalidatePath("/network/piazzadellarte/programma")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Update Piazza program item error:", error)
        return { success: false, error: "Errore nell'aggiornamento dell'attività." }
    }
}

export async function deletePiazzaProgramItem(id: string) {
    try {
        await prisma.piazzaProgramItem.delete({ where: { id } })
        revalidatePath("/network/piazzadellarte/programma")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Delete Piazza program item error:", error)
        return { success: false, error: "Errore nell'eliminazione dell'attività." }
    }
}

// --- MEDIA ---

const getPiazzaMediaInternal = async (type?: string) => {
    try {
        const where: any = {}
        if (type) where.type = type
        return await prisma.piazzaMediaItem.findMany({
            where,
            orderBy: { order: "asc" }
        })
    } catch (error) {
        console.error("Error fetching Piazza media:", error)
        return []
    }
}

export const getPiazzaMedia = unstable_cache(
    async (type?: string) => getPiazzaMediaInternal(type),
    ['piazza-media-list'],
    { revalidate: 3600, tags: ['piazza'] }
)

export async function createPiazzaMediaItem(data: {
    type: string,
    title: string,
    description?: string | null,
    url?: string | null,
    thumbnail?: string | null,
    personName?: string | null,
    personRole?: string | null,
    duration?: string | null,
    order?: number
}) {
    try {
        await prisma.piazzaMediaItem.create({ data })
        revalidatePath("/network/piazzadellarte/media")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Create Piazza media item error:", error)
        return { success: false, error: "Errore nella creazione del contenuto media." }
    }
}

export async function updatePiazzaMediaItem(id: string, data: any) {
    try {
        await prisma.piazzaMediaItem.update({
            where: { id },
            data
        })
        revalidatePath("/network/piazzadellarte/media")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Update Piazza media item error:", error)
        return { success: false, error: "Errore nell'aggiornamento del contenuto media." }
    }
}

export async function deletePiazzaMediaItem(id: string) {
    try {
        await prisma.piazzaMediaItem.delete({ where: { id } })
        revalidatePath("/network/piazzadellarte/media")
        revalidatePath("/admin/piazza")
        return { success: true }
    } catch (error) {
        console.error("Delete Piazza media item error:", error)
        return { success: false, error: "Errore nell'eliminazione del contenuto media." }
    }
}
