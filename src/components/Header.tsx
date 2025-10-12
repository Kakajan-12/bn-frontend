'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const t = useTranslations('Header');
    const locale = useLocale();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const locales = [
        { code: 'en', label: 'EN', flag: '/lang/uk.svg' },
        { code: 'ru', label: 'RU', flag: '/lang/ru.svg' },
        { code: 'tk', label: 'TM', flag: '/lang/tk.svg' },
    ];

    const getLocalizedPath = (newLocale: string) => {
        const parts = pathname.split('/').filter(Boolean);
        if (locales.some((l) => l.code === parts[0])) {
            parts[0] = newLocale;
        } else {
            parts.unshift(newLocale);
        }
        return '/' + parts.join('/');
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
            <div className="container mx-auto flex justify-between items-center px-4 py-2">
                {/* --- ЛОГОТИП --- */}
                <Link href={`/${locale}`} className="cursor-pointer">
                    <Image src="/icon.png" alt="BN Tour logo" width={90} height={90} priority />
                </Link>

                {/* --- ДЕСКТОПНОЕ МЕНЮ --- */}
                <nav className="hidden md:flex items-center space-x-4 text-gray-800 font-medium">
                    <Link href={`/${locale}`} className="hover:text-red-600 transition">
                        {t('main')}
                    </Link>
                    <Link href={`/${locale}/tours`} className="hover:text-red-600 transition">
                        {t('tours')}
                    </Link>
                    <Link href={`/${locale}/about`} className="hover:text-red-600 transition">
                        {t('about')}
                    </Link>
                    <Link href={`/${locale}/blogs`} className="hover:text-red-600 transition">
                        {t('blog')}
                    </Link>
                    <Link href={`/${locale}/information`} className="hover:text-red-600 transition">
                        {t('information')}
                    </Link>
                    <Link href={`/${locale}/contacts`} className="hover:text-red-600 transition">
                        {t('contacts')}
                    </Link>
                </nav>

                {/* --- ДЕСКТОПНЫЙ ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА --- */}
                <div className="hidden md:flex items-center space-x-2">
                    {locales.map((l) => (
                        <Link
                            key={l.code}
                            href={getLocalizedPath(l.code)}
                            scroll={false}
                            className="opacity-80 hover:opacity-100 cursor-pointer"
                        >
                            <Image src={l.flag} alt={l.label} width={28} height={18} />
                        </Link>
                    ))}
                </div>

                {/* --- МОБИЛЬНАЯ ВЕРСИЯ --- */}
                <div className="flex md:hidden items-center gap-3">
                    {locales.map(
                        (l) =>
                            l.code === locale && (
                                <span key={l.code} className="font-semibold">
                  {l.label}
                </span>
                            )
                    )}

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-md hover:bg-gray-100 transition"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* --- МОБИЛЬНОЕ МЕНЮ --- */}
            <div
                className={`md:hidden bg-white shadow-lg border-t transition-all duration-300 overflow-hidden ${
                    isMenuOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                }`}
            >
                <div className="flex flex-col items-center space-y-3 text-gray-700">
                    <Link href={`/${locale}`} onClick={() => setIsMenuOpen(false)}>
                        {t('main')}
                    </Link>
                    <Link href={`/${locale}/tours`} onClick={() => setIsMenuOpen(false)}>
                        {t('tours')}
                    </Link>
                    <Link href={`/${locale}/about`} onClick={() => setIsMenuOpen(false)}>
                        {t('about')}
                    </Link>
                    <Link href={`/${locale}/blogs`} onClick={() => setIsMenuOpen(false)}>
                        {t('blog')}
                    </Link>
                    <Link href={`/${locale}/information`} onClick={() => setIsMenuOpen(false)}>
                        {t('information')}
                    </Link>
                    <Link href={`/${locale}/contacts`} onClick={() => setIsMenuOpen(false)}>
                        {t('contacts')}
                    </Link>

                    <div className="flex justify-center space-x-3 border-t pt-3">
                        {locales.map((l) => (
                            <Link
                                key={l.code}
                                href={getLocalizedPath(l.code)}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Image
                                    src={l.flag}
                                    alt={l.label}
                                    width={28}
                                    height={18}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
