'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-gray-600 dark:text-gray-400">
        We apologize for the inconvenience. Our team has been notified.
      </p>
      {error.digest && (
        <p className="text-sm text-gray-500">
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={() => reset()}
        className="rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
