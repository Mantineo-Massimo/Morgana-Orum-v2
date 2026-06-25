import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
    './i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
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
            // Locale-prefixed old network news paths → new news paths
            {
                source: '/:locale/network/:brand/news/:id',
                destination: '/:locale/news/:id',
                permanent: true,
            },
            // Locale-prefixed old network events paths → new events paths
            {
                source: '/:locale/network/:brand/events/:id',
                destination: '/:locale/events/:id',
                permanent: true,
            },
            // Locale-prefixed list pages
            {
                source: '/:locale/network/:brand/news',
                destination: '/:locale/news',
                permanent: true,
            },
            {
                source: '/:locale/network/:brand/events',
                destination: '/:locale/events',
                permanent: true,
            },
            // Non-locale variants
            {
                source: '/network/:brand/news/:id',
                destination: '/news/:id',
                permanent: true,
            },
            {
                source: '/network/:brand/events/:id',
                destination: '/events/:id',
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
                    // Restrict browser features
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    // Cross-origin isolation for popups
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
                    // Content Security Policy is now handled dynamically in middleware.ts with nonces to protect scripts without unsafe-inline.
                ],
            },
        ]
    },
};

export default withNextIntl(nextConfig);
