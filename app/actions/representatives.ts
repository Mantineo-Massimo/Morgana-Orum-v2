"use server"
// Force TS re-evaluation

import { revalidatePath } from "next/cache"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"

async function checkContentPermission(itemAssociation?: Association) {
    const { cookies } = await import("next/headers")
    const userEmail = cookies().get("session_email")?.value
    if (!userEmail) return { allowed: false }

    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    if (!user) return { allowed: false }

    // SUPER_ADMIN and ADMIN_MORGANA can edit everything
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN_MORGANA") {
        return { allowed: true, user }
    }

    // ADMIN_NETWORK can only edit their own association
    if (user.role === "ADMIN_NETWORK") {
        const isMatch = itemAssociation === user.association
        return { allowed: isMatch, user }
    }

    return { allowed: false }
}

const representativeSchema = z.object({
    name: z.string().min(1, "Il nome è obbligatorio"),
    listName: z.enum(["MORGANA", "O.R.U.M.", "AZIONE UNIVERITARIA"]),
    category: z.enum(["CENTRAL", "DEPARTMENT", "NATIONAL"]),
    department: z.string().optional(),
    role: z.string().optional(),
    term: z.string().default("2025-2027"),
    image: z.string().optional().nullable(),
    email: z.string().email().optional().nullable().or(z.literal("")),
    phone: z.string().optional().nullable().or(z.literal("")),
    instagram: z.string().optional().nullable().or(z.literal("")),
    description: z.string().optional().nullable().or(z.literal("")),
    roleDescription: z.string().optional().nullable().or(z.literal("")),
    association: z.nativeEnum(Association).default(Association.MORGANA_ORUM),
})

export async function createRepresentative(data: z.infer<typeof representativeSchema>) {
    try {
        const validData = representativeSchema.parse(data)
        const permission = await checkContentPermission(validData.association)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa associazione." }

        await prisma.representative.create({
            data: {
                ...validData,
                email: validData.email || null,
                phone: validData.phone || null,
                instagram: validData.instagram || null,
                role: validData.role || null,
                term: validData.term,
                description: validData.description || null,
                roleDescription: validData.roleDescription || null,
                department: (validData.category === "CENTRAL" || validData.category === "NATIONAL") ? null : (validData.department || null),
            }
        })

        revalidatePath("/representatives")
        revalidatePath("/admin/representatives")
        return { success: true }
    } catch (error) {
        console.error("Create representative error:", error)
        return { success: false, error: "Errore durante la creazione" }
    }
}

export async function updateRepresentative(id: string, data: Partial<z.infer<typeof representativeSchema>>) {
    try {
        const existing = await prisma.representative.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Rappresentante non trovato" }

        const permission = await checkContentPermission(existing.association)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questo rappresentante." }

        await prisma.representative.update({
            where: { id },
            data: {
                ...data,
            }
        })

        revalidatePath("/representatives")
        revalidatePath("/admin/representatives")
        return { success: true }
    } catch (error) {
        console.error("Update representative error:", error)
        return { success: false, error: "Errore durante l'aggiornamento" }
    }
}

export async function deleteRepresentative(id: string) {
    try {
        const existing = await prisma.representative.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Rappresentante non trovato" }

        const permission = await checkContentPermission(existing.association)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questo rappresentante." }

        await prisma.representative.delete({
            where: { id }
        })

        revalidatePath("/representatives")
        revalidatePath("/admin/representatives")
        return { success: true }
    } catch (error) {
        console.error("Delete representative error:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function getRepresentatives(
    query?: string,
    list?: string,
    category?: string,
    department?: string
) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value

        let currentUserAssoc: Association | null = null
        let isNetworkAdmin = false

        if (userEmail) {
            const user = await prisma.user.findUnique({ where: { email: userEmail } })
            if (user && user.role === "ADMIN_NETWORK") {
                isNetworkAdmin = true
                currentUserAssoc = user.association
            }
        }

        const where: any = {}

        if (isNetworkAdmin) {
            where.association = currentUserAssoc
        }

        if (department) {
            where.department = { contains: department, mode: 'insensitive' }
        }

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { role: { contains: query, mode: 'insensitive' } },
                { department: { contains: query, mode: 'insensitive' } }
            ]
        }

        if (list && list !== 'all') {
            where.listName = list
        }

        if (category && category !== 'all') {
            where.category = category
        }

        const reps = await prisma.representative.findMany({
            where,
            orderBy: {
                name: 'asc'
            }
        })
        return reps
    } catch (error) {
        console.error("Error fetching representatives:", error)
        return []
    }
}
