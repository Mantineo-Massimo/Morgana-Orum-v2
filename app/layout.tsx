import type { Metadata } from 'next'
import { Inter, Outfit } from "next/font/google"
import { BrandProvider } from "@/components/brand-provider"
import { cookies } from "next/headers"
import { TopBar } from "@/components/top-bar"
import { StickyHeader } from "@/components/sticky-header"
import { Footer } from "@/components/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
    title: "Associazioni Universitarie Morgana & O.R.U.M.", // Titolo temporaneo unificato
    icons: {
        icon: [
            { url: `/assets/morgana/favicon.ico` }, // Temporaneo
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
            </body>
        </html>
    )
}
