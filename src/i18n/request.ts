import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
    const headerLocale = headers().get('x-next-intl-locale');

    // Validate that the incoming `locale` parameter is valid
    const finalLocale = locale || headerLocale || routing.defaultLocale;

    if (!routing.locales.includes(finalLocale as any)) {
        notFound();
    }

    return {
        locale: finalLocale,
        messages: (await import(`../messages/${finalLocale}.json`)).default
    };
});
