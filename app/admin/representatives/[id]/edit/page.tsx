import RepresentativeForm from "@/components/admin/representative-form"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"


export const dynamic = "force-dynamic"

export default async function EditRepresentativePage({ params }: { params: { id: string } }) {
    const { cookies } = await import("next/headers")
    const userEmail = cookies().get("session_email")?.value
    const user = userEmail ? await prisma.user.findUnique({ where: { email: userEmail } }) : null

    const rep = await prisma.representative.findUnique({
        where: { id: params.id }
    })

    if (!rep) {
        notFound()
    }

    return (
        <RepresentativeForm
            initialData={rep}
            userRole={user?.role}
            userAssociation={user?.association}
        />
    )
}
