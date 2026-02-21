"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/mail"
import { getEventBookingTemplate, getNewsletterTemplate } from "@/lib/email-templates"

// --- READ ---

export async function getAllEvents(userEmail?: string | null, association?: string) {
    const query: any = {
        where: { published: true },
        orderBy: { date: 'asc' },
    }

    if (association) {
        query.where.association = association
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

    return events.map((event: any) => ({
        ...event,
        isRegistered: event.registrations ? (event.registrations as any[]).length > 0 : false,
        registrations: undefined
    }))
}

export async function getEventById(id: number, userEmail?: string | null) {
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
        isRegistered: event.registrations ? (event.registrations as any[]).length > 0 : false,
        registrations: undefined
    }
}

export async function getEventCategories() {
    const events = await prisma.event.findMany({ select: { category: true } })
    const categorySet = new Set<string>()
    events.forEach((e: { category: string }) => categorySet.add(e.category))
    return Array.from(categorySet).sort()
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
        const brand = (user.association?.toLowerCase() === "orum" || user.association?.toLowerCase() === "o.r.u.m.") ? "orum" : "morgana"

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

        revalidatePath("/dashboard")
        revalidatePath(`/events/${eventId}`)
        return { success: true, message: "Prenotazione annullata con successo." }
    } catch (error) {
        console.error("Cancel registration error:", error)
        return { success: false, message: "Errore durante l'annullamento della prenotazione." }
    }
}

// --- ADMIN CRUD ---

export async function getAllAdminEvents(filters?: { query?: string, status?: string }) {
    try {
        const where: any = {}

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
    description: string
    details?: string
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
    association?: string
}) {
    try {
        const newEvent = await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                details: data.details || null,
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
                association: data.association || "Morgana & O.R.U.M.",
            }
        })
        revalidatePath("/events")
        revalidatePath("/admin/events")
        return { success: true }
    } catch (error) {
        console.error("Create event error:", error)
        return { success: false, error: "Errore nella creazione dell'evento." }
    }
}

export async function updateEvent(id: number, data: {
    title: string
    description: string
    details?: string
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
    association?: string
}) {
    try {
        await prisma.event.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                details: data.details || null,
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
                association: data.association || "Morgana & O.R.U.M.",
            }
        })
        revalidatePath("/events")
        revalidatePath("/admin/events")
        return { success: true }
    } catch (error) {
        console.error("Update event error:", error)
        return { success: false, error: "Errore nell'aggiornamento dell'evento." }
    }
}

export async function deleteEvent(id: number) {
    try {
        await prisma.registration.deleteMany({ where: { eventId: id } })
        await prisma.event.delete({ where: { id } })
        revalidatePath("/events")
        revalidatePath("/admin/events")
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

        const { id, ...eventData } = event

        await prisma.event.create({
            data: {
                ...eventData,
                title: `${event.title} (Copia)`,
                bookingOpen: false, // Per sicurezza disabilitiamo la prenotazione
                published: false,   // La copia nasce sempre come bozza
            }
        })

        revalidatePath("/admin/events")
        revalidatePath("/events")
        return { success: true }
    } catch (error) {
        console.error("Duplicate event error:", error)
        return { success: false }
    }
}
