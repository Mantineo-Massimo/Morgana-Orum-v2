"use server"
// Force TS re-evaluation

import { revalidatePath } from "next/cache"
import { z } from "zod"
import prisma from "@/lib/prisma"


const representativeSchema = z.object({
    name: z.string().min(1, "Il nome è obbligatorio"),
    listName: z.enum(["MORGANA", "O.R.U.M.", "AZIONE"]),
    category: z.enum(["CENTRAL", "DEPARTMENT", "NATIONAL"]),
    department: z.string().optional(),
    role: z.string().optional(),
    term: z.string().default("2025-2027"),
    image: z.string().optional().nullable(),
    email: z.string().email().optional().nullable().or(z.literal("")),
    phone: z.string().optional().nullable().or(z.literal("")),
    instagram: z.string().optional().nullable().or(z.literal("")),
    description: z.string().optional().nullable().or(z.literal("")),
    roleDescription: z.string().optional().nullable().or(z.literal(""))
})

export async function createRepresentative(data: z.infer<typeof representativeSchema>) {
    try {
        const validData = representativeSchema.parse(data)

        await prisma.representative.create({
            data: {
                ...validData,
                // Handle optional strings becoming empty strings/nulls cleanly if needed
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

        revalidatePath("/[brand]/representatives")
        revalidatePath("/[brand]/admin/representatives")
        return { success: true }
    } catch (error) {
        console.error("Create representative error:", error)
        return { success: false, error: "Errore durante la creazione" }
    }
}

export async function updateRepresentative(id: string, data: Partial<z.infer<typeof representativeSchema>>) {
    try {
        await prisma.representative.update({
            where: { id },
            data: {
                ...data,
                // Ensure null handling logic matches requirements
            }
        })

        revalidatePath("/[brand]/representatives")
        revalidatePath("/[brand]/admin/representatives")
        return { success: true }
    } catch (error) {
        console.error("Update representative error:", error)
        return { success: false, error: "Errore durante l'aggiornamento" }
    }
}

export async function deleteRepresentative(id: string) {
    try {
        await prisma.representative.delete({
            where: { id }
        })

        revalidatePath("/[brand]/representatives")
        revalidatePath("/[brand]/admin/representatives")
        return { success: true }
    } catch (error) {
        console.error("Delete representative error:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function getRepresentatives(
    query?: string,
    list?: string,
    category?: string
) {
    try {
        console.log("getRepresentatives called with:", { query, list, category })
        const where: any = {}

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
