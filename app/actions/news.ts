"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { sendPublicationNotification } from "./notifications"
import { AssociationId } from "@/lib/associations"

const newsSchema = z.object({
    title: z.string().min(1, "Il titolo è obbligatorio"),
    description: z.string().optional().nullable().or(z.literal("")),
    content: z.string().optional().nullable().or(z.literal("")),
    category: z.string().min(1, "La categoria è obbligatoria"),
    tags: z.string().optional().nullable().or(z.literal("")),
    image: z.string().optional().nullable().or(z.literal("")),
    date: z.string().optional(),
    published: z.boolean().default(true),
    associations: z.array(z.nativeEnum(Association)).min(1, "Seleziona almeno un'associazione"),
})

async function checkContentPermission(itemAssociations?: Association[]) {
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

    // ADMIN_NETWORK can only edit if their association is in the list
    if (user.role === "ADMIN_NETWORK" && itemAssociations) {
        const isMatch = itemAssociations.includes(user.association)
        return { allowed: isMatch, user }
    }

    return { allowed: false }
}

export async function createNews(data: any) {
    try {
        const validData = newsSchema.parse(data)
        const permission = await checkContentPermission(validData.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa configurazione di associazioni." }

        const newNews = await prisma.news.create({
            data: {
                title: validData.title,
                description: validData.description || "",
                content: validData.content || null,
                category: validData.category,
                tags: validData.tags || null,
                image: validData.image || null,
                date: validData.date ? new Date(validData.date) : new Date(),
                published: validData.published,
                associations: validData.associations,
            }
        })

        // -- INVIA NEWSLETTER A SOTTOSCRITTORI (SOLO SE PUBBLICATA) --
        if (newNews.published) {
            sendPublicationNotification(newNews, "Notizia")
        }

        revalidatePath("/[brand]/news")
        revalidatePath("/[brand]/admin/news")
        return { success: true }
    } catch (error) {
        console.error("Create news error:", error)
        return { success: false, error: "Errore durante la creazione" }
    }
}

export async function updateNews(id: string, data: Partial<z.infer<typeof newsSchema>>) {
    try {
        const existing = await prisma.news.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Notizia non trovata" }

        const permission = await checkContentPermission(existing.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa notizia." }

        const updateData: any = { ...data }

        const oldNews = await prisma.news.findUnique({
            where: { id },
            select: { published: true }
        })

        const updatedNews = await prisma.news.update({
            where: { id },
            data: updateData,
        })

        // -- INVIA NEWSLETTER SE PASSA DA BOZZA A PUBBLICATA --
        if (!oldNews?.published && updatedNews.published) {
            sendPublicationNotification(updatedNews, "Notizia")
        }

        revalidatePath("/[brand]/news")
        revalidatePath("/[brand]/admin/news")
        return { success: true }
    } catch (error) {
        console.error("Update news error:", error)
        return { success: false, error: "Errore durante l'aggiornamento" }
    }
}

export async function deleteNews(id: string) {
    try {
        const existing = await prisma.news.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Notizia non trovata" }

        const permission = await checkContentPermission(existing.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa notizia." }

        await prisma.news.delete({
            where: { id }
        })

        revalidatePath("/[brand]/news")
        revalidatePath("/[brand]/admin/news")
        return { success: true }
    } catch (error) {
        console.error("Delete news error:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

// Public: only published AND date <= now (scheduled publishing support)
export async function getNews(category?: string, query?: string, association?: Association) {
    try {
        const now = new Date()
        const where: any = {
            published: true,
            date: { lte: now }
        }

        if (category && category !== "Tutte") {
            where.category = category
        }

        if (association) {
            where.associations = { has: association }
        }

        if (query) {
            where.OR = [
                { title: { contains: query } },
                { description: { contains: query } },
            ]
        }

        return await prisma.news.findMany({
            where,
            orderBy: { date: "desc" },
        })
    } catch (error) {
        console.error("Error fetching news:", error)
        return []
    }
}

// Admin: all news, with optional filters
export async function getAllNews(filters?: { query?: string, category?: string, status?: string, year?: number, association?: Association }) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return []

        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!user) return []

        const where: any = {}

        // Enforce role-based association filtering
        if (user.role === "ADMIN_NETWORK") {
            where.associations = { has: user.association }
        } else if (filters?.association) {
            where.associations = { has: filters.association }
        }

        if (filters?.query) {
            where.OR = [
                { title: { contains: filters.query } },
                { description: { contains: filters.query } },
            ]
        }

        if (filters?.category) {
            where.category = filters.category
        }

        if (filters?.status === "published") {
            where.published = true
        } else if (filters?.status === "draft") {
            where.published = false
        } else if (filters?.status === "scheduled") {
            where.published = true
            where.date = { gt: new Date() }
        }

        if (filters?.year) {
            const yearStart = new Date(filters.year, 0, 1)
            const yearEnd = new Date(filters.year + 1, 0, 1)
            where.date = { ...where.date, gte: yearStart, lt: yearEnd }
        }

        return await prisma.news.findMany({
            where,
            orderBy: { date: "desc" },
        })
    } catch (error) {
        console.error("Error fetching all news:", error)
        return []
    }
}

export async function getNewsById(id: string) {
    try {
        return await prisma.news.findUnique({ where: { id } })
    } catch (error) {
        console.error("Error fetching news by id:", error)
        return null
    }
}

export async function getNewsCategories(): Promise<string[]> {
    try {
        const cats = await prisma.newsCategory.findMany({ orderBy: { name: "asc" } })
        return cats.map((c: any) => c.name)
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function createNewsCategory(name: string) {
    try {
        await prisma.newsCategory.create({ data: { name } })
        revalidatePath("/[brand]/admin/news")
        revalidatePath("/[brand]/news")
        return { success: true }
    } catch (error) {
        console.error("Create category error:", error)
        return { success: false, error: "Categoria già esistente o errore" }
    }
}

export async function deleteNewsCategory(id: string) {
    try {
        await prisma.newsCategory.delete({ where: { id } })
        revalidatePath("/[brand]/admin/news")
        revalidatePath("/[brand]/news")
        return { success: true }
    } catch (error) {
        console.error("Delete category error:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function getNewsCategoriesWithIds() {
    try {
        return await prisma.newsCategory.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

// Get distinct years from news for year filter
export async function getNewsYears(): Promise<number[]> {
    try {
        const news = await prisma.news.findMany({
            select: { date: true },
            orderBy: { date: "desc" }
        })
        const yearSet = new Set<number>()
        news.forEach((n: any) => yearSet.add(new Date(n.date).getFullYear()))
        const years = Array.from(yearSet)
        return years.sort((a, b) => b - a)
    } catch (error) {
        console.error("Error fetching news years:", error)
        return []
    }
}
