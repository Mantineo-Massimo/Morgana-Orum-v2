import { getEventById } from "@/app/actions/events"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import EventDetailClient from "./event-detail-client"

export const dynamic = "force-dynamic"

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
