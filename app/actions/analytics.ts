"use server"

import prisma from "@/lib/prisma"

export async function getPlatformStats() {
    try {
        const [
            totalUsers,
            totalEvents,
            totalRegistrations,
            totalNews,
            totalReps,
            topEvents,
            visitsCount,
            clicksCount
        ] = await Promise.all([
            prisma.user.count(),
            prisma.event.count({ where: { published: true } }),
            prisma.registration.count(),
            prisma.news.count({ where: { published: true } }),
            prisma.representative.count(),
            prisma.event.findMany({
                where: { published: true },
                include: {
                    _count: {
                        select: { registrations: true }
                    }
                },
                orderBy: {
                    registrations: {
                        _count: 'desc'
                    }
                },
                take: 5
            }),
            prisma.analyticEvent.count({ where: { type: "VISIT" } }),
            prisma.analyticEvent.count({ where: { type: "CLICK" } })
        ])

        const engagementRate = totalUsers > 0
            ? Math.round((totalRegistrations / totalUsers) * 100)
            : 0

        return {
            totalUsers,
            totalEvents,
            totalRegistrations,
            totalNews,
            totalReps,
            engagementRate,
            visitsCount,
            clicksCount,
            topEvents: topEvents.map(e => ({
                id: e.id,
                title: e.title,
                count: e._count.registrations
            }))
        }
    } catch (error) {
        console.error("Error fetching analytics stats:", error)
        return null
    }
}
