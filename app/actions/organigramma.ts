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

    return user?.role === "SUPER_ADMIN"
}

export async function getOrganigrammaMembers() {
    try {
        const members = await prisma.organigrammaMember.findMany({
            orderBy: [
                { association: 'asc' },
                { section: 'asc' },
                { order: 'asc' }
            ]
        })
        return members
    } catch (error) {
        console.error("Error fetching organigramma members:", error)
        return []
    }
}

export async function createOrganigrammaMember(data: {
    name: string
    role: string
    roleEn?: string
    email?: string
    association: string
    section: string
    order?: number
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const member = await prisma.organigrammaMember.create({
            data: {
                name: data.name,
                role: data.role,
                roleEn: data.roleEn || null,
                email: data.email || null,
                association: data.association,
                section: data.section,
                order: data.order ?? 0
            }
        })
        revalidatePath("/organigramma")
        revalidatePath("/admin/organigramma")
        return { success: true, member }
    } catch (error) {
        console.error("Error creating organigramma member:", error)
        return { success: false, error: "Errore durante la creazione del membro dell'organigramma." }
    }
}

export async function updateOrganigrammaMember(id: string, data: {
    name: string
    role: string
    roleEn?: string
    email?: string
    association: string
    section: string
    order?: number
}) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        const member = await prisma.organigrammaMember.update({
            where: { id },
            data: {
                name: data.name,
                role: data.role,
                roleEn: data.roleEn || null,
                email: data.email || null,
                association: data.association,
                section: data.section,
                order: data.order ?? 0
            }
        })
        revalidatePath("/organigramma")
        revalidatePath("/admin/organigramma")
        return { success: true, member }
    } catch (error) {
        console.error("Error updating organigramma member:", error)
        return { success: false, error: "Errore durante l'aggiornamento del membro dell'organigramma." }
    }
}

export async function deleteOrganigrammaMember(id: string) {
    if (!(await checkAdminPermission())) {
        return { success: false, error: "Non hai i permessi per questa operazione." }
    }

    try {
        await prisma.organigrammaMember.delete({
            where: { id }
        })
        revalidatePath("/organigramma")
        revalidatePath("/admin/organigramma")
        return { success: true }
    } catch (error) {
        console.error("Error deleting organigramma member:", error)
        return { success: false, error: "Errore durante l'eliminazione del membro dell'organigramma." }
    }
}
