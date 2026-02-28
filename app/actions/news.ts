"use server"

import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { revalidatePath, unstable_cache, revalidateTag } from "next/cache"
import { sendPublicationNotification } from "./notifications"

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

const getNewsInternal = async (category?: string, query?: string, association?: Association, locale: string = 'it') => {
    try {
        const where: any = { published: true }

        if (category && category !== "Tutte") {
            where.category = category
        }

        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
            ]
        }

        if (association) {
            where.associations = { hasSome: [association, Association.MORGANA_ORUM] }
        }

        const newsRows = await prisma.news.findMany({
            where,
            orderBy: { date: "desc" }
        })

        const news = newsRows as any[]

        // Simple local mapping for current language
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

export const getNews = async (category?: string, query?: string, association?: Association, locale: string = 'it') => {
    const news = await unstable_cache(
        async () => getNewsInternal(category, query, association, locale),
        ['news-list', category || 'all', query || 'none', association || 'none', locale],
        { revalidate: 3600, tags: ['news'] }
    )()

    return news.map(item => ({
        ...item,
        date: new Date(item.date)
    }))
}

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

export const getNewsById = async (id: string, locale: string = 'it') => {
    const news = await unstable_cache(
        async () => getNewsByIdInternal(id, locale),
        ['news-detail', id, locale],
        { revalidate: 3600, tags: ['news'] }
    )()

    if (!news) return null
    return {
        ...news,
        date: new Date(news.date)
    }
}

export async function getNewsCategories() {
    try {
        const cats = await prisma.newsCategory.findMany({ orderBy: { name: "asc" } })
        return cats.map((c: any) => c.name)
    } catch (error) {
        console.error("Error fetching news categories:", error)
        return []
    }
}

export async function createNewsCategory(name: string) {
    try {
        await prisma.newsCategory.create({ data: { name } })
        revalidatePath("/admin/news", "page")
        revalidatePath("/news", "page")
        revalidatePath("/", "layout")
        revalidateTag('news')
        return { success: true }
    } catch (error) {
        console.error("Create news category error:", error)
        return { success: false, error: "Categoria già esistente o errore" }
    }
}

export async function deleteNewsCategory(id: string) {
    try {
        await prisma.newsCategory.delete({ where: { id } })
        revalidatePath("/admin/news", "page")
        revalidatePath("/news", "page")
        revalidatePath("/", "layout")
        revalidateTag('news')
        return { success: true }
    } catch (error) {
        console.error("Delete news category error:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function getNewsCategoriesWithIds() {
    try {
        return await prisma.newsCategory.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
        console.error("Error fetching news categories:", error)
        return []
    }
}

export async function getNewsYears() {
    try {
        const news = await prisma.news.findMany({
            select: { date: true },
            orderBy: { date: "desc" }
        })
        const years = Array.from(new Set(news.map(n => new Date(n.date).getFullYear())))
        return years.sort((a, b) => b - a)
    } catch (error) {
        console.error("Error fetching news years:", error)
        return []
    }
}

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
                { title: { contains: filters.query, mode: 'insensitive' } },
                { description: { contains: filters.query, mode: 'insensitive' } },
            ]
        }

        if (filters?.category) {
            where.category = filters.category
        }

        if (filters?.status === "published") {
            where.published = true
        } else if (filters?.status === "draft") {
            where.published = false
        }

        return await prisma.news.findMany({
            where,
            orderBy: { date: "desc" },
        })
    } catch (error) {
        console.error("Error fetching admin news:", error)
        return []
    }
}

export async function createNews(data: {
    title: string
    titleEn?: string | null
    description: string
    descriptionEn?: string | null
    content?: string | null
    contentEn?: string | null
    image?: string | null
    category: string
    associations?: Association[]
    published: boolean
}) {
    try {
        const permission = await checkContentPermission(data.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa associazione." }

        const newNews = await prisma.news.create({
            data: {
                title: data.title,
                titleEn: (data as any).titleEn || null,
                description: data.description,
                descriptionEn: (data as any).descriptionEn || null,
                content: data.content,
                contentEn: (data as any).contentEn || null,
                image: data.image || null,
                category: data.category,
                associations: data.associations || [Association.MORGANA_ORUM],
                published: data.published,
                date: new Date()
            } as any
        })

        if (newNews.published) {
            sendPublicationNotification(newNews, "Notizia")
        }

        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
        revalidateTag('news')
        return { success: true }
    } catch (error) {
        console.error("Create news error:", error)
        return { success: false, error: "Errore nella creazione della notizia." }
    }
}

export async function updateNews(id: string, data: {
    title: string
    titleEn?: string | null
    description: string
    descriptionEn?: string | null
    content?: string | null
    contentEn?: string | null
    image?: string | null
    category: string
    associations?: Association[]
    published: boolean
}) {
    try {
        const existing = await prisma.news.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Notizia non trovata" }

        const permission = await checkContentPermission(existing.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa notizia." }

        // Extra protection: Network admins cannot modify associations of central content
        if (permission.user?.role === "ADMIN_NETWORK" && existing.associations.includes(Association.MORGANA_ORUM)) {
            const currentAssocs = [...existing.associations].sort()
            const newAssocs = [...(data.associations || [Association.MORGANA_ORUM])].sort()
            if (JSON.stringify(currentAssocs) !== JSON.stringify(newAssocs)) {
                return { success: false, error: "Non puoi modificare le associazioni di un contenuto centrale." }
            }
        }

        const updatedNews = await prisma.news.update({
            where: { id },
            data: {
                title: data.title,
                titleEn: (data as any).titleEn || null,
                description: data.description,
                descriptionEn: (data as any).descriptionEn || null,
                content: data.content,
                contentEn: (data as any).contentEn || null,
                image: data.image || null,
                category: data.category,
                associations: { set: data.associations || [Association.MORGANA_ORUM] },
                published: data.published,
            } as any
        })

        if (!existing.published && updatedNews.published) {
            sendPublicationNotification(updatedNews, "Notizia")
        }

        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
        revalidateTag('news')
        return { success: true }
    } catch (error) {
        console.error("Update news error:", error)
        return { success: false, error: "Errore nell'aggiornamento della notizia." }
    }
}

export async function deleteNews(id: string) {
    try {
        const existing = await prisma.news.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Notizia non trovata" }

        const permission = await checkContentPermission(existing.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa notizia." }

        if (permission.user?.role === "ADMIN_NETWORK" && existing.associations.includes(Association.MORGANA_ORUM)) {
            return { success: false, error: "Non puoi eliminare contenuti creati dall'amministrazione centrale." }
        }

        await prisma.news.delete({ where: { id } })
        revalidatePath("/news", "page")
        revalidatePath("/admin/news", "page")
        revalidatePath("/", "layout")
        revalidateTag('news')
        return { success: true }
    } catch (error) {
        console.error("Delete news error:", error)
        return { success: false, error: "Errore nell'eliminazione della notizia." }
    }
}

export async function duplicateNews(newsId: string) {
    try {
        const news = await prisma.news.findUnique({
            where: { id: newsId }
        })

        if (!news) return { success: false, error: "Notizia non trovata" }

        const permission = await checkContentPermission(news.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa notizia." }

        const { id, ...newsData } = news

        await prisma.news.create({
            data: {
                ...newsData,
                title: `${news.title} (Copia)`,
                published: false,   // La copia nasce sempre come bozza
            }
        })

        revalidatePath("/admin/news", "page")
        revalidatePath("/news", "page")
        revalidatePath("/", "layout")
        revalidateTag('news')
        return { success: true }
    } catch (error) {
        console.error("Duplicate news error:", error)
        return { success: false, error: "Errore durante la duplicazione" }
    }
}
