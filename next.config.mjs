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
};

export default withNextIntl(nextConfig);
