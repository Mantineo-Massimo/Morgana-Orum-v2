"use server"

import prisma from "@/lib/prisma"

export async function getPlatformStats() {
    try {
        const [
            totalUsers,
            totalEvents,
            totalRegistrations,
            attendedRegistrations
        ] = await Promise.all([
            prisma.user.count(),
            prisma.event.count({ where: { published: true } }),
            prisma.registration.count(),
            prisma.registration.count({ where: { status: "ATTENDED" } })
        ])

        const engagementRate = totalUsers > 0
            ? Math.round((totalRegistrations / totalUsers) * 100)
            : 0

        return {
            totalUsers,
            totalEvents,
            totalRegistrations,
            attendedRegistrations,
            engagementRate
        }
    } catch (error) {
        console.error("Error fetching analytics stats:", error)
        return null
    }
}
