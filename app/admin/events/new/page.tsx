import { getEventCategories } from "@/app/actions/events"
import EventForm from "@/components/admin/event-form"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function NewEventPage() {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({ where: { email: userEmail || "" } })

    const categories = await getEventCategories()
    return <EventForm categories={categories} userRole={user?.role} userAssociation={user?.association} />
}
