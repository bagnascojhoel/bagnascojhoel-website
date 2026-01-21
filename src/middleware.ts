import createMiddleware from 'next-intl/middleware';
import { routing } from './app/_lib/routing';
import { NextRequest, NextResponse } from 'next/server';
import { isValidLocale, Locale, DEFAULT_LOCALE } from '@/core/domain/Locale';
import * as Sentry from '@sentry/nextjs';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    // Treat first segment as a locale-like identifier if it matches a language tag
    // pattern like 'en', 'pt-br', 'pt-bra', 'ens', etc. This accepts primary
    // subtags of 2-3 letters and an optional secondary subtag (2-3 letters).
    const localeLikePattern = /^[A-Za-z]{2,3}(?:-[A-Za-z]{2,3})?$/;
    const isLocaleLike = Boolean(firstSegment && localeLikePattern.test(firstSegment));

    // If it's locale-like but not supported, redirect to root to avoid nesting
    // (e.g., /es, /pt-bra, /ens)
    if (isLocaleLike && !isValidLocale(firstSegment || '')) {
      Sentry.addBreadcrumb({
        message: 'Invalid locale detected, redirecting to root',
        data: { invalidLocale: firstSegment, pathname },
        level: 'info',
      });
      return NextResponse.redirect(new URL('/', req.url));
    }

    // If user is at root path without a locale, always detect and redirect to appropriate locale
    if (pathname === '/') {
      const detectedLocale = detectInitialLocale(req);
      Sentry.addBreadcrumb({
        message: 'Root path accessed, redirecting to detected locale',
        data: { detectedLocale, pathname },
        level: 'info',
      });
      return NextResponse.redirect(new URL(`/${detectedLocale}`, req.url));
    }

    return intlMiddleware(req);
  } catch (error) {
    // Capture middleware errors in Sentry
    Sentry.captureException(error, {
      contexts: {
        middleware: {
          pathname: req.nextUrl.pathname,
          method: req.method,
          url: req.url,
        },
      },
    });
    
    // Re-throw to let Next.js handle it
    throw error;
  }
}

/**
 * Detects the initial locale based on the following priority:
 * 1. Language saved in cookie (from localStorage)
 * 2. User's device/browser language (Accept-Language header)
 * 3. Country the user is from (via Accept-Language country code)
 * 4. English (default fallback)
 */
function detectInitialLocale(req: NextRequest): Locale {
  // 1. Check cookie (set from localStorage)
  const localeCookie = req.cookies.get('locale')?.value;
  if (localeCookie && isValidLocale(localeCookie)) {
    return localeCookie;
  }

  // 2. Check Accept-Language header for browser/device language
  const acceptLanguage = req.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase());

    for (const lang of languages) {
      // Check for exact match first (e.g., "pt-br")
      if (isValidLocale(lang)) {
        return lang;
      }

      // Check primary language (e.g., "pt" from "pt-BR")
      if (lang.startsWith('pt')) {
        return Locale.PT_BR;
      }
      if (lang.startsWith('en')) {
        return Locale.EN;
      }

      // 3. Check country code (e.g., "BR" from "pt-BR")
      if (lang.includes('-')) {
        const [, country] = lang.split('-');
        if (country && country.toLowerCase() === 'br') {
          return Locale.PT_BR;
        }
      }
    }
  }

  // 4. Default to English
  return DEFAULT_LOCALE;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
