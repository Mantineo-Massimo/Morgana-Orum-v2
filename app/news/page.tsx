import { getNews, getNewsCategories } from "@/app/actions/news"
import NewsClient from "./news-client"

export const dynamic = "force-dynamic"

export default async function Page() {
    const news = await getNews()
    const categories = await getNewsCategories()

    return (
        <NewsClient
            initialNews={news}
            categories={categories}
        />
    )
}
