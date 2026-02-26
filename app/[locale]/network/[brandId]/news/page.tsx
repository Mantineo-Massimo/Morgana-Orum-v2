import { getNews, getNewsCategories } from "@/app/actions/news"
import NewsClient from "@/app/[locale]/news/news-client"
import { notFound } from "next/navigation"
import { Association } from "@prisma/client"

export const dynamic = "force-dynamic"

const BRAND_TO_ASSOCIATION: Record<string, Association> = {
    unimhealth: Association.UNIMHEALTH,
    economia: Association.ECONOMIA,
    matricole: Association.MATRICOLE,
    scipog: Association.SCIPOG,
    dicam: Association.INSIDE_DICAM,
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
