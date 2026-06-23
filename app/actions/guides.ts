"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

const PROTECTED_GUIDE_IDS = ["matricole", "trasporti", "servizi", "mappa"]

async function checkAdminPermission() {
    const { cookies } = await import("next/headers")
    const userEmail = cookies().get("session_email")?.value
    if (!userEmail) return false

    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN_MORGANA"
}

export async function getGuidesData() {
    try {
        const guides = await prisma.guide.findMany({
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        })
        return guides
    } catch (error) {
        console.error("Error fetching guides data:", error)
        return []
    }
}

export async function createGuide(data: {
    id: string
    title: string
    titleEn?: string
    description: string
    descriptionEn?: string
    icon: string
    color: string
    order?: number
    hasCustomComponent?: boolean
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    if (PROTECTED_GUIDE_IDS.includes(data.id)) {
        return { success: false, error: "Non puoi creare una guida con questo ID riservato." }
    }

    try {
        const guide = await prisma.guide.create({
            data: {
                id: data.id,
                title: data.title,
                titleEn: data.titleEn || null,
                description: data.description,
                descriptionEn: data.descriptionEn || null,
                icon: data.icon,
                color: data.color,
                order: data.order ?? 0,
                hasCustomComponent: data.hasCustomComponent ?? false
            }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/guides")
        return { success: true, guide }
    } catch (error) {
        console.error("Error creating guide:", error)
        return { success: false, error: "Errore durante la creazione della guida." }
    }
}

export async function updateGuide(id: string, data: {
    title: string
    titleEn?: string
    description: string
    descriptionEn?: string
    icon: string
    color: string
    order?: number
    hasCustomComponent?: boolean
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    if (PROTECTED_GUIDE_IDS.includes(id)) {
        return { success: false, error: "Non puoi modificare questa guida protetta." }
    }

    try {
        const guide = await prisma.guide.update({
            where: { id },
            data: {
                title: data.title,
                titleEn: data.titleEn || null,
                description: data.description,
                descriptionEn: data.descriptionEn || null,
                icon: data.icon,
                color: data.color,
                order: data.order ?? 0,
                hasCustomComponent: data.hasCustomComponent ?? false
            }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/guides")
        return { success: true, guide }
    } catch (error) {
        console.error("Error updating guide:", error)
        return { success: false, error: "Errore durante l'aggiornamento della guida." }
    }
}

export async function deleteGuide(id: string) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    if (PROTECTED_GUIDE_IDS.includes(id)) {
        return { success: false, error: "Non puoi eliminare questa guida protetta." }
    }

    try {
        await prisma.guide.delete({
            where: { id }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/guides")
        return { success: true }
    } catch (error) {
        console.error("Error deleting guide:", error)
        return { success: false, error: "Errore durante l'eliminazione della guida." }
    }
}

export async function createGuideStep(data: {
    title: string
    titleEn?: string
    description: string
    descriptionEn?: string
    order?: number
    guideId: string
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    if (PROTECTED_GUIDE_IDS.includes(data.guideId)) {
        return { success: false, error: "Non puoi aggiungere step a questa guida protetta." }
    }

    try {
        const step = await prisma.guideStep.create({
            data: {
                title: data.title,
                titleEn: data.titleEn || null,
                description: data.description,
                descriptionEn: data.descriptionEn || null,
                order: data.order ?? 0,
                guideId: data.guideId
            }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/guides")
        return { success: true, step }
    } catch (error) {
        console.error("Error creating guide step:", error)
        return { success: false, error: "Errore durante la creazione dello step." }
    }
}

export async function updateGuideStep(id: string, data: {
    title: string
    titleEn?: string
    description: string
    descriptionEn?: string
    order?: number
    guideId: string
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    if (PROTECTED_GUIDE_IDS.includes(data.guideId)) {
        return { success: false, error: "Non puoi modificare gli step di questa guida protetta." }
    }

    try {
        const step = await prisma.guideStep.update({
            where: { id },
            data: {
                title: data.title,
                titleEn: data.titleEn || null,
                description: data.description,
                descriptionEn: data.descriptionEn || null,
                order: data.order ?? 0,
                guideId: data.guideId
            }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/guides")
        return { success: true, step }
    } catch (error) {
        console.error("Error updating guide step:", error)
        return { success: false, error: "Errore durante l'aggiornamento dello step." }
    }
}

export async function deleteGuideStep(id: string) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const step = await prisma.guideStep.findUnique({
            where: { id }
        })
        if (!step || PROTECTED_GUIDE_IDS.includes(step.guideId)) {
            return { success: false, error: "Non puoi eliminare gli step di questa guida protetta." }
        }

        await prisma.guideStep.delete({
            where: { id }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/guides")
        return { success: true }
    } catch (error) {
        console.error("Error deleting guide step:", error)
        return { success: false, error: "Errore durante l'eliminazione dello step." }
    }
}
