"use server"

import prisma from "@/lib/prisma"
import { toUtcFromRome } from "@/lib/date"

export type DeadlineCountdownData = {
    id: string
    title: string
    titleEn: string | null
    category: string
    date: Date
    description: string
    descriptionEn: string | null
    visible: boolean
    order: number
    createdAt: Date
    updatedAt: Date
}

export async function getCountdowns(): Promise<DeadlineCountdownData[]> {
    try {
        return await prisma.deadlineCountdown.findMany({
            where: { id: { not: "system-init" } },
            orderBy: [{ order: "asc" }, { date: "asc" }]
        })
    } catch (e) {
        console.error("getCountdowns error:", e)
        return []
    }
}

export async function getVisibleCountdowns(): Promise<DeadlineCountdownData[]> {
    try {
        return await prisma.deadlineCountdown.findMany({
            where: { visible: true, id: { not: "system-init" } },
            orderBy: [{ order: "asc" }, { date: "asc" }]
        })
    } catch (e) {
        console.error("getVisibleCountdowns error:", e)
        return []
    }
}

export async function createCountdown(data: {
    title: string
    titleEn?: string
    category: string
    date: Date
    description: string
    descriptionEn?: string
    visible?: boolean
    order?: number
}): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.deadlineCountdown.create({
            data: {
                title: data.title,
                titleEn: data.titleEn || null,
                category: data.category,
                date: data.date,
                description: data.description,
                descriptionEn: data.descriptionEn || null,
                visible: data.visible ?? true,
                order: data.order ?? 0
            }
        })
        return { success: true }
    } catch (e) {
        console.error("createCountdown error:", e)
        return { success: false, error: "Errore durante la creazione" }
    }
}

export async function updateCountdown(
    id: string,
    data: {
        title?: string
        titleEn?: string | null
        category?: string
        date?: Date
        description?: string
        descriptionEn?: string | null
        visible?: boolean
        order?: number
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.deadlineCountdown.update({
            where: { id },
            data
        })
        return { success: true }
    } catch (e) {
        console.error("updateCountdown error:", e)
        return { success: false, error: "Errore durante l'aggiornamento" }
    }
}

export async function deleteCountdown(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.deadlineCountdown.delete({ where: { id } })
        return { success: true }
    } catch (e) {
        console.error("deleteCountdown error:", e)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function toggleCountdownVisibility(
    id: string,
    visible: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.deadlineCountdown.update({ where: { id }, data: { visible } })
        return { success: true }
    } catch (e) {
        console.error("toggleCountdownVisibility error:", e)
        return { success: false, error: "Errore nel cambio visibilità" }
    }
}

// Seed default items into DB if empty
export async function seedDefaultCountdowns(): Promise<void> {
    try {
        const initRecord = await prisma.deadlineCountdown.findUnique({
            where: { id: "system-init" }
        })
        if (initRecord) return

        const count = await prisma.deadlineCountdown.count()
        if (count > 0) {
            // If the DB already has items but no system-init flag, create the flag and return
            await prisma.deadlineCountdown.create({
                data: {
                    id: "system-init",
                    title: "System Init",
                    category: "system",
                    date: new Date(),
                    description: "Do not delete. Keeps default countdowns from re-seeding.",
                    visible: false
                }
            })
            return
        }

        const defaults = [
            {
                title: "Domanda Borsa di Studio ERSU 2026/27",
                titleEn: "ERSU Scholarship Application 2026/27",
                category: "burocrazia",
                date: toUtcFromRome("2026-08-31T23:59:59"),
                description: "Scadenza ultima per la presentazione della domanda di borsa di studio ed esonero tasse ERSU sul portale dedicato.",
                descriptionEn: "Final deadline to submit the ERSU scholarship and tuition fee waiver application on the official portal.",
                order: 1
            },
            {
                title: "Sessione d'Esami Autunnale",
                titleEn: "Autumn Exam Session",
                category: "sessione",
                date: toUtcFromRome("2026-09-01T09:00:00"),
                description: "Inizio ufficiale degli appelli d'esame per la sessione autunnale dell'A.A. 2025/26.",
                descriptionEn: "Official start of exam calls for the Autumn session of the Academic Year 2025/26.",
                order: 2
            },
            {
                title: "Compilazione Piano di Studi 2026/27",
                titleEn: "Study Plan Submission 2026/27",
                category: "burocrazia",
                date: toUtcFromRome("2026-11-15T23:59:59"),
                description: "Finestra per la compilazione e modifica online del piano di studi per l'A.A. 2026/27 su Esse3.",
                descriptionEn: "Timeline for submitting and editing your online study plan for A.Y. 2026/27 on the Esse3 portal.",
                order: 3
            },
            {
                title: "Scadenza Immatricolazioni & Iscrizioni 2026/27",
                titleEn: "Enrollment & Registration Deadline 2026/27",
                category: "burocrazia",
                date: toUtcFromRome("2026-12-31T23:59:59"),
                description: "Termine ultimo per completare l'immatricolazione o l'iscrizione ad anni successivi senza mora.",
                descriptionEn: "Deadline to complete enrollment or re-enrollment for subsequent years without incurring late fees.",
                order: 4
            },
            {
                title: "Sessione d'Esami Invernale 2026/27",
                titleEn: "Winter Exam Session 2026/27",
                category: "sessione",
                date: toUtcFromRome("2027-01-15T09:00:00"),
                description: "Inizio ufficiale della sessione d'esami ordinaria invernale per l'A.A. 2026/27.",
                descriptionEn: "Official start of the winter ordinary exam session for the Academic Year 2026/27.",
                order: 5
            }
        ]

        await prisma.deadlineCountdown.createMany({ data: defaults })

        // Create the hidden initialization record
        await prisma.deadlineCountdown.create({
            data: {
                id: "system-init",
                title: "System Init",
                category: "system",
                date: new Date(),
                description: "Do not delete. Keeps default countdowns from re-seeding.",
                visible: false
            }
        })
    } catch (e) {
        console.error("seedDefaultCountdowns error:", e)
    }
}
