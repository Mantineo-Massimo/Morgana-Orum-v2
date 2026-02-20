import type { Metadata } from 'next'
import { BrandProvider } from "@/components/brand-provider"
import { cookies } from "next/headers"
import { TopBar } from "@/components/top-bar"
import { StickyHeader } from "@/components/sticky-header"
import { Footer } from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
    title: "Associazione Universitaria Insieme", // Titolo temporaneo unificato
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

    // La transizione a portale Insieme rimuove la necessità di un uiBrand di default

    return (
        <html lang="it">
            <body>
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
