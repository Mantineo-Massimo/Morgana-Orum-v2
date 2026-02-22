import { getNews, getNewsCategories } from "@/app/actions/news"
import NewsClient from "@/app/news/news-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

const BRAND_TO_ASSOCIATION: Record<string, string> = {
    unimhealth: "UNIMHEALTH",
    economia: "ECONOMIA",
    matricole: "MATRICOLE",
    scipog: "SCIPOG",
    dicam: "INSIDE_DICAM",
}

export default async function Page({ params }: { params: { brandId: string } }) {
    const association = BRAND_TO_ASSOCIATION[params.brandId]

    if (!association) {
        notFound()
    }

    const news = await getNews(undefined, undefined, association)
    const categories = await getNewsCategories()

    return (
        <NewsClient
            initialNews={news}
            categories={categories}
        />
    )
}
