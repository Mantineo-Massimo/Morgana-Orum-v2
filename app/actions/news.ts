"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import prisma from "@/lib/prisma"


const newsSchema = z.object({
    title: z.string().min(1, "Il titolo è obbligatorio"),
    description: z.string().optional().nullable().or(z.literal("")),
    content: z.string().optional().nullable().or(z.literal("")),
    category: z.string().min(1, "La categoria è obbligatoria"),
    tags: z.string().optional().nullable().or(z.literal("")),
    image: z.string().optional().nullable().or(z.literal("")),
    date: z.string().optional(),
    published: z.boolean().default(true),
    association: z.string().optional().default("Morgana & O.R.U.M."),
})

export async function createNews(data: z.infer<typeof newsSchema>) {
    try {
        const validData = newsSchema.parse(data)

        await prisma.news.create({
            data: {
                title: validData.title,
                description: validData.description || "",
                content: validData.content || null,
                category: validData.category,
                tags: validData.tags || null,
                image: validData.image || null,
                date: validData.date ? new Date(validData.date) : new Date(),
                published: validData.published,
                association: validData.association || "Morgana & O.R.U.M.",
            }
        })

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
        const updateData: any = { ...data }
        if (data.date) {
            updateData.date = new Date(data.date)
        }
        if (data.content === "") updateData.content = null
        if (data.tags === "") updateData.tags = null
        if (data.image === "") updateData.image = null

        await prisma.news.update({
            where: { id },
            data: updateData,
        })

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
export async function getNews(category?: string, query?: string, association?: string) {
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
            where.association = association
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
export async function getAllNews(filters?: { query?: string, category?: string, status?: string, year?: number, association?: string }) {
    try {
        const where: any = {}

        if (filters?.query) {
            where.OR = [
                { title: { contains: filters.query } },
                { description: { contains: filters.query } },
            ]
        }

        if (filters?.category) {
            where.category = filters.category
        }

        if (filters?.association) {
            where.association = filters.association
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
