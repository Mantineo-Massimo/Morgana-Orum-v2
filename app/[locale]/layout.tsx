import type { Metadata } from 'next'
import { Inter, Outfit } from "next/font/google"
import { BrandProvider } from "@/components/brand-provider"
import { GoogleAnalytics } from '@next/third-parties/google'
import { cookies } from "next/headers"
import { TopBar } from "@/components/top-bar"
import { StickyHeader } from "@/components/sticky-header"
import { Footer } from "@/components/footer"
import { ClientLogger } from "@/components/analytics/client-logger"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
    title: {
        default: "Morgana & O.R.U.M. - Associazioni Universitarie",
        template: "%s | Morgana & O.R.U.M."
    },
    description: "Associazioni Universitarie Morgana & O.R.U.M. - Impegno, passione e competenza al servizio della comunità accademica dell'Università di Messina.",
    keywords: ["Associazione Morgana", "Associazione ORUM", "Unime", "Università di Messina", "Rappresentanza Studentesca", "Eventi Universitari", "Messina"],
    authors: [{ name: "Massimo Mantineo" }],
    creator: "Massimo Mantineo",
    publisher: "Morgana & O.R.U.M.",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: "website",
        locale: "it_IT",
        url: "https://morganaorum.it",
        siteName: "Morgana & O.R.U.M.",
        title: "Morgana & O.R.U.M. - Associazioni Universitarie",
        description: "Impegno, passione e competenza al servizio della comunità accademica dell'Università di Messina.",
        images: [
            {
                url: "/assets/morganaorum/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Morgana & O.R.U.M. Associazioni Universitarie",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Morgana & O.R.U.M. - Associazioni Universitarie",
        description: "Impegno, passione e competenza al servizio della comunità accademica dell'Università di Messina.",
        images: ["/assets/morganaorum/og-image.jpg"],
    },
    icons: {
        icon: [
            { url: "/assets/morganaorum/favicon.ico" },
            { url: "/assets/morganaorum/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/assets/morganaorum/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [
            { url: "/assets/morganaorum/apple-touch-icon.png" },
        ],
    }
}

import {NextIntlClientProvider} from "next-intl"
import {getMessages} from "next-intl/server"

export default async function RootLayout({
    children, params: {locale}
}: {
    children: React.ReactNode
}) {
    const sessionEmail = cookies().get("session_email")?.value
    const isLoggedIn = !!sessionEmail
    const cookieConsent = cookies().get("cookie-consent")?.value

    return (
        <html lang={locale}>
            <body className={`${inter.variable} ${outfit.variable}`}>
                const messages = await getMessages()

    return (
        <html lang={locale}>
            <body className={`${inter.variable} ${outfit.variable}`}>
                <NextIntlClientProvider messages={messages}>
                <BrandProvider defaultBrand={null}>
                    <div className="flex min-h-screen flex-col bg-background font-sans">
                        <TopBar />
                        <StickyHeader isLoggedIn={isLoggedIn} />
                        <ClientLogger />
                        <CookieConsent />

                        <main className="flex-1">
                            {children}
                        </main>

                        <Footer />
                    </div>
                </BrandProvider>
                </NextIntlClientProvider>
                {process.env.NEXT_PUBLIC_GA_ID && cookieConsent === "accepted" && (
                    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                )}
            </body>
        </html>
    )
}
