import { getNews, getNewsCategories } from "@/app/actions/news"
import { getTranslations } from "next-intl/server"
import NewsClient from "./news-client"

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const [news, categories, t, tc] = await Promise.all([
        getNews(undefined, undefined, undefined, locale),
        getNewsCategories(),
        getTranslations("HomePage"),
        getTranslations("Search")
    ])

    return (
        <NewsClient
            initialNews={news}
            categories={categories}
        />
    )
}
