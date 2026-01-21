import { redirect } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';

/**
 * Catch-all route for unmatched paths within valid locales.
 * Redirects to root path to trigger locale detection logic.
 *
 * Example: /en/asdf or /pt-br/invalid-path will redirect to /
 */
export default function NotFoundCatchAll() {
  // Log to Sentry for monitoring invalid path access
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: 'Invalid path accessed - redirecting to root',
    level: 'info',
  });

  redirect('/');
}
