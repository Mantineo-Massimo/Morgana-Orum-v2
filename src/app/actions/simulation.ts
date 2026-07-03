"use server"

import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export async function saveGradeSimulation(data: {
    exams: any[]
    targetCfu: number
    targetType: string
    lodeAs31: boolean
    thesisPoints: number
}) {
    try {
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) {
            return { success: false, error: "Unauthorized" }
        }

        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        const simulation = await prisma.gradeSimulation.upsert({
            where: { userId: user.id },
            update: {
                exams: data.exams,
                targetCfu: data.targetCfu,
                targetType: data.targetType,
                lodeAs31: data.lodeAs31,
                thesisPoints: data.thesisPoints,
            },
            create: {
                userId: user.id,
                exams: data.exams,
                targetCfu: data.targetCfu,
                targetType: data.targetType,
                lodeAs31: data.lodeAs31,
                thesisPoints: data.thesisPoints,
            }
        })

        return { success: true, simulation }
    } catch (error: any) {
        console.error("Save simulation error:", error)
        return { success: false, error: error.message || "Failed to save simulation" }
    }
}

export async function getGradeSimulation() {
    try {
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) {
            return { success: false, error: "Unauthorized", isLoggedIn: false }
        }

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: {
                gradeSimulation: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found", isLoggedIn: false }
        }

        if (!user.gradeSimulation) {
            return { success: true, simulation: null, isLoggedIn: true }
        }

        return {
            success: true,
            isLoggedIn: true,
            simulation: {
                exams: user.gradeSimulation.exams as any[],
                targetCfu: user.gradeSimulation.targetCfu,
                targetType: user.gradeSimulation.targetType,
                lodeAs31: user.gradeSimulation.lodeAs31,
                thesisPoints: user.gradeSimulation.thesisPoints
            }
        }
    } catch (error: any) {
        console.error("Get simulation error:", error)
        return { success: false, error: error.message || "Failed to load simulation", isLoggedIn: false }
    }
}

export async function checkSession() {
    const userEmail = cookies().get("session_email")?.value
    return !!userEmail
}
