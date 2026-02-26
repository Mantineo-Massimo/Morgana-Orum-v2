"use server"

import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/mail"
import { getEventBookingTemplate, getNewsletterTemplate } from "@/lib/email-templates"
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

export async function getAllEvents(userEmail?: string | null, association?: Association, mode: 'upcoming' | 'past' = 'upcoming', locale: string = 'it') {
    const now = new Date()
    const query: any = {
        where: {
            published: true,
            date: mode === 'upcoming' ? { gte: now } : { lt: now }
        },
        orderBy: { date: mode === 'upcoming' ? 'asc' : 'desc' },
    }

    if (association) {
        query.where.associations = { hasSome: [association, Association.MORGANA_ORUM] }
    }

    if (userEmail) {
        query.include = {
            registrations: {
                where: {
                    user: { email: userEmail }
                }
            }
        }
    }

    const events = await prisma.event.findMany(query)
    const typedEvents = events as any[]

    return typedEvents.map((event: any) => ({
        ...event,
        title: (locale === 'en' && event.titleEn) ? event.titleEn : event.title,
        description: (locale === 'en' && event.descriptionEn) ? event.descriptionEn : event.description,
        details: (locale === 'en' && event.detailsEn) ? event.detailsEn : event.details,
        isRegistered: event.registrations ? (event.registrations as any[]).length > 0 : false,
        registrations: undefined
    }))
}

export async function getEventById(id: number, userEmail?: string | null, locale: string = 'it') {
    const query: any = {
        where: { id, published: true },
    }

    if (userEmail) {
        query.include = {
            registrations: {
                where: {
                    user: { email: userEmail }
                }
            }
        }
    }

    const event = await prisma.event.findUnique(query) as any

    if (!event) return null

    return {
        ...event,
        title: (locale === 'en' && (event as any).titleEn) ? (event as any).titleEn : event.title,
        description: (locale === 'en' && (event as any).descriptionEn) ? (event as any).descriptionEn : event.description,
        details: (locale === 'en' && (event as any).detailsEn) ? (event as any).detailsEn : event.details,
        isRegistered: event.registrations ? (event.registrations as any[]).length > 0 : false,
        registrations: undefined
    }
}

export async function getEventCategories() {
    try {
        const cats = await prisma.eventCategory.findMany({ orderBy: { name: "asc" } })
        return cats.map((c: any) => c.name)
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function createEventCategory(name: string) {
    try {
        await prisma.eventCategory.create({ data: { name } })
        revalidatePath("/admin/events", "page")
        revalidatePath("/events", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Create category error:", error)
        return { success: false, error: "Categoria già esistente o errore" }
    }
}

export async function deleteEventCategory(id: string) {
    try {
        await prisma.eventCategory.delete({ where: { id } })
        revalidatePath("/admin/events", "page")
        revalidatePath("/events", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Delete category error:", error)
        return { success: false, error: "Errore durante l'eliminazione" }
    }
}

export async function getEventCategoriesWithIds() {
    try {
        return await prisma.eventCategory.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

// --- REGISTRATION ---

export async function registerForEvent(userEmail: string, eventId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!user) {
            return { success: false, message: "Utente non trovato." }
        }

        // Check if booking is open
        const event = await prisma.event.findUnique({ where: { id: eventId } })
        if (!event) {
            return { success: false, message: "Evento non trovato." }
        }

        if (!event.bookingOpen) {
            return { success: false, message: "Le prenotazioni per questo evento non sono aperte." }
        }

        const now = new Date()
        if (event.bookingStart && now < event.bookingStart) {
            return { success: false, message: `Le prenotazioni aprono il ${event.bookingStart.toLocaleDateString('it-IT')}.` }
        }
        if (event.bookingEnd && now > event.bookingEnd) {
            return { success: false, message: "Le prenotazioni per questo evento sono chiuse." }
        }

        const existing = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId: eventId
                }
            }
        })

        if (existing) {
            return { success: false, message: "Sei già registrato a questo evento." }
        }

        await prisma.registration.create({
            data: {
                userId: user.id,
                eventId: eventId,
                status: "REGISTERED"
            }
        })

        // Send Confirmation Email (Non-blocking)
        // Detect brand from associations logic or use a default/context
        // For simplicity, we use the user's association or the context of the event
        const brand = (user.association === Association.MORGANA_ORUM) ? "morgana" : "orum"

        sendEmail({
            to: userEmail,
            subject: `Conferma Prenotazione: ${event.title}`,
            html: getEventBookingTemplate(
                user.name,
                event.title,
                event.date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                event.location,
                brand as "morgana" | "orum"
            ),
            brand: brand as "morgana" | "orum"
        }).catch(err => console.error("Async booking email error:", err))

        revalidatePath("/dashboard")
        return { success: true, message: "Registrazione effettuata con successo!" }

    } catch (error) {
        console.error("Registration error:", error)
        return { success: false, message: "Errore durante la registrazione." }
    }
}

export async function cancelRegistration(eventId: number) {
    try {
        const { cookies } = await import("next/headers")
        const userEmail = cookies().get("session_email")?.value

        if (!userEmail) {
            return { success: false, message: "Non autorizzato." }
        }

        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        })

        if (!user) {
            return { success: false, message: "Utente non trovato." }
        }

        await prisma.registration.delete({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId: eventId
                }
            }
        })

        revalidatePath("/dashboard", "page")
        revalidatePath(`/events/${eventId}`, "page")
        revalidatePath("/", "layout")
        return { success: true, message: "Prenotazione annullata con successo." }
    } catch (error) {
        console.error("Cancel registration error:", error)
        return { success: false, message: "Errore durante l'annullamento della prenotazione." }
    }
}

// --- ADMIN CRUD ---

export async function getAllAdminEvents(filters?: {
    query?: string,
    status?: string,
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

        if (filters?.status === "published") {
            where.published = true
        } else if (filters?.status === "draft") {
            where.published = false
        }

        return await prisma.event.findMany({
            where,
            orderBy: { date: "desc" },
        })
    } catch (error) {
        console.error("Error fetching all admin events:", error)
        return []
    }
}

export async function createEvent(data: {
    title: string
    titleEn?: string
    description: string
    descriptionEn?: string
    details?: string
    detailsEn?: string
    date: string
    endDate?: string
    location: string
    cfuValue?: string
    cfuType?: string
    cfuDepartments?: string
    image?: string
    category: string
    bookingOpen: boolean
    bookingStart?: string
    bookingEnd?: string
    attachments?: string
    associations?: Association[]
    published: boolean
    youtubeUrl?: string
}) {
    try {
        const permission = await checkContentPermission(data.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questa associazione." }

        const newEvent = await prisma.event.create({
            data: {
                title: data.title,
                titleEn: (data as any).titleEn || null,
                description: data.description,
                descriptionEn: (data as any).descriptionEn || null,
                details: data.details || null,
                detailsEn: (data as any).detailsEn || null,
                date: new Date(data.date),
                endDate: data.endDate ? new Date(data.endDate) : null,
                location: data.location,
                cfuValue: data.cfuValue || null,
                cfuType: data.cfuType || null,
                cfuDepartments: data.cfuDepartments || null,
                image: data.image || null,
                category: data.category,
                bookingOpen: data.bookingOpen,
                bookingStart: data.bookingStart ? new Date(data.bookingStart) : null,
                bookingEnd: data.bookingEnd ? new Date(data.bookingEnd) : null,
                attachments: data.attachments || null,
                associations: data.associations || [Association.MORGANA_ORUM],
                published: data.published,
                youtubeUrl: data.youtubeUrl || null,
            } as any
        })

        // -- INVIA NEWSLETTER A SOTTOSCRITTORI (SOLO SE PUBBLICATO) --
        if (newEvent.published) {
            sendPublicationNotification(newEvent, "Evento")
        }
        revalidatePath("/events", "page")
        revalidatePath("/admin/events", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Create event error:", error)
        return { success: false, error: "Errore nella creazione dell'evento." }
    }
}

export async function updateEvent(id: number, data: {
    title: string
    titleEn?: string
    description: string
    descriptionEn?: string
    details?: string
    detailsEn?: string
    date: string
    endDate?: string
    location: string
    cfuValue?: string
    cfuType?: string
    cfuDepartments?: string
    image?: string
    category: string
    bookingOpen: boolean
    bookingStart?: string
    bookingEnd?: string
    attachments?: string
    associations?: Association[]
    published: boolean
    youtubeUrl?: string
}) {
    try {
        const existing = await prisma.event.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Evento non trovato" }

        const permission = await checkContentPermission(existing.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questo evento." }

        // Extra protection: Network admins cannot modify associations of central content
        if (permission.user?.role === "ADMIN_NETWORK" && existing.associations.includes(Association.MORGANA_ORUM)) {
            // Check if associations are being changed
            const currentAssocs = [...existing.associations].sort()
            const newAssocs = [...(data.associations || [Association.MORGANA_ORUM])].sort()
            if (JSON.stringify(currentAssocs) !== JSON.stringify(newAssocs)) {
                return { success: false, error: "Non puoi modificare le associazioni di un contenuto centrale." }
            }
        }

        const updateData: any = {
            title: data.title,
            titleEn: (data as any).titleEn || null,
            description: data.description,
            descriptionEn: (data as any).descriptionEn || null,
            details: data.details || null,
            detailsEn: (data as any).detailsEn || null,
            date: new Date(data.date),
            endDate: data.endDate ? new Date(data.endDate) : null,
            location: data.location,
            cfuValue: data.cfuValue || null,
            cfuType: data.cfuType || null,
            cfuDepartments: data.cfuDepartments || null,
            image: data.image || null,
            category: data.category,
            bookingOpen: data.bookingOpen,
            bookingStart: data.bookingStart ? new Date(data.bookingStart) : null,
            bookingEnd: data.bookingEnd ? new Date(data.bookingEnd) : null,
            attachments: data.attachments || null,
            associations: { set: data.associations || [Association.MORGANA_ORUM] },
            published: data.published,
            youtubeUrl: data.youtubeUrl || null,
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: updateData
        })

        // -- INVIA NEWSLETTER SE PASSA DA BOZZA A PUBBLICATO --
        if (!existing?.published && updatedEvent.published) {
            sendPublicationNotification(updatedEvent, "Evento")
        }
        revalidatePath("/events", "page")
        revalidatePath("/admin/events", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Update event error:", error)
        const errorMessage = error instanceof Error ? error.message : "Errore nell'aggiornamento dell'evento."
        return { success: false, error: errorMessage }
    }
}

export async function deleteEvent(id: number) {
    try {
        const existing = await prisma.event.findUnique({ where: { id } })
        if (!existing) return { success: false, error: "Evento non trovato" }

        const permission = await checkContentPermission(existing.associations)
        if (!permission.allowed) return { success: false, error: "Non hai i permessi per questo evento." }

        // Extra protection: Network admins cannot delete Morgana items
        if (permission.user?.role === "ADMIN_NETWORK" && existing.associations.includes(Association.MORGANA_ORUM)) {
            return { success: false, error: "Non puoi eliminare contenuti creati dall'amministrazione centrale." }
        }

        await prisma.registration.deleteMany({ where: { eventId: id } })
        await prisma.event.delete({ where: { id } })
        revalidatePath("/events", "page")
        revalidatePath("/admin/events", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Delete event error:", error)
        return { success: false, error: "Errore nell'eliminazione dell'evento." }
    }
}

export async function getEventRegistrations(eventId: number) {
    try {
        const registrations = await prisma.registration.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        name: true,
                        surname: true,
                        email: true,
                        matricola: true,
                        department: true,
                        degreeCourse: true
                    }
                }
            },
            orderBy: { createdAt: "asc" }
        })
        return registrations.map(r => ({
            ...r.user,
            status: r.status,
            registeredAt: r.createdAt
        }))
    } catch (error) {
        console.error("Get registrations error:", error)
        return []
    }
}

export async function duplicateEvent(eventId: number) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) return { success: false, message: "Evento non trovato" }

        const permission = await checkContentPermission(event.associations)
        if (!permission.allowed) return { success: false, message: "Non hai i permessi per questo evento." }

        const { id, ...eventData } = event

        await prisma.event.create({
            data: {
                ...eventData,
                title: `${event.title} (Copia)`,
                bookingOpen: false, // Per sicurezza disabilitiamo la prenotazione
                published: false,   // La copia nasce sempre come bozza
            }
        })

        revalidatePath("/admin/events", "page")
        revalidatePath("/events", "page")
        revalidatePath("/", "layout")
        return { success: true }
    } catch (error) {
        console.error("Duplicate event error:", error)
        return { success: false }
    }
}
