import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Piazza Dell'Arte - Morgana & Orum",
        icons: {
            icon: [
                { url: `/assets/piazzadellarte/favicon.ico` },
                { url: `/assets/piazzadellarte/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
                { url: `/assets/piazzadellarte/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
            ],
            apple: [
                { url: `/assets/piazzadellarte/apple-touch-icon.png` },
            ],
        }
    }
}

export default function PiazzaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
