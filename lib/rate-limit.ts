/**
 * DB-backed sliding-window rate limiter.
 *
 * Works on Vercel serverless (no shared memory) because state is stored in the
 * PostgreSQL database via the `RateLimit` table.
 *
 * Usage example:
 *   const { allowed, remaining } = await rateLimit("login", ip, { limit: 5, windowMinutes: 15 })
 *   if (!allowed) return { success: false, error: "Troppi tentativi. Riprova tra qualche minuto." }
 */

import prisma from "./prisma"

interface RateLimitOptions {
    /** Maximum number of requests allowed in the window. */
    limit: number
    /** Width of the sliding window in minutes. */
    windowMinutes: number
}

interface RateLimitResult {
    allowed: boolean
    /** Remaining requests in the current window. */
    remaining: number
}

/**
 * Returns the minute-level window key for the current time, offset by the window size.
 * All timestamps within the same [now - windowMinutes] bucket share the same key.
 */
function getWindowKey(windowMinutes: number): string {
    const now = new Date()
    // Round down to the nearest window boundary
    const rounded = new Date(Math.floor(now.getTime() / (windowMinutes * 60 * 1000)) * (windowMinutes * 60 * 1000))
    return rounded.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:mm"
}

/**
 * Check and increment the rate limit counter for a given key.
 *
 * @param action  - A label identifying the action (e.g. "login", "reset", "contact")
 * @param identifier - The unique identifier (e.g. IP address or email)
 * @param options - Limit configuration
 */
export async function rateLimit(
    action: string,
    identifier: string,
    options: RateLimitOptions
): Promise<RateLimitResult> {
    const { limit, windowMinutes } = options
    const key = `${action}:${identifier}`
    const window = getWindowKey(windowMinutes)

    try {
        // Upsert — atomically increment or create
        const record = await prisma.rateLimit.upsert({
            where: { key_window: { key, window } },
            update: { count: { increment: 1 } },
            create: { key, window, count: 1 },
        })

        const allowed = record.count <= limit
        const remaining = Math.max(0, limit - record.count)

        // Cleanup old windows asynchronously (fire and forget — non-blocking)
        const cutoff = new Date(Date.now() - windowMinutes * 2 * 60 * 1000)
        prisma.rateLimit.deleteMany({
            where: { createdAt: { lt: cutoff } }
        }).catch(() => { /* non-critical */ })

        return { allowed, remaining }
    } catch (error) {
        // Fail open: if DB is unavailable, allow the request to avoid total outage.
        console.error("[rateLimit] DB error — failing open:", error)
        return { allowed: true, remaining: 0 }
    }
}

/**
 * Extract the client IP address from Next.js request headers.
 * Falls back to "unknown" if no IP is detectable.
 */
export function getClientIp(headers: Headers): string {
    return (
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers.get("x-real-ip") ||
        "unknown"
    )
}
