import { getAllNews, deleteNews, getNewsCategoriesWithIds, createNewsCategory, deleteNewsCategory, getNewsCategories, getNewsYears } from "@/app/actions/news"
import AdminNewsClient from "./admin-news-client"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AdminNewsPage() {

    const { cookies } = await import("next/headers")
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const [news, categoriesWithIds, categories, years] = await Promise.all([
        getAllNews(),
        getNewsCategoriesWithIds(),
        getNewsCategories(),
        getNewsYears()
    ])

    return (
        <AdminNewsClient
            userRole={user?.role}
            userAssociation={user?.association}
            news={news}
            categoriesWithIds={categoriesWithIds}
            categories={categories}
            years={years}
        />
    )
}
