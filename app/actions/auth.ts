"use server"

import prisma from "@/lib/prisma"
import { Association } from "@prisma/client"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { sendEmail } from "@/lib/mail"
import { getWelcomeEmailTemplate, getPasswordResetTemplate, getEmailVerificationTemplate } from "@/lib/email-templates"
import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

export async function loginAction(email: string, password?: string) {
    // Rate limit: 5 login attempts per IP per 15 minutes
    const requestHeaders = headers()
    const ip = getClientIp(requestHeaders)
    const { allowed } = await rateLimit("login", ip, { limit: 5, windowMinutes: 15 })
    if (!allowed) {
        return { success: false, error: "Troppi tentativi di accesso. Riprova tra qualche minuto." }
    }

    // SIMPLIFIED AUTH for demo purposes
    // In production: Verify password, set HTTP-only cookie session
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (user && password) {
        const isValid = await bcrypt.compare(password, user.password)
        if (isValid) {
            if (!user.emailVerified) {
                return { success: false, error: "VERIFICATION_REQUIRED" }
            }
            // Set session cookie
            cookies().set("session_email", email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
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
    const consensoMarketingOrum = formData.get("consenso_marketing_orum") === "yes"
    const consensoMarketingMorgana = formData.get("consenso_marketing_morgana") === "yes"
    const accettazioneTerminiCondivisi = formData.get("accettazione_termini_condivisi") === "yes"
    let rawAssociation = (formData.get("association") as string) || "MORGANA_ORUM"

    if (rawAssociation.toLowerCase().includes("morgana")) {
        rawAssociation = "MORGANA_ORUM"
    }

    const association = rawAssociation as Association

    // Validazione base
    if (!name || !surname || !email || !password || !birthDateStr || !matricola || !department || !degreeCourse || !accettazioneTerminiCondivisi) {
        return { success: false, error: "Tutti i campi obbligatori devono essere compilati, inclusa l'accettazione della privacy." }
    }

    // Validazione password
    if (password.length < 8) {
        return { success: false, error: "La password deve essere di almeno 8 caratteri." }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const token = randomUUID()
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
                consensoMarketingOrum,
                consensoMarketingMorgana,
                accettazioneTerminiCondivisi,
                newsletter: consensoMarketingOrum || consensoMarketingMorgana, // Sync legacy field
                association,
                role: "USER",
                emailVerified: false,
                verificationToken: token
            }
        })

        // Send Verification Email (Non-blocking)
        const brand = (association === Association.MORGANA_ORUM) ? "morgana" : "orum" // Simple fallback
        const referer = headers().get("referer")
        const locale = (referer?.includes("/en/") || referer?.endsWith("/en")) ? "en" : "it"
        const isEn = locale === "en"
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.morganaorum.it"
        const verificationLink = `${baseUrl}/${locale}/verify-email?token=${token}`

        sendEmail({
            to: email,
            subject: isEn ? "Verify your email address" : "Verifica il tuo indirizzo email",
            html: getEmailVerificationTemplate(name, verificationLink, brand, locale),
            brand: brand as "morgana" | "orum"
        }).catch(err => console.error("Async verification email error:", err))

        return { success: true, requiresVerification: true }
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
        // Rate limit: 3 reset requests per email or IP per 60 minutes
        const requestHeaders = headers()
        const ip = getClientIp(requestHeaders)
        const { allowed } = await rateLimit("reset", `${ip}:${email}`, { limit: 3, windowMinutes: 60 })
        if (!allowed) {
            // Return generic success to avoid timing-based user enumeration
            return { success: true, message: "Se l'email è registrata, riceverai un link a breve." }
        }

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
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.morganaorum.it"
        const referer = headers().get("referer")
        const locale = (referer?.includes("/en/") || referer?.endsWith("/en")) ? "en" : "it"
        const resetLink = `${baseUrl}/${locale}/reset-password?token=${token}`

        const brandToUse = (user.association === Association.MORGANA_ORUM) ? "morgana" : "orum"
        await sendEmail({
            to: email,
            subject: locale === "en" ? "Password Recovery" : "Recupero Password",
            html: getPasswordResetTemplate(user.name, resetLink, brandToUse, locale),
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

export async function verifyEmailAction(token: string, locale: string = "it") {
    if (!token) {
        return { success: false, error: "Token non valido." }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        })

        if (!user) {
            return { success: false, error: "Token non valido o scaduto." }
        }

        // Aggiorna l'utente
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null
            }
        })

        // Logga l'utente impostando il cookie di sessione
        cookies().set("session_email", user.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })

        // Invia l'email di benvenuto (Non-blocking)
        const brand = (user.association === Association.MORGANA_ORUM) ? "morgana" : "orum"
        const isEn = locale === "en"
        
        sendEmail({
            to: user.email,
            subject: isEn ? `Welcome to ${brand === "orum" ? "O.R.U.M." : "Morgana"}!` : `Benvenuto in ${brand === "orum" ? "O.R.U.M." : "Morgana"}!`,
            html: getWelcomeEmailTemplate(user.name, brand as "morgana" | "orum", locale),
            brand: brand as "morgana" | "orum"
        }).catch(err => console.error("Async welcome email error:", err))

        return { success: true }
    } catch (error) {
        console.error("verifyEmailAction error:", error)
        return { success: false, error: "Errore durante la verifica dell'email." }
    }
}

export async function resendVerificationEmailAction(email: string, locale: string = "it") {
    if (!email) {
        return { success: false, error: "Email mancante." }
    }

    // Rate limit: 3 resend attempts per email per 60 minutes
    const requestHeaders = headers()
    const ip = getClientIp(requestHeaders)
    const { allowed } = await rateLimit("resend-verify", `${ip}:${email}`, { limit: 3, windowMinutes: 60 })
    if (!allowed) {
        return { success: false, error: locale === "en" ? "Too many requests. Please try again later." : "Troppi tentativi. Riprova più tardi." }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // Per sicurezza, non sveliamo se l'utente esiste o no
            return { success: true }
        }

        if (user.emailVerified) {
            return { success: false, error: locale === "en" ? "Account already verified." : "L'account è già stato verificato." }
        }

        // Genera un nuovo token
        const token = randomUUID()
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken: token }
        })

        const brand = (user.association === Association.MORGANA_ORUM) ? "morgana" : "orum"
        const isEn = locale === "en"
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.morganaorum.it"
        const verificationLink = `${baseUrl}/${locale}/verify-email?token=${token}`

        await sendEmail({
            to: email,
            subject: isEn ? "Verify your email address" : "Verifica il tuo indirizzo email",
            html: getEmailVerificationTemplate(user.name, verificationLink, brand, locale),
            brand: brand as "morgana" | "orum"
        })

        return { success: true }
    } catch (error) {
        console.error("resendVerificationEmailAction error:", error)
        return { success: false, error: "Errore durante l'invio dell'email." }
    }
}

