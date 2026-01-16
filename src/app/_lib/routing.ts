import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { Locale, LOCALES, DEFAULT_LOCALE } from '@/core/domain/Locale';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});

export const localeNames: Record<Locale, string> = {
  [Locale.EN]: '🇺🇸 EN',
  [Locale.PT_BR]: '🇧🇷 PT',
};

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
