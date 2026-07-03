"use server"

import prisma from "@/lib/prisma"

export async function logAnalyticEvent(type: string, page?: string, targetId?: string, metadata?: any) {
    try {
        await prisma.analyticEvent.create({
            data: {
                type,
                page,
                targetId,
                metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Error logging analytic event:", error)
        return { success: false }
    }
}
