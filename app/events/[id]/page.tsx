import { getEventById } from "@/app/actions/events"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { Metadata } from "next"
import EventDetailClient from "./event-detail-client"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const event = await getEventById(Number(params.id))
    if (!event) return {}

    return {
        title: event.title,
        description: event.description || `Evento ${event.title} organizzato da Morgana & O.R.U.M. il ${new Date(event.date).toLocaleDateString("it-IT")}`,
        openGraph: {
            title: event.title,
            description: event.description || `Evento ${event.title} organized by Morgana & O.R.U.M.`,
            images: event.image ? [event.image] : [],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: event.title,
            description: event.description || `Evento ${event.title} organized by Morgana & O.R.U.M.`,
            images: event.image ? [event.image] : [],
        }
    }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
    const sessionEmail = cookies().get("session_email")?.value || null
    const event = await getEventById(Number(params.id), sessionEmail)

    if (!event) {
        notFound()
    }

    return (
        <EventDetailClient event={event} isLoggedIn={!!sessionEmail} userEmail={sessionEmail} />
    )
}
