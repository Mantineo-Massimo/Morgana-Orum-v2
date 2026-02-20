import { getAllNews, deleteNews, getNewsCategoriesWithIds, createNewsCategory, deleteNewsCategory, getNewsCategories, getNewsYears } from "@/app/actions/news"
import AdminNewsClient from "./admin-news-client"

export const dynamic = "force-dynamic"

export default async function AdminNewsPage() {
    
    const [news, categoriesWithIds, categories, years] = await Promise.all([
        getAllNews(),
        getNewsCategoriesWithIds(),
        getNewsCategories(),
        getNewsYears()
    ])

    return (
        <AdminNewsClient
            
            news={news}
            categoriesWithIds={categoriesWithIds}
            categories={categories}
            years={years}
        />
    )
}
