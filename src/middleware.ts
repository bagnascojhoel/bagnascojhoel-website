import createMiddleware from 'next-intl/middleware';
import { routing } from './app/_lib/routing';
import { NextRequest, NextResponse } from 'next/server';
import { isValidLocale } from '@/core/domain/Locale';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
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
    return NextResponse.redirect(new URL('/', req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
