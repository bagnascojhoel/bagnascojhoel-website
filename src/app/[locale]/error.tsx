'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import GeometricBackground from '@/app/_components/GeometricBackground';

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
    <>
      <GeometricBackground />
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex flex-col items-center gap-4 max-w-2xl">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">Something went wrong!</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            We apologize for the inconvenience. Our team has been notified and is working on a fix.
          </p>
          {error.digest && (
            <p className="text-sm text-muted-foreground/70 font-mono bg-card px-4 py-2 rounded-lg border border-border">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <button
          onClick={() => reset()}
          className="inline-block rounded-lg bg-primary px-8 py-4 text-primary-foreground font-medium transition-all hover:bg-primary/90 hover:shadow-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try again
        </button>
      </div>
    </>
  );
}
