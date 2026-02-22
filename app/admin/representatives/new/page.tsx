import RepresentativeForm from "@/components/admin/representative-form"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function NewRepresentativePage() {
    const userEmail = cookies().get("session_email")?.value
    const user = userEmail ? await prisma.user.findUnique({ where: { email: userEmail } }) : null

    return (
        <RepresentativeForm
            userRole={user?.role}
            userAssociation={user?.association}
        />
    )
}
