"use server"

import prisma from "@/lib/prisma"

export async function globalSearch(query: string) {
    if (!query || query.length < 2) return { news: [], events: [], representatives: [] }

    const [news, events, representatives] = await Promise.all([
        prisma.news.findMany({
            where: {
                published: true,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 5
        }),
        prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { location: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 5
        }),
        prisma.representative.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { role: { contains: query, mode: 'insensitive' } },
                    { department: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 5
        })
    ])

    return { news, events, representatives }
}
