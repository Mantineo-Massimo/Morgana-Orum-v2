"use server"
// Force TS re-evaluation

import { revalidatePath } from "next/cache"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { ASSOCIATION_DEPARTMENT_KEYWORDS } from "@/lib/associations"

async function checkContentPermission(itemAssociation?: Association, itemDepartment?: string | null) {
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

    // ADMIN_NETWORK can edit their own association OR anything in their department
    if (user.role === "ADMIN_NETWORK") {
        const isAssocMatch = itemAssociation === user.association

        let isDeptMatch = false
        if (itemDepartment) {
            const keywords = ASSOCIATION_DEPARTMENT_KEYWORDS[user.association as string]
            if (keywords && keywords.length > 0) {
                isDeptMatch = keywords.some(kw =>
                    itemDepartment.toLowerCase().includes(kw.toLowerCase())
                )
            }
        }

        return { allowed: isAssocMatch || isDeptMatch, user }
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

        revalidatePath("/representatives", "page")
        revalidatePath("/admin/representatives", "page")
        revalidatePath("/", "layout")
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

        const permission = await checkContentPermission(existing.association, existing.department)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questo rappresentante." }

        await prisma.representative.update({
            where: { id },
            data: {
                ...data,
            }
        })

        revalidatePath("/representatives", "page")
        revalidatePath("/admin/representatives", "page")
        revalidatePath("/", "layout")
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

        const permission = await checkContentPermission(existing.association, existing.department)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questo rappresentante." }

        await prisma.representative.delete({
            where: { id }
        })

        revalidatePath("/representatives", "page")
        revalidatePath("/admin/representatives", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Delete representative error:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function duplicateRepresentative(id: string) {
    try {
        const existing = await prisma.representative.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Rappresentante non trovato" }

        const permission = await checkContentPermission(existing.association, existing.department)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questo rappresentante." }

        const { id: _, ...repData } = existing

        await prisma.representative.create({
            data: {
                ...repData,
                name: `${existing.name} (Copia)`,
            }
        })

        revalidatePath("/representatives", "page")
        revalidatePath("/admin/representatives", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Duplicate representative error:", error)
        return { success: false, error: "Errore durante la duplicazione" }
    }
}


export async function getRepresentatives(filters?: {
    query?: string,
    list?: string,
    category?: string,
    department?: string,
    userRole?: string,
    userAssociation?: Association
}) {
    try {
        let user: any = null

        if (filters?.userRole && filters?.userAssociation) {
            user = { role: filters.userRole, association: filters.userAssociation }
        } else {
            const { cookies } = await import("next/headers")
            const userEmail = cookies().get("session_email")?.value
            if (userEmail) {
                user = await prisma.user.findUnique({ where: { email: userEmail } })
            }
        }

        const where: any = {}

        // Enforce role-based visibility
        if (user?.role === "ADMIN_NETWORK") {
            // Must be their association OR Morgana (central)
            // But MUST match their department department keywords
            const keywords = ASSOCIATION_DEPARTMENT_KEYWORDS[user.association as string]

            if (keywords && keywords.length > 0) {
                where.AND = [
                    { association: { in: [user.association, Association.MORGANA_ORUM] } },
                    {
                        OR: keywords.map(kw => ({
                            department: { contains: kw, mode: 'insensitive' }
                        }))
                    }
                ]
            } else {
                where.association = { in: [user.association, Association.MORGANA_ORUM] }
            }
        } else if (filters?.userAssociation) {
            where.association = filters.userAssociation
        }

        if (filters?.department) {
            where.department = { contains: filters.department, mode: 'insensitive' }
        }

        if (filters?.query) {
            where.OR = [
                { name: { contains: filters.query, mode: 'insensitive' } },
                { role: { contains: filters.query, mode: 'insensitive' } },
                { department: { contains: filters.query, mode: 'insensitive' } }
            ]
        }

        if (filters?.list && filters.list !== 'all') {
            where.listName = filters.list
        }

        if (filters?.category && filters.category !== 'all') {
            where.category = filters.category
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
