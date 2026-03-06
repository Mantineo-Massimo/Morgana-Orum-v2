import { getNews, getNewsCategories } from "@/app/actions/news"
import { Association } from "@prisma/client"
import { getTranslations } from "next-intl/server"
import NewsClient from "./news-client"

export const dynamic = "force-dynamic"
export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const [news, categories, t, tc] = await Promise.all([
        getNews(undefined, undefined, Association.MORGANA_ORUM, locale),
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
