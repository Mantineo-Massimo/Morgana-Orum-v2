import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

const BASE_URL = "https://www.morganaorum.it"
const LOCALES = ["it", "en"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticRoutes = [
        "",           // Home
        "/about",
        "/news",
        "/events",
        "/events/past",
        "/representatives",
        "/guide",
        "/iniziative",
        "/faq",
        "/convenzioni",
        "/gruppi",
        "/organigramma",
        "/social",
        "/media-kit",
        "/contact",
        "/privacy",
        "/terms",
        "/cookie",
        "/piazzadellarte",
    ]

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap(route =>
        LOCALES.map(locale => ({
            url: `${BASE_URL}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: route === "" ? 1.0 : 0.8,
            alternates: {
                languages: {
                    it: `${BASE_URL}/it${route}`,
                    en: `${BASE_URL}/en${route}`,
                }
            }
        }))
    )

    // Dynamic news pages
    let newsEntries: MetadataRoute.Sitemap = []
    try {
        const news = await prisma.news.findMany({
            where: { published: true },
            select: { id: true, updatedAt: true },
        })
        newsEntries = news.flatMap(article =>
            LOCALES.map(locale => ({
                url: `${BASE_URL}/${locale}/news/${article.id}`,
                lastModified: article.updatedAt,
                changeFrequency: "monthly" as const,
                priority: 0.7,
                alternates: {
                    languages: {
                        it: `${BASE_URL}/it/news/${article.id}`,
                        en: `${BASE_URL}/en/news/${article.id}`,
                    }
                }
            }))
        )
    } catch { /* DB unavailable during build */ }

    // Dynamic event pages
    let eventEntries: MetadataRoute.Sitemap = []
    try {
        const events = await prisma.event.findMany({
            where: { published: true },
            select: { id: true, updatedAt: true },
        })
        eventEntries = events.flatMap(event =>
            LOCALES.map(locale => ({
                url: `${BASE_URL}/${locale}/events/${event.id}`,
                lastModified: event.updatedAt,
                changeFrequency: "monthly" as const,
                priority: 0.7,
                alternates: {
                    languages: {
                        it: `${BASE_URL}/it/events/${event.id}`,
                        en: `${BASE_URL}/en/events/${event.id}`,
                    }
                }
            }))
        )
    } catch { /* DB unavailable during build */ }

    return [...staticEntries, ...newsEntries, ...eventEntries]
}
