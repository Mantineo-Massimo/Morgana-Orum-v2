import { getNews, getNewsCategories } from "@/app/actions/news"
import NewsClient from "@/app/[locale]/news/news-client"
import { Association } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function NewsPage() {
    const association = Association.PIAZZA_DELLARTE

    const news = await getNews(undefined, undefined, association)
    const categories = await getNewsCategories()

    return (
        <NewsClient
            initialNews={news}
            categories={categories}
        />
    )
}
