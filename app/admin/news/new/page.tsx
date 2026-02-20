import NewsForm from "@/components/admin/news-form"
import { getNewsCategories } from "@/app/actions/news"

export const dynamic = "force-dynamic"

export default async function NewNewsPage() {
    const categories = await getNewsCategories()
    return <NewsForm categories={categories} />
}
