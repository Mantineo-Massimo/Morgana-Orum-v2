"use server"

import prisma from "@/lib/prisma"

export type MediaItem = {
    url: string
    source: string
    title: string
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
            piazzaSponsors
        ] = await Promise.all([
            prisma.news.findMany({
                where: { image: { not: null, not: "" } },
                select: { image: true, title: true }
            }),
            prisma.event.findMany({
                where: { image: { not: null, not: "" } },
                select: { image: true, title: true }
            }),
            prisma.representative.findMany({
                where: { image: { not: null, not: "" } },
                select: { image: true, name: true }
            }),
            prisma.organigrammaMember.findMany({
                where: { image: { not: null, not: "" } },
                select: { image: true, name: true }
            }),
            prisma.convention.findMany({
                where: { logo: { not: null, not: "" } },
                select: { logo: true, name: true }
            }),
            prisma.piazzaArtist.findMany({
                where: { image: { not: null, not: "" } },
                select: { image: true, name: true }
            }),
            prisma.piazzaSponsor.findMany({
                where: { logo: { not: null, not: "" } },
                select: { logo: true, name: true }
            })
        ])

        const mediaMap = new Map<string, MediaItem>()

        // Helper to add unique media items
        const addMedia = (url: string | null, source: string, title: string) => {
            if (!url) return
            // Normalize URLs to avoid duplicates
            const cleanUrl = url.trim()
            if (!mediaMap.has(cleanUrl)) {
                mediaMap.set(cleanUrl, {
                    url: cleanUrl,
                    source,
                    title
                })
            }
        }

        // Gather all media
        news.forEach(item => addMedia(item.image, "Notizia", item.title))
        events.forEach(item => addMedia(item.image, "Evento", item.title))
        representatives.forEach(item => addMedia(item.image, "Rappresentante", item.name))
        organigramma.forEach(item => addMedia(item.image, "Organigramma", item.name))
        conventions.forEach(item => addMedia(item.logo, "Convenzione", item.name))
        piazzaArtists.forEach(item => addMedia(item.image, "Piazza - Artista", item.name))
        piazzaSponsors.forEach(item => addMedia(item.logo, "Piazza - Sponsor", item.name))

        // Return array of media items sorted alphabetically by title/source
        return Array.from(mediaMap.values()).sort((a, b) => a.source.localeCompare(b.source))
    } catch (error) {
        console.error("Error fetching uploaded media:", error)
        return []
    }
}
