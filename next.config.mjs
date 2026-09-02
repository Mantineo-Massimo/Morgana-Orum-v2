import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
    './src/i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
                pathname: '/**',
            }
        ],
    },
    async redirects() {
        return [
            // Redirects for 'piazzadellarte' sub-brand specifically (retaining /piazzadellarte prefix)
            {
                source: '/:locale/network/piazzadellarte/:path*',
                destination: '/:locale/piazzadellarte/:path*',
                permanent: true,
            },
            {
                source: '/network/piazzadellarte/:path*',
                destination: '/piazzadellarte/:path*',
                permanent: true,
            },
            // Wildcard redirect for all other network sub-brands to their clean equivalents
            {
                source: '/:locale/network/:brand/:path*',
                destination: '/:locale/:path*',
                permanent: true,
            },
            {
                source: '/network/:brand/:path*',
                destination: '/:path*',
                permanent: true,
            },
        ]
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    // Clickjacking protection
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    // Prevent MIME type sniffing
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    // Referrer privacy
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    // HSTS — force HTTPS for 1 year, include subdomains + preload list
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
                    // Restrict browser features (allow camera on same origin for QR scanner)
                    { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=()' },
                    // Cross-origin isolation for popups
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
                    // Content Security Policy is now handled dynamically in middleware.ts with nonces to protect scripts without unsafe-inline.
                ],
            },
        ]
    },
};

export default withNextIntl(nextConfig);
