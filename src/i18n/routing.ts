import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['it', 'en'],
    defaultLocale: 'it',
    localePrefix: 'as-needed',
    localeDetection: false
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
