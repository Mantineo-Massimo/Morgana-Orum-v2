import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    // Generate a secure nonce for Content Security Policy (CSP)
    const nonce = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? btoa(crypto.randomUUID()) 
        : btoa(Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));

    // Inject x-nonce and x-pathname into request headers so server components (layouts/pages) can read it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    const modifiedRequest = new NextRequest(request, {
        headers: requestHeaders,
    });

    const response = intlMiddleware(modifiedRequest);
    response.headers.set('x-pathname', request.nextUrl.pathname);

    // ── Rolling session: refresh the session cookie on every request ─────────
    // If the user is authenticated, reset the 30-minute inactivity timer
    // so the session only expires after 30 min of COMPLETE inactivity
    // (no page navigation, API call, or server action).
    const SESSION_TIMEOUT = 30 * 60 // 30 minutes in seconds
    const sessionCookie = request.cookies.get("session_email")
    if (sessionCookie?.value) {
        response.cookies.set({
            name: "session_email",
            value: sessionCookie.value,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: SESSION_TIMEOUT,
            path: "/",
        })
    }

    // Intercept and secure the NEXT_LOCALE cookie set by next-intl
    const localeCookie = response.cookies.get('NEXT_LOCALE');
    if (localeCookie) {
        response.cookies.set({
            name: 'NEXT_LOCALE',
            value: localeCookie.value,
            httpOnly: true,
            secure: true, // Secure must be true for HTTPS and is accepted by modern browsers on localhost too
            sameSite: 'lax',
            path: '/',
        });
    }

    // Set dynamic Content-Security-Policy with nonce
    const isProd = process.env.NODE_ENV === 'production';
    const cspHeader = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline'${!isProd ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://vercel.live`,
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
        "frame-ancestors 'self'",
        "upgrade-insecure-requests",
    ].join('; ');

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('x-nonce', nonce);

    const pathname = request.nextUrl.pathname;
    const pathParts = pathname.split('/').filter(Boolean);

    // Identify if the first segment is a locale (it or en) and remove it if present
    const hasLocalePrefix = pathParts.length > 0 && ['it', 'en'].includes(pathParts[0]);
    const cleanParts = hasLocalePrefix ? pathParts.slice(1) : pathParts;

    if (cleanParts.length >= 1 && cleanParts[0] === 'piazzadellarte') {
        response.headers.set('x-brand', 'piazzadellarte');
    } else if (cleanParts.length >= 2 && cleanParts[0] === 'network') {
        const brandId = cleanParts[1];
        response.headers.set('x-brand', brandId);
    } else {
        response.headers.set('x-brand', 'null');
    }

    // Prevents indexing on non-primary domains (Vercel preview/deployment domains)
    const host = request.headers.get('host') || '';
    if (host && !host.includes('morganaorum.it')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
