import { getNews, getNewsCategories } from "@/app/actions/news"
import { Association } from "@prisma/client"
import { getTranslations } from "next-intl/server"
import NewsClient from "./news-client"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEn = locale === "en"
    return {
        title: isEn ? "News" : "Notizie",
        description: isEn
            ? "All the latest news, updates, and announcements from the Morgana and O.R.U.M. student associations."
            : "Tutte le ultime notizie, novità ed aggiornamenti dalle associazioni studentesche Morgana e O.R.U.M."
    }
}
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
