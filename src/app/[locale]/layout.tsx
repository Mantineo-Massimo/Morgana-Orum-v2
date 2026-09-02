import type { Metadata } from 'next'
import { Inter, Outfit } from "next/font/google"
import { BrandProvider, Brand } from "@/components/layout/brand-provider"
import { cookies, headers } from "next/headers"
import { TopBar } from "@/components/layout/top-bar"
import { StickyHeader } from "@/components/layout/sticky-header"
import { Footer } from "@/components/layout/footer"
import { ClientLogger } from "@/components/analytics/client-logger"
import { CookieConsent } from "@/components/shared/cookie-consent"
import { InactivityGuard } from "@/components/shared/inactivity-guard"
import Script from "next/script"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { getOrganigrammaConfig } from "@/app/actions/organigramma"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import prisma from "@/lib/prisma"
import "../globals.css"

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700", "900"],
    variable: "--font-sans",
    display: "swap",
    preload: true,
})
const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700", "900"],
    variable: "--font-serif",
    display: "swap",
    preload: true,
})

const BASE_URL = "https://www.morganaorum.it"

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const pathname = headers().get("x-pathname") || "/"
    
    // Normalize pathname: remove trailing slash if it is not the root "/"
    const normalizedPath = pathname !== "/" && pathname.endsWith("/") 
        ? pathname.slice(0, -1) 
        : pathname

    // Strip locale prefix if present (e.g., "/it/about" -> "/about", "/en" -> "/")
    let pathWithoutLocale = normalizedPath
    if (pathWithoutLocale === "/it" || pathWithoutLocale === "/en") {
        pathWithoutLocale = "/"
    } else if (pathWithoutLocale.startsWith("/it/")) {
        pathWithoutLocale = pathWithoutLocale.slice(3)
    } else if (pathWithoutLocale.startsWith("/en/")) {
        pathWithoutLocale = pathWithoutLocale.slice(3)
    }

    // Ensure it starts with "/"
    if (!pathWithoutLocale.startsWith("/")) {
        pathWithoutLocale = "/" + pathWithoutLocale
    }

    const canonicalUrl = `${BASE_URL}${normalizedPath}`
    const itUrl = pathWithoutLocale === "/" ? `${BASE_URL}/` : `${BASE_URL}${pathWithoutLocale}`
    const enUrl = pathWithoutLocale === "/" ? `${BASE_URL}/en` : `${BASE_URL}/en${pathWithoutLocale}`

    return {
        metadataBase: new URL(BASE_URL),
        alternates: {
            canonical: canonicalUrl,
            languages: {
                "it": itUrl,
                "en": enUrl,
                "x-default": itUrl,
            },
        },
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
            locale: locale === "en" ? "en_US" : "it_IT",
            alternateLocale: locale === "en" ? "it_IT" : "en_US",
            url: canonicalUrl,
            siteName: "Morgana & O.R.U.M.",
            title: "Morgana & O.R.U.M. - Associazioni Universitarie",
            description: "Impegno, passione e competenza al servizio della comunità accademica dell'Università di Messina.",
            images: [
                {
                    url: "/assets/backgrounds/WHAZAP.png",
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
            images: ["/assets/backgrounds/WHAZAP.png"],
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
}

export default async function RootLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const sessionEmail = cookies().get("session_email")?.value
    const isLoggedIn = !!sessionEmail
    
    let currentUser = null
    if (sessionEmail) {
        currentUser = await prisma.user.findUnique({
            where: { email: sessionEmail },
            select: { name: true, surname: true, email: true }
        })
    }

    const cookieConsent = cookies().get("cookie-consent")?.value
    const messages = await getMessages()

    // Get brand from middleware header for server-side initialization
    const brandHeader = headers().get("x-brand")
    const brand = (brandHeader && brandHeader !== "null" ? brandHeader : null) as Brand

    // Get CSP nonce from middleware header
    const nonce = headers().get("x-nonce") || undefined

    const organigrammaConfig = await getOrganigrammaConfig()

    const pathname = headers().get("x-pathname") || "/"
    const isPartnerPage = pathname.includes("/partner")

    return (
        <html lang={locale} suppressHydrationWarning data-brand={brand || undefined}>
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "Morgana & O.R.U.M.",
                            "alternateName": ["Morgana & Orum", "Associazioni Universitarie Morgana & O.R.U.M."],
                            "url": "https://www.morganaorum.it/"
                        })
                    }}
                />
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <BrandProvider defaultBrand={brand}>
                        <SpeedInsights />
                        <Analytics />
                        <div className="flex min-h-screen flex-col bg-background font-sans">
                            {!isPartnerPage && <TopBar />}
                            {!isPartnerPage && <StickyHeader isLoggedIn={isLoggedIn} showOrganigramma={organigrammaConfig.visible} />}
                            <ClientLogger />
                            <CookieConsent />
                            {/* Disconnette l'utente dopo 30 min di inattività */}
                            <InactivityGuard isLoggedIn={isLoggedIn} />

                            <main className="flex-1">
                                {children}
                            </main>

                            {!isPartnerPage && <Footer showOrganigramma={organigrammaConfig.visible} />}
                        </div>
                    </BrandProvider>
                </NextIntlClientProvider>
                {process.env.NEXT_PUBLIC_GA_ID && cookieConsent === "accepted" && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                            strategy="afterInteractive"
                            nonce={nonce}
                        />
                        <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                                    page_path: window.location.pathname,
                                    cookie_domain: 'none',
                                    cookie_flags: 'SameSite=None;Secure'
                                });
                            `}
                        </Script>
                    </>
                )}
            </body>
        </html>
    )
}
