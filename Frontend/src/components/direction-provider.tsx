"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const RTL_LOCALES = ['ar'];

export function DirectionProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
    const pathname = usePathname();
    useEffect(() => {
        const isRtl = RTL_LOCALES.includes(locale);
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', locale);
            document.documentElement.classList.toggle('rtl', isRtl);
            document.body.classList.toggle('rtl', isRtl);
        }
    }, [locale, pathname]);
    return <>{children}</>;
}
