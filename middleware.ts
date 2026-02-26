import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - api routes
    // - _next (internal paths)
    // - static files (e.g. favicon.ico)
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
