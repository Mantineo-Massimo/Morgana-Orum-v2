"use server"

import prisma from "@/lib/prisma"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"

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

export const getPiazzaArtists = async () => {
    return await getPiazzaArtistsInternal()
}

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
        revalidatePath("/piazzadellarte/artisti")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
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
        revalidatePath("/piazzadellarte/artisti")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Update Piazza artist error:", error)
        return { success: false, error: "Errore nell'aggiornamento dell'artista." }
    }
}

export async function deletePiazzaArtist(id: string) {
    try {
        await prisma.piazzaArtist.delete({ where: { id } })
        revalidatePath("/piazzadellarte/artisti")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
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

export const getPiazzaProgram = async () => {
    return await getPiazzaProgramInternal()
}

export async function createPiazzaProgramItem(data: {
    title: string,
    description: string,
    location?: string | null,
    timeSlot: string,
    startTime?: string | null,
    endTime?: string | null,
    icon?: string | null,
    order?: number
}) {
    try {
        await prisma.piazzaProgramItem.create({ data })
        revalidatePath("/piazzadellarte/programma")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Create Piazza program item error:", error)
        return { success: false, error: "Errore nella creazione dell'attività." }
    }
}

export async function updatePiazzaProgramItem(id: string, data: {
    title?: string,
    description?: string,
    location?: string | null,
    timeSlot?: string,
    startTime?: string | null,
    endTime?: string | null,
    icon?: string | null,
    order?: number
}) {
    try {
        await prisma.piazzaProgramItem.update({
            where: { id },
            data
        })
        revalidatePath("/piazzadellarte/programma")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Update Piazza program item error:", error)
        return { success: false, error: "Errore nell'aggiornamento dell'attività." }
    }
}

export async function deletePiazzaProgramItem(id: string) {
    try {
        await prisma.piazzaProgramItem.delete({ where: { id } })
        revalidatePath("/piazzadellarte/programma")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
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

export const getPiazzaMedia = async (type?: string) => {
    return await getPiazzaMediaInternal(type)
}

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
        revalidatePath("/piazzadellarte/media")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
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
        revalidatePath("/piazzadellarte/media")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Update Piazza media item error:", error)
        return { success: false, error: "Errore nell'aggiornamento del contenuto media." }
    }
}

export async function deletePiazzaMediaItem(id: string) {
    try {
        await prisma.piazzaMediaItem.delete({ where: { id } })
        revalidatePath("/piazzadellarte/media")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Delete Piazza media item error:", error)
        return { success: false, error: "Errore nell'eliminazione del contenuto media." }
    }
}

// --- SETTINGS ---

const getPiazzaSettingsInternal = async () => {
    try {
        let settings = await prisma.piazzaSettings.findUnique({
            where: { id: "settings" }
        })

        if (!settings) {
            settings = await prisma.piazzaSettings.create({
                data: {
                    id: "settings",
                    year: "2026",
                    eventDate: new Date("2026-05-22T09:00:00Z"),
                    countdownVisible: true
                }
            })
        }

        return settings
    } catch (error) {
        console.error("Error fetching Piazza settings:", error)
        return { year: "2026", eventDate: new Date("2026-05-22T09:00:00Z"), countdownVisible: true }
    }
}

export const getPiazzaSettings = async () => {
    return await getPiazzaSettingsInternal()
}

export async function updatePiazzaSettings(data: {
    year?: string,
    eventDate?: Date,
    countdownVisible?: boolean
}) {
    try {
        await prisma.piazzaSettings.upsert({
            where: { id: "settings" },
            update: data,
            create: {
                id: "settings",
                year: data.year || "2026",
                eventDate: data.eventDate || new Date("2026-05-22T09:00:00Z"),
                countdownVisible: data.countdownVisible ?? true
            }
        })
        revalidatePath("/piazza-admin")
        revalidatePath("/")
        revalidatePath("/piazzadellarte")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Update Piazza settings error:", error)
        return { success: false, error: "Errore nell'aggiornamento delle impostazioni." }
    }
}

// --- SPONSORS ---

const getPiazzaSponsorsInternal = async () => {
    try {
        const sponsors = await prisma.piazzaSponsor.findMany({
            orderBy: { order: "asc" }
        })
        console.log("FETCHED SPONSORS FROM DB:", sponsors.length)
        return sponsors
    } catch (error) {
        console.error("Error fetching Piazza sponsors:", error)
        return []
    }
}

export const getPiazzaSponsors = async () => {
    return await getPiazzaSponsorsInternal()
}

export async function createPiazzaSponsor(data: {
    name: string,
    logo?: string | null,
    website?: string | null,
    tier?: string | null,
    order?: number
}) {
    try {
        await prisma.piazzaSponsor.create({ data })
        revalidatePath("/piazzadellarte")
        revalidatePath("/[locale]/piazzadellarte", "page")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Create Piazza sponsor error:", error)
        return { success: false, error: "Errore nella creazione dello sponsor." }
    }
}

export async function updatePiazzaSponsor(id: string, data: any) {
    try {
        await prisma.piazzaSponsor.update({
            where: { id },
            data
        })
        revalidatePath("/piazzadellarte")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Update Piazza sponsor error:", error)
        return { success: false, error: "Errore nell'aggiornamento dello sponsor." }
    }
}

export async function deletePiazzaSponsor(id: string) {
    try {
        await prisma.piazzaSponsor.delete({ where: { id } })
        revalidatePath("/piazzadellarte")
        revalidatePath("/piazza-admin")
        revalidateTag('piazza')
        return { success: true }
    } catch (error) {
        console.error("Delete Piazza sponsor error:", error)
        return { success: false, error: "Errore nell'eliminazione dello sponsor." }
    }
}
