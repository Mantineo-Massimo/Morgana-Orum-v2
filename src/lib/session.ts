import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import type { Role } from "@prisma/client"

export interface SessionUser {
    id: number
    email: string
    name: string
    surname: string
    role: Role
}

/**
 * Reads the session cookie and returns the current user from the DB.
 * Returns null if the user is not authenticated.
 *
 * Use this helper in both API route handlers and server actions to avoid
 * duplicating the `cookies().get("session_email")` pattern everywhere.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
    try {
        const userEmail = cookies().get("session_email")?.value
        if (!userEmail) return null

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                role: true,
            },
        })

        return user ?? null
    } catch {
        return null
    }
}

/**
 * Returns true if the current session user has at least one of the given roles.
 */
export async function hasRole(...roles: Role[]): Promise<boolean> {
    const user = await getSessionUser()
    if (!user) return false
    return roles.includes(user.role)
}

/**
 * Returns true if the current session user is any kind of admin
 * (ADMIN_MORGANA, ADMIN_NETWORK, or SUPER_ADMIN).
 */
export async function isAdmin(): Promise<boolean> {
    return hasRole("ADMIN_MORGANA", "ADMIN_NETWORK", "SUPER_ADMIN")
}
