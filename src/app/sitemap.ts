import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

const BASE_URL = "https://www.morganaorum.it"
const LOCALES = ["it", "en"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let showOrganigramma = true
    try {
        const config = await prisma.organigrammaConfig.findUnique({
            where: { id: "config" }
        })
        if (config && !config.visible) {
            showOrganigramma = false
        }
    } catch { /* DB unavailable during build */ }

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
        ...(showOrganigramma ? ["/organigramma"] : []),
        "/social",
        "/media-kit",
        "/contact",
        "/privacy",
        "/terms",
        "/cookie",
        "/piazzadellarte",
        "/statuto",
    ]

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap(route =>
        LOCALES.map(locale => {
            const urlPath = route === "" 
                ? (locale === "it" ? "/" : "/en") 
                : (locale === "it" ? route : `/${locale}${route}`)
                
            return {
                url: `${BASE_URL}${urlPath}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: route === "" ? 1.0 : 0.8,
                alternates: {
                    languages: {
                        it: `${BASE_URL}${route === "" ? "/" : route}`,
                        en: `${BASE_URL}/en${route}`,
                    }
                }
            }
        })
    )

    // Dynamic news pages
    let newsEntries: MetadataRoute.Sitemap = []
    try {
        const news = await prisma.news.findMany({
            where: { published: true },
            select: { id: true, updatedAt: true },
        })
        newsEntries = news.flatMap(article =>
            LOCALES.map(locale => {
                const urlPath = locale === "it" ? `/news/${article.id}` : `/${locale}/news/${article.id}`
                return {
                    url: `${BASE_URL}${urlPath}`,
                    lastModified: article.updatedAt,
                    changeFrequency: "monthly" as const,
                    priority: 0.7,
                    alternates: {
                        languages: {
                            it: `${BASE_URL}/news/${article.id}`,
                            en: `${BASE_URL}/en/news/${article.id}`,
                        }
                    }
                }
            })
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
            LOCALES.map(locale => {
                const urlPath = locale === "it" ? `/events/${event.id}` : `/${locale}/events/${event.id}`
                return {
                    url: `${BASE_URL}${urlPath}`,
                    lastModified: event.updatedAt,
                    changeFrequency: "monthly" as const,
                    priority: 0.7,
                    alternates: {
                        languages: {
                            it: `${BASE_URL}/events/${event.id}`,
                            en: `${BASE_URL}/en/events/${event.id}`,
                        }
                    }
                }
            })
        )
    } catch { /* DB unavailable during build */ }

    return [...staticEntries, ...newsEntries, ...eventEntries]
}
