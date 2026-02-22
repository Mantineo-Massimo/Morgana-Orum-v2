import NewsForm from "@/components/admin/news-form"
import { getNewsCategories } from "@/app/actions/news"
import { getSession } from "@/app/actions/auth"

export const dynamic = "force-dynamic"

export default async function NewNewsPage() {
    const [categories, user] = await Promise.all([
        getNewsCategories(),
        getSession()
    ])

    return <NewsForm categories={categories} userRole={user?.role} userAssociation={user?.association} />
}
