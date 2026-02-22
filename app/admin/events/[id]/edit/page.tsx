import { getEventById, getEventCategories } from "@/app/actions/events"
import { notFound } from "next/navigation"
import EventForm from "@/components/admin/event-form"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({ where: { email: userEmail || "" } })

    const [event, categories] = await Promise.all([
        getEventById(Number(params.id)),
        getEventCategories()
    ])

    if (!event) {
        notFound()
    }

    return <EventForm
        initialData={event}
        categories={categories}
        userRole={user?.role}
        userAssociation={user?.association}
    />
}
