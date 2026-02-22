import NewsForm from "@/components/admin/news-form"
import { getNewsCategories } from "@/app/actions/news"
import { getSession } from "@/app/actions/auth"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditNewsPage({ params }: { params: { id: string } }) {
    const [article, categories, user] = await Promise.all([
        prisma.news.findUnique({ where: { id: params.id } }),
        getNewsCategories(),
        getSession()
    ])

    if (!article) {
        notFound()
    }

    return <NewsForm initialData={article} categories={categories} userRole={user?.role} userAssociation={user?.association} />
}
