import { notFound } from "next/navigation"

/**
 * Catch-all route: any path under /[locale]/... that doesn't match
 * an existing route will hit this page, which triggers the localized
 * not-found.tsx inside the [locale] layout (keeping header + footer).
 */
export default function CatchAllPage() {
    notFound()
}
