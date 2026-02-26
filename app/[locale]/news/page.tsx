import { getNews, getNewsCategories } from "@/app/actions/news"
import NewsClient from "./news-client"

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const [news, categories] = await Promise.all([
        getNews(undefined, undefined, undefined, locale),
        getNewsCategories()
    ])

    return (
        <NewsClient
            initialNews={news}
            categories={categories}
        />
    )
}
