import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {

    let locale = await requestLocale || 'en';

    if (!locales.includes(locale as 'en' | 'ar'))
        return {
            locale,
            messages: (await import(`../../messages/en.json`)).default
        };

    else
        return {
            locale,
            messages: (await import(`../../messages/${locale}.json`)).default
        };

});

export const Languages = [
    {
        locale: 'en',
        name: 'English',
        icon: 'US'
    },
    {
        locale: 'ar',
        name: 'Arabic',
        icon: 'AR'
    }
]