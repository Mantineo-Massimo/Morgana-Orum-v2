import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
    './i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
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
                    // Content Security Policy — permissive policy compatible with Next.js, GA, Vercel, Cloudinary
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://vercel.live",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com data:",
                            "img-src 'self' data: blob: https://res.cloudinary.com https://storage.googleapis.com https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://*.basemaps.cartocdn.com https://www.googletagmanager.com",
                            "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.vercel-storage.com https://*.supabase.co https://api.vercel.com",
                            "frame-src 'self' https://www.youtube.com https://www.google.com",
                            "media-src 'self' blob: https://res.cloudinary.com https://storage.googleapis.com",
                            "worker-src 'self' blob:",
                            "manifest-src 'self'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "upgrade-insecure-requests",
                        ].join('; '),
                    },
                ],
            },
        ]
    },
};

export default withNextIntl(nextConfig);
