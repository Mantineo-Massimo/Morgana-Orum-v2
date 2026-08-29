import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const host = request.headers.get('host') || '';

    // Redirect old vercel.app production domains to the official custom domain (301 Permanent Redirect)
    if (host === 'morganaorum.vercel.app' || host === 'morgana-orum-v2.vercel.app') {
        const targetUrl = `https://www.morganaorum.it${request.nextUrl.pathname}${request.nextUrl.search}`;
        return NextResponse.redirect(targetUrl, 301);
    }

    const url = request.nextUrl.clone();
    const { pathname } = url;

    // 1. Gestione del sottodominio 'piazzadellarte.morganaorum.it'
    if (host === 'piazzadellarte.morganaorum.it') {
        // Se l'utente accede direttamente a /piazzadellarte sul sottodominio, lo reindirizziamo alla root del sottodominio
        // es. /piazzadellarte/artisti -> /artisti (o /it/piazzadellarte/artisti -> /it/artisti)
        const match = pathname.match(/^\/(it|en)?\/?piazzadellarte(.*)$/);
        if (match) {
            const locale = match[1];
            const rest = match[2] || '';
            const newPath = locale ? `/${locale}${rest}` : `${rest || '/'}`;
            url.pathname = newPath;
            return NextResponse.redirect(url, 301);
        }

        // Riscriviamo internamente i percorsi verso /piazzadellarte/...
        const isInternal = pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/assets') || pathname.includes('.');
        if (!isInternal) {
            const matchLocale = pathname.match(/^\/(it|en)(.*)$/);
            if (matchLocale) {
                const locale = matchLocale[1];
                const rest = matchLocale[2] || '';
                url.pathname = `/${locale}/piazzadellarte${rest}`;
            } else {
                url.pathname = `/piazzadellarte${pathname}`;
            }
            // Aggiorniamo la richiesta con l'URL riscritto internamente
            request = new NextRequest(url, { headers: request.headers });
        }
    } else {
        // 2. Se l'utente visita il sito principale e richiede rotte /piazzadellarte, lo reindirizziamo al sottodominio dedicato
        const match = pathname.match(/^\/(it|en)?\/?piazzadellarte(.*)$/);
        if (match) {
            const locale = match[1];
            const rest = match[2] || '';
            const newPath = locale ? `/${locale}${rest}` : `${rest || '/'}`;
            return NextResponse.redirect(`https://piazzadellarte.morganaorum.it${newPath}`, 301);
        }
    }

    // Generate a secure nonce for Content Security Policy (CSP)
    const nonce = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? btoa(crypto.randomUUID()) 
        : btoa(Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));

    // Determina il brand (es. piazzadellarte) in base al dominio o alla rotta
    const currentPathname = request.nextUrl.pathname;
    const pathParts = currentPathname.split('/').filter(Boolean);
    const hasLocalePrefix = pathParts.length > 0 && ['it', 'en'].includes(pathParts[0]);
    const cleanParts = hasLocalePrefix ? pathParts.slice(1) : pathParts;

    let brand = 'null';
    if (host === 'piazzadellarte.morganaorum.it') {
        brand = 'piazzadellarte';
    } else if (cleanParts.length >= 1 && cleanParts[0] === 'piazzadellarte') {
        brand = 'piazzadellarte';
    } else if (cleanParts.length >= 2 && cleanParts[0] === 'network') {
        brand = cleanParts[1];
    }

    // Inject x-nonce, x-pathname and x-brand into request headers so server components (layouts/pages) can read it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);
    requestHeaders.set('x-brand', brand);

    const modifiedRequest = new NextRequest(request, {
        headers: requestHeaders,
    });

    const response = intlMiddleware(modifiedRequest);
    
    // Se la richiesta è per il sottodominio ed è stata riscritta internamente, 
    // ma next-intl non ha impostato l'header di rewrite (perché il percorso ha già il prefisso locale, es. /en/piazzadellarte),
    // impostiamo manualmente l'header x-middleware-rewrite per forzare Next.js a servire la pagina corretta.
    if (host === 'piazzadellarte.morganaorum.it' && !response.headers.get('x-middleware-rewrite')) {
        const rewriteUrl = new URL(url.pathname + url.search, request.url).toString();
        response.headers.set('x-middleware-rewrite', rewriteUrl);
    }

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
        "img-src 'self' data: blob: https://storage.googleapis.com https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://server.arcgisonline.com https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://www.googletagmanager.com",
        "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.vercel-storage.com https://*.supabase.co https://api.vercel.com",
        "frame-src 'self' https://www.youtube.com https://www.google.com https://vercel.live https://*.vercel.live",
        "media-src 'self' blob: https://storage.googleapis.com",
        "worker-src 'self' blob:",
        "manifest-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
        "upgrade-insecure-requests",
    ].join('; ');

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('x-nonce', nonce);

    response.headers.set('x-brand', brand);

    // Prevents indexing on non-primary domains (Vercel preview/deployment domains)
    if (host && !host.includes('morganaorum.it')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
