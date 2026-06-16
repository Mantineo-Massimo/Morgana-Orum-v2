import { getRepresentatives, getBienniumConfigs } from "@/app/actions/representatives"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RepresentativesAdminClient } from "./representatives-admin-client"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function AdminRepresentativesPage() {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const [reps, configs] = await Promise.all([
        getRepresentatives({
            userRole: user?.role,
            userAssociation: user?.association
        }),
        getBienniumConfigs()
    ])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <RepresentativesAdminClient
                initialReps={reps as any}
                userRole={user?.role}
                userAssociation={user?.association}
                initialConfigs={configs as any}
            />
        </div>
    )
}
