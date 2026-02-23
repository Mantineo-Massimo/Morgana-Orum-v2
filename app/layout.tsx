import type { Metadata } from 'next'
import { Inter, Outfit } from "next/font/google"
import { BrandProvider } from "@/components/brand-provider"
import { GoogleAnalytics } from '@next/third-parties/google'
import { cookies } from "next/headers"
import { TopBar } from "@/components/top-bar"
import { StickyHeader } from "@/components/sticky-header"
import { Footer } from "@/components/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
    title: "Morgana & O.R.U.M. - Associazioni Universitarie", // Titolo temporaneo unificato
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const sessionEmail = cookies().get("session_email")?.value
    const isLoggedIn = !!sessionEmail

    return (
        <html lang="it">
            <body className={`${inter.variable} ${outfit.variable}`}>
                <BrandProvider defaultBrand={null}>
                    <div className="flex min-h-screen flex-col bg-background font-sans">
                        <TopBar />
                        <StickyHeader isLoggedIn={isLoggedIn} />

                        <main className="flex-1">
                            {children}
                        </main>

                        <Footer />
                    </div>
                </BrandProvider>
                {process.env.NEXT_PUBLIC_GA_ID && (
                    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                )}
            </body>
        </html>
    )
}
