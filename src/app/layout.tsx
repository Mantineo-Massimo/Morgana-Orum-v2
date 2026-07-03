/**
 * Root layout — minimal shell required by Next.js App Router.
 * The real branded layout (fonts, header, footer, providers) lives in
 * app/[locale]/layout.tsx which wraps all locale-prefixed routes.
 * This root layout only serves as a fallback container for the root
 * not-found.tsx page and any other paths that bypass the locale group.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="it">
            <body>{children}</body>
        </html>
    )
}
