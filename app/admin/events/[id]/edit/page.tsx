import { getEventById, getEventCategories } from "@/app/actions/events"
import { getSession } from "@/app/actions/auth"
import { notFound } from "next/navigation"
import EventForm from "@/components/admin/event-form"

export const dynamic = "force-dynamic"

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const [event, categories, user] = await Promise.all([
        getEventById(Number(params.id)),
        getEventCategories(),
        getSession()
    ])

    if (!event) {
        notFound()
    }

    return <EventForm initialData={event} categories={categories} userRole={user?.role} userAssociation={user?.association} />
}
