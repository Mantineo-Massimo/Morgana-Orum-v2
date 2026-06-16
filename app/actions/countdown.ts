"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type CountdownDeadlineData = {
    id: string
    title: string
    titleEn: string
    category: string
    date: Date
    description: string
    descriptionEn: string
    published: boolean
    order: number
    createdAt: Date
    updatedAt: Date
}

// Public: only published, sorted by date
export async function getPublicCountdownDeadlines(): Promise<CountdownDeadlineData[]> {
    try {
        return await prisma.countdownDeadline.findMany({
            where: { published: true },
            orderBy: [{ date: "asc" }]
        })
    } catch (error) {
        console.error("Error fetching countdown deadlines:", error)
        return []
    }
}

// Admin: all items
export async function getAdminCountdownDeadlines(): Promise<CountdownDeadlineData[]> {
    try {
        return await prisma.countdownDeadline.findMany({
            orderBy: [{ order: "asc" }, { date: "asc" }]
        })
    } catch (error) {
        console.error("Error fetching admin countdown deadlines:", error)
        return []
    }
}

type CreateInput = {
    title: string
    titleEn: string
    category: string
    date: string // ISO string from form
    description: string
    descriptionEn: string
    published?: boolean
    order?: number
}

export async function createCountdownDeadline(data: CreateInput): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.countdownDeadline.create({
            data: {
                title: data.title,
                titleEn: data.titleEn,
                category: data.category,
                date: new Date(data.date),
                description: data.description,
                descriptionEn: data.descriptionEn,
                published: data.published ?? true,
                order: data.order ?? 0
            }
        })
        revalidatePath("/admin/countdown")
        revalidatePath("/guide")
        return { success: true }
    } catch (error) {
        console.error("Error creating countdown deadline:", error)
        return { success: false, error: "Errore durante la creazione" }
    }
}

export async function updateCountdownDeadline(id: string, data: Partial<CreateInput>): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.countdownDeadline.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.titleEn !== undefined && { titleEn: data.titleEn }),
                ...(data.category !== undefined && { category: data.category }),
                ...(data.date !== undefined && { date: new Date(data.date) }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.descriptionEn !== undefined && { descriptionEn: data.descriptionEn }),
                ...(data.published !== undefined && { published: data.published }),
                ...(data.order !== undefined && { order: data.order })
            }
        })
        revalidatePath("/admin/countdown")
        revalidatePath("/guide")
        return { success: true }
    } catch (error) {
        console.error("Error updating countdown deadline:", error)
        return { success: false, error: "Errore durante l'aggiornamento" }
    }
}

export async function deleteCountdownDeadline(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.countdownDeadline.delete({ where: { id } })
        revalidatePath("/admin/countdown")
        revalidatePath("/guide")
        return { success: true }
    } catch (error) {
        console.error("Error deleting countdown deadline:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function toggleCountdownDeadlinePublished(id: string, published: boolean): Promise<{ success: boolean; error?: string }> {
    return updateCountdownDeadline(id, { published })
}

// Seed: Import the hardcoded items into DB (run once from admin)
export async function seedDefaultCountdownDeadlines(): Promise<{ success: boolean; count: number; error?: string }> {
    const defaults = [
        {
            title: "Domanda Borsa di Studio ERSU 2026/27",
            titleEn: "ERSU Scholarship Application 2026/27",
            category: "burocrazia",
            date: "2026-08-31T23:59:59",
            description: "Scadenza ultima per la presentazione della domanda di borsa di studio ed esonero tasse ERSU sul portale dedicato.",
            descriptionEn: "Final deadline to submit the ERSU scholarship and tuition fee waiver application on the official portal.",
            order: 1
        },
        {
            title: "Sessione d'Esami Autunnale",
            titleEn: "Autumn Exam Session",
            category: "sessione",
            date: "2026-09-01T09:00:00",
            description: "Inizio ufficiale degli appelli d'esame per la sessione autunnale dell'A.A. 2025/26.",
            descriptionEn: "Official start of exam calls for the Autumn session of the Academic Year 2025/26.",
            order: 2
        },
        {
            title: "Compilazione Piano di Studi 2026/27",
            titleEn: "Study Plan Submission 2026/27",
            category: "burocrazia",
            date: "2026-11-15T23:59:59",
            description: "Finestra per la compilazione e modifica online del piano di studi per l'A.A. 2026/27 su Esse3.",
            descriptionEn: "Timeline for submitting and editing your online study plan for A.Y. 2026/27 on the Esse3 portal.",
            order: 3
        },
        {
            title: "Scadenza Immatricolazioni & Iscrizioni 2026/27",
            titleEn: "Enrollment & Registration Deadline 2026/27",
            category: "burocrazia",
            date: "2026-12-31T23:59:59",
            description: "Termine ultimo per completare l'immatricolazione o l'iscrizione ad anni successivi senza mora.",
            descriptionEn: "Deadline to complete enrollment or re-enrollment for subsequent years without incurring late fees.",
            order: 4
        },
        {
            title: "Sessione d'Esami Invernale 2026/27",
            titleEn: "Winter Exam Session 2026/27",
            category: "sessione",
            date: "2027-01-15T09:00:00",
            description: "Inizio ufficiale della sessione d'esami ordinaria invernale per l'A.A. 2026/27.",
            descriptionEn: "Official start of the winter ordinary exam session for the Academic Year 2026/27.",
            order: 5
        }
    ]

    try {
        let count = 0
        for (const item of defaults) {
            try {
                await prisma.countdownDeadline.create({
                    data: {
                        ...item,
                        date: new Date(item.date),
                        published: true
                    }
                })
                count++
            } catch {
                // Skip duplicates if already exists
            }
        }
        revalidatePath("/admin/countdown")
        return { success: true, count }
    } catch (error) {
        console.error("Seed error:", error)
        return { success: false, count: 0, error: "Errore durante il seed" }
    }
}
