import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const response = intlMiddleware(request);

    // Extract brand from URL if present: /[locale]/network/[brandId]
    const pathname = request.nextUrl.pathname;
    const pathParts = pathname.split('/').filter(Boolean);

    // Parts are usually [locale, 'network', brandId]
    if (pathParts.length >= 3 && pathParts[1] === 'network') {
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
