"use server"

import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sendEmail } from "@/lib/mail"
import { getWelcomeEmailTemplate, getPasswordResetTemplate } from "@/lib/email-templates"
import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"

export async function loginAction(email: string, password?: string) {
    // SIMPLIFIED AUTH for demo purposes
    // In production: Verify password, set HTTP-only cookie session
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (user && password) {
        const isValid = await bcrypt.compare(password, user.password)
        if (isValid) {
            // Set session cookie
            cookies().set("session_email", email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            })
            return { success: true, user }
        } else {
            return { success: false, error: "Credenziali non valide" }
        }
    }
    return { success: false, error: "Utente non trovato" }
}

export async function logoutAction() {
    cookies().delete("session_email")
    redirect(`/`)
}

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string
    const surname = formData.get("surname") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const birthDateStr = formData.get("birthDate") as string
    const matricola = formData.get("matricola") as string
    const department = formData.get("department") as string
    const degreeCourse = formData.get("degreeCourse") as string
    const isFuorisede = formData.get("isFuorisede") === "yes"
    const newsletter = formData.get("newsletter") === "yes"
    const association = (formData.get("association") as Association) || Association.MORGANA_ORUM

    // Validazione base
    if (!name || !surname || !email || !password || !birthDateStr || !matricola || !department || !degreeCourse) {
        return { success: false, error: "Tutti i campi sono obbligatori." }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                surname,
                birthDate: new Date(birthDateStr),
                email,
                password: hashedPassword,
                matricola,
                department,
                degreeCourse,
                isFuorisede,
                newsletter,
                association,
                role: "USER"
            }
        })

        // Set session cookie
        cookies().set("session_email", email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })

        // Send Welcome Email (Non-blocking)
        const brand = (association === Association.MORGANA_ORUM) ? "morgana" : "orum" // Simple fallback
        sendEmail({
            to: email,
            subject: `Benvenuto in ${brand === "orum" ? "O.R.U.M." : "Morgana"}!`,
            html: getWelcomeEmailTemplate(name, brand as "morgana" | "orum"),
            brand: brand as "morgana" | "orum"
        }).catch(err => console.error("Async welcome email error:", err))

        return { success: true, user }
    } catch (error: any) {
        console.error("Registration error:", error)
        if (error.code === 'P2002') {
            const target = error.meta?.target || []
            if (target.includes('email')) return { success: false, error: "Questa email è già registrata." }
            if (target.includes('matricola')) return { success: false, error: "Questa matricola è già registrata." }
            return { success: false, error: "Email o Matricola già in uso." }
        }
        return { success: false, error: "Errore durante la registrazione: " + (error.message || "riprova più tardi.") }
    }
}

export async function requestPasswordReset(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            // Per sicurezza, non dire che l'utente non esiste
            return { success: true, message: "Se l'email è registrata, riceverai un link a breve." }
        }

        const token = randomUUID()
        const expiry = new Date(Date.now() + 3600000) // 1 hour from now

        await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry
            }
        })

        // In production, should use the real domain
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        const resetLink = `${baseUrl}/reset-password?token=${token}`

        const brandToUse = (user.association === Association.MORGANA_ORUM) ? "morgana" : "orum"
        await sendEmail({
            to: email,
            subject: "Recupero Password",
            html: getPasswordResetTemplate(user.name, resetLink, brandToUse),
            brand: brandToUse
        })

        return { success: true, message: "Email inviata con successo!" }
    } catch (error) {
        console.error("Request reset error:", error)
        return { success: false, error: "Errore durante la richiesta di recupero." }
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { resetToken: token }
        })

        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return { success: false, error: "Token non valido o scaduto." }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        })

        return { success: true, message: "Password aggiornata con successo!" }
    } catch (error) {
        console.error("Reset password error:", error)
        return { success: false, error: "Errore durante il reset della password." }
    }
}
