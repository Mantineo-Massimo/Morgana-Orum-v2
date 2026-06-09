import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const response = intlMiddleware(request);

    const pathname = request.nextUrl.pathname;
    const pathParts = pathname.split('/').filter(Boolean);

    // Parts are usually [locale, 'piazzadellarte'] or [locale, 'network', brandId]
    if (pathParts.length >= 2 && pathParts[1] === 'piazzadellarte') {
        response.headers.set('x-brand', 'piazzadellarte');
    } else if (pathParts.length >= 3 && pathParts[1] === 'network') {
        const brandId = pathParts[2];
        response.headers.set('x-brand', brandId);
    } else {
        response.headers.set('x-brand', 'null');
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
