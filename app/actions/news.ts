"use server"

import { revalidatePath, unstable_cache, revalidateTag } from "next/cache"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { sendPublicationNotification } from "./notifications"
import { AssociationId } from "@/lib/associations"

const newsSchema = z.object({
    title: z.string().min(1, "Il titolo è obbligatorio"),
    titleEn: z.string().optional().nullable().or(z.literal("")),
    description: z.string().optional().nullable().or(z.literal("")),
    descriptionEn: z.string().optional().nullable().or(z.literal("")),
    content: z.string().optional().nullable().or(z.literal("")),
    contentEn: z.string().optional().nullable().or(z.literal("")),
    category: z.string().min(1, "La categoria è obbligatoria"),
    tags: z.string().optional().nullable().or(z.literal("")),
    image: z.string().optional().nullable().or(z.literal("")),
    date: z.string().optional(),
    published: z.boolean().default(true),
    associations: z.array(z.nativeEnum(Association)).default([Association.MORGANA_ORUM]),
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
    if (user.role === "ADMIN_NETWORK") {
        const isMatch = itemAssociations?.includes(user.association)
        return { allowed: !!isMatch, user }
    }

    return { allowed: false }
}

export async function createNews(data: any) {
    try {
        const validData = newsSchema.parse(data) as any
        const permission = await checkContentPermission(validData.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa associazione." }

        const newNews = await prisma.news.create({
            data: {
                title: validData.title,
                titleEn: validData.titleEn || null,
                description: validData.description || "",
                descriptionEn: validData.descriptionEn || null,
                content: validData.content || null,
                contentEn: validData.contentEn || null,
                category: validData.category,
                tags: validData.tags || null,
                image: validData.image || null,
                date: validData.date ? new Date(validData.date) : new Date(),
                published: validData.published,
                associations: validData.associations || [Association.MORGANA_ORUM],
            }
        })

        // -- INVIA NEWSLETTER A SOTTOSCRITTORI (SOLO SE PUBBLICATA) --
        if (newNews.published) {
            sendPublicationNotification(newNews, "Notizia")
        }

        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
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

        const validData = newsSchema.partial().parse(data)

        // Extra protection: Network admins cannot modify associations of central content
        if (permission.user?.role === "ADMIN_NETWORK" && existing.associations.includes(Association.MORGANA_ORUM)) {
            if (validData.associations) {
                const currentAssocs = [...existing.associations].sort()
                const newAssocs = [...validData.associations].sort()
                if (JSON.stringify(currentAssocs) !== JSON.stringify(newAssocs)) {
                    return { success: false, error: "Non puoi modificare le associazioni di un contenuto centrale." }
                }
            }
        }

        const updateData: any = {}

        // Map validData to updateData, ensuring empty strings are null for optional localized fields
        Object.entries(validData).forEach(([key, value]) => {
            if (key === 'associations' && Array.isArray(value)) {
                updateData.associations = { set: value }
            } else if (key === 'date' && value) {
                updateData.date = new Date(value as string)
            } else if (typeof value === 'string' && value.trim() === '' && ['titleEn', 'descriptionEn', 'contentEn', 'tags', 'image'].includes(key)) {
                updateData[key] = null
            } else {
                updateData[key] = value
            }
        })

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

        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Update news error:", error)
        const errorMessage = error instanceof Error ? error.message : "Errore durante l'aggiornamento"
        return { success: false, error: errorMessage }
    }
}

export async function deleteNews(id: string) {
    try {
        const existing = await prisma.news.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Notizia non trovata" }

        const permission = await checkContentPermission(existing.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa notizia." }

        // Extra protection: Network admins cannot delete Morgana items
        if (permission.user?.role === "ADMIN_NETWORK" && existing.associations.includes(Association.MORGANA_ORUM)) {
            return { success: false, error: "Non puoi eliminare contenuti creati dall'amministrazione centrale." }
        }

        await prisma.news.delete({
            where: { id }
        })

        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Delete news error:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function duplicateNews(id: string) {
    try {
        const existing = await prisma.news.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Notizia non trovata" }

        const permission = await checkContentPermission(existing.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa notizia." }

        const { id: _, createdAt: __, updatedAt: ___, ...newsData } = existing

        await prisma.news.create({
            data: {
                ...newsData,
                title: `${existing.title} (Copia)`,
                published: false, // La copia nasce sempre come bozza
                date: new Date(),
            }
        })

        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
        revalidateTag('news')
        return { success: true }
    } catch (error) {
        console.error("Duplicate news error:", error)
        return { success: false, error: "Errore durante la duplicazione" }
    }
}

const getNewsInternal = async (category?: string, query?: string, association?: Association, locale: string = 'it') => {
    // ... logic remains same as original getNews ...
    console.log('getNewsInternal called with:', { category, query, association, locale })
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
            where.associations = { hasSome: [association, Association.MORGANA_ORUM] }
        }

        if (query) {
            where.OR = [
                { title: { contains: query } },
                { titleEn: { contains: query } },
                { description: { contains: query } },
                { descriptionEn: { contains: query } },
            ]
        }

        const news = await prisma.news.findMany({
            where,
            orderBy: { date: "desc" },
        })

        // Localization mapping
        return news.map((item: any) => ({
            ...item,
            title: (locale === 'en' && item.titleEn) ? item.titleEn : item.title,
            description: (locale === 'en' && item.descriptionEn) ? item.descriptionEn : item.description,
            content: (locale === 'en' && item.contentEn) ? item.contentEn : item.content,
        }))
    } catch (error) {
        console.error("Error fetching news:", error)
        return []
    }
}

export const getNews = unstable_cache(
    async (category?: string, query?: string, association?: Association, locale: string = 'it') => {
        return getNewsInternal(category, query, association, locale)
    },
    ['news-list'],
    { revalidate: 3600, tags: ['news'] }
)

const getNewsByIdInternal = async (id: string, locale: string = 'it') => {
    try {
        const news = await prisma.news.findUnique({ where: { id } })
        if (!news) return null

        // Localization mapping
        return {
            ...news,
            title: (locale === 'en' && (news as any).titleEn) ? (news as any).titleEn : news.title,
            description: (locale === 'en' && (news as any).descriptionEn) ? (news as any).descriptionEn : news.description,
            content: (locale === 'en' && (news as any).contentEn) ? (news as any).contentEn : news.content,
        }
    } catch (error) {
        console.error("Error fetching news by id:", error)
        return null
    }
}

export const getNewsById = unstable_cache(
    async (id: string, locale: string = 'it') => {
        return getNewsByIdInternal(id, locale)
    },
    ['news-detail'],
    { revalidate: 3600, tags: ['news'] }
)

// Admin: all news, with optional filters
export async function getAllNews(filters?: {
    query?: string,
    category?: string,
    status?: string,
    year?: number,
    association?: Association,
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
                user = await prisma.user.findUnique({
                    where: { email: userEmail }
                })
            }
        }

        if (!user) return []

        const where: any = {}

        // Enforce role-based association filtering
        if (user.role === "ADMIN_NETWORK") {
            where.associations = { hasSome: [user.association, Association.MORGANA_ORUM] }
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
        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Create category error:", error)
        return { success: false, error: "Categoria già esistente o errore" }
    }
}

export async function deleteNewsCategory(id: string) {
    try {
        await prisma.newsCategory.delete({ where: { id } })
        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
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
