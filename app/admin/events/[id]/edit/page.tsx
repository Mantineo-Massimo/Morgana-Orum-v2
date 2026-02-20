import { getEventById } from "@/app/actions/events"
import { notFound } from "next/navigation"
import EventForm from "@/components/admin/event-form"

export const dynamic = "force-dynamic"

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const event = await getEventById(Number(params.id))

    if (!event) {
        notFound()
    }

    return <EventForm initialData={event} />
}
