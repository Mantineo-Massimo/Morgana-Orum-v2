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

export async function getServicesData() {
    try {
        const categories = await prisma.serviceCategory.findMany({
            include: {
                items: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        })
        return categories
    } catch (error) {
        console.error("Error fetching services data:", error)
        return []
    }
}

export async function createServiceCategory(data: {
    id: string
    title: string
    titleEn?: string
    icon: string
    color: string
    order?: number
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const category = await prisma.serviceCategory.create({
            data: {
                id: data.id,
                title: data.title,
                titleEn: data.titleEn || null,
                icon: data.icon,
                color: data.color,
                order: data.order ?? 0
            }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/services")
        return { success: true, category }
    } catch (error) {
        console.error("Error creating service category:", error)
        return { success: false, error: "Errore durante la creazione della categoria." }
    }
}

export async function updateServiceCategory(id: string, data: {
    title: string
    titleEn?: string
    icon: string
    color: string
    order?: number
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const category = await prisma.serviceCategory.update({
            where: { id },
            data: {
                title: data.title,
                titleEn: data.titleEn || null,
                icon: data.icon,
                color: data.color,
                order: data.order ?? 0
            }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/services")
        return { success: true, category }
    } catch (error) {
        console.error("Error updating service category:", error)
        return { success: false, error: "Errore durante l'aggiornamento della categoria." }
    }
}

export async function deleteServiceCategory(id: string) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        await prisma.serviceCategory.delete({
            where: { id }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/services")
        return { success: true }
    } catch (error) {
        console.error("Error deleting service category:", error)
        return { success: false, error: "Errore durante l'eliminazione della categoria." }
    }
}

export async function createServiceItem(data: {
    name: string
    nameEn?: string
    description: string
    descriptionEn?: string
    href?: string
    order?: number
    categoryId: string
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const item = await prisma.serviceItem.create({
            data: {
                name: data.name,
                nameEn: data.nameEn || null,
                description: data.description,
                descriptionEn: data.descriptionEn || null,
                href: data.href || null,
                order: data.order ?? 0,
                categoryId: data.categoryId
            }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/services")
        return { success: true, item }
    } catch (error) {
        console.error("Error creating service item:", error)
        return { success: false, error: "Errore durante la creazione del servizio." }
    }
}

export async function updateServiceItem(id: string, data: {
    name: string
    nameEn?: string
    description: string
    descriptionEn?: string
    href?: string
    order?: number
    categoryId: string
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const item = await prisma.serviceItem.update({
            where: { id },
            data: {
                name: data.name,
                nameEn: data.nameEn || null,
                description: data.description,
                descriptionEn: data.descriptionEn || null,
                href: data.href || null,
                order: data.order ?? 0,
                categoryId: data.categoryId
            }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/services")
        return { success: true, item }
    } catch (error) {
        console.error("Error updating service item:", error)
        return { success: false, error: "Errore durante l'aggiornamento del servizio." }
    }
}

export async function deleteServiceItem(id: string) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        await prisma.serviceItem.delete({
            where: { id }
        })
        revalidatePath("/guide")
        revalidatePath("/admin/services")
        return { success: true }
    } catch (error) {
        console.error("Error deleting service item:", error)
        return { success: false, error: "Errore durante l'eliminazione del servizio." }
    }
}
