import { getNews, getNewsCategories } from "@/app/actions/news"
import NewsClient from "./news-client"

export const dynamic = "force-dynamic"

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const news = await getNews(undefined, undefined, undefined, locale)
    const categories = await getNewsCategories()

    return (
        <NewsClient
            initialNews={news}
            categories={categories}
        />
    )
}
