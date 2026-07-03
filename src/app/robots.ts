import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default function robots(): MetadataRoute.Robots {
    const host = headers().get('host') || ''

    if (host && !host.includes('morganaorum.it')) {
        return {
            rules: {
                userAgent: '*',
                disallow: '/',
            }
        }
    }

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: 'https://www.morganaorum.it/sitemap.xml',
    }
}
