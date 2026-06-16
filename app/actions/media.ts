"use server"

import prisma from "@/lib/prisma"
import { del } from "@vercel/blob"

export type MediaItem = {
    url: string
    source: string
    title: string
    // For standalone library items
    libraryId?: string
    sizeBytes?: number | null
    mimeType?: string | null
    createdAt?: Date
}

export async function getUploadedMedia(): Promise<MediaItem[]> {
    try {
        const [
            news,
            events,
            representatives,
            organigramma,
            conventions,
            piazzaArtists,
            piazzaSponsors,
            libraryItems
        ] = await Promise.all([
            prisma.news.findMany({
                where: { AND: [{ image: { not: null } }, { image: { not: "" } }] },
                select: { image: true, title: true }
            }),
            prisma.event.findMany({
                where: { AND: [{ image: { not: null } }, { image: { not: "" } }] },
                select: { image: true, title: true }
            }),
            prisma.representative.findMany({
                where: { AND: [{ image: { not: null } }, { image: { not: "" } }] },
                select: { image: true, name: true }
            }),
            prisma.organigrammaMember.findMany({
                where: { AND: [{ image: { not: null } }, { image: { not: "" } }] },
                select: { image: true, name: true }
            }),
            prisma.convention.findMany({
                where: { AND: [{ logo: { not: null } }, { logo: { not: "" } }] },
                select: { logo: true, name: true }
            }),
            prisma.piazzaArtist.findMany({
                where: { AND: [{ image: { not: null } }, { image: { not: "" } }] },
                select: { image: true, name: true }
            }),
            prisma.piazzaSponsor.findMany({
                where: { AND: [{ logo: { not: null } }, { logo: { not: "" } }] },
                select: { logo: true, name: true }
            }),
            prisma.mediaLibraryItem.findMany({
                orderBy: { createdAt: "desc" }
            })
        ])

        const mediaMap = new Map<string, MediaItem>()

        // Helper to add unique media items
        const addMedia = (url: string | null, source: string, title: string, extra?: Partial<MediaItem>) => {
            if (!url) return
            const cleanUrl = url.trim()
            if (!mediaMap.has(cleanUrl)) {
                mediaMap.set(cleanUrl, {
                    url: cleanUrl,
                    source,
                    title,
                    ...extra
                })
            }
        }

        // Add standalone library items first (they take priority over record-linked)
        libraryItems.forEach(item => addMedia(item.url, "Libreria", item.name, {
            libraryId: item.id,
            sizeBytes: item.sizeBytes,
            mimeType: item.mimeType,
            createdAt: item.createdAt
        }))

        // Add record-linked images
        news.forEach(item => addMedia(item.image, "Notizia", item.title))
        events.forEach(item => addMedia(item.image, "Evento", item.title))
        representatives.forEach(item => addMedia(item.image, "Rappresentante", item.name))
        organigramma.forEach(item => addMedia(item.image, "Organigramma", item.name))
        conventions.forEach(item => addMedia(item.logo, "Convenzione", item.name))
        piazzaArtists.forEach(item => addMedia(item.image, "Piazza - Artista", item.name))
        piazzaSponsors.forEach(item => addMedia(item.logo, "Piazza - Sponsor", item.name))

        return Array.from(mediaMap.values()).sort((a, b) => {
            // Libreria items first, then by source name
            if (a.source === "Libreria" && b.source !== "Libreria") return -1
            if (a.source !== "Libreria" && b.source === "Libreria") return 1
            return a.source.localeCompare(b.source)
        })
    } catch (error) {
        console.error("Error fetching uploaded media:", error)
        return []
    }
}

export async function addToMediaLibrary(url: string, name: string, mimeType?: string, sizeBytes?: number): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.mediaLibraryItem.create({
            data: {
                url,
                name,
                mimeType: mimeType || null,
                sizeBytes: sizeBytes || null
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Error adding to media library:", error)
        return { success: false, error: "Errore durante il salvataggio in libreria" }
    }
}

export async function deleteMediaLibraryItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const item = await prisma.mediaLibraryItem.findUnique({ where: { id } })
        if (!item) {
            return { success: false, error: "Elemento non trovato" }
        }

        // Delete from Vercel Blob
        try {
            await del(item.url)
        } catch (blobError) {
            // Log but don't fail — blob might already be deleted or not a blob URL
            console.warn("Could not delete from Vercel Blob:", blobError)
        }

        // Delete from DB
        await prisma.mediaLibraryItem.delete({ where: { id } })

        return { success: true }
    } catch (error) {
        console.error("Error deleting media library item:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}
