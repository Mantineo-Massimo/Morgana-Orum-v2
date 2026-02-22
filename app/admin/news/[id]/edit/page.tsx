import NewsForm from "@/components/admin/news-form"
import { getNewsCategories } from "@/app/actions/news"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function EditNewsPage({ params }: { params: { id: string } }) {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({ where: { email: userEmail || "" } })

    const [article, categories] = await Promise.all([
        prisma.news.findUnique({ where: { id: params.id } }),
        getNewsCategories()
    ])

    if (!article) {
        notFound()
    }

    return <NewsForm
        initialData={article}
        categories={categories}
        userRole={user?.role}
        userAssociation={user?.association}
    />
}
