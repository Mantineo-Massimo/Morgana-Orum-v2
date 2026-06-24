"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

async function checkAdminPermission() {
    const { cookies } = await import("next/headers")
    const userEmail = cookies().get("session_email")?.value
    if (!userEmail) return false

    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN_MORGANA"
}

export async function getWhatsAppGroups() {
    try {
        const groups = await prisma.whatsAppGroup.findMany({
            orderBy: [
                { category: 'asc' },
                { department: 'asc' },
                { order: 'asc' }
            ]
        })
        return groups
    } catch (error) {
        console.error("Error fetching WhatsApp groups:", error)
        return []
    }
}

export async function createWhatsAppGroup(data: {
    name: string
    nameEn?: string
    link: string
    category: string
    department?: string
    description?: string
    descriptionEn?: string
    icon?: string
    theme?: string
    order?: number
    semester?: string
    subcategory?: string
    isGeneral?: boolean
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const group = await prisma.whatsAppGroup.create({
            data: {
                name: data.name,
                nameEn: data.nameEn || null,
                link: data.link,
                category: data.category,
                department: data.category === "ACADEMIC" ? (data.department || null) : null,
                description: (data.category === "COMMUNITY" || data.category === "SANITARY_VET") ? (data.description || null) : null,
                descriptionEn: (data.category === "COMMUNITY" || data.category === "SANITARY_VET") ? (data.descriptionEn || null) : null,
                icon: data.category === "COMMUNITY" ? (data.icon || null) : null,
                theme: data.category === "COMMUNITY" ? (data.theme || null) : null,
                order: data.order ?? 0,
                semester: data.semester || null,
                subcategory: data.subcategory || null,
                isGeneral: data.isGeneral ?? false
            }
        })
        revalidatePath("/gruppi")
        revalidatePath("/admin/whatsapp-groups")
        return { success: true, group }
    } catch (error) {
        console.error("Error creating WhatsApp group:", error)
        return { success: false, error: "Errore durante la creazione del gruppo WhatsApp." }
    }
}

export async function updateWhatsAppGroup(id: string, data: {
    name: string
    nameEn?: string
    link: string
    category: string
    department?: string
    description?: string
    descriptionEn?: string
    icon?: string
    theme?: string
    order?: number
    semester?: string
    subcategory?: string
    isGeneral?: boolean
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const group = await prisma.whatsAppGroup.update({
            where: { id },
            data: {
                name: data.name,
                nameEn: data.nameEn || null,
                link: data.link,
                category: data.category,
                department: data.category === "ACADEMIC" ? (data.department || null) : null,
                description: (data.category === "COMMUNITY" || data.category === "SANITARY_VET") ? (data.description || null) : null,
                descriptionEn: (data.category === "COMMUNITY" || data.category === "SANITARY_VET") ? (data.descriptionEn || null) : null,
                icon: data.category === "COMMUNITY" ? (data.icon || null) : null,
                theme: data.category === "COMMUNITY" ? (data.theme || null) : null,
                order: data.order ?? 0,
                semester: data.semester || null,
                subcategory: data.subcategory || null,
                isGeneral: data.isGeneral ?? false
            }
        })
        revalidatePath("/gruppi")
        revalidatePath("/admin/whatsapp-groups")
        return { success: true, group }
    } catch (error) {
        console.error("Error updating WhatsApp group:", error)
        return { success: false, error: "Errore durante l'aggiornamento del gruppo WhatsApp." }
    }
}

export async function deleteWhatsAppGroup(id: string) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        await prisma.whatsAppGroup.delete({
            where: { id }
        })
        revalidatePath("/gruppi")
        revalidatePath("/admin/whatsapp-groups")
        return { success: true }
    } catch (error) {
        console.error("Error deleting WhatsApp group:", error)
        return { success: false, error: "Errore durante l'eliminazione del gruppo WhatsApp." }
    }
}
