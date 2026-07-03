'use client'

import Error from 'next/error'

/**
 * Root-level fallback 404: catches paths without a locale prefix
 * that bypass the [locale] layout group entirely.
 * Uses Next.js built-in Error component as the recommended pattern.
 * The localized 404 page (app/[locale]/not-found.tsx) handles all
 * locale-prefixed routes and renders inside the full site layout.
 */
export default function RootNotFound() {
    return (
        <html lang="it">
            <body>
                <Error statusCode={404} />
            </body>
        </html>
    )
}
