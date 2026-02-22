import NewsForm from "@/components/admin/news-form"
import { getNewsCategories } from "@/app/actions/news"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function NewNewsPage() {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({ where: { email: userEmail || "" } })

    const categories = await getNewsCategories()
    return <NewsForm categories={categories} userRole={user?.role} userAssociation={user?.association} />
}
