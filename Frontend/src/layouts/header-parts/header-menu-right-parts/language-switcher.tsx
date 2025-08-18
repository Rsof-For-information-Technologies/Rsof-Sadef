"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadCn/ui/dropDown';
import { Languages } from '@/i18n/request';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineLanguage } from "react-icons/md";
import { ActionIcon } from 'rizzui';

const defaultLanguage = Languages.find(lang => lang.name === 'English') || Languages[0];

function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage.locale);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        // Get the initial language from the URL
        const currentLocale = pathname.split('/')[1];
        const languageInURL = Languages.find(lang => lang.locale === currentLocale);
        if (languageInURL) {
            setSelectedLanguage(languageInURL.locale);
        }
    }, [pathname]);

    const handleLanguageChange = (locale: string) => {
        setSelectedLanguage(locale);
        startTransition(() => {
            // Replace the first part of the path with the new locale
            const newPath = `/${locale}${pathname.substring(3)}`;
            router.replace(newPath);
            router.refresh();
        });
        console.log(`Language changed to: ${locale}`);
    };

    return (
        <DropdownMenu >
            <DropdownMenuTrigger className='outline-none rizzui-action-icon-root inline-flex items-center justify-center active:enabled:translate-y-px focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-offset-2 ring-offset-background transition-colors duration-200 p-1 rounded hover:text-primary focus-visible:ring-[#e3e3e3] relative h-[34px] w-[34px] shadow md:h-9 md:w-9 dark:bg-gray-100 focus:ring-[#e3e3e3]'>
                <ActionIcon
                    as='span'
                    aria-label="Language Switcher"
                    variant="text"
                >
                    <MdOutlineLanguage size={20} />
                </ActionIcon>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='z-50 bg-white dark:bg-black'>
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.locale}
                        className="cursor-pointer hover:bg-gray-300"
                        onClick={() => handleLanguageChange(lang.locale)}
                        disabled={isPending}
                    >
                        {lang.icon} {lang.name}
                        {selectedLanguage === lang.locale && <FaCheck className="ml-3 text-black dark:text-[#dfdfdf]" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default LanguageSwitcher;
